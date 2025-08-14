<template>
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 lg:h-20">
          <!-- Logo -->
          <div class="flex items-center">
            <router-link
              to="/"
              class="flex items-center space-x-3 group"
              aria-label="Gemstone Collection Home"
            >
              <div class="relative">
                <div class="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-200">
                  <svg class="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                  </svg>
                </div>
              </div>
              <div class="hidden sm:block">
                <h1 class="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Gemstone
                </h1>
                <p class="text-xs text-slate-500 -mt-1">Collection</p>
              </div>
            </router-link>
          </div>
  
          <!-- Desktop Search -->
          <div class="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div class="relative w-full">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search gemstones, jewelry, collections..."
                class="w-full pl-12 pr-12 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                @keyup.enter="handleSearch"
                @input="handleSearchInput"
              />
              <div class="absolute inset-y-0 right-0 pr-4 flex items-center">
                <button
                  v-if="searchQuery"
                  @click="clearSearch"
                  class="text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Clear search"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              
              <!-- Search Suggestions Dropdown -->
              <div
                v-if="showSearchSuggestions && searchSuggestions.length > 0"
                class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200/60 backdrop-blur-xl z-50 max-h-96 overflow-y-auto"
              >
                <div class="p-2">
                  <div class="text-xs font-medium text-slate-500 px-3 py-2 uppercase tracking-wider">
                    Suggestions
                  </div>
                  <button
                    v-for="suggestion in searchSuggestions"
                    :key="suggestion.id"
                    @click="selectSuggestion(suggestion)"
                    class="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center space-x-3 transition-colors"
                  >
                    <div class="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                      <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                    </div>
                    <div>
                      <div class="font-medium text-slate-900">{{ suggestion.name }}</div>
                      <div class="text-sm text-slate-500">{{ suggestion.category }}</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Desktop Navigation & Actions -->
          <div class="hidden lg:flex items-center space-x-6">
            <!-- Navigation Links -->
            <nav class="flex items-center space-x-8">
              <router-link
                v-for="link in navigationLinks"
                :key="link.name"
                :to="link.path"
                :class="[
                  'text-sm font-medium transition-colors duration-200 relative py-2',
                  isActiveRoute(link.path)
                    ? 'text-emerald-600'
                    : 'text-slate-700 hover:text-emerald-600'
                ]"
              >
                {{ link.name }}
                <span
                  v-if="isActiveRoute(link.path)"
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"
                />
              </router-link>
            </nav>
  
            <!-- Action Buttons -->
            <div class="flex items-center space-x-4">
              <!-- Search Toggle (Mobile) -->
              <button
                @click="toggleMobileSearch"
                class="lg:hidden p-2 text-slate-600 hover:text-emerald-600 transition-colors"
                aria-label="Toggle search"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
  
              <!-- Wishlist -->
              <button
                @click="toggleWishlist"
                class="relative p-2 text-slate-600 hover:text-emerald-600 transition-colors group"
                aria-label="Wishlist"
              >
                <svg class="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                <span
                  v-if="wishlistCount > 0"
                  class="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                >
                  {{ wishlistCount }}
                </span>
              </button>
  
              <!-- Shopping Cart -->
              <button
                @click="toggleCart"
                class="relative p-2 text-slate-600 hover:text-emerald-600 transition-colors group"
                aria-label="Shopping cart"
              >
                <svg class="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5m6-2.5L17.5 18.5M17.5 18.5L20 21"/>
                </svg>
                <span
                  v-if="cartItemsCount > 0"
                  class="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-pulse"
                >
                  {{ cartItemsCount }}
                </span>
              </button>
  
              <!-- User Menu -->
              <div class="relative" ref="userMenuRef">
                <button
                  @click="toggleUserMenu"
                  class="flex items-center space-x-2 p-2 text-slate-600 hover:text-emerald-600 transition-colors group"
                  aria-label="User menu"
                >
                  <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <svg v-if="!user" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <img
                      v-else
                      :src="user.avatar"
                      :alt="user.name"
                      class="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </button>
  
                <!-- User Dropdown Menu -->
                <transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-in"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
                >
                  <div
                    v-if="showUserMenu"
                    class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200/60 backdrop-blur-xl z-50 py-2"
                  >
                    <template v-if="user">
                      <div class="px-4 py-3 border-b border-slate-100">
                        <p class="text-sm font-medium text-slate-900">{{ user.name }}</p>
                        <p class="text-xs text-slate-500">{{ user.email }}</p>
                      </div>
                      <router-link
                        v-for="item in userMenuItems"
                        :key="item.name"
                        :to="item.path"
                        class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        @click="closeUserMenu"
                      >
                        {{ item.name }}
                      </router-link>
                      <button
                        @click="handleLogout"
                        class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign out
                      </button>
                    </template>
                    <template v-else>
                      <router-link
                        to="/auth/login"
                        class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        @click="closeUserMenu"
                      >
                        Sign in
                      </router-link>
                      <router-link
                        to="/auth/register"
                        class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        @click="closeUserMenu"
                      >
                        Create account
                      </router-link>
                    </template>
                  </div>
                </transition>
              </div>
            </div>
          </div>
  
          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="lg:hidden p-2 text-slate-600 hover:text-emerald-600 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg
              v-if="!isMobileMenuOpen"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg
              v-else
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
  
      <!-- Mobile Search Bar -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform opacity-0 -translate-y-2"
        enter-to-class="transform opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform opacity-100 translate-y-0"
        leave-to-class="transform opacity-0 -translate-y-2"
      >
        <div
          v-if="showMobileSearch"
          class="lg:hidden border-t border-slate-200/50 px-4 py-3"
        >
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input
              v-model="mobileSearchQuery"
              type="text"
              placeholder="Search gemstones..."
              class="w-full pl-12 pr-12 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
              @keyup.enter="handleMobileSearch"
            />
            <div class="absolute inset-y-0 right-0 pr-4 flex items-center">
              <button
                v-if="mobileSearchQuery"
                @click="clearMobileSearch"
                class="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Clear search"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </header>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { useCartStore } from '@/stores/cart'
  import { useUIStore } from '@/stores/ui'
  
  // Types
  interface NavigationLink {
    name: string
    path: string
  }
  
  interface SearchSuggestion {
    id: string
    name: string
    category: string
  }
  
  interface UserMenuItem {
    name: string
    path: string
  }
  
  // Stores
  const authStore = useAuthStore()
  const cartStore = useCartStore()
  const uiStore = useUIStore()
  
  // Router
  const route = useRoute()
  const router = useRouter()
  
  // Refs
  const userMenuRef = ref<HTMLElement>()
  
  // Reactive data
  const searchQuery = ref('')
  const mobileSearchQuery = ref('')
  const showSearchSuggestions = ref(false)
  const showUserMenu = ref(false)
  const showMobileSearch = ref(false)
  
  // Navigation links
  const navigationLinks: NavigationLink[] = [
    { name: 'Collections', path: '/collections' },
    { name: 'Gemstones', path: '/products' },
    { name: 'Jewelry', path: '/jewelry' },
    { name: 'Custom', path: '/custom' },
    { name: 'About', path: '/about' }
  ]
  
  // User menu items
  const userMenuItems: UserMenuItem[] = [
    { name: 'My Account', path: '/account' },
    { name: 'Orders', path: '/orders' },
    { name: 'Wishlist', path: '/wishlist' },
    { name: 'Settings', path: '/settings' }
  ]
  
  // Mock search suggestions
  const searchSuggestions = ref<SearchSuggestion[]>([
    { id: '1', name: 'Diamond Rings', category: 'Jewelry' },
    { id: '2', name: 'Emerald Collection', category: 'Gemstones' },
    { id: '3', name: 'Ruby Necklaces', category: 'Jewelry' },
    { id: '4', name: 'Sapphire Earrings', category: 'Jewelry' },
    { id: '5', name: 'Custom Engagement Rings', category: 'Custom' }
  ])
  
  // Computed properties
  const user = computed(() => authStore.user)
  const cartItemsCount = computed(() => cartStore.itemsCount)
  const wishlistCount = computed(() => 3) // Mock wishlist count
  const isMobileMenuOpen = computed(() => uiStore.isMobileMenuOpen)
  
  // Methods
  const isActiveRoute = (path: string): boolean => {
    return route.path === path || route.path.startsWith(path + '/')
  }
  
  const handleSearch = (): void => {
    if (searchQuery.value.trim()) {
      router.push({
        name: 'products',
        query: { q: searchQuery.value.trim() }
      })
      showSearchSuggestions.value = false
    }
  }
  
  const handleMobileSearch = (): void => {
    if (mobileSearchQuery.value.trim()) {
      router.push({
        name: 'products',
        query: { q: mobileSearchQuery.value.trim() }
      })
      showMobileSearch.value = false
    }
  }
  
  const handleSearchInput = (): void => {
    showSearchSuggestions.value = searchQuery.value.length > 2
  }
  
  const clearSearch = (): void => {
    searchQuery.value = ''
    showSearchSuggestions.value = false
  }
  
  const clearMobileSearch = (): void => {
    mobileSearchQuery.value = ''
  }
  
  const selectSuggestion = (suggestion: SearchSuggestion): void => {
    searchQuery.value = suggestion.name
    handleSearch()
  }
  
  const toggleMobileSearch = (): void => {
    showMobileSearch.value = !showMobileSearch.value
  }
  
  const toggleMobileMenu = (): void => {
    uiStore.toggleMobileMenu()
  }
  
  const toggleCart = (): void => {
    uiStore.toggleCartSidebar()
  }
  
  const toggleWishlist = (): void => {
    router.push('/wishlist')
  }
  
  const toggleUserMenu = (): void => {
    showUserMenu.value = !showUserMenu.value
  }
  
  const closeUserMenu = (): void => {
    showUserMenu.value = false
  }
  
  const handleLogout = async (): void => {
    try {
      await authStore.logout()
      closeUserMenu()
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  
  // Click outside handler for user menu
  const handleClickOutside = (event: Event): void => {
    if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
      showUserMenu.value = false
    }
    
    // Close search suggestions when clicking outside
    if (showSearchSuggestions.value) {
      const searchContainer = document.querySelector('.relative.w-full')
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        showSearchSuggestions.value = false
      }
    }
  }
  
  // Lifecycle
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
  </script>
  
  <style scoped>
  /* Custom styles for glassmorphism effect */
  .backdrop-blur-xl {
    backdrop-filter: blur(20px);
  }
  
  /* Search input focus ring custom style */
  .focus\:ring-emerald-500\/20:focus {
    --tw-ring-color: rgb(16 185 129 / 0.2);
  }
  </style>