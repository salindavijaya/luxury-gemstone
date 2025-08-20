<template>
  <section class="container mx-auto p-6">
    <h1 class="text-2xl font-semibold mb-4">Your Profile</h1>
    <p class="text-gray-600">Profile management UI will appear here.</p>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "@/features/auth/store";
import { useUIStore } from "@/features/ui/store";
const auth = useAuthStore();
const ui = useUIStore();
onMounted(() => ui.setPageLoading(false));
</script>
