<template>
  <main class="container mx-auto p-6">
    <h1 class="text-3xl font-semibold mb-4">Luxury Gemstone Platform</h1>
    <p class="text-gray-600">
      Discover the world's finest gemstones and luxury jewelry.
    </p>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useUIStore } from "@/features/ui/store";

const ui = useUIStore();
onMounted(() => {
  ui.setPageLoading(false);
  document.title = "Home - Luxury Gemstone Platform";
});
</script>

<style scoped></style>
