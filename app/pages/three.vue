<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import {
  ACESFilmicToneMapping,
  BoxGeometry,
  Clock,
  Color,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  RepeatWrapping,
  Scene,
  SpotLight,
  SRGBColorSpace,
  TextureLoader,
  WebGLRenderer,
} from 'three'

interface CubeData {
  id: number
  mesh: Mesh
  target: { x: number; y: number; z: number }
}

const containerRef = useTemplateRef<HTMLDivElement>('container')
const width = ref(typeof window !== 'undefined' ? window.innerWidth : 800)
const height = ref(typeof window !== 'undefined' ? window.innerHeight : 600)
const scale = ref(1)
const smooth = ref(false)

let renderer: WebGLRenderer
let scene: Scene
let camera: PerspectiveCamera
let clock: Clock
let raf = 0

const cubes: CubeData[] = []
let nextId = 0

const cameraTarget = { x: 0, y: 10, z: 15 }
const cameraCurrent = { x: 0, y: 10, z: 15 }
const cameraVel = { x: 0, y: 0, z: 0 }
const spring = { stiffness: 170, damping: 26 }

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function randomColor() {
  return new Color().setHSL(Math.random(), 0.7, 0.6)
}

function makeGround() {
  const geometry = new BoxGeometry(10, 0.15, 10)
  const texture = new TextureLoader().load('/ground.jpg')
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  texture.repeat.set(6, 6)
  texture.colorSpace = SRGBColorSpace
  const material = new MeshStandardMaterial({ map: texture, roughness: 0.9, metalness: 0 })
  const mesh = new Mesh(geometry, material)
  mesh.scale.multiplyScalar(3)
  mesh.receiveShadow = true
  return mesh
}

function makeCube(color: Color) {
  const geometry = new BoxGeometry(1, 1, 1)
  const material = new MeshStandardMaterial({
    color,
    roughness: 0.35,
    metalness: 0.1,
  })
  const mesh = new Mesh(geometry, material)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

function addCube() {
  const mesh = makeCube(randomColor())
  const target = {
    x: randomBetween(-5, 5),
    y: randomBetween(1, 10),
    z: randomBetween(-5, 6),
  }
  mesh.position.set(target.x, target.y, target.z)
  scene.add(mesh)
  cubes.push({ id: nextId++, mesh, target })

  if (cubes.length >= 2) {
    cameraTarget.x = randomBetween(-10, 10)
    cameraTarget.y = randomBetween(1, 20)
    cameraTarget.z = (Math.random() < 0.5 ? -1 : 1) * (8 + randomBetween(0, 2))
    if (!smooth.value) Object.assign(cameraCurrent, cameraTarget)
  }
}

function removeCube() {
  const cube = cubes.shift()
  if (cube) scene.remove(cube.mesh)
}

function shuffleCubes() {
  const positions = cubes.map(c => ({ ...c.target }))
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[positions[i]!, positions[j]!] = [positions[j]!, positions[i]!]
  }
  cubes.forEach((c, i) => (c.target = positions[i]!))
  if (!smooth.value) {
    cubes.forEach(c => c.mesh.position.set(c.target.x, c.target.y, c.target.z))
  }
}

function stepSpring(current: number, target: number, vel: number, dt: number) {
  const force = -spring.stiffness * (current - target)
  const damper = -spring.damping * vel
  const a = force + damper
  const newVel = vel + a * dt
  return { value: current + newVel * dt, velocity: newVel }
}

