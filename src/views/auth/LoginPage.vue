<template>
  <div class="login-page min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
      <AuthLogin />
    </div>
  </div>
</template>

<script setup lang="ts">
import AuthLogin from '@/components/auth/AuthLogin.vue'
</script>
