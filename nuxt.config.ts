export default defineNuxtConfig({
  compatibilityDate: '2026-05-23',

  app: {
    head: {
      title: 'Vue.js State Animations Demos',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        { name: 'description', content: 'State Animations demos' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  css: [
    'modern-normalize/modern-normalize.css',
    'animate.css/animate.css',
    '~/assets/main.css',
  ],
})
