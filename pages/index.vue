<template>
  <section>
    <ul class="links">
      <li>
        <nuxt-link class="link" to="/basic-transition">Basic transition</nuxt-link>
      </li>
      <li>
        <nuxt-link class="link" to="/easings-graph">Easings graph</nuxt-link>
      </li>
      <li>
        <nuxt-link class="link" to="/motion-graph">Motion graph</nuxt-link>
      </li>
      <li>
        <nuxt-link class="link" to="/polygon">Polygon</nuxt-link>
      </li>
      <li>
        <nuxt-link class="link" to="/easing-mouse">Easing with mouse</nuxt-link>
      </li>
      <li>
        <nuxt-link class="link" to="/plot-motion">Plot</nuxt-link>
      </li>
      <li>
        <nuxt-link class="link" to="/sudoku-motion">Sudoku</nuxt-link>
      </li>
      <li>
        <nuxt-link class="link" to="/music">Music</nuxt-link>
      </li>
      <li>
        <nuxt-link class="link" to="/three">3D</nuxt-link>
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

.links li,
.links {
  list-style: none;
  margin: 0;
  padding: 0;
}

.link {
  color: var(--color-snow);
  text-decoration-style: dashed;
  text-decoration-color: var(--color-purple);
  display: block;
  margin-bottom: 0.5rem;

  transition: text-decoration-color 150ms, color 150ms;

  &:hover {
    text-decoration-color: var(--color-snow);
    color: var(--color-purple);
  }
}
</style>
