<template>
  <div>
    <h2 class="text-xl font-medium mb-4">Orders</h2>
    <p class="text-gray-600">Order history will be displayed here.</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useUIStore } from "@/features/ui/store";
const ui = useUIStore();
onMounted(() => ui.setPageLoading(false));
</script>
