<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import Motion from '~/components/Motion.vue'

const presets: Record<string, { stiffness: number; damping: number; precision: number }> = {
  noWobble: { stiffness: 170, damping: 26, precision: 0.01 },
  gentle: { stiffness: 120, damping: 14, precision: 0.01 },
  wobbly: { stiffness: 180, damping: 12, precision: 0.01 },
  stiff: { stiffness: 210, damping: 20, precision: 0.01 },
}

const spring = reactive({ stiffness: 170, damping: 26, precision: 0.01 })

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

let debounceTimer: ReturnType<typeof setTimeout> | null = null
function delayedStart() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => start(), 100)
}

function setSpring(preset: typeof presets[string]) {
  Object.assign(spring, preset, { precision: preset.precision || 0.01 })
  delayedStart()
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
</script>

<template>
  <div class="motion-graph">
    <Motion
      v-if="!resetting"
      :value="target"
      class="svg-container"
      tag="div"
      :spring="spring"
      @motion-end="isTracking = false"
    >
      <template #default="{ value }">
        <div class="graph">
          <svg
            :style="{ '--stroke-width': 2 / aspectRatio + 'px' }"
            :width="svgWidth"
            :height="svgHeight"
            preserveAspectRatio="none"
            :viewBox="viewBox"
          >
            <line x1="0" :x2="chartWidth" :y1="svgHeight - maxValue" :y2="svgHeight - maxValue" />
            <path :d="pathD" />
          </svg>
          <div
            class="marker"
            :style="{ transform: `translateY(${-value * aspectRatio}px)` }"
          ></div>
        </div>
        <p>Current value: {{ addPoint(value).toFixed(2) }}</p>
        <p>Visually finished at {{ Math.round(lastRendered - initialTime) }}ms</p>
        <p>Finished at {{ Math.round(lastTime - initialTime) }}ms</p>
      </template>
    </Motion>

    <label class="text">
      Target value
      <input v-model.number="maxValue" step="10" type="number" @input="delayedStart" />
    </label>
    <label class="text">
      Stiffness
      <input v-model.number="spring.stiffness" step="10" type="number" @input="delayedStart" />
    </label>
    <label class="text">
      Damping
      <input v-model.number="spring.damping" step="1" type="number" @input="delayedStart" />
    </label>
    <label class="text">
      Precision
      <input v-model.number="spring.precision" step="0.01" type="number" @input="delayedStart" />
    </label>
    <div class="limit-width">
      <button v-for="(preset, name) in presets" :key="name" @click="setSpring(preset)">
        {{ name }}
      </button>
    </div>
    <hr style="border: none; margin: 0.35rem 0;" />

    <button @click="stop">Stop</button>
    <button @click="start">Start</button>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css?family=Lato');

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

.motion-graph .svg-container {
  margin-right: calc(var(--marker-size) * 3.4);
}

.motion-graph label {
  margin: 0.15rem;
}

.motion-graph button {
  width: 3rem;
  padding: 0.05rem;
  margin: 0.1rem 0.2rem;
  display: inline-block;
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

.limit-width {
  max-width: 550px;
}
</style>
