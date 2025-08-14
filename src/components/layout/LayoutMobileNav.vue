<template>
    <Teleport to="body">
      <!-- Mobile Navigation Overlay -->
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="uiStore.isMobileMenuOpen"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          @click="closeMobileMenu"
          aria-hidden="true"
        />
      </Transition>
  
      <!-- Mobile Navigation Panel -->
      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <nav
          v-if="uiStore.isMobileMenuOpen"
          class="fixed top-0 left-0 h-full w-80 max-w-[80vw] bg-white/95 backdrop-blur-lg border-r border-slate-200/50 shadow-2xl z-50 lg:hidden"
          aria-label="Mobile navigation"
          role="navigation"
        >
          <!-- Mobile Menu Header -->
          <div class="flex items-center justify-between p-6 border-b border-slate-200/50">
            <RouterLink
              to="/"
              class="flex items-center space-x-2"
              @click="closeMobileMenu"
            >
              <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                <GemIcon class="w-5 h-5 text-white" />
              </div>
              <span class="text-xl font-bold text-slate-800">LuxeGems</span>
            </RouterLink>
  
            <button
              @click="closeMobileMenu"
              class="p-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors duration-200"
              aria-label="Close mobile menu"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
  
          <!-- User Section -->
          <div class="p-6 border-b border-slate-200/50">
            <div v-if="authStore.isAuthenticated" class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center">
                <UserIcon class="w-5 h-5 text-white" />
              </div>
              <div>
                <p class="font-semibold text-slate-800">{{ authStore.user?.name || 'Guest User' }}</p>
                <p class="text-sm text-slate-600">{{ authStore.user?.email }}</p>
              </div>
            </div>
            <div v-else class="space-y-3">
              <RouterLink
                to="/auth/login"
                @click="closeMobileMenu"
                class="block w-full px-4 py-2 bg-emerald-600 text-white text-center rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200"
              >
                Sign In
              </RouterLink>
              <RouterLink
                to="/auth/register"
                @click="closeMobileMenu"
                class="block w-full px-4 py-2 border border-slate-300 text-slate-700 text-center rounded-lg font-medium hover:bg-slate-50 transition-colors duration-200"
              >
                Register
              </RouterLink>
            </div>
          </div>
  
          <!-- Navigation Links -->
          <div class="px-6 py-4 space-y-1">
            <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Shop
            </h3>
            
            <RouterLink
              v-for="link in navigationLinks"
              :key="link.path"
              :to="link.path"
              @click="closeMobileMenu"
              class="block px-4 py-3 rounded-lg text-slate-700 font-medium hover:bg-slate-100 hover:text-emerald-600 transition-all duration-200 flex items-center space-x-3"
              :class="{ 'bg-emerald-50 text-emerald-600': $route.path === link.path }"
            >
              <component :is="link.icon" class="w-5 h-5" />
              <span>{{ link.label }}</span>
              <ChevronRightIcon class="w-4 h-4 ml-auto opacity-40" />
            </RouterLink>
          </div>
  
          <!-- Cart Summary -->
          <div class="px-6 py-4 border-t border-slate-200/50">
            <RouterLink
              to="/cart"
              @click="closeMobileMenu"
              class="block p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="relative">
                    <ShoppingBagIcon class="w-6 h-6 text-slate-600" />
                    <span
                      v-if="cartStore.itemCount > 0"
                      class="absolute -top-2 -right-2 w-5 h-5 bg-emerald-600 text-white text-xs rounded-full flex items-center justify-center font-medium"
                    >
                      {{ cartStore.itemCount }}
                    </span>
                  </div>
                  <div>
                    <p class="font-medium text-slate-800">Shopping Cart</p>
                    <p class="text-sm text-slate-600">
                      {{ cartStore.itemCount }} {{ cartStore.itemCount === 1 ? 'item' : 'items' }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-bold text-slate-800">${{ cartStore.totalPrice.toLocaleString() }}</p>
                  <ChevronRightIcon class="w-4 h-4 text-slate-400 ml-auto" />
                </div>
              </div>
            </RouterLink>
          </div>
  
          <!-- Account Links (when authenticated) -->
          <div v-if="authStore.isAuthenticated" class="px-6 py-4 border-t border-slate-200/50">
            <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Account
            </h3>
            
            <RouterLink
              v-for="link in accountLinks"
              :key="link.path"
              :to="link.path"
              @click="closeMobileMenu"
              class="block px-4 py-3 rounded-lg text-slate-700 font-medium hover:bg-slate-100 hover:text-emerald-600 transition-all duration-200 flex items-center space-x-3"
            >
              <component :is="link.icon" class="w-5 h-5" />
              <span>{{ link.label }}</span>
              <ChevronRightIcon class="w-4 h-4 ml-auto opacity-40" />
            </RouterLink>
  
            <!-- Sign Out Button -->
            <button
              @click="handleSignOut"
              class="w-full mt-2 px-4 py-3 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-all duration-200 flex items-center space-x-3"
            >
              <ArrowRightOnRectangleIcon class="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
  
          <!-- Footer Links -->
          <div class="px-6 py-4 border-t border-slate-200/50 mt-auto">
            <div class="space-y-2">
              <RouterLink
                v-for="link in footerLinks"
                :key="link.path"
                :to="link.path"
                @click="closeMobileMenu"
                class="block text-sm text-slate-600 hover:text-emerald-600 transition-colors duration-200"
              >
                {{ link.label }}
              </RouterLink>
            </div>
            
            <!-- Social Links -->
            <div class="flex items-center space-x-4 mt-4 pt-4 border-t border-slate-200/50">
              <a
                v-for="social in socialLinks"
                :key="social.name"
                :href="social.url"
                :aria-label="social.name"
                class="p-2 text-slate-400 hover:text-emerald-600 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <component :is="social.icon" class="w-5 h-5" />
              </a>
            </div>
          </div>
        </nav>
      </Transition>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { RouterLink, useRoute } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { useCartStore } from '@/stores/cart'
  import { useUIStore } from '@/stores/ui'
  import {
    XMarkIcon,
    UserIcon,
    ShoppingBagIcon,
    ChevronRightIcon,
    ArrowRightOnRectangleIcon,
    HomeIcon,
    SparklesIcon,
    HeartIcon,
    CogIcon,
    DocumentTextIcon,
    ShieldCheckIcon,
    QuestionMarkCircleIcon,
    EnvelopeIcon
  } from '@heroicons/vue/24/outline'
  
  // Custom Gem Icon component (inline for simplicity)
  const GemIcon = {
    template: `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zm0 2h12l2 3H4l2-3zm-2 5h16v11H4V9z"/>
      </svg>
    `
  }
  
  // Social media icons (simplified)
  const FacebookIcon = { template: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' }
  const TwitterIcon = { template: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>' }
  const InstagramIcon = { template: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>' }
  
  // Store instances
  const authStore = useAuthStore()
  const cartStore = useCartStore()
  const uiStore = useUIStore()
  const route = useRoute()
  
  // Navigation configuration
  const navigationLinks = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/products', label: 'All Gemstones', icon: SparklesIcon },
    { path: '/products/rings', label: 'Rings', icon: SparklesIcon },
    { path: '/products/necklaces', label: 'Necklaces', icon: SparklesIcon },
    { path: '/products/earrings', label: 'Earrings', icon: SparklesIcon },
    { path: '/products/bracelets', label: 'Bracelets', icon: SparklesIcon },
    { path: '/wishlist', label: 'Wishlist', icon: HeartIcon }
  ]
  
  const accountLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/dashboard/orders', label: 'Order History', icon: DocumentTextIcon },
    { path: '/dashboard/profile', label: 'Profile Settings', icon: CogIcon }
  ]
  
  const footerLinks = [
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
    { path: '/shipping', label: 'Shipping Info' },
    { path: '/returns', label: 'Returns' },
    { path: '/privacy', label: 'Privacy Policy' },
    { path: '/terms', label: 'Terms of Service' },
    { path: '/help', label: 'Help Center' }
  ]
  
  const socialLinks = [
    { name: 'Facebook', icon: FacebookIcon, url: 'https://facebook.com/luxegems' },
    { name: 'Twitter', icon: TwitterIcon, url: 'https://twitter.com/luxegems' },
    { name: 'Instagram', icon: InstagramIcon, url: 'https://instagram.com/luxegems' }
  ]
  
  // Methods
  const closeMobileMenu = (): void => {
    uiStore.closeMobileMenu()
  }
  
  const handleSignOut = async (): Promise<void> => {
    try {
      uiStore.setLoading(true)
      await authStore.logout()
      closeMobileMenu()
      // Optionally redirect to home page
      // router.push('/')
    } catch (error) {
      console.error('Sign out failed:', error)
      // Handle error (show toast notification, etc.)
    } finally {
      uiStore.setLoading(false)
    }
  }
  
  // Accessibility: Close menu on Escape key
  const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && uiStore.isMobileMenuOpen) {
      closeMobileMenu()
    }
  }
  
  // Add global keyboard listener when component mounts
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }
  
  // Clean up on unmount
  import { onUnmounted } from 'vue'
  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeydown)
    }
  })
  </script>
  
  <style scoped>
  /* Custom scrollbar for mobile menu */
  nav {
    scrollbar-width: thin;
    scrollbar-color: rgba(148, 163, 184, 0.5) transparent;
  }
  
  nav::-webkit-scrollbar {
    width: 4px;
  }
  
  nav::-webkit-scrollbar-track {
    background: transparent;
  }
  
  nav::-webkit-scrollbar-thumb {
    background-color: rgba(148, 163, 184, 0.5);
    border-radius: 2px;
  }
  
  nav::-webkit-scrollbar-thumb:hover {
    background-color: rgba(148, 163, 184, 0.7);
  }
  
  /* Smooth backdrop blur animation */
  .backdrop-blur-sm {
    backdrop-filter: blur(4px);
  }
  
  .backdrop-blur-lg {
    backdrop-filter: blur(16px);
  }
  
  /* Focus styles for accessibility */
  nav a:focus,
  nav button:focus {
    @apply outline-none ring-2 ring-emerald-500 ring-offset-2;
  }
  
  /* Glass morphism effect */
  nav {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(16px);
    border-right: 1px solid rgba(226, 232, 240, 0.5);
  }
  
  /* Active route highlighting */
  .router-link-active {
    @apply bg-emerald-50 text-emerald-600;
  }
  
  /* Smooth hover transitions */
  nav a,
  nav button {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Custom shadow for mobile panel */
  nav {
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.05);
  }
  </style>