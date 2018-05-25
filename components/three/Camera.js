import Object3D from './Object3D'
import { PerspectiveCamera } from 'three'
// import { OrbitControls } from '~/plugins/three'

export default {
  extends: Object3D,
  inject: ['renderer'],

  provide () {
    this.obj = new PerspectiveCamera(75, this.renderer.width / this.renderer.height, 0.1, 1000)
    // new OrbitControls(this.camera)
    return {
      camera: this.obj,
    }
  },

  watch: {
    position: {
      handler () {
        if (!this.obj) return
        this.obj.lookAt(this.scene.position)
      },
      deep: true,
    },
  },

  mounted () {
    this.renderer.camera = this.obj
    this.obj.lookAt(this.scene.position)
    // console.log('camera', this.obj)
  },
}
