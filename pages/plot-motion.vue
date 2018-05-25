<template>
  <div class="plot-motion">
    <select v-model="selected">
      <option v-for="option in options" v-bind:value="option.value">
        {{ option.text }}
      </option>
    </select>

    <svg viewBox="0 0 400 400" :style="{ transform: `translateY(${370 - getMax}px)` }">
      <!--xaxis -->
      <g class="xaxis">
        <line x1="-2" :y1="getMax - 369" x2="365" :y2="getMax - 369"/>
        <g v-for="(select, index) in selected">
          <line :y1="getMax - 369" :y2="getMax - 362" v-bind="{ 'x1':index*10, 'x2':index*10 }"/>
          <text v-if="index % 5 === 0" v-bind="{ 'x':index*10, 'y': getMax - 349 }">{{ index }}</text>
        </g>
      </g>

      <!--yaxis -->
      <g class="yaxis">
        <line x1="0" y1="1" :x2="getMax" y2="1"/>
        <g v-for="n in getMaxRange">
          <line y1="0" y2="7" v-bind="{ 'x1':n*10, 'x2':n*10 }"/>
          <text v-if="n % 5 === 0" v-bind="{ 'x':getMax-(n*10)-5, 'y':20 }">{{ n }}</text>
        </g>
      </g>

    <!-- bars -->
      <motion tag="g" :values="selected">
        <template slot-scope="vals">
          <g v-for="(select, index) in vals" class="bars">
            <rect :x="index*10+20" :y="getMax-select*10" width="10" :height="select*10"/>
          </g>
        </template>
      </motion>

    </svg>

    <button @click="randomize">Random</button>
  </div>
</template>

<script>
import options from '~/assets/datasets'
import range from 'lodash/range'

export default {
  data() {
    return {
      selected: options[0].value.slice(),
      options,
    }
  },

  computed: {
    getMax() {
      return Math.max.apply(Math, this.selected) * 10
    },
    getMaxRange() {
      let maxi = Math.max.apply(Math, this.selected)
      return range(maxi)
    },
  },

  methods: {
    randomize() {
      this.selected = this.selected.map(_ => Math.floor(Math.random() * 37))
    },
  },
}
</script>

<style lang="scss" scoped>
.plot-motion {
  text-align: center;
  max-width: 400px;
  margin: 30px auto;
  display: inline-block;
}

select {
  margin-bottom: 1rem;
}

svg {
  & text {
    font-size: 0.75rem;
    fill: var(--color-smoke);
  }
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

$amt: 350px;
$max: 40;
$color: 200/$max;

@for $i from 1 through $max {
  .bars:nth-child(#{$i}) rect {
    fill: hsl(261 - ($i / $max) * 20%, 100% - ($i / $max) * 60%, 61% - ($i / $max) * 20%);
    // fill: hsl(($i - 10)*($color*1.25),  ($i - 1)*$color, 40%);
  }
}
</style>
