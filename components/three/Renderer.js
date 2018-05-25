import { WebGLRenderer, BasicShadowMap } from 'three'

export default {
  props: {
    width: Number,
    height: Number,
  },

  provide () {
    this.renderer = new WebGLRenderer()
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = BasicShadowMap
    return {
      renderer: this,
    }
  },

  mounted () {
    this.renderer.setSize(this.width, this.height)
    this.animate()
  },

  methods: {
    animate () {
      if (this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera)
      } else {
        // console.warn('You need a scene and a camera inside of the renderer')
      }
      requestAnimationFrame(this.animate.bind(this))
    },
  },

  render (h) {
    this.$nextTick().then(() => {
      this.$el.appendChild(this.renderer.domElement)
    })
    return h('div', this.$slots.default)
  },
}
