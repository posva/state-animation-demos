<template>
  <section>
    <ul class="links">
      <li><NuxtLink class="link" to="/basic-transition">Basic transition</NuxtLink></li>
      <li><NuxtLink class="link" to="/easings-graph">Easings graph</NuxtLink></li>
      <li><NuxtLink class="link" to="/motion-graph">Motion graph</NuxtLink></li>
      <li><NuxtLink class="link" to="/polygon">Polygon</NuxtLink></li>
      <li><NuxtLink class="link" to="/easing-mouse">Easing with mouse</NuxtLink></li>
      <li><NuxtLink class="link" to="/plot-motion">Plot</NuxtLink></li>
      <li><NuxtLink class="link" to="/sudoku-motion">Sudoku</NuxtLink></li>
      <li><NuxtLink class="link" to="/music">Music</NuxtLink></li>
      <li><NuxtLink class="link" to="/three">3D</NuxtLink></li>
    </ul>
  </section>
</template>

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
}

.link:hover {
  text-decoration-color: var(--color-snow);
  color: var(--color-purple);
}
</style>
