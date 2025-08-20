<template>
  <section class="max-w-md mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-4">Sign in</h1>
    <p class="text-gray-600 mb-4">
      Use demo credentials: demo@gemstore.com / password123
    </p>
    <!-- Simple login hint; actual form components exist in components/auth -->
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useUIStore } from "@/features/ui/store";
const ui = useUIStore();
onMounted(() => ui.setPageLoading(false));
</script>
