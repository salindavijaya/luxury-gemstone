<template>
  <div class="faq-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold mb-8">Frequently Asked Questions</h1>

      <!-- Search Bar -->
      <div class="mb-12">
        <div class="max-w-xl mx-auto">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search FAQs..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
            <span class="absolute right-3 top-2.5 text-gray-400">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <!-- FAQ Categories -->
      <div class="mb-8">
        <div class="flex flex-wrap gap-4 justify-center">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium',
              selectedCategory === category.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- FAQ Sections -->
      <div class="space-y-6">
        <template v-for="category in categories" :key="category.id">
          <div v-if="selectedCategory === category.id || selectedCategory === 'all'">
            <h2 class="text-2xl font-semibold mb-4">{{ category.name }}</h2>
            <div class="space-y-4">
              <div
                v-for="faq in filteredFaqs(category.id)"
                :key="faq.id"
                class="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button
                  @click="toggleFaq(faq.id)"
                  class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                >
                  <span class="font-medium">{{ faq.question }}</span>
                  <svg
                    class="h-5 w-5 transform transition-transform duration-200"
                    :class="{ 'rotate-180': openFaqs.includes(faq.id) }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  v-show="openFaqs.includes(faq.id)"
                  class="px-6 py-4 bg-gray-50"
                >
                  <p class="text-gray-700">{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Still Have Questions -->
      <div class="mt-12 text-center">
        <h3 class="text-xl font-semibold mb-4">Still Have Questions?</h3>
        <p class="text-gray-600 mb-6">
          Can't find what you're looking for? We're here to help!
        </p>
        <router-link
          to="/contact"
          class="inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Contact Us
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedCategory = ref('all')
const openFaqs = ref<string[]>([])

const categories = ref([
  { id: 'all', name: 'All Questions' },
  { id: 'general', name: 'General' },
  { id: 'products', name: 'Products' },
  { id: 'shipping', name: 'Shipping' },
  { id: 'returns', name: 'Returns & Refunds' },
  { id: 'care', name: 'Care & Maintenance' }
])

const faqs = ref([
  {
    id: '1',
    categoryId: 'general',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers. For high-value purchases, we also offer wire transfer options.'
  },
  {
    id: '2',
    categoryId: 'products',
    question: 'Are your gemstones certified?',
    answer: 'Yes, all our gemstones come with certificates from internationally recognized authorities such as GIA, IGI, or AGS.'
  },
  {
    id: '3',
    categoryId: 'shipping',
    question: 'How are the gemstones shipped?',
    answer: 'All gemstones are shipped fully insured via secure courier services. International shipping is available to most countries.'
  },
  {
    id: '4',
    categoryId: 'returns',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for all unmounted gemstones in their original condition. Custom orders are non-returnable.'
  },
  {
    id: '5',
    categoryId: 'care',
    question: 'How should I clean my gemstones?',
    answer: 'Each gemstone type requires specific care. Generally, use mild soap and warm water, avoiding harsh chemicals and ultrasonic cleaners.'
  }
])

const filteredFaqs = (categoryId: string) => {
  return faqs.value
    .filter(faq => faq.categoryId === categoryId)
    .filter(faq => 
      searchQuery.value === '' ||
      faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
}

const toggleFaq = (id: string) => {
  const index = openFaqs.value.indexOf(id)
  if (index === -1) {
    openFaqs.value.push(id)
  } else {
    openFaqs.value.splice(index, 1)
  }
}
</script>
