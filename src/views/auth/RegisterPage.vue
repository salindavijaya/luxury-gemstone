<template>
  <section class="max-w-md mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-4">Create an Account</h1>
    <p class="text-gray-600">
      Registration form placeholder; use `AuthRegister.vue` component for full
      UI.
    </p>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useUIStore } from "@/features/ui/store";
const ui = useUIStore();
onMounted(() => ui.setPageLoading(false));
</script>
