<template>
  <div>
    <h1>Lazy Sudoku</h1>
    <p>Keep hitting the shuffle button until you win.</p>

    <button @click="shuffle">
      Shuffle
    </button>
    <transition-group name="cell" tag="div" class="sudoku">
      <div v-for="cell in cells" :key="cell.id" class="cell">
        {{ cell.number }}
      </div>
    </transition-group>
  </div>
</template>

<script>
import shuffle from 'lodash/shuffle'

export default {
  data() {
    return {
      cells: Array.apply(null, { length: 81 }).map((_, index) => ({
        id: index,
        number: index % 9 + 1,
      })),
    }
  },

  methods: {
    shuffle: function() {
      this.cells = shuffle(this.cells)
    },
  },
}
</script>

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
