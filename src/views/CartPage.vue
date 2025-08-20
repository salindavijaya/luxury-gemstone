<template>
  <section class="container mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-4">Shopping Cart</h1>
    <p class="text-gray-600">Items in your cart will appear here.</p>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useUIStore } from "@/features/ui/store";
const ui = useUIStore();
onMounted(() => ui.setPageLoading(false));
</script>
