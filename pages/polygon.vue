<template>
  <div>
    <svg width="200" height="200">
      <Tweezing :to="stats" tween="tweenjs" :duration="updateInterval" :easing="easing">
        <polygon
          slot-scope="points"
          :points="transformToPoints(points)"
        ></polygon>
      </Tweezing>
      <circle cx="100" cy="100" r="90"></circle>
    </svg>
    <label>Sides: {{ sides }}</label>
    <input
      type="range"
      min="3"
      max="500"
      v-model.number="sides"
    >
    <label>Minimum Radius: {{ minRadius }}%</label>
    <input
      type="range"
      min="0"
      max="90"
      v-model.number="minRadius"
    >
    <label>Update Interval: {{ updateInterval }} milliseconds</label>
    <input
      type="range"
      min="10"
      max="2000"
      v-model.number="updateInterval"
    >
    <label>
      Easing Equation
      <select v-model="equationType">
        <option v-for="easing in easings" :value="easing.value">{{ easing.text }}</option>
      </select>
    </label>
    <br>
    <label>
      <input v-model="easingType" type="radio" name="easing-type" value="In">
      In
    </label>
    <label>
      <input v-model="easingType" type="radio" name="easing-type" value="Out">
      Out
    </label>
    <label>
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
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return {
    x: x * cos - y * sin + 100,
    y: x * sin + y * cos + 100,
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
      minRadius: 50,
      updateInterval: 500,

      // custom easings
      equationType: TWEEN.Easing.Linear,
      easingType: 'In',
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
        () => (100 - this.minRadius) * Math.random() + this.minRadius
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
  fill: #41b883;
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
