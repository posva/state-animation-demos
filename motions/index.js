import Vue from 'vue'
import Motion from 'vue-motion'
import 'modern-normalize/modern-normalize.css'
import App from './App'

Vue.use(Motion)

Vue.config.devtools = true
Vue.config.performance = true

window.vm = new Vue({
  el: '#app',
  render: h => h(App),
})
