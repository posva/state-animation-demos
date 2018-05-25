import { SpotLight } from 'three'
import Object3D from './Object3D'

export default {
  mixins: [Object3D],

  beforeMount () {
    this.obj = new SpotLight(0x404040)
    this.obj.angle = Math.PI / 5
    this.obj.penumbra = 0.3
    this.obj.position.set(0, 10, 5)
    this.obj.castShadow = true
    this.obj.shadow.camera.near = 8
    this.obj.shadow.camera.far = 30
    this.obj.shadow.mapSize.width = 1024
    this.obj.shadow.mapSize.height = 1024
  },
}
