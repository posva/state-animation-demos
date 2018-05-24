<template>
  <div class="basic-transition">
    <div class="text-container" @click="on = !on">
      <transition
        enter-active-class="animated slideInLeft"
        leave-active-class="animated slideOutRight fadeOut"
      >
        <div v-if="on" key="on">On</div>
        <div v-else>Off</div>
      </transition>
    </div>
    <p>Click on the text to toggle it</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      on: true,
    }
  },
}
</script>

<style scoped>
.text-container {
  cursor: pointer;
  text-align: left;
  padding: 1rem;
}

.animated.slideOutRight {
  animation-name: slideOutRight, fadeOut;
  position: absolute;
  width: 343px;
  max-width: calc(100vw - 1.3rem);
}

.basic-transition {
  font-size: 1.5rem;
}
</style>
