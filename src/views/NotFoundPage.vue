<template>
  <section class="container mx-auto p-6 text-center">
    <h1 class="text-4xl font-bold mb-4">404</h1>
    <p class="text-gray-600">Page not found.</p>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useUIStore } from "@/features/ui/store";
const ui = useUIStore();
onMounted(() => ui.setPageLoading(false));
</script>
