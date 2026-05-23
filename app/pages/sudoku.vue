<script setup lang="ts">
import { ref } from 'vue'

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

const cells = ref<Cell[]>(
  Array.from({ length: 81 }, (_, index) => ({
    id: index,
    number: (index % 9) + 1,
  })),
)

function doShuffle() {
  cells.value = shuffle(cells.value)
}
</script>

<template>
  <div>
    <h1>Lazy Sudoku</h1>
    <p>Keep hitting the shuffle button until you win.</p>

    <button @click="doShuffle">Shuffle</button>
    <TransitionGroup name="cell" tag="div" class="sudoku">
      <div v-for="cell in cells" :key="cell.id" class="cell">
        {{ cell.number }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.sudoku {
  display: flex;
  flex-wrap: wrap;
  width: calc(var(--sudoku-cell-size) * 9 - 6px);
  margin: auto;
  margin-top: 10px;
}
.cell {
  display: flex;
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
.cell-move {
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
