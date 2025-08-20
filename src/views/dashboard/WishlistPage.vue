<template>
  <div>
    <h2 class="text-xl font-medium mb-4">Wishlist</h2>
    <p class="text-gray-600">Saved items will appear here.</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useUIStore } from "@/features/ui/store";
const ui = useUIStore();
onMounted(() => ui.setPageLoading(false));
</script>
