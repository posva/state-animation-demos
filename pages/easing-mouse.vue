<template>
  <div id="easing-mouse">
    <GlobalEvents @mousemove.passive="mouseY = $event.clientY" @touchmove.prevent="mouseY = $event.touches[0].clientY"/>
    <Tweezing :to="1" tween="custom" :time="mouseYPer">
      <div slot-scope="value">
        <pre>{{ (100 * mouseYPer).toFixed(2) }}%</pre>
        <div class="ball" :style="ballStyle(value)"></div>
      </div>
    </Tweezing>
    <div class="line"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mouseY: 0,
    }
  },

  methods: {
    ballStyle(value) {
      const size = process.client ? document.documentElement.clientHeight : 155
      return {
        transform: `translateY(${value * (size - 155)}px)`,
      }
    },
  },

  computed: {
    mouseYPer() {
      return process.client ? this.mouseY / document.documentElement.clientHeight : 0
    },
  },
}
</script>

<style scoped>
#easing-mouse {
  width: 100%;
  max-height: calc(100% - 100px);
  /* position: relative; */
}

.line {
  position: absolute;
  left: 0;
  bottom: 50px;
  width: 100%;
  height: 0.15rem;
  background-color: var(--color-snow);
}

.ball {
  --ball-size: 100px;
  position: absolute;
  top: 0;
  left: calc(50% - var(--ball-size) / 2);
  width: var(--ball-size);
  height: var(--ball-size);
  border-radius: 50%;
  background-color: var(--color-purple);
}
</style>
