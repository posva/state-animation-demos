<template>
  <no-ssr>
    <music/>
  </no-ssr>
</template>

<script>
const Music = () => import('~/components/music')

export default {
  components: {
    Music,
  },
}
</script>
