<template>
    <footer class="bg-slate-900 text-white">
      <!-- Main Footer Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <!-- Brand Section -->
          <div class="lg:col-span-1">
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold">Gemstone</h2>
                <p class="text-sm text-slate-400 -mt-1">Collection</p>
              </div>
            </div>
            <p class="text-slate-300 text-sm leading-relaxed mb-6">
              Discover the world's finest gemstones and luxury jewelry. Each piece is carefully selected and crafted to perfection, bringing you timeless elegance and exceptional quality.
            </p>
            
            <!-- Social Media Links -->
            <div class="flex space-x-4">
              <a
                v-for="social in socialLinks"
                :key="social.name"
                :href="social.url"
                :aria-label="social.name"
                class="w-10 h-10 bg-slate-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                target="_blank"
                rel="noopener noreferrer"
              >
                <component :is="social.icon" class="w-5 h-5" />
              </a>
            </div>
          </div>
  
          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold mb-6">Quick Links</h3>
            <ul class="space-y-3">
              <li v-for="link in quickLinks" :key="link.name">
                <router-link
                  :to="link.path"
                  class="text-slate-300 hover:text-emerald-400 transition-colors duration-200 text-sm flex items-center group"
                >
                  <svg class="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                  {{ link.name }}
                </router-link>
              </li>
            </ul>
          </div>
  
          <!-- Categories -->
          <div>
            <h3 class="text-lg font-semibold mb-6">Categories</h3>
            <ul class="space-y-3">
              <li v-for="category in categories" :key="category.name">
                <router-link
                  :to="category.path"
                  class="text-slate-300 hover:text-emerald-400 transition-colors duration-200 text-sm flex items-center group"
                >
                  <svg class="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                  {{ category.name }}
                </router-link>
              </li>
            </ul>
          </div>
  
          <!-- Newsletter & Contact -->
          <div>
            <h3 class="text-lg font-semibold mb-6">Stay Connected</h3>
            <p class="text-slate-300 text-sm mb-4">
              Subscribe to our newsletter for exclusive offers and the latest gemstone collections.
            </p>
            
            <!-- Newsletter Signup -->
            <form @submit.prevent="handleNewsletterSignup" class="mb-6">
              <div class="flex flex-col sm:flex-row gap-3">
                <div class="flex-1">
                  <label for="newsletter-email" class="sr-only">Email address</label>
                  <input
                    id="newsletter-email"
                    v-model="newsletterEmail"
                    type="email"
                    placeholder="Enter your email"
                    required
                    class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    :disabled="isNewsletterLoading"
                  />
                </div>
                <button
                  type="submit"
                  :disabled="isNewsletterLoading || !newsletterEmail"
                  class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center min-w-[120px]"
                >
                  <svg
                    v-if="isNewsletterLoading"
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  <span v-else>Subscribe</span>
                </button>
              </div>
              <!-- Success/Error Messages -->
              <div v-if="newsletterMessage" class="mt-3">
                <p :class="[
                  'text-sm',
                  newsletterSuccess ? 'text-emerald-400' : 'text-red-400'
                ]">
                  {{ newsletterMessage }}
                </p>
              </div>
            </form>
  
            <!-- Contact Info -->
            <div class="space-y-3">
              <div class="flex items-center text-slate-300 text-sm">
                <svg class="w-4 h-4 mr-3 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span>+1 (555) 123-4567</span>
              </div>
              <div class="flex items-start text-slate-300 text-sm">
                <svg class="w-4 h-4 mr-3 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>123 Gemstone Avenue<br>New York, NY 10001</span>
              </div>
              <div class="flex items-center text-slate-300 text-sm">
                <svg class="w-4 h-4 mr-3 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <a href="mailto:info@gemstonecollection.com" class="hover:text-emerald-400 transition-colors">
                  info@gemstonecollection.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Trust Badges & Certifications -->
      <div class="border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            <!-- Trust Badges -->
            <div class="flex flex-wrap items-center justify-center lg:justify-start space-x-6 lg:space-x-8">
              <div
                v-for="badge in trustBadges"
                :key="badge.name"
                class="flex items-center space-x-2 text-slate-400 text-sm group"
              >
                <div class="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-emerald-600/20 transition-colors">
                  <component :is="badge.icon" class="w-4 h-4 text-emerald-500" />
                </div>
                <span class="font-medium">{{ badge.name }}</span>
              </div>
            </div>
  
            <!-- Certifications -->
            <div class="flex items-center space-x-6">
              <div
                v-for="cert in certifications"
                :key="cert.name"
                class="flex items-center space-x-2 text-slate-400 text-xs"
              >
                <img
                  :src="cert.logo"
                  :alt="cert.name"
                  class="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity"
                />
                <span>{{ cert.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Bottom Bar -->
      <div class="border-t border-slate-800 bg-slate-950">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <!-- Copyright -->
            <div class="text-slate-400 text-sm">
              <p>&copy; {{ currentYear }} Gemstone Collection. All rights reserved.</p>
            </div>
  
            <!-- Legal Links -->
            <div class="flex items-center space-x-6">
              <router-link
                v-for="link in legalLinks"
                :key="link.name"
                :to="link.path"
                class="text-slate-400 hover:text-emerald-400 text-sm transition-colors duration-200"
              >
                {{ link.name }}
              </router-link>
            </div>
  
            <!-- Payment Methods -->
            <div class="flex items-center space-x-3">
              <span class="text-slate-400 text-sm mr-2">We accept:</span>
              <div class="flex items-center space-x-2">
                <div
                  v-for="payment in paymentMethods"
                  :key="payment.name"
                  class="w-8 h-5 bg-white rounded-sm flex items-center justify-center shadow-sm"
                >
                  <img
                    :src="payment.logo"
                    :alt="payment.name"
                    class="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  
  // Types
  interface Link {
    name: string
    path: string
  }
  
  interface SocialLink {
    name: string
    url: string
    icon: string
  }
  
  interface TrustBadge {
    name: string
    icon: string
  }
  
  interface Certification {
    name: string
    logo: string
  }
  
  interface PaymentMethod {
    name: string
    logo: string
  }
  
  // Router
  const router = useRouter()
  
  // Reactive data
  const newsletterEmail = ref('')
  const isNewsletterLoading = ref(false)
  const newsletterMessage = ref('')
  const newsletterSuccess = ref(false)
  
  // Current year for copyright
  const currentYear = computed(() => new Date().getFullYear())
  
  // Navigation data
  const quickLinks: Link[] = [
    { name: 'About Us', path: '/about' },
    { name: 'Collections', path: '/collections' },
    { name: 'Custom Jewelry', path: '/custom' },
    { name: 'Size Guide', path: '/size-guide' },
    { name: 'Care Instructions', path: '/care' },
    { name: 'Contact', path: '/contact' },
    { name: 'Store Locator', path: '/stores' },
    { name: 'Gift Cards', path: '/gift-cards' }
  ]
  
  const categories: Link[] = [
    { name: 'Engagement Rings', path: '/products?category=engagement-rings' },
    { name: 'Wedding Bands', path: '/products?category=wedding-bands' },
    { name: 'Necklaces', path: '/products?category=necklaces' },
    { name: 'Earrings', path: '/products?category=earrings' },
    { name: 'Bracelets', path: '/products?category=bracelets' },
    { name: 'Gemstones', path: '/products?category=gemstones' },
    { name: 'Watches', path: '/products?category=watches' },
    { name: 'Collections', path: '/collections' }
  ]
  
  const legalLinks: Link[] = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Return Policy', path: '/returns' },
    { name: 'Shipping Info', path: '/shipping' }
  ]
  
  // Social media links
  const socialLinks: SocialLink[] = [
    {
      name: 'Facebook',
      url: 'https://facebook.com/gemstonecollection',
      icon: 'FacebookIcon'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/gemstonecollection',
      icon: 'InstagramIcon'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/gemstonecoll',
      icon: 'TwitterIcon'
    },
    {
      name: 'Pinterest',
      url: 'https://pinterest.com/gemstonecollection',
      icon: 'PinterestIcon'
    }
  ]
  
  // Trust badges
  const trustBadges: TrustBadge[] = [
    { name: 'Secure Checkout', icon: 'ShieldCheckIcon' },
    { name: 'Free Shipping', icon: 'TruckIcon' },
    { name: '30-Day Returns', icon: 'RefreshIcon' },
    { name: 'Lifetime Warranty', icon: 'StarIcon' }
  ]
  
  // Certifications (mock data - in real app, these would be actual certification logos)
  const certifications: Certification[] = [
    { name: 'GIA Certified', logo: '/images/certifications/gia.png' },
    { name: 'AGS Certified', logo: '/images/certifications/ags.png' },
    { name: 'SSL Secured', logo: '/images/certifications/ssl.png' }
  ]
  
  // Payment methods (mock data - in real app, these would be actual payment logos)
  const paymentMethods: PaymentMethod[] = [
    { name: 'Visa', logo: '/images/payments/visa.png' },
    { name: 'Mastercard', logo: '/images/payments/mastercard.png' },
    { name: 'American Express', logo: '/images/payments/amex.png' },
    { name: 'PayPal', logo: '/images/payments/paypal.png' },
    { name: 'Apple Pay', logo: '/images/payments/applepay.png' }
  ]
  
  // Methods
  const handleNewsletterSignup = async (): Promise<void> => {
    if (!newsletterEmail.value || isNewsletterLoading.value) return
  
    isNewsletterLoading.value = true
    newsletterMessage.value = ''
  
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock successful signup
      newsletterSuccess.value = true
      newsletterMessage.value = 'Thank you for subscribing! Check your email for confirmation.'
      newsletterEmail.value = ''
      
      // Clear message after 5 seconds
      setTimeout(() => {
        newsletterMessage.value = ''
      }, 5000)
      
    } catch (error) {
      console.error('Newsletter signup failed:', error)
      newsletterSuccess.value = false
      newsletterMessage.value = 'Something went wrong. Please try again later.'
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        newsletterMessage.value = ''
      }, 5000)
    } finally {
      isNewsletterLoading.value = false
    }
  }
  </script>
  
  <!-- Icon Components (SVG icons as components) -->
  <template>
    <!-- Hidden icon definitions -->
    <div style="display: none;">
      <!-- Facebook Icon -->
      <svg id="FacebookIcon">
        <path fill="currentColor" d="M18.77 7.46H15.5v-1.9c0-.9.6-1.1 1-1.1h2.2V.5h-3C13.5.5 12 2 12 4.6v2.86h-2V12h2v12h4V12h2.5l.27-4.54z"/>
      </svg>
      
      <!-- Instagram Icon -->
      <svg id="InstagramIcon">
        <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
      
      <!-- Twitter Icon -->
      <svg id="TwitterIcon">
        <path fill="currentColor" d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
      
      <!-- Pinterest Icon -->
      <svg id="PinterestIcon">
        <path fill="currentColor" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.1.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
      </svg>
      
      <!-- Shield Check Icon -->
      <svg id="ShieldCheckIcon">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
      </svg>
      
      <!-- Truck Icon -->
      <svg id="TruckIcon">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM21 17a2 2 0 11-4 0 2 2 0 014 0zM1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
      </svg>
      
      <!-- Refresh Icon -->
      <svg id="RefreshIcon">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
      </svg>
      
      <!-- Star Icon -->
      <svg id="StarIcon">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
      </svg>
    </div>
  </template>
  
  <style scoped>
  /* Custom animations for trust badges */
  .group:hover .group-hover\:bg-emerald-600\/20 {
    background-color: rgb(16 185 129 / 0.2);
  }
  
  /* Newsletter input focus styling */
  .focus\:ring-emerald-500:focus {
    --tw-ring-color: #10b981;
  }
  
  /* Smooth transitions for all interactive elements */
  * {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
  }
  </style>