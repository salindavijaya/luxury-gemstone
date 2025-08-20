<script setup lang="ts">
const props = defineProps({ currentPage: Number, totalPages: Number });
</script>
<template>
  <nav class="flex items-center gap-2" aria-label="Pagination">
    <slot />
  </nav>
</template>
