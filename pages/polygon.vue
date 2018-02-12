<template>
  <div>
    <svg width="300" height="300">
      <Tweezing :to="stats" tween="tweenjs" :duration="updateInterval" :easing="easing">
        <polygon
          slot-scope="points"
          :points="transformToPoints(points)"
        ></polygon>
      </Tweezing>
      <circle cx="150" cy="150" r="140"></circle>
    </svg>
    <label>Sides: {{ sides }}</label>
    <input
      type="range"
      min="3"
      max="500"
      v-model.number="sides"
    >
    <label>Minimum Radius: {{ (minRadius * 100).toFixed(0) }}%</label>
    <input
      type="range"
      min="0"
      step="0.01"
      max="0.9"
      v-model.number="minRadius"
    >
    <label>Update Interval: {{ updateInterval }}ms</label>
    <input
      type="range"
      min="10"
      max="2000"
      v-model.number="updateInterval"
    >
    <label class="text">
      Easing Equation
      <select v-model="equationType">
        <option v-for="easing in easings" :value="easing.value">{{ easing.text }}</option>
      </select>
    </label>
    <br>
    <label class="radio">
      <input v-model="easingType" type="radio" name="easing-type" value="In">
      In
    </label>
    <label class="radio">
      <input v-model="easingType" type="radio" name="easing-type" value="Out">
      Out
    </label>
    <label class="radio">
      <input v-model="easingType" type="radio" name="easing-type" value="InOut">
      InOut
    </label>
  </div>
</template>

<script>
import TWEEN from '@tweenjs/tween.js'

function valueToPoint(value, index, total) {
  const x = 0
  const y = -value * 0.9
  const angle = Math.PI * 2 / total * index
  const cos = Math.cos(angle) * 150
  const sin = Math.sin(angle) * 150
  return {
    x: x * cos - y * sin + 150,
    y: x * sin + y * cos + 150,
  }
}

function generatePoints(stats) {
  const total = stats.length
  return stats
    .map(function(stat, index) {
      const point = valueToPoint(stat, index, total)
      return point.x + ',' + point.y
    })
    .join(' ')
}

export default {
  data() {
    const defaultSides = 10
    return {
      sides: defaultSides,
      stats: Array.from(Array(defaultSides), () => 0),
      minRadius: 0.5,
      updateInterval: 500,

      // custom easings
      equationType: TWEEN.Easing.Linear,
      easingType: 'Out',
    }
  },

  computed: {
    easing() {
      return this.equationType[this.easingType]
    },

    easings() {
      return Object.keys(TWEEN.Easing).map(easing => ({
        value: TWEEN.Easing[easing],
        text: easing,
      }))
    },
  },

  mounted() {
    this.setupInterval()
  },

  watch: {
    updateInterval: 'setupInterval',
  },

  methods: {
    randomizeStats() {
      this.stats = Array.from(
        Array(this.sides),
        () => (1 - this.minRadius) * Math.random() + this.minRadius
      )
    },

    setupInterval() {
      if (this.interval) clearInterval(this.interval)
      this.interval = setInterval(this.randomizeStats.bind(this), this.updateInterval)
    },

    transformToPoints(pointsArray) {
      const { length } = pointsArray
      return pointsArray
        .map((p, i) => valueToPoint(p, i, length))
        .reduce((points, { x, y }) => points + ` ${x},${y}`, '')
    },
  },
}
</script>

<style scoped>
svg {
  display: block;
}
polygon {
  fill: var(--color-purple);
}
circle {
  fill: transparent;
  stroke: #35495e;
}
input[type='range'] {
  display: block;
  width: 100%;
  margin-bottom: 15px;
}
</style>
