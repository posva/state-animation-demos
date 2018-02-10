<template>
  <div id="app">
    <Motion
      ref="motion"
      v-if="!resetting"
      :value="target"
      tag="div"
      @motion-end="isTracking = false"
      :spring="spring"
    >
      <template slot-scope="{ value }">
        <div class="graph">
          <svg :style="{ '--stroke-width': 2 / aspectRatio + 'px' }" :width="svgWidth" :height="svgHeight" preserveAspectRatio="none" :viewBox="viewBox">
            <line x1="0" :x2="chartWidth" :y1="svgHeight - maxValue" :y2="svgHeight - maxValue"></line>
            <path :d="pathD"></path>
          </svg>
          <div class="marker" :style="{ transform: `translateY(${-value * aspectRatio}px)`}"></div>
        </div>
        <p>Current value: {{ value }} {{ addPoint(value) }}</p>
        <p>Last rendered: {{ Math.round(lastRendered - initialTime) }}ms</p>
        <p>Finished at {{ Math.round(lastTime - initialTime) }}ms</p>
      </template>
    </Motion>

    <label>
      Target value
      <input v-model.number="maxValue" @input="delayedStart" step="10" type="number"/>
    </label>
    <br/>
    <label>
      Stiffness
      <input v-model.number="spring.stiffness" @input="delayedStart" step="10" type="number"/>
    </label>
    <br/>
    <label>
      Damping
      <input v-model.number="spring.damping" step="1" @input="delayedStart" type="number"/>
    </label>
    <br/>
    <label>
      Precision
      <input v-model.number="spring.precision" step="0.01" @input="delayedStart" type="number"/>
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
import debounce from 'lodash/debounce'

export default {
  data () {
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
      pathD: '',

      // last time we called addPoint
      lastTime: 0,
      // last time we added a point into the path
      lastRendered: 0,
      maxRegisteredValue: 0,
    }
  },

  computed: {
    svgWidth () {
      return 300
    },

    svgHeight () {
      return 140
    },

    aspectRatio () {
      return this.svgHeight / (this.svgHeight - this.svgTop)
    },

    maxValueProportion () {
      return this.maxValue / 100
    },

    presets () {
      return presets
    },

    svgTop () {
      return Math.min(-this.maxRegisteredValue + this.svgHeight, 0) - 10
    },

    chartWidth () {
      return Math.max(this.svgWidth, this.lastRendered - this.initialTime)
    },

    viewBox () {
      return `0 ${this.svgTop} ${this.chartWidth} ${this.svgHeight - this.svgTop}`
    },
  },

  created () {
    this.lastTime = 100
    this.initialTime = 0
    this.lastRendered = 100

    setTimeout(() => {
      this.setSpring(this.presets.wobbly)
    }, 2000)
  },

  methods: {
    async start () {
      await this.reset()
      if (!this.isTracking) {
        this.pathD = `M0,${this.svgHeight} l0,0 `
        this.isTracking = true
        this.lastY = 0
        this.maxRegisteredValue = 0
        this.lastTime = performance.now()
        this.initialTime = this.lastTime
        this.lastRendered = this.lastTime
      }
      this.target = this.maxValue
    },

    delayedStart: debounce(function () {
      this.start()
    }, 100),

    setSpring (spring) {
      this.spring = {...spring}
      this.spring.precision = this.spring.precision || 0.01
      this.delayedStart()
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
      // do not render too much
      if (elapsed <= 15) return
      // make sure we compute all the time
      const totalElapsed = now - this.lastRendered
      /* y = this.maxValue - y + 80 */
      if (Math.abs(y - this.lastY) > 0.1) {
        this.lastRendered = now
        this.pathD += `${totalElapsed},${-(this.lastY ? y - this.lastY : y)} `
        if (y > this.maxRegisteredValue) this.maxRegisteredValue = y
      }
      this.lastY = y
      this.lastTime = now
    },
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Lato');

body {
  background-color: #111111;
  font-family: 'Lato', sans-serif;
  color: white;
}

.graph {
  display: inline-block;
  position: relative;
  padding-left: 1rem;
  padding-top: 1rem;
}

.graph svg {
  margin-bottom: -4px;
  border-left: #bbb 2px solid;
  border-bottom: darkgrey 2px solid;
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
  top: 1rem;
  left: 2px;
  content: 'x';
  text-align: left;
  font-family: 'Futura';
  font-size: 14px;
  color: #bbb;
}

.graph line {
  stroke: crimson;
  stroke-width: var(--stroke-width);
}

.graph path {
  fill: transparent;
  stroke: white;
  stroke-width: var(--stroke-width);
}

.graph .marker {
  position: absolute;
  left: 100%;
}

:root {
  --marker-color: #bf0003;
  --marker-size: 7px;
  --stroke-width: 2px;
}

.graph .marker::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: calc(-1 * var(--marker-size));
  width: 0;
  height: 0;
  border-top: var(--marker-size) solid transparent;
  border-bottom: var(--marker-size) solid transparent;
  border-right: var(--marker-size) solid var(--marker-color);
}

.graph .marker::after {
  content: '';
  position: absolute;
  left: var(--marker-size);
  bottom: calc(-1 * var(--marker-size));
  width: calc(var(--marker-size) * 2.4);
  height: calc(var(--marker-size) * 2);
  background: var(--marker-color);
}

</style>
