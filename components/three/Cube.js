import { BoxGeometry, MeshPhongMaterial, Mesh } from 'three'
import Object3D from './Object3D'

export default {
  extends: Object3D,

  props: ['color'],

  beforeMount () {
    this.geometry = new BoxGeometry(1, 1, 1)
    this.material = new MeshPhongMaterial({
      color: this.color,
      shininess: 150,
      specular: 0x222222,
    })
    this.obj = new Mesh(this.geometry, this.material)
    this.obj.castShadow = true
    this.obj.receiveShadow = true
  },
}
