<template>
  <section class="container mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-4">Checkout</h1>
    <p class="text-gray-600">Checkout steps and payment form.</p>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useUIStore } from "@/features/ui/store";
const ui = useUIStore();
onMounted(() => ui.setPageLoading(false));
</script>
