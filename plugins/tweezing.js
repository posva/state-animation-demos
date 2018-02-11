import Vue from 'vue'
import { Tweezing, tweenjsHelper } from 'vue-tweezing'
import TWEEN from '@tweenjs/tween.js'

Vue.use(Tweezing, {
  tweenjs: tweenjsHelper(TWEEN),
})

function animate (time) {
  requestAnimationFrame(animate)
  TWEEN.update(time)
}
requestAnimationFrame(animate)
