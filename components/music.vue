<template>
  <div class="music-container">
    <transition
      mode="out-in"
      enter-active-class="animated rotateInDownRight"
      leave-active-class="animated hinge"
    >
      <div v-if="progress <= 1" key="loading">
        Loading ({{ (progress * 100).toFixed(0)}}%)
        <br>
        {{ loadingBar }}
      </div>
      <div v-else>
        <button class="audio-btn" @click="play" v-if="!playing">⏯ Play</button>
        <button class="audio-btn" @click="pause" v-else>⏸ Pause</button>
        <button class="audio-btn" @click="toggleVolume">🔈 Toggle volume</button>
        <br>
        <select v-model="mode" class="mb1">
          <option>normal</option>
          <option>motion</option>
          <option>tween.js</option>
        </select>
        <input type="range" v-model.number="rate" min="0.05" max="4" step="0.05">
        <br>
        <template v-if="mode === 'normal'">
          <p>Rate: {{ rate.toFixed(2) }}</p>
        </template>
        <Motion :value="rate" :spring="spring" v-else-if="mode === 'motion'">
          <template slot-scope="{ value }">
            <input type="range" :value="value" disabled min="0.05" max="4" step="0.05">
            <p>Rate: {{ setRate(value).toFixed(2) }}</p>
            <label class="text">
              Stiffness
              <input v-model.number="spring.stiffness" step="10" type="number"/>
            </label>
            <label class="text">
              Damping
              <input v-model.number="spring.damping" step="1" type="number"/>
            </label>
            <button class="fun-btn" @click="fun">🎩 Fun!</button>
          </template>
        </Motion>
        <template v-else-if="mode === 'tween.js'">
          <Tweezing :to="rate" tween="tweenjs" :duration="3000" :easing="easing">
            <div slot-scope="value">
              <input type="range" :value="value" disabled min="0.05" max="4" step="0.05">
              <p>Rate: {{ setRate(value).toFixed(2) }}</p>
            </div>
          </Tweezing>
          <label class="text">
            Easing Equation
            <select v-model="equationType">
              <option v-for="easing in easings" :value="easing.value">{{ easing.text }}</option>
            </select>
          </label>
          <br>
          <label class="radio">
            <input v-model="easingType" type="radio" name="easing-type" value="In">
            In
          </label>
          <label class="radio">
            <input v-model="easingType" type="radio" name="easing-type" value="Out">
            Out
          </label>
          <label class="radio">
            <input v-model="easingType" type="radio" name="easing-type" value="InOut">
            InOut
          </label>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
import TWEEN from '@tweenjs/tween.js'
import p5 from 'p5'
import p5Sound from 'p5/lib/addons/p5.sound'

const p = new p5()

const music = '/meatball-parade.mp3'

export default {
  data() {
    return {
      mode: 'normal',
      rate: 1,
      playing: false,

      // motion
      spring: {
        stiffness: 170,
        damping: 26,
        precision: 0.01,
      },

      // tween.js
      equationType: TWEEN.Easing.Linear,
      easingType: 'In',

      // loading
      progress: 0,
    }
  },

  computed: {
    easing() {
      return this.equationType[this.easingType]
    },

    easings() {
      return Object.keys(TWEEN.Easing).map(easing => ({
        value: TWEEN.Easing[easing],
        text: easing,
      }))
    },

    loadingBar() {
      const n = 10
      const done = Math.min(Math.floor(this.progress * n), 10)
      console.log(done)
      return '🔊'.repeat(done) + '🔇'.repeat(n - done)
    },
  },

  mounted() {
    this.song = p.loadSound(
      music,
      async () => {
        this.progress = 1
        await this.$nextTick()
        this.progress = 2
      },
      console.error,
      progress => (this.progress = progress)
      // ({ loaded, total }) => {
      //   console.log(arguments)
      //   this.progress = { loaded, total }
      // }
    )
  },

  destroyed() {
    this.song.stop()
  },

  methods: {
    setRate(rate) {
      this.song.rate(rate)
      return rate
    },
    async fun() {
      this.song.jump(51)
      this.mode = ''
      this.rate = 1.05
      await this.$nextTick()
      this.mode = 'motion'
      this.spring.stiffness = 95
      this.spring.damping = 0
      await this.$nextTick()
      this.rate = 1
    },

    play() {
      this.song.setVolume(0.1)
      this.song.loop()
      this.playing = true
    },

    pause() {
      this.song.pause()
      this.playing = false
    },

    toggleVolume() {
      this.song.amp(this.song.getVolume() < 1 ? 1 : 0.1, 0.3)
    },
  },

  watch: {
    rate(rate) {
      if (this.mode === 'normal') this.song.rate(p.constrain(rate, 0.01, 4))
    },
  },
}
</script>

<style scoped>
input[type='range'] {
  max-width: 15rem;
  width: 100vw;
}

.fun-btn {
  margin-top: 1rem;
  background-color: var(--color-grass);
}
.audio-btn {
  /* margin: 1rem; */
}

.animated.hinge {
  position: absolute;
}

.music-container {
  min-width: 270px;
  min-height: 20px;
}
</style>