function animate() {
  const delta = clock.getDelta()

  cubes.forEach(c => {
    c.mesh.rotation.x += 0.25 * delta
    c.mesh.rotation.y += 2 * delta
    c.mesh.rotation.z += 1 * delta
    c.mesh.scale.setScalar(scale.value)

    if (smooth.value) {
      const px = c.mesh.position.x
      const py = c.mesh.position.y
      const pz = c.mesh.position.z
      const vx = (c as any)._vx ?? 0
      const vy = (c as any)._vy ?? 0
      const vz = (c as any)._vz ?? 0
      const sx = stepSpring(px, c.target.x, vx, delta)
      const sy = stepSpring(py, c.target.y, vy, delta)
      const sz = stepSpring(pz, c.target.z, vz, delta)
      c.mesh.position.set(sx.value, sy.value, sz.value)
      ;(c as any)._vx = sx.velocity
      ;(c as any)._vy = sy.velocity
      ;(c as any)._vz = sz.velocity
    } else {
      c.mesh.position.set(c.target.x, c.target.y, c.target.z)
    }
  })

  if (smooth.value) {
    const sx = stepSpring(cameraCurrent.x, cameraTarget.x, cameraVel.x, delta)
    const sy = stepSpring(cameraCurrent.y, cameraTarget.y, cameraVel.y, delta)
    const sz = stepSpring(cameraCurrent.z, cameraTarget.z, cameraVel.z, delta)
    cameraCurrent.x = sx.value
    cameraCurrent.y = sy.value
    cameraCurrent.z = sz.value
    cameraVel.x = sx.velocity
    cameraVel.y = sy.velocity
    cameraVel.z = sz.velocity
  } else {
    Object.assign(cameraCurrent, cameraTarget)
  }
  camera.position.set(cameraCurrent.x, cameraCurrent.y, cameraCurrent.z)
  camera.lookAt(scene.position)

  renderer.render(scene, camera)
  raf = requestAnimationFrame(animate)
}

onMounted(() => {
  renderer = new WebGLRenderer({ antialias: true })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1
  renderer.outputColorSpace = SRGBColorSpace
  renderer.setPixelRatio(typeof window !== 'undefined' ? window.devicePixelRatio : 1)
  renderer.setSize(width.value, height.value)

  scene = new Scene()
  scene.background = new Color(0x1a1a22)

  camera = new PerspectiveCamera(75, width.value / height.value, 0.1, 1000)
  camera.position.set(cameraCurrent.x, cameraCurrent.y, cameraCurrent.z)
  camera.lookAt(scene.position)

  scene.add(new HemisphereLight(0xbfd4ff, 0x352b1f, 0.6))

  const key = new DirectionalLight(0xfff1d6, 2.2)
  key.position.set(-8, 14, 6)
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  key.shadow.camera.near = 1
  key.shadow.camera.far = 40
  key.shadow.camera.left = -15
  key.shadow.camera.right = 15
  key.shadow.camera.top = 15
  key.shadow.camera.bottom = -15
  key.shadow.bias = -0.0005
  key.shadow.radius = 4
  scene.add(key)

  const fill = new SpotLight(0x88aaff, 80, 40, Math.PI / 4, 0.6, 1.5)
  fill.position.set(8, 6, -4)
  scene.add(fill)

  scene.add(makeGround())

  containerRef.value!.appendChild(renderer.domElement)
  clock = new Clock()
  addCube()
  raf = requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
  renderer?.dispose()
})

watch(smooth, () => {
  cameraVel.x = cameraVel.y = cameraVel.z = 0
})
</script>

<template>
  <section>
    <div ref="container" class="three-container" />
    <div class="controls">
      <input v-model.number="scale" type="range" min="0.2" max="5" step="0.1" style="width: 100%" />
      <br />
      <label>
        <input v-model="smooth" type="checkbox" /> Smooth
      </label>
      <br />
      <button @click="addCube">Add Cube</button>
      <button @click="removeCube">Remove Cube</button>
      <button @click="shuffleCubes">Shuffle Cube</button>
    </div>
  </section>
</template>

<style scoped>
.three-container {
  display: flex;
  padding: 0;
  width: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.controls {
  padding: 14px;
  position: absolute;
  top: 0;
  background-color: rgba(0, 0, 0, 0.3);
}

button {
  padding: 0;
}
</style>
