<template>
  <div id="app">
    <div class="graph">
    <svg :width="svgWidth" :height="svgHeight" preserveAspectRatio="none" :viewBox="viewBox">
      <path :d="pathD"></path>
    </svg>
    </div>

    <Motion
      ref="motion"
      v-if="!resetting"
      :value="target"
      @motion-end="isTracking = false"
      :spring="spring"
    >
      <pre slot-scope="{ value }">{{ value }} {{ addPoint(value) }}</pre>
    </Motion>

    <label>
      Stiffness
      <input v-model.number="spring.stiffness" step="10" type="number"/>
    </label>
    <br/>
    <label>
      Damping
      <input v-model.number="spring.damping" step="1" type="number"/>
    </label>
    <br/>
    <label>
      Precision
      <input v-model.number="spring.precision" step="0.01" type="number"/>
    </label>
    <br/>
    <button v-for="(preset, name) in presets" @click="setSpring(preset)">{{ name }}</button>
    <br/>

    <button @click="reset">Reset</button>
    <button @click="start">Start</button>
  </div>
</template>

<script>
import presets from 'vue-motion/src/presets'

export default {
  data() {
    return {
      spring: {
        stiffness: 170,
        damping: 26,
        precision: 0.01,
      },
      target: 0,
      resetting: false,
      maxValue: 100,
      isTracking: false,
      points: [],
      pathD: '',

      lastTime: 0,
      lastRendered: 0,
    }
  },

  computed: {
    svgWidth () {
      return 300
    },

    svgHeight () {
      return 140
    },

    presets () {
      return presets
    },

    chartWidth () {
      return Math.max(300, this.lastRendered - this.initialTime)
    },

    chartHeight () {
      return 220
    },

    viewBox () {
      return `-1 -30 ${this.chartWidth} ${this.chartHeight}`
    }
  },

  created () {
    this.lastTime = 100
    this.initialTime = 0
    this.lastRendered = 100
  },

  methods: {
    async start () {
      if (!this.isTracking) await this.reset()
      if (!this.isTracking) {
        this.pathD = `M0,${this.maxValue + 80} L0,${this.maxValue + 80} `
        this.isTracking = true
        this.lastTime = performance.now()
        this.initialTime = this.lastTime
      }
      this.target = this.maxValue
    },

    setSpring (spring) {
      this.spring = spring
      this.spring.precision = this.spring.precision || 0.01
    },

    async reset () {
      // small hack to reset it by removing it before changing the target
      this.resetting = true
      await this.$nextTick()
      this.target = 0
      this.resetting = false
      this.isTracking = false
    },

    addPoint (y) {
      if (!this.isTracking) return
      const now = performance.now()
      const elapsed = now - this.lastTime
      if (elapsed <= 15) return
      y = this.maxValue - y + 80
      if (Math.abs(y - this.lastY) > 0.1) {
        this.lastRendered = now
        this.pathD += `${now - this.initialTime},${y} `
      }
      this.lastY = y
      // this.points.push({
      //   x: now - this.lastTime,
      //   y,
      // })
      this.lastTime = now
    }
  },
}
</script>

<style>
.graph {
  display: inline-block;
  border-left: #bbb 2px solid;
  border-bottom: darkgrey 2px solid;
  position: relative;
}

.graph::after {
  position: absolute;
  bottom: 2px;
  right: 2px;
  content: 't';
  text-align: left;
  font-family: 'Futura';
  font-size: 14px;
  color: #bbb;
}

.graph::before {
  position: absolute;
  top: 0;
  left: 2px;
  content: 'x';
  text-align: left;
  font-family: 'Futura';
  font-size: 14px;
  color: #bbb;
}

.graph path {
  fill: transparent;
  stroke: black;
  stroke-width: 2px;
}

</style>
