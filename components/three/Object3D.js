// import { Mesh } from 'three'

function walkGet (obj, path) {
  const keys = path.split('.')
  while (keys.length) {
    obj = obj[keys.shift()]
  }
  return obj
}

function walkSet (obj, path, val) {
  const keys = path.split('.')
  while (keys.length > 1) {
    obj = obj[keys.shift()]
  }
  obj[keys.shift()] = val
}

function propWatcher (propsToWatch) {
  return Object.keys(propsToWatch).reduce((watch, prop) => {
    watch[prop] = {
      handler (val) {
        walkSet(this.obj, propsToWatch[prop], val)
      },
      // this is not enough, because obj doesn't exist
      // immediate: true,
    }
    return watch
  }, {})
}

const watch = propWatcher({
  'scale.x': 'scale.x',
  'scale.y': 'scale.y',
  'scale.z': 'scale.z',

  'position.x': 'position.x',
  'position.y': 'position.y',
  'position.z': 'position.z',

  'rotation.x': 'rotation.x',
  'rotation.y': 'rotation.y',
  'rotation.z': 'rotation.z',
})

const VectorType = (v = 0) => ({
  type: Object,
  default: () => ({
    x: v,
    y: v,
    z: v,
  }),
})

export default {
  inject: ['scene'],

  props: {
    position: Object,
    rotation: Object,
    scale: Object,
  },

  mounted () {
    if (!this.obj) return
    this.scene.add(this.obj)
    Object.entries(watch).forEach(([prop, { handler }]) => {
      try {
        const val = walkGet(this, prop)
        if (val == null) return
        handler.call(this, val)
      } catch (err) {}
    })
  },

  beforeDestroy () {
    if (this.obj) this.scene.remove(this.obj)
  },

  render (h) {
    return !this.$slots.default ? h() : h('div', this.$slots.default)
  },

  watch,
}
