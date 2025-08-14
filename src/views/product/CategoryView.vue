<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Category Hero Section -->
      <div class="relative bg-gradient-to-r from-slate-800 to-slate-900 overflow-hidden">
        <div class="absolute inset-0 bg-black opacity-20"></div>
        <div 
          class="absolute inset-0 bg-cover bg-center bg-no-repeat"
          :style="{ backgroundImage: `url(${categoryData?.heroImage})` }"
        ></div>
        
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div class="text-center lg:text-left">
            <!-- Breadcrumb -->
            <nav class="flex justify-center lg:justify-start mb-6" aria-label="Breadcrumb">
              <ol class="flex items-center space-x-2 text-sm">
                <li>
                  <router-link 
                    to="/" 
                    class="text-white/70 hover:text-white transition-colors"
                  >
                    Home
                  </router-link>
                </li>
                <li class="text-white/50">/</li>
                <li>
                  <router-link 
                    to="/products" 
                    class="text-white/70 hover:text-white transition-colors"
                  >
                    Products
                  </router-link>
                </li>
                <li class="text-white/50">/</li>
                <li class="text-white font-medium">{{ categoryData?.name }}</li>
              </ol>
            </nav>
  
            <h1 class="text-4xl lg:text-6xl font-bold text-white mb-4">
              {{ categoryData?.name }}
            </h1>
            <p class="text-xl text-white/90 max-w-2xl mx-auto lg:mx-0 mb-8">
              {{ categoryData?.description }}
            </p>
            
            <!-- Category Stats -->
            <div class="flex flex-wrap justify-center lg:justify-start gap-6 text-white/80">
              <div class="text-center lg:text-left">
                <div class="text-2xl font-bold text-white">{{ totalProducts }}</div>
                <div class="text-sm">Available Items</div>
              </div>
              <div class="text-center lg:text-left">
                <div class="text-2xl font-bold text-white">{{ categoryData?.avgRating || 4.8 }}</div>
                <div class="text-sm">Average Rating</div>
              </div>
              <div class="text-center lg:text-left">
                <div class="text-2xl font-bold text-white">{{ formatPriceRange() }}</div>
                <div class="text-sm">Price Range</div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Category Information & Features -->
      <div class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Category Features -->
            <div 
              v-for="feature in categoryData?.features" 
              :key="feature.title"
              class="text-center lg:text-left"
            >
              <div class="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg mb-4">
                <component :is="feature.icon" class="w-6 h-6" />
              </div>
              <h3 class="text-lg font-semibold text-slate-800 mb-2">{{ feature.title }}</h3>
              <p class="text-gray-600">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Subcategories (if any) -->
      <div 
        v-if="categoryData?.subcategories?.length"
        class="bg-gray-50 border-b border-gray-200"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 class="text-2xl font-bold text-slate-800 mb-6">Shop by Type</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <button
              v-for="subcategory in categoryData.subcategories"
              :key="subcategory.slug"
              @click="selectSubcategory(subcategory.slug)"
              :class="[
                'p-4 rounded-lg border-2 transition-all duration-200 text-center',
                selectedSubcategory === subcategory.slug
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md'
              ]"
            >
              <div class="text-2xl mb-2">{{ subcategory.icon }}</div>
              <div class="font-medium text-sm">{{ subcategory.name }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ subcategory.count }} items</div>
            </button>
          </div>
        </div>
      </div>
  
      <!-- Main Products Section -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Mobile Filter Toggle -->
          <div class="lg:hidden flex justify-between items-center mb-4">
            <div class="text-sm text-gray-600">
              Showing {{ products.length }} of {{ totalProducts }} products
            </div>
            <button
              @click="toggleMobileFilters"
              class="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
              Filters
            </button>
          </div>
  
          <!-- Mobile Filter Overlay -->
          <div
            v-if="showMobileFilters"
            class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            @click="closeMobileFilters"
          />
  
          <!-- Filter Sidebar -->
          <div
            :class="[
              'lg:w-80 lg:flex-shrink-0',
              'fixed inset-y-0 left-0 w-80 bg-white z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-auto',
              showMobileFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            ]"
          >
            <div class="h-full flex flex-col">
              <!-- Mobile Filter Header -->
              <div class="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
                <h2 class="text-lg font-semibold text-slate-800">Filters</h2>
                <button
                  @click="closeMobileFilters"
                  class="p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
  
              <!-- Filters Content -->
              <div class="flex-1 overflow-y-auto p-4 lg:p-0">
                <ProductFilters :category="categorySlug" />
              </div>
            </div>
          </div>
  
          <!-- Main Content -->
          <div class="flex-1 min-w-0">
            <!-- Search and Sort Bar -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div class="flex-1 w-full sm:max-w-md">
                  <ProductSearch :placeholder="`Search ${categoryData?.name.toLowerCase()}...`" />
                </div>
                <div class="flex items-center gap-4 w-full sm:w-auto">
                  <ProductSort />
                  <ViewToggle
                    :view="currentView"
                    @change="setView"
                  />
                </div>
              </div>
            </div>
  
            <!-- Active Filters -->
            <ActiveFilters
              v-if="hasActiveFilters"
              class="mb-6"
            />
  
            <!-- Loading State -->
            <div v-if="isLoading" class="space-y-6">
              <ProductGridSkeleton />
            </div>
  
            <!-- Error State -->
            <div
              v-else-if="error"
              class="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
            >
              <div class="text-red-600 mb-2">
                <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-red-900 mb-2">Error Loading Products</h3>
              <p class="text-red-700 mb-4">{{ error }}</p>
              <button
                @click="refetchProducts"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
  
            <!-- Empty State -->
            <div
              v-else-if="!hasProducts"
              class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
            >
              <div class="text-gray-400 mb-4">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-slate-800 mb-2">
                No {{ categoryData?.name }} Found
              </h3>
              <p class="text-gray-600 mb-6">
                Try adjusting your filters or check back later for new arrivals.
              </p>
              <button
                @click="clearAllFilters"
                class="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
  
            <!-- Products Display -->
            <div v-else>
              <ProductGrid v-if="currentView === 'grid'" />
              <ProductList v-else />
            </div>
  
            <!-- Pagination -->
            <Pagination
              v-if="hasProducts && totalPages > 1"
              :current-page="currentPage"
              :total-pages="totalPages"
              :total-items="totalProducts"
              @page-change="handlePageChange"
              class="mt-8"
            />
          </div>
        </div>
      </div>
  
      <!-- Category Education Section -->
      <div 
        v-if="categoryData?.education"
        class="bg-white border-t border-gray-200 mt-16"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-3xl font-bold text-slate-800 mb-6">
                {{ categoryData.education.title }}
              </h2>
              <div 
                class="prose prose-lg text-gray-600"
                v-html="categoryData.education.content"
              ></div>
              <router-link
                :to="categoryData.education.learnMoreLink"
                class="inline-flex items-center gap-2 mt-6 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Learn More
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </router-link>
            </div>
            <div class="relative">
              <img
                :src="categoryData.education.image"
                :alt="categoryData.education.title"
                class="rounded-lg shadow-lg w-full h-80 object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useProducts } from '@/composables/useProducts'
  import { useFilters } from '@/composables/useFilters'
  import ProductFilters from '@/components/ProductFilters.vue'
  import ProductSearch from '@/components/ProductSearch.vue'
  import ProductSort from '@/components/ProductSort.vue'
  import ProductGrid from '@/components/ProductGrid.vue'
  import ProductList from '@/components/ProductList.vue'
  import ViewToggle from '@/components/ViewToggle.vue'
  import ActiveFilters from '@/components/ActiveFilters.vue'
  import ProductGridSkeleton from '@/components/ProductGridSkeleton.vue'
  import Pagination from '@/components/Pagination.vue'
  
  // Props
  const route = useRoute()
  const router = useRouter()
  
  // Composables
  const { 
    products, 
    isLoading, 
    error, 
    totalProducts, 
    currentPage, 
    totalPages,
    fetchProducts,
    setPage
  } = useProducts()
  const { 
    filters, 
    hasActiveFilters, 
    clearAllFilters,
    setFilter
  } = useFilters()
  
  // Local state
  const showMobileFilters = ref(false)
  const currentView = ref<'grid' | 'list'>('grid')
  const selectedSubcategory = ref<string | null>(null)
  
  // Get category slug from route
  const categorySlug = computed(() => route.params.category as string)
  
  // Mock category data - in real app, this would come from an API
  const categoryData = computed(() => {
    const categories = {
      diamonds: {
        name: 'Diamonds',
        description: 'Discover our exquisite collection of certified diamonds, each one carefully selected for its exceptional brilliance and quality.',
        heroImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&h=600&fit=crop',
        avgRating: 4.9,
        features: [
          {
            title: 'Certified Quality',
            description: 'All diamonds come with GIA or AGS certification',
            icon: 'ShieldCheck'
          },
          {
            title: 'Ethical Sourcing',
            description: 'Conflict-free diamonds with full traceability',
            icon: 'Heart'
          },
          {
            title: 'Expert Cut',
            description: 'Precision cut for maximum brilliance and fire',
            icon: 'Sparkles'
          }
        ],
        subcategories: [
          { name: 'Round', slug: 'round', icon: '⚪', count: 156 },
          { name: 'Princess', slug: 'princess', icon: '⬜', count: 89 },
          { name: 'Oval', slug: 'oval', icon: '⭕', count: 74 },
          { name: 'Emerald', slug: 'emerald', icon: '💎', count: 52 },
          { name: 'Cushion', slug: 'cushion', icon: '🔶', count: 43 },
          { name: 'Pear', slug: 'pear', icon: '💧', count: 31 }
        ],
        education: {
          title: 'Understanding Diamond Quality',
          content: '<p>Learn about the 4Cs of diamonds - Cut, Color, Clarity, and Carat weight - and how they determine a diamond\'s beauty and value.</p>',
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop',
          learnMoreLink: '/education/diamond-guide'
        }
      },
      sapphires: {
        name: 'Sapphires',
        description: 'Explore our stunning sapphire collection featuring the finest blue, pink, yellow, and rare padparadscha sapphires.',
        heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
        avgRating: 4.8,
        features: [
          {
            title: 'Natural Beauty',
            description: 'Unheated sapphires with natural color',
            icon: 'Gem'
          },
          {
            title: 'Rare Origins',
            description: 'From Kashmir, Burma, and Ceylon mines',
            icon: 'MapPin'
          },
          {
            title: 'Investment Grade',
            description: 'Museum-quality specimens for collectors',
            icon: 'TrendingUp'
          }
        ],
        subcategories: [
          { name: 'Blue', slug: 'blue', icon: '🔵', count: 124 },
          { name: 'Pink', slug: 'pink', icon: '🌸', count: 87 },
          { name: 'Yellow', slug: 'yellow', icon: '🟡', count: 63 },
          { name: 'White', slug: 'white', icon: '⚪', count: 45 },
          { name: 'Padparadscha', slug: 'padparadscha', icon: '🧡', count: 23 },
          { name: 'Star', slug: 'star', icon: '⭐', count: 18 }
        ],
        education: {
          title: 'The World of Sapphires',
          content: '<p>Discover the fascinating world of sapphires, from the legendary Kashmir blues to the rare padparadscha variety.</p>',
          image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=400&fit=crop',
          learnMoreLink: '/education/sapphire-guide'
        }
      },
      emeralds: {
        name: 'Emeralds',
        description: 'Behold our collection of vivid green emeralds, nature\'s most captivating gemstone with unparalleled color intensity.',
        heroImage: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=1200&h=600&fit=crop',
        avgRating: 4.7,
        features: [
          {
            title: 'Vivid Color',
            description: 'Exceptional green color saturation',
            icon: 'Palette'
          },
          {
            title: 'Colombian Origin',
            description: 'Premium stones from Muzo and Chivor',
            icon: 'Mountain'
          },
          {
            title: 'Natural Inclusions',
            description: 'Authentic jardin inclusions tell their story',
            icon: 'Eye'
          }
        ],
        subcategories: [
          { name: 'Colombian', slug: 'colombian', icon: '🇨🇴', count: 92 },
          { name: 'Zambian', slug: 'zambian', icon: '🇿🇲', count: 67 },
          { name: 'Brazilian', slug: 'brazilian', icon: '🇧🇷', count: 54 },
          { name: 'Ethiopian', slug: 'ethiopian', icon: '🇪🇹', count: 38 },
          { name: 'Trapiche', slug: 'trapiche', icon: '🌟', count: 12 },
          { name: 'Cat\'s Eye', slug: 'cats-eye', icon: '👁️', count: 8 }
        ],
        education: {
          title: 'Emerald Excellence',
          content: '<p>Learn about emerald formation, the significance of origin, and how to appreciate these magnificent green gems.</p>',
          image: 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=600&h=400&fit=crop',
          learnMoreLink: '/education/emerald-guide'
        }
      },
      rubies: {
        name: 'Rubies',
        description: 'Experience the fiery passion of our ruby collection, featuring the world\'s most coveted red gemstones.',
        heroImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=600&fit=crop',
        avgRating: 4.9,
        features: [
          {
            title: 'Pigeon Blood Red',
            description: 'The finest red color classification',
            icon: 'Flame'
          },
          {
            title: 'Burmese Heritage',
            description: 'From the legendary Mogok valley',
            icon: 'Crown'
          },
          {
            title: 'Unheated Stones',
            description: 'Natural color without enhancement',
            icon: 'Shield'
          }
        ],
        subcategories: [
          { name: 'Burmese', slug: 'burmese', icon: '🇲🇲', count: 78 },
          { name: 'Thai', slug: 'thai', icon: '🇹🇭', count: 65 },
          { name: 'Mozambique', slug: 'mozambique', icon: '🇲🇿', count: 52 },
          { name: 'Madagascar', slug: 'madagascar', icon: '🇲🇬', count: 34 },
          { name: 'Star', slug: 'star', icon: '⭐', count: 19 },
          { name: 'Trapiche', slug: 'trapiche', icon: '🌟', count: 7 }
        ],
        education: {
          title: 'Ruby Royalty',
          content: '<p>Explore the rich history and exceptional characteristics that make rubies the king of colored gemstones.</p>',
          image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&h=400&fit=crop',
          learnMoreLink: '/education/ruby-guide'
        }
      }
    }
    
    return categories[categorySlug.value as keyof typeof categories] || null
  })
  
  // Computed properties
  const hasProducts = computed(() => products.value.length > 0)
  
  // Methods
  const toggleMobileFilters = () => {
    showMobileFilters.value = !showMobileFilters.value
  }
  
  const closeMobileFilters = () => {
    showMobileFilters.value = false
  }
  
  const setView = (view: 'grid' | 'list') => {
    currentView.value = view
    localStorage.setItem('productView', view)
  }
  
  const handlePageChange = (page: number) => {
    setPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const refetchProducts = () => {
    fetchProducts()
  }
  
  const selectSubcategory = (subcategory: string) => {
    if (selectedSubcategory.value === subcategory) {
      selectedSubcategory.value = null
      // Remove subcategory filter
      setFilter('subcategory', null)
    } else {
      selectedSubcategory.value = subcategory
      // Apply subcategory filter
      setFilter('subcategory', subcategory)
    }
  }
  
  const formatPriceRange = () => {
    // This would calculate from actual product data
    const ranges = {
      diamonds: '$1,200 - $50,000',
      sapphires: '$800 - $25,000',
      emeralds: '$600 - $30,000',
      rubies: '$900 - $40,000'
    }
    return ranges[categorySlug.value as keyof typeof ranges] || '$500 - $50,000'
  }
  
  // Load saved view preference and fetch products
  onMounted(() => {
    const savedView = localStorage.getItem('productView') as 'grid' | 'list'
    if (savedView) {
      currentView.value = savedView
    }
    
    // Set category filter
    setFilter('category', categorySlug.value)
    fetchProducts()
  })
  
  // Watch for filter changes
  watch(
    () => filters.value,
    () => {
      setPage(1)
      fetchProducts()
    },
    { deep: true }
  )
  
  // Watch for route changes
  watch(
    () => route.params.category,
    (newCategory) => {
      if (newCategory) {
        setFilter('category', newCategory as string)
        selectedSubcategory.value = null
        fetchProducts()
      }
    }
  )
  
  // Handle responsive behavior
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      showMobileFilters.value = false
    }
  }
  
  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })
  </script>
  
  <style scoped>
  /* Custom scrollbar for filter sidebar */
  .overflow-y-auto::-webkit-scrollbar {
    width: 6px;
  }
  
  .overflow-y-auto::-webkit-scrollbar-track {
    @apply bg-gray-100 rounded-full;
  }
  
  .overflow-y-auto::-webkit-scrollbar-thumb {
    @apply bg-gray-300 rounded-full hover:bg-gray-400;
  }
  
  /* Hero background parallax effect */
  .bg-cover {
    background-attachment: fixed;
  }
  
  @media (max-width: 768px) {
    .bg-cover {
      background-attachment: scroll;
    }
  }
  
  /* Ensure proper mobile filter transition */
  @media (max-width: 1023px) {
    .transform {
      will-change: transform;
    }
  }
  
  /* Prose styling for education content */
  .prose {
    line-height: 1.7;
  }
  
  .prose p {
    margin-bottom: 1rem;
  }
  </style>