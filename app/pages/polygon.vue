<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Easing } from '@tweenjs/tween.js'
import Tweezing from '~/components/Tweezing.vue'

const easingGroups = Object.entries(Easing).map(([name, group]) => ({
  text: name,
  value: group as Record<'In' | 'Out' | 'InOut', (k: number) => number>,
}))

const defaultSides = 10
const sides = ref(defaultSides)
const stats = ref<number[]>(Array.from({ length: defaultSides }, () => 0))
const minRadius = ref(0.5)
const updateInterval = ref(500)

const equationType = ref<any>(Easing.Linear)
const easingType = ref<'In' | 'Out' | 'InOut'>('Out')

const easing = computed(() => {
  const group: any = equationType.value
  return group[easingType.value] ?? group.None ?? group
})

function valueToPoint(value: number, index: number, total: number) {
  const x = 0
  const y = -value * 0.9
  const angle = ((Math.PI * 2) / total) * index
  const cos = Math.cos(angle) * 150
  const sin = Math.sin(angle) * 150
  return { x: x * cos - y * sin + 150, y: x * sin + y * cos + 150 }
}

function randomizeStats() {
  stats.value = Array.from(
    { length: sides.value },
    () => (1 - minRadius.value) * Math.random() + minRadius.value,
  )
}

function transformToPoints(pointsArray: number[]) {
  const { length } = pointsArray
  return pointsArray
    .map((p, i) => valueToPoint(p, i, length))
    .reduce((acc, { x, y }) => acc + ` ${x},${y}`, '')
}

let interval: ReturnType<typeof setInterval> | null = null
function setupInterval() {
  if (interval) clearInterval(interval)
  interval = setInterval(randomizeStats, updateInterval.value)
}

onMounted(setupInterval)
onBeforeUnmount(() => {
  if (interval) clearInterval(interval)
})
watch(updateInterval, setupInterval)
</script>

<template>
  <div>
    <svg width="300" height="300">
      <Tweezing
        :to="stats"
        tween="tweenjs"
        tag="g"
        :duration="updateInterval"
        :easing="easing"
      >
        <template #default="{ value }">
          <polygon :points="transformToPoints(value as number[])" />
        </template>
      </Tweezing>
      <circle cx="150" cy="150" r="140" />
    </svg>
    <label>Sides: {{ sides }}</label>
    <input v-model.number="sides" type="range" min="3" max="500" />
    <label>Minimum Radius: {{ (minRadius * 100).toFixed(0) }}%</label>
    <input v-model.number="minRadius" type="range" min="0" step="0.01" max="0.9" />
    <label>Update Interval: {{ updateInterval }}ms</label>
    <input v-model.number="updateInterval" type="range" min="10" max="2000" />
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
  </div>
</template>

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
