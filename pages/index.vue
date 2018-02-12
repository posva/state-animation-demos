<template>
  <section>
    <ul class="links">
      <li>
        <nuxt-link class="link" to="/motion-graph">Motion graphs</nuxt-link>
      </li>
      <li>
        <nuxt-link class="link" to="/basic">Basic transition</nuxt-link>
      </li>
      <li>
        <nuxt-link class="link" to="/polygon">Polygon</nuxt-link>
      </li>
      <li>
        <nuxt-link class="link" to="/sudoku-motion">Sudoku</nuxt-link>
      </li>
      <li>
        <nuxt-link class="link" to="/music">Music</nuxt-link>
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
