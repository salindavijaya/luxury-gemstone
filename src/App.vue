<template>
  <router-view />
</template>

<script setup lang="ts">
// Minimal app shell
</script>

<style>
/* minimal reset to avoid flash before Tailwind loads */
html,
body,
#app {
  height: 100%;
}
body {
  margin: 0;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    sans-serif;
}
</style>
