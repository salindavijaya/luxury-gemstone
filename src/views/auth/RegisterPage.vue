<template>
  <div class="register-page min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
      <AuthRegister />
    </div>
  </div>
</template>

<script setup lang="ts">
import AuthRegister from '@/components/auth/AuthRegister.vue'
</script>
