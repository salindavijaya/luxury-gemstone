<template>
  <div class="gem-education-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold mb-8">Gemstone Education</h1>

      <!-- Introduction -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">Understanding Gemstones</h2>
        <p class="text-gray-700 mb-4">
          Understanding the qualities and characteristics of gemstones is essential for making an informed purchase.
          Learn about the 4Cs (Color, Clarity, Cut, and Carat) and other important factors that determine a gemstone's value.
        </p>
      </section>

      <!-- Educational Topics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- The 4Cs -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-3">The 4Cs of Gemstones</h3>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start space-x-2">
              <span class="font-medium">Color:</span>
              <span>Hue, tone, and saturation</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="font-medium">Clarity:</span>
              <span>Internal and external characteristics</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="font-medium">Cut:</span>
              <span>Proportion, symmetry, and polish</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="font-medium">Carat:</span>
              <span>Weight and size measurements</span>
            </li>
          </ul>
        </div>

        <!-- Gemstone Types -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-3">Popular Gemstone Types</h3>
          <ul class="space-y-2 text-gray-700">
            <li v-for="gem in gemstoneTypes" :key="gem.name">
              <router-link 
                :to="{ path: '/education/gemstones', query: { type: gem.slug }}"
                class="text-primary-600 hover:text-primary-700"
              >
                {{ gem.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Care Guide -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-3">Care and Maintenance</h3>
          <p class="text-gray-700 mb-4">
            Learn how to properly care for and maintain your gemstones to ensure their lasting beauty.
          </p>
          <router-link 
            to="/education/care-guide"
            class="text-primary-600 hover:text-primary-700"
          >
            Read Care Guide →
          </router-link>
        </div>
      </div>

      <!-- Video Tutorials -->
      <section class="mt-12">
        <h2 class="text-2xl font-semibold mb-6">Video Tutorials</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="video in educationalVideos" :key="video.id" class="aspect-video">
            <iframe 
              :src="video.embedUrl"
              class="w-full h-full rounded-lg"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const gemstoneTypes = ref([
  { name: 'Diamonds', slug: 'diamonds' },
  { name: 'Rubies', slug: 'rubies' },
  { name: 'Sapphires', slug: 'sapphires' },
  { name: 'Emeralds', slug: 'emeralds' },
  { name: 'Opals', slug: 'opals' },
  { name: 'Tanzanite', slug: 'tanzanite' }
])

const educationalVideos = ref([
  {
    id: 1,
    title: 'Understanding Diamond Quality',
    embedUrl: 'https://www.youtube.com/embed/example1'
  },
  {
    id: 2,
    title: 'Guide to Colored Gemstones',
    embedUrl: 'https://www.youtube.com/embed/example2'
  },
  {
    id: 3,
    title: 'Gemstone Care Tips',
    embedUrl: 'https://www.youtube.com/embed/example3'
  }
])
</script>
