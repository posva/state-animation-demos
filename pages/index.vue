<template>
  <section class="container">
    <ul class="links">
      <li>
        <nuxt-link class="button--grey" to="/motion-graph">Motion graphs</nuxt-link>
      </li>
      <li>
        <nuxt-link class="button--grey" to="/basic">Basic transition</nuxt-link>
      </li>
    </ul>
  </section>
</template>

<script>
export default {}
</script>

<style>
.links {
  padding-top: 15px;
}

.links li {
  list-style: none;
  margin: 0;
  margin-bottom: 0.3rem;
}
</style>
