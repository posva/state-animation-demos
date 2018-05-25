<template>
  <section>
    <div class="container">
      <no-ssr>
        <Renderer :width="width" :height="height">
          <Scene>
            <Motion v-if="smooth" :values="cameraPosition">
              <Camera slot-scope="position" :position="position" />
            </Motion>
            <Camera v-else :position="cameraPosition"/>

            <AmbientLight/>

            <SpotLight :position="{ x: -10, y: 15, z: -5 }" />
            <SpotLight :position="{ x: 7, y: 5, z: 5 }" />

            <template v-if="smooth">
              <Motion v-for="(cube, i) in cubes" :values="cube" :key="i">
                <Cube
                  slot-scope="cube"
                  :rotation="rotation"
                  :scale="cubeScale"
                  :position="cube.position"
                  :color="cube.color"
                />
              </Motion>
            </template>
            <template v-else>
              <Cube
                v-for="(cube, i) in cubes"
                :key="i"
                :rotation="rotation"
                :scale="cubeScale"
                :position="cube.position"
                :color="cube.color"
              />
            </template>
            <Ground/>
          </Scene>
        </Renderer>
      </no-ssr>
    </div>
    <div class="controls">
      <input type="range" v-model="scale" min="0.2" max="5" step="0.1" style="width: 100%" />
      <br/>

      <label>
        <input type="checkbox" v-model="smooth"/> Smooth
      </label>
      <br>

      <button @click="addCube">Add Cube</button>
      <button @click="cubes.shift()">Remove Cube</button>
      <button @click="shuffle">Shuffle Cube</button>
    </div>
  </section>
</template>

<script>
import { Clock } from 'three'
import random from 'lodash/random'
import shuffle from 'lodash/shuffle'
import sample from 'lodash/sample'
import randomColor from 'randomcolor'

let id = 0

export default {
  data() {
    return {
      width: typeof window !== 'undefined' && window.innerWidth,
      height: typeof window !== 'undefined' && window.innerHeight,

      smooth: false,

      cubes: [],

      cameraPosition: {
        x: 0,
        y: 10,
        z: 15,
      },

      lightPosition: {
        x: 0,
        y: 15,
        z: 5,
      },

      position: {
        x: 0,
        y: 2,
        z: 0,
      },

      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },

      scale: 1,
    }
  },

  computed: {
    cubeScale() {
      return {
        x: this.scale,
        y: this.scale,
        z: this.scale,
      }
    },
  },

  mounted() {
    this.addCube()
    // window.vm = this
    this.clock = new Clock()
    this.animate()
  },

  methods: {
    setCameraX({ target }) {
      this.cameraPosition = {
        ...this.cameraPosition,
        x: target.value,
      }
    },

    animate() {
      const delta = this.clock.getDelta()

      this.rotation.x += 0.25 * delta
      this.rotation.y += 2 * delta
      this.rotation.z += 1 * delta
      requestAnimationFrame(this.animate.bind(this))
    },

    addCube() {
      this.cubes.push({
        id: id++,
        color: randomColor(),
        position: {
          x: random(-5, 5),
          y: random(1, 10),
          z: random(-5, 6),
        },
      })

      if (this.cubes.length < 2) return

      this.cameraPosition = {
        x: random(-10, 10),
        y: random(1, 20),
        z: sample([-1, 1]) * (8 + random(0, 2)),
      }
    },

    shuffle() {
      this.cubes = shuffle(this.cubes)
    },
  },
}
</script>

<style scoped>
.container {
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
