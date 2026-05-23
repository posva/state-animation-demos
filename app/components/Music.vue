<script setup lang="ts">
import { computed, onUnmounted, reactive, ref, shallowRef, watch } from 'vue'
import { Howl } from 'howler'
import { Easing } from '@tweenjs/tween.js'
import Motion from './Motion.vue'
import Tweezing from './Tweezing.vue'

type Mode = 'normal' | 'motion' | 'tween.js'

interface Track {
  label: string
  src: string
  format?: string[]
  // seek position (seconds) the Fun button jumps to; defaults to 0
  funSeek?: number
  // true => owned blob URL, revoke on replace
  isBlob?: boolean
}

const builtInTracks: Track[] = [
  { label: '🎺 Meatball Parade (instrumental)', src: '/meatball-parade.mp3', funSeek: 51 },
  { label: '🎤 Rewob — Adaptation (acapella)', src: '/rewob-adaptation-acapella.mp3' },
  { label: '🎹 Beethoven — Für Elise', src: '/fur-elise.ogg', format: ['ogg'] },
  { label: '🎻 Bach — Brandenburg No. 1, Allegro', src: '/bach-brandenburg-1-allegro.ogg', format: ['ogg'] },
  { label: '⛪ Pachelbel — Magnificat Fugue (organ)', src: '/pachelbel-magnificat-fugue.ogg', format: ['ogg'] },
  { label: '🔔 Tibetan singing bowl', src: '/tibetan-singing-bowl.ogg', format: ['ogg'] },
  { label: '🎛 Yamaha CS1X synth tone', src: '/yamaha-synth.ogg', format: ['ogg'] },
  { label: '🪈 Didgeridoo drone', src: '/didgeridoo.ogg', format: ['ogg'] },
  { label: '⛈ Thunder', src: '/thunder.ogg', format: ['ogg'] },
  { label: '❤️ Heartbeat', src: '/heartbeat.ogg', format: ['ogg'] },
]

const tracks = shallowRef<Track[]>([...builtInTracks])
const currentTrack = shallowRef<Track>(builtInTracks[0]!)

const mode = ref<Mode>('normal')
const rate = ref(1)
const playing = ref(false)
const loaded = ref(false)
const loadError = ref<string | null>(null)

const spring = reactive({ stiffness: 170, damping: 26, precision: 0.01 })

const easings = Object.entries(Easing).map(([name, group]) => ({
  text: name,
  value: group as Record<'In' | 'Out' | 'InOut', (k: number) => number>,
}))

const equationType = shallowRef<any>(Easing.Linear)
const easingType = ref<'In' | 'Out' | 'InOut'>('In')

const easing = computed(() => {
  const group: any = equationType.value
  return group[easingType.value] ?? group.None ?? group
})

const song = shallowRef<Howl>(makeSong(currentTrack.value))

function makeSong(track: Track) {
  return new Howl({
    src: [track.src],
    format: track.format,
    loop: true,
    volume: 0.1,
    rate: rate.value,
    onload: () => (loaded.value = true),
    onloaderror: (_id, err) => (loadError.value = String(err)),
  })
}

watch(currentTrack, (next, prev) => {
  loaded.value = false
  loadError.value = null
  playing.value = false
  song.value.stop()
  song.value.unload()
  if (prev?.isBlob) URL.revokeObjectURL(prev.src)
  song.value = makeSong(next)
})

function onFilePicked(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  const ext = file.name.split('.').pop()?.toLowerCase()
  const track: Track = {
    label: `📁 ${file.name}`,
    src: url,
    format: ext ? [ext] : undefined,
    isBlob: true,
  }
  tracks.value = [...tracks.value, track]
  currentTrack.value = track
  input.value = ''
}

function setRate(r: number) {
  const clamped = Math.max(0.01, Math.min(4, r))
  song.value.rate(clamped)
  return clamped
}

function play() {
  song.value.play()
  playing.value = true
}

function pause() {
  song.value.pause()
  playing.value = false
}

