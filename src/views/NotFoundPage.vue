<template>
  <div class="not-found-page min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-xl w-full text-center px-4">
      <h1 class="text-6xl font-bold text-primary-600 mb-4">404</h1>
      <h2 class="text-3xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
      <p class="text-gray-600 mb-8">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      <div class="space-x-4">
        <router-link
          to="/"
          class="inline-block bg-primary-600 text-white py-2 px-6 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Go Home
        </router-link>
        <button
          @click="goBack"
          class="inline-block bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Go Back
        </button>
      </div>

      <!-- Suggested Links -->
      <div class="mt-12">
        <h3 class="text-lg font-medium text-gray-900 mb-4">You might be interested in:</h3>
        <ul class="space-y-2">
          <li>
            <router-link
              to="/products"
              class="text-primary-600 hover:text-primary-700"
            >
              Browse Our Collection
            </router-link>
          </li>
          <li>
            <router-link
              to="/contact"
              class="text-primary-600 hover:text-primary-700"
            >
              Contact Support
            </router-link>
          </li>
          <li>
            <router-link
              to="/about"
              class="text-primary-600 hover:text-primary-700"
            >
              About Us
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>
