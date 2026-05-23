<script setup lang="ts">
import { computed, ref } from 'vue'
import Motion from '~/components/Motion.vue'

interface Cell {
  id: number
  number: number
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i]!, out[j]!] = [out[j]!, out[i]!]
  }
  return out
}

const spring = ref<'noWobble' | 'wobbly' | 'gentle' | 'stiff'>('gentle')
const cells = ref<Cell[]>(
  Array.from({ length: 81 }, (_, index) => ({
    id: index,
    number: (index % 9) + 1,
  })),
)

function doShuffle() {
  cells.value = shuffle(cells.value)
}

const positions = computed(() => {
  const out: Record<number, { x: number; y: number }> = {}
  cells.value.forEach((cell, i) => {
    const size = 31
    const x = i % 9
    const y = Math.floor(i / 9)
    out[cell.id] = {
      x: x * size + 1 + Math.floor(x / 3),
      y: y * size + 1 + Math.floor(y / 3),
    }
  })
  return out
})
</script>

<template>
  <div>
    <h1>Lazy Sudoku</h1>
    <p>Keep hitting the shuffle button until you win.</p>

    <select v-model="spring">
      <option>noWobble</option>
      <option>wobbly</option>
      <option>gentle</option>
      <option>stiff</option>
    </select>
    <button @click="doShuffle">Shuffle</button>
    <Motion :values="positions" class="sudoku" tag="div" :spring="spring">
      <template #default="{ values }">
        <div
          v-for="cell in cells"
          :key="cell.id"
          class="cell"
          :style="{
            transform: `translate(${values[cell.id].x}px, ${values[cell.id].y}px)`,
          }"
        >
          {{ cell.number }}
        </div>
      </template>
    </Motion>
  </div>
</template>

<style scoped>
.sudoku {
  width: calc(var(--sudoku-cell-size) * 9 - 6px);
  height: calc(var(--sudoku-cell-size) * 9 - 6px);
  margin: auto;
  margin-top: 10px;
}
.cell {
  display: flex;
  position: absolute;
  justify-content: space-around;
  align-items: center;
  width: var(--sudoku-cell-size);
  height: var(--sudoku-cell-size);
  border: 1px solid #aaa;
  margin-right: -1px;
  margin-bottom: -1px;
}
.cell:nth-child(3n) {
  margin-right: 0;
}
.cell:nth-child(27n) {
  margin-bottom: 0;
}
</style>
