<script setup lang="ts">
import { ref } from 'vue'

const on = ref(true)
</script>

<template>
  <div class="basic-transition">
    <div class="text-container" @click="on = !on">
      <Transition
        enter-active-class="animate__animated animate__slideInLeft"
        leave-active-class="animate__animated animate__slideOutRight animate__fadeOut"
      >
        <div v-if="on" key="on">On</div>
        <div v-else>Off</div>
      </Transition>
    </div>
    <p>Click on the text to toggle it</p>
  </div>
</template>

<style scoped>
.text-container {
  cursor: pointer;
  text-align: left;
  padding: 1rem;
}

.animate__animated.animate__slideOutRight {
  animation-name: slideOutRight, fadeOut;
  position: absolute;
  width: 343px;
  max-width: calc(100vw - 1.3rem);
}

.basic-transition {
  font-size: 1.5rem;
}
</style>
