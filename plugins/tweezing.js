import Vue from 'vue'
import { Tweezing, tweenjsHelper } from 'vue-tweezing'
import TWEEN from '@tweenjs/tween.js'
function bounceOut (n) {
  if (n < 1 / 2.75) {
    return 7.5625 * n * n
  } else if (n < 2 / 2.75) {
    return 7.5625 * (n -= 1.5 / 2.75) * n + 0.75
  } else if (n < 2.5 / 2.75) {
    return 7.5625 * (n -= 2.25 / 2.75) * n + 0.9375
  } else {
    return 7.5625 * (n -= 2.625 / 2.75) * n + 0.984375
  }
}
Vue.use(Tweezing, {
  tweenjs: tweenjsHelper(TWEEN),
  custom (value, end, opts, vm) {
    if (vm._unwatchCustom) vm._unwatchCustom()
    // TODO custom stop function?
    vm._unwatchCustom = vm.$watch(
      '$attrs.time',
      time => {
        opts.$setValue(bounceOut(time))
      },
      { immediate: true }
    )
  },
})

function animate (time) {
  requestAnimationFrame(animate)
  TWEEN.update(time)
}
if (process.client) requestAnimationFrame(animate)
