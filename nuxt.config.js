module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Vue.js Amsterdam Demos',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
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

  plugins: ['~/plugins/motion', '~/plugins/tweezing', '~/plugins/global-events', { src: '~plugins/ga.js', ssr: false }],

  css: ['modern-normalize/modern-normalize.css', 'animate.css/animate.css', '~/assets/main.css'],
}