function toggleVolume() {
  const current = song.value.volume()
  song.value.fade(current, current < 1 ? 1 : 0.1, 300)
}

async function fun() {
  song.value.seek(currentTrack.value.funSeek ?? 0)
  mode.value = 'normal'
  rate.value = 1.05
  await Promise.resolve()
  mode.value = 'motion'
  spring.stiffness = 95
  spring.damping = 0
  await Promise.resolve()
  rate.value = 1
}

watch(rate, r => {
  if (mode.value === 'normal') setRate(r)
})

onUnmounted(() => {
  song.value.stop()
  song.value.unload()
  for (const t of tracks.value) if (t.isBlob) URL.revokeObjectURL(t.src)
})
</script>

<template>
  <div class="music-container">
    <div class="track-picker">
      <label class="text">
        Track
        <select v-model="currentTrack">
          <option v-for="t in tracks" :key="t.src" :value="t">{{ t.label }}</option>
        </select>
      </label>
      <label class="audio-btn file-btn">
        📂 Load file
        <input type="file" accept="audio/*" @change="onFilePicked" />
      </label>
    </div>
    <Transition
      mode="out-in"
      enter-active-class="animated rotateInDownRight"
      leave-active-class="animated hinge"
    >
      <div v-if="!loaded" key="loading">
        <p v-if="loadError">Failed to load: {{ loadError }}</p>
        <p v-else>Loading…</p>
      </div>
      <div v-else>
        <button v-if="!playing" class="audio-btn" @click="play">⏯ Play</button>
        <button v-else class="audio-btn" @click="pause">⏸ Pause</button>
        <button class="audio-btn" @click="toggleVolume">🔈 Toggle volume</button>
        <br />
        <select v-model="mode" class="mb1">
          <option value="normal">normal</option>
          <option value="motion">motion</option>
          <option value="tween.js">tween.js</option>
        </select>
        <input v-model.number="rate" type="range" min="0.05" max="4" step="0.05" />
        <br />
        <template v-if="mode === 'normal'">
          <p>Rate: {{ rate.toFixed(2) }}</p>
        </template>
        <Motion v-else-if="mode === 'motion'" :value="rate" :spring="spring">
          <template #default="{ value }">
            <input type="range" :value="value" disabled min="0.05" max="4" step="0.05" />
            <p>Rate: {{ setRate(value).toFixed(2) }}</p>
            <label class="text">
              Stiffness
              <input v-model.number="spring.stiffness" step="10" type="number" />
            </label>
            <label class="text">
              Damping
              <input v-model.number="spring.damping" step="1" type="number" />
            </label>
            <button class="fun-btn" @click="fun">🎩 Fun!</button>
          </template>
        </Motion>
        <template v-else>
          <Tweezing :to="rate" :duration="3000" :easing="easing">
            <template #default="{ value }">
              <input type="range" :value="value" disabled min="0.05" max="4" step="0.05" />
              <p>Rate: {{ setRate(value).toFixed(2) }}</p>
            </template>
          </Tweezing>
          <label class="text">
            Easing Equation
            <select v-model="equationType">
              <option v-for="e in easings" :key="e.text" :value="e.value">{{ e.text }}</option>
            </select>
          </label>
          <br />
          <label class="radio">
            <input v-model="easingType" type="radio" name="easing-type" value="In" />
            In
          </label>
          <label class="radio">
            <input v-model="easingType" type="radio" name="easing-type" value="Out" />
            Out
          </label>
          <label class="radio">
            <input v-model="easingType" type="radio" name="easing-type" value="InOut" />
            InOut
          </label>
        </template>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
input[type='range'] {
  max-width: 15rem;
  width: 100vw;
}

.fun-btn {
  margin-top: 1rem;
  background-color: var(--color-grass);
}

.animated.hinge {
  position: absolute;
}

.music-container {
  min-width: 270px;
  min-height: 20px;
}

.track-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.75rem;
}

.track-picker select {
  max-width: 18rem;
}

.file-btn {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.file-btn input[type='file'] {
  display: none;
}
</style>
