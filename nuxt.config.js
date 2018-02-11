module.exports = {
  mode: 'spa',
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
  },

  plugins: ['~/plugins/motion', '~/plugins/tweezing'],

  css: ['modern-normalize/modern-normalize.css', 'animate.css/animate.css', '~/assets/main.css'],
}
