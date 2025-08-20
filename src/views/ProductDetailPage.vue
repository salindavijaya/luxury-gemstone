<template>
  <article class="container mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-4">Product Details</h1>
    <p class="text-gray-600">Detailed product information will appear here.</p>
  </article>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useUIStore } from "@/features/ui/store";
const route = useRoute();
const ui = useUIStore();
onMounted(() => {
  ui.setPageLoading(false);
  const slug = route.params.slug as string | undefined;
  document.title = slug
    ? `${slug} - Luxury Gemstone Platform`
    : "Product Details";
});
</script>
