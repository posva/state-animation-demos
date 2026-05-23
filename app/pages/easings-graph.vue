<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { Easing } from '@tweenjs/tween.js'
import Tweezing from '~/components/Tweezing.vue'

const easingGroups = Object.entries(Easing).map(([name, group]) => ({
  text: name,
  value: group as Record<'In' | 'Out' | 'InOut', (k: number) => number>,
}))

const equationType = ref<any>(Easing.Bounce)
const easingType = ref<'In' | 'Out' | 'InOut'>('Out')

const easing = computed(() => {
  const group: any = equationType.value
  return group[easingType.value] ?? group.None ?? group
})

const target = ref(0)
const resetting = ref(false)
const maxValue = ref(100)
const isTracking = ref(false)
const pathD = ref('')

const initialTime = ref(0)
const lastTime = ref(0)
const lastRendered = ref(0)
const maxRegisteredValue = ref(0)
let lastY = 0

const svgWidth = 300
const svgHeight = 140

const svgTop = computed(() =>
  Math.min(-maxRegisteredValue.value + svgHeight, 0) - 10,
)
const aspectRatio = computed(() => svgHeight / (svgHeight - svgTop.value))
const chartWidth = computed(() =>
  Math.max(svgWidth, lastRendered.value - initialTime.value),
)
const viewBox = computed(
  () => `0 ${svgTop.value} ${chartWidth.value} ${svgHeight - svgTop.value}`,
)

async function start() {
  await stop()
  if (!isTracking.value) {
    pathD.value = `M0,${svgHeight} l0,0 `
    isTracking.value = true
    lastY = 0
    maxRegisteredValue.value = 0
    lastTime.value = performance.now()
    initialTime.value = lastTime.value
    lastRendered.value = lastTime.value
  }
  target.value = maxValue.value
}

async function stop() {
  resetting.value = true
  await nextTick()
  target.value = 0
  resetting.value = false
  isTracking.value = false
  await nextTick()
}

function addPoint(y: number) {
  if (!isTracking.value) return y
  const now = performance.now()
  const elapsed = now - lastTime.value
  if (elapsed <= 15) return y
  const totalElapsed = now - lastRendered.value
  if (Math.abs(y - lastY) > 0.1) {
    lastRendered.value = now
    pathD.value += `${totalElapsed},${-(lastY ? y - lastY : y)} `
    if (y > maxRegisteredValue.value) maxRegisteredValue.value = y
  }
  lastY = y
  lastTime.value = now
  return y
}

onMounted(() => {
  lastTime.value = 100
  initialTime.value = 0
  lastRendered.value = 100
  setTimeout(start, 1000)
})
</script>

<template>
  <div id="easing-graph">
    <Tweezing
      v-if="!resetting"
      :to="target"
      class="svg-container"
      :duration="1000"
      :easing="easing"
      @end="isTracking = false"
    >
      <template #default="{ value }">
        <div>
          <div class="graph">
            <svg
              :style="{ '--stroke-width': 2 / aspectRatio + 'px' }"
              :width="svgWidth"
              :height="svgHeight"
              preserveAspectRatio="none"
              :viewBox="viewBox"
            >
              <line
                x1="0"
                :x2="chartWidth"
                :y1="svgHeight - maxValue"
                :y2="svgHeight - maxValue"
              />
              <path :d="pathD" />
            </svg>
            <div
              class="marker"
              :style="{ transform: `translateY(${-value * aspectRatio}px)` }"
            ></div>
          </div>
          <p>Current value: {{ addPoint(value).toFixed(2) }}</p>
          <p>Last rendered: {{ Math.round(lastRendered - initialTime) }}ms</p>
          <p>Finished at {{ Math.round(lastTime - initialTime) }}ms</p>
        </div>
      </template>
    </Tweezing>

    <label class="text">
      Easing Equation
      <select v-model="equationType">
        <option v-for="e in easingGroups" :key="e.text" :value="e.value">{{ e.text }}</option>
      </select>
    </label>
    <br />
    <label class="radio">
      <input v-model="easingType" type="radio" name="easing-type" value="In" /> In
    </label>
    <label class="radio">
      <input v-model="easingType" type="radio" name="easing-type" value="Out" /> Out
    </label>
    <label class="radio">
      <input v-model="easingType" type="radio" name="easing-type" value="InOut" /> InOut
    </label>

    <br />
    <button @click="stop">Stop</button>
    <button @click="start">Start</button>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css?family=Lato');

#easing-graph .svg-container {
  margin-right: calc(var(--marker-size) * 3.4);
}

#easing-graph label {
  margin: 0.15rem;
}

#easing-graph button {
  width: 3rem;
  padding: 0.05rem;
  margin: 0.1rem 0.2rem;
  display: inline-block;
}
</style>
