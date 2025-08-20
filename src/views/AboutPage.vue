<template>
  <div class="about-page">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold mb-8">About Us</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="about-content">
          <h2 class="text-2xl font-semibold mb-4">Our Story</h2>
          <p class="text-gray-700 mb-4">
            Welcome to Luxury Gemstone, your premier destination for exquisite gemstones and fine jewelry.
            With years of experience in the industry, we pride ourselves on offering only the highest quality,
            ethically sourced gemstones to our discerning clientele.
          </p>
          <p class="text-gray-700 mb-4">
            Our expert gemologists carefully select each stone, ensuring that it meets our rigorous standards
            for quality, authenticity, and beauty. We believe in complete transparency and provide detailed
            documentation for every gemstone in our collection.
          </p>
        </div>

        <div class="about-image">
          <img
            src="@/assets/images/about-us.jpg"
            alt="About Luxury Gemstone"
            class="rounded-lg shadow-lg"
          >
        </div>
      </div>

      <div class="mt-12">
        <h2 class="text-2xl font-semibold mb-4">Our Commitment</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-3">Quality</h3>
            <p class="text-gray-700">
              Every gemstone in our collection is carefully selected and certified for its quality and authenticity.
            </p>
          </div>
          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-3">Ethics</h3>
            <p class="text-gray-700">
              We are committed to ethical sourcing and maintaining transparent relationships with our suppliers.
            </p>
          </div>
          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-3">Service</h3>
            <p class="text-gray-700">
              Our team of experts is dedicated to providing exceptional customer service and guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for this static page
</script>
