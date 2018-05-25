module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Vue.js State Animations Demos',
    meta: [
      { charset: 'utf-8' },
      { hid: 'description', name: 'description', content: 'State Animations demos' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#eee' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      config.resolve.mainFields = ['module', 'main']
    },
    postcss: [require('postcss-nested')()],
  },

  modules: ['@nuxtjs/pwa'],

  plugins: [
    '~/plugins/motion',
    '~/plugins/tweezing',
    '~/plugins/global-events',
    { src: '~plugins/ga.js', ssr: false },
    { src: '~/plugins/three', ssr: false },
  ],

  css: ['modern-normalize/modern-normalize.css', 'animate.css/animate.css', '~/assets/main.css'],

  manifest: {
    name: 'State Animations Demos',
    short_name: 'State Animations',
    lang: 'en',
    background_color: '#111111',
    theme_color: '#8652e7',
    display: 'standalone',
    description: 'Demos for my State Animations talk',
  },
}
