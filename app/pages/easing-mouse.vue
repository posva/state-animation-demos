<script setup lang="ts">
import { computed, ref } from 'vue'
import { GlobalEvents } from 'vue-global-events'
import Tweezing from '~/components/Tweezing.vue'

definePageMeta({ ssr: false })

const mouseY = ref(0)

const mouseYPer = computed(() =>
  import.meta.client ? mouseY.value / document.documentElement.clientHeight : 0,
)

function ballStyle(value: number) {
  const size = import.meta.client ? document.documentElement.clientHeight : 155
  return {
    transform: `translateY(${value * (size - 155)}px)`,
  }
}

function onMouseMove(e: Event) {
  mouseY.value = (e as MouseEvent).clientY
}

function onTouchMove(e: Event) {
  mouseY.value = (e as TouchEvent).touches[0]!.clientY
}
</script>

<template>
  <ClientOnly>
    <div id="easing-mouse">
      <GlobalEvents
        @mousemove.passive="onMouseMove"
        @touchmove.prevent="onTouchMove"
      />
      <Tweezing :to="1" tween="custom" :time="mouseYPer">
        <template #default="{ value }">
          <div>
            <pre>{{ (100 * mouseYPer).toFixed(2) }}%</pre>
            <div class="ball" :style="ballStyle(value)"></div>
          </div>
        </template>
      </Tweezing>
      <div class="line"></div>
    </div>
  </ClientOnly>
</template>

<style scoped>
#easing-mouse {
  width: 100%;
  max-height: calc(100% - 100px);
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
