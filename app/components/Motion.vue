<script setup lang="ts" generic="T extends number | Record<string, number> | number[]">
import { computed, ref, watch, onUnmounted } from 'vue'

interface Spring {
  stiffness: number
  damping: number
  precision?: number
}

const props = withDefaults(
  defineProps<{
    value?: T
    values?: T
    spring?: Spring | keyof typeof presets
    tag?: string
  }>(),
  {
    spring: () => ({ stiffness: 170, damping: 26, precision: 0.01 }),
    tag: 'div',
  },
)

const emit = defineEmits<{
  'motion-end': []
}>()

const presets = {
  noWobble: { stiffness: 170, damping: 26, precision: 0.01 },
  gentle: { stiffness: 120, damping: 14, precision: 0.01 },
  wobbly: { stiffness: 180, damping: 12, precision: 0.01 },
  stiff: { stiffness: 210, damping: 20, precision: 0.01 },
}

const target = computed(() => (props.value !== undefined ? props.value : props.values) as T)

const spring = computed<Spring>(() =>
  typeof props.spring === 'string' ? presets[props.spring] : props.spring,
)

// internal state: per-leaf {value, velocity}
type Leaf = { value: number; velocity: number; target: number }
type Tree = Leaf | Tree[] | { [k: string]: Tree }

function makeTree(t: any): Tree {
  if (typeof t === 'number') return { value: t, velocity: 0, target: t }
  if (Array.isArray(t)) return t.map(makeTree)
  if (t && typeof t === 'object') {
    const out: Record<string, Tree> = {}
    for (const k in t) out[k] = makeTree(t[k])
    return out
  }
  return { value: 0, velocity: 0, target: 0 }
}

function setTargets(tree: Tree, t: any) {
  if ('value' in (tree as any) && 'velocity' in (tree as any)) {
    ;(tree as Leaf).target = typeof t === 'number' ? t : 0
    return
  }
  if (Array.isArray(tree) && Array.isArray(t)) {
    for (let i = 0; i < tree.length; i++) setTargets(tree[i], t[i])
  } else if (typeof tree === 'object' && typeof t === 'object' && t) {
    for (const k in tree) setTargets((tree as any)[k], (t as any)[k])
  }
}

function step(tree: Tree, dt: number, s: Spring): boolean {
  if ('value' in (tree as any) && 'velocity' in (tree as any)) {
    const leaf = tree as Leaf
    const force = -s.stiffness * (leaf.value - leaf.target)
    const damper = -s.damping * leaf.velocity
    const a = force + damper
    leaf.velocity = leaf.velocity + a * dt
    leaf.value = leaf.value + leaf.velocity * dt
    const precision = s.precision ?? 0.01
    if (Math.abs(leaf.velocity) < precision && Math.abs(leaf.value - leaf.target) < precision) {
      leaf.value = leaf.target
      leaf.velocity = 0
      return true
    }
    return false
  }
  let done = true
  if (Array.isArray(tree)) {
    for (const child of tree) done = step(child, dt, s) && done
  } else {
    for (const k in tree as any) done = step((tree as any)[k], dt, s) && done
  }
  return done
}

function readTree(tree: Tree): any {
  if ('value' in (tree as any) && 'velocity' in (tree as any)) return (tree as Leaf).value
  if (Array.isArray(tree)) return tree.map(readTree)
  const out: Record<string, any> = {}
  for (const k in tree as any) out[k] = readTree((tree as any)[k])
  return out
}

const internal = ref<Tree>(makeTree(target.value))
const current = ref<T>(target.value)
let raf = 0
let lastTime = 0

function tick(now: number) {
  const dt = Math.min((now - lastTime) / 1000, 0.064)
  lastTime = now
  const done = step(internal.value, dt, spring.value)
  current.value = readTree(internal.value)
  if (done) {
    raf = 0
    emit('motion-end')
  } else {
    raf = requestAnimationFrame(tick)
  }
}

function kick() {
  if (raf) return
  lastTime = performance.now()
  raf = requestAnimationFrame(tick)
}

watch(
  target,
  newVal => {
    setTargets(internal.value, newVal)
    kick()
  },
  { deep: true },
)

onUnmounted(() => {
  if (raf) cancelAnimationFrame(raf)
})

defineSlots<{
  default(props: { value: T; values: T }): unknown
}>()
</script>

<template>
  <component :is="tag">
    <slot :value="(current as T)" :values="(current as T)" />
  </component>
</template>
