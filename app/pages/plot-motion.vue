<script setup lang="ts">
import { computed, ref } from 'vue'
import Motion from '~/components/Motion.vue'
import options from '~/assets/datasets.json'

const selected = ref<number[]>([...(options[0]!.value as number[])])

const getMax = computed(() => Math.max.apply(Math, selected.value) * 10)
const getMaxRange = computed(() => {
  const max = Math.max.apply(Math, selected.value)
  return Array.from({ length: max }, (_, i) => i)
})

function randomize() {
  selected.value = selected.value.map(() => Math.floor(Math.random() * 37))
}

function selectOption(value: number[]) {
  selected.value = [...value]
}

function barColor(i: number) {
  const max = 40
  const h = 261 - (i / max) * 20
  const s = 100 - (i / max) * 60
  const l = 61 - (i / max) * 20
  return `hsl(${h}, ${s}%, ${l}%)`
}
</script>

<template>
  <div class="plot-motion">
    <select @change="selectOption(options[(($event.target as HTMLSelectElement).selectedIndex)]!.value as number[])">
      <option v-for="option in options" :key="option.text">{{ option.text }}</option>
    </select>

    <svg viewBox="0 0 400 400" :style="{ transform: `translateY(${370 - getMax}px)` }">
      <g class="xaxis">
        <line x1="-2" :y1="getMax - 369" x2="365" :y2="getMax - 369" />
        <g v-for="(_, index) in selected" :key="`x${index}`">
          <line :y1="getMax - 369" :y2="getMax - 362" :x1="index * 10" :x2="index * 10" />
          <text v-if="index % 5 === 0" :x="index * 10" :y="getMax - 349">{{ index }}</text>
        </g>
      </g>

      <g class="yaxis">
        <line x1="0" y1="1" :x2="getMax" y2="1" />
        <g v-for="n in getMaxRange" :key="`y${n}`">
          <line y1="0" y2="7" :x1="n * 10" :x2="n * 10" />
          <text v-if="n % 5 === 0" :x="getMax - n * 10 - 5" y="20">{{ n }}</text>
        </g>
      </g>

      <Motion tag="g" :values="selected">
        <template #default="{ values }">
          <g v-for="(select, index) in (values as number[])" :key="index" class="bars">
            <rect
              :x="index * 10 + 20"
              :y="getMax - select * 10"
              width="10"
              :height="select * 10"
              :fill="barColor(index)"
            />
          </g>
        </template>
      </Motion>
    </svg>

    <button @click="randomize">Random</button>
  </div>
</template>

<style scoped>
.plot-motion {
  text-align: center;
  max-width: 400px;
  margin: 30px auto;
  display: inline-block;
}

select {
  margin-bottom: 1rem;
}

svg text {
  font-size: 0.75rem;
  fill: var(--color-smoke);
}

line {
  stroke: var(--color-smoke);
  stroke-width: 2px;
}

.xaxis {
  transform: translate(20px, 370px);
}

.yaxis {
  transform: translate(20px, 0px) rotate(90deg);
}

.bars {
  fill: var(--color-purple);
}
</style>
