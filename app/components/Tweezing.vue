<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { Group, Tween, Easing } from '@tweenjs/tween.js'

type EasingFn = (k: number) => number
type TweenValue = number | Record<string, number> | number[]

const props = withDefaults(
  defineProps<{
    to: TweenValue
    duration?: number
    easing?: EasingFn
    tween?: 'tweenjs' | 'custom'
    time?: number
    tag?: string
  }>(),
  {
    duration: 1000,
    easing: () => Easing.Linear.None,
    tween: 'tweenjs',
    tag: 'span',
  },
)

const emit = defineEmits<{ end: [] }>()

function clone(v: TweenValue): any {
  if (typeof v === 'number') return { _v: v }
  if (Array.isArray(v)) return v.slice()
  return { ...v }
}

function snapshot(state: any): any {
  if (Array.isArray(state)) return state.slice()
  if (state && typeof state === 'object') return { ...state }
  return state
}

function unwrap(v: any, originalIsNumber: boolean): any {
  if (originalIsNumber) return v._v
  return snapshot(v)
}

const current = ref<any>(props.to)
const group = new Group()
let activeTween: Tween | null = null
let raf = 0

function animate(time: number) {
  group.update(time)
  raf = requestAnimationFrame(animate)
}

onMounted(() => {
  raf = requestAnimationFrame(animate)
})

function startTween(to: TweenValue) {
  if (activeTween) activeTween.stop()
  if (props.tween === 'custom') return

  const isNumber = typeof to === 'number'
  const from = clone(isNumber ? (current.value as number) : current.value)
  const target = clone(to)

  activeTween = new Tween(from, group)
    .to(target, props.duration)
    .easing(props.easing)
    .onUpdate(v => {
      current.value = unwrap(v, isNumber)
    })
    .onComplete(() => emit('end'))
    .start()
}

watch(
  () => props.to,
  newVal => startTween(newVal),
  { deep: true },
)

watch(
  () => props.time,
  t => {
    if (props.tween !== 'custom' || t === undefined) return
    const ease = props.easing(Math.max(0, Math.min(1, t)))
    if (typeof props.to === 'number') {
      current.value = ease * props.to
    }
  },
)

onUnmounted(() => {
  if (raf) cancelAnimationFrame(raf)
  if (activeTween) activeTween.stop()
})

defineSlots<{
  default(props: { value: any }): unknown
}>()
</script>

<template>
  <component :is="tag">
    <slot :value="current" />
  </component>
</template>
