import Object3D from './Object3D'
import { Scene, Color } from 'three'

export default {
  ...Object3D,
  inject: ['renderer'],

  provide () {
    this.scene = new Scene()
    return {
      scene: this.scene,
    }
  },

  // overwrite existing mounted
  mounted () {
    this.renderer.scene = this.scene
    this.scene.background = new Color(0x111111)
    // console.log('scene', this.scene)
  },
}
