import { BoxGeometry, MeshPhongMaterial, Mesh, TextureLoader, RepeatWrapping } from 'three'
import Object3D from './Object3D'

export default {
  extends: Object3D,
  beforeMount () {
    this.geometry = new BoxGeometry(10, 0.15, 10)
    const texture = new TextureLoader().load('/ground.jpg')
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(6, 6)
    this.material = new MeshPhongMaterial({
      map: texture,
      shininess: 150,
    })
    this.obj = new Mesh(this.geometry, this.material)
    this.obj.scale.multiplyScalar(3)
    this.obj.castShadow = false
    this.obj.receiveShadow = true
  },
}
