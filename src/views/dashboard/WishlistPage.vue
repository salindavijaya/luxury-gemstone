<template>
  <main class="py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white shadow sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <DashboardWishlist />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import DashboardWishlist from "@/components/dashboard/DashboardWishlist.vue";
</script>
