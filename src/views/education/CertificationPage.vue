<template>
  <div class="certification-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold mb-8">Gemstone Certification</h1>

      <!-- Introduction -->
      <section class="mb-12">
        <p class="text-lg text-gray-700 mb-6">
          Our gemstones come with internationally recognized certificates that verify their authenticity,
          quality, and characteristics. Learn about the different certification authorities and what their
          certificates mean.
        </p>
      </section>

      <!-- Certification Authorities -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-6">Certification Authorities</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="authority in certificationAuthorities" 
               :key="authority.id" 
               class="bg-white p-6 rounded-lg shadow-md">
            <img 
              :src="authority.logo" 
              :alt="authority.name"
              class="h-12 mb-4"
            >
            <h3 class="text-xl font-semibold mb-3">{{ authority.name }}</h3>
            <p class="text-gray-700 mb-4">{{ authority.description }}</p>
            <a 
              :href="authority.website" 
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary-600 hover:text-primary-700"
            >
              Learn More →
            </a>
          </div>
        </div>
      </section>

      <!-- Certificate Elements -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-6">Understanding Your Certificate</h2>
        <div class="bg-white p-8 rounded-lg shadow-md">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-xl font-semibold mb-4">Key Certificate Elements</h3>
              <ul class="space-y-4">
                <li v-for="element in certificateElements" 
                    :key="element.id"
                    class="flex items-start space-x-3">
                  <div class="flex-shrink-0 mt-1">
                    <div class="w-2 h-2 bg-primary-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 class="font-medium">{{ element.title }}</h4>
                    <p class="text-gray-600">{{ element.description }}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <img 
                src="@/assets/images/sample-certificate.jpg" 
                alt="Sample Gemstone Certificate"
                class="rounded-lg shadow-sm"
              >
            </div>
          </div>
        </div>
      </section>

      <!-- Verification Process -->
      <section>
        <h2 class="text-2xl font-semibold mb-6">Certificate Verification</h2>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <p class="text-gray-700 mb-6">
            All our certificates can be verified online through the respective certification authority's website.
            Follow these steps to verify your certificate:
          </p>
          <ol class="list-decimal list-inside space-y-4 text-gray-700">
            <li>Locate the certificate number on your certificate</li>
            <li>Visit the certification authority's website</li>
            <li>Enter the certificate number in their verification tool</li>
            <li>Compare the details with your certificate</li>
          </ol>
          <div class="mt-6">
            <button 
              @click="showVerificationTool"
              class="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Verify Certificate Now
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const certificationAuthorities = ref([
  {
    id: 1,
    name: 'GIA (Gemological Institute of America)',
    logo: '@/assets/images/gia-logo.png',
    description: 'The world\'s foremost authority in gemology, providing education, research, laboratory services, and instrument development.',
    website: 'https://www.gia.edu'
  },
  {
    id: 2,
    name: 'IGI (International Gemological Institute)',
    logo: '@/assets/images/igi-logo.png',
    description: 'One of the largest independent gemological laboratories, known for its diamond grading and certification.',
    website: 'https://www.igi.org'
  },
  {
    id: 3,
    name: 'AGS (American Gem Society)',
    logo: '@/assets/images/ags-logo.png',
    description: 'A nonprofit organization dedicated to consumer protection and ethical business practices in the jewelry industry.',
    website: 'https://www.americangemsociety.org'
  }
])

const certificateElements = ref([
  {
    id: 1,
    title: 'Certificate Number',
    description: 'Unique identifier for your gemstone\'s certificate'
  },
  {
    id: 2,
    title: 'Gemstone Details',
    description: 'Type, weight, measurements, and shape'
  },
  {
    id: 3,
    title: 'Quality Grades',
    description: 'Color, clarity, and cut grades where applicable'
  },
  {
    id: 4,
    title: 'Authentication',
    description: 'Security features and verification methods'
  }
])

const showVerificationTool = () => {
  // Implement certificate verification tool logic
  window.open('https://www.gia.edu/report-check', '_blank')
}
</script>
