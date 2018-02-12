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
    <button @click="shuffle">
      Shuffle
    </button>
    <Motion :values="positions" class="sudoku" tag="div" :spring="spring">
      <template slot-scope="positions" >
        <div
          v-for="cell in cells"
          :key="cell.id"
          class="cell"
          :style="{ transform: `translate(${positions[cell.id].x}px, ${positions[cell.id].y}px)` }"
        >
          {{ cell.number }}
        </div>
      </template>
    </Motion>
  </div>
</template>

<script>
import shuffle from 'lodash/shuffle'

export default {
  data() {
    return {
      spring: 'gentle',
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

  computed: {
    positions() {
      return this.cells.reduce((positions, cell, i) => {
        const size = 31
        const x = i % 9
        const y = Math.floor(i / 9)
        positions[cell.id] = {
          x: x * size + 1 + Math.floor(x / 3),
          y: y * size + 1 + Math.floor(y / 3),
        }
        return positions
      }, Array(this.cells.length))
    },
  },
}
</script>

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
