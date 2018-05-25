import Vue from 'vue'
import Scene from '~/components/three/Scene'
import Cube from '~/components/three/Cube'
import Ground from '~/components/three/Ground'
import Renderer from '~/components/three/Renderer'
import Camera from '~/components/three/Camera'
import AmbientLight from '~/components/three/AmbientLight'
import SpotLight from '~/components/three/SpotLight'
import * as THREE from 'three'
// import VueThreejs from 'vue-threejs'
// Vue.use(VueThreejs)

Vue.component('Scene', Scene)
Vue.component('Cube', Cube)
Vue.component('Ground', Ground)
Vue.component('Renderer', Renderer)
Vue.component('Camera', Camera)
Vue.component('AmbientLight', AmbientLight)
Vue.component('SpotLight', SpotLight)
