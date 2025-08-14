<template>
    <div class="space-y-4">
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="space-y-4">
        <div
          v-for="i in 5"
          :key="i"
          class="bg-white rounded-lg shadow-lg p-6 animate-pulse"
        >
          <div class="flex flex-col md:flex-row gap-6">
            <div class="w-full md:w-48 h-48 bg-slate-200 rounded-lg"></div>
            <div class="flex-1 space-y-4">
              <div class="h-6 bg-slate-200 rounded w-3/4"></div>
              <div class="h-4 bg-slate-200 rounded w-1/2"></div>
              <div class="space-y-2">
                <div class="h-4 bg-slate-200 rounded"></div>
                <div class="h-4 bg-slate-200 rounded w-5/6"></div>
              </div>
              <div class="flex gap-2">
                <div class="h-8 bg-slate-200 rounded w-24"></div>
                <div class="h-8 bg-slate-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Empty State -->
      <div
        v-else-if="!isLoading && products.length === 0"
        class="text-center py-16 bg-white rounded-lg shadow-lg"
      >
        <div class="w-24 h-24 mx-auto mb-6 text-slate-300">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.441-1.046-5.86-2.691m11.72 0A7.963 7.963 0 0112 15c-2.34 0-4.441-1.046-5.86-2.691M15 11V9a3 3 0 10-6 0v2m6 0a3 3 0 11-6 0"
            />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-slate-800 mb-2">No Products Found</h3>
        <p class="text-slate-600 mb-6">
          We couldn't find any products matching your criteria.
        </p>
        <button
          @click="clearFilters"
          class="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
  
      <!-- Product List -->
      <div v-else class="space-y-4">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
        >
          <div class="flex flex-col md:flex-row">
            <!-- Product Image -->
            <div class="relative w-full md:w-48 h-48 md:h-auto">
              <img
                :src="product.image"
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              
              <!-- Badge Overlay -->
              <div class="absolute top-3 left-3 flex flex-col gap-1">
                <span
                  v-if="product.isNew"
                  class="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full font-medium"
                >
                  New
                </span>
                <span
                  v-if="product.onSale"
                  class="bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium"
                >
                  Sale
                </span>
                <span
                  v-if="product.stock === 0"
                  class="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium"
                >
                  Out of Stock
                </span>
              </div>
  
              <!-- Quick Actions -->
              <div class="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  @click="toggleWishlist(product.id)"
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                    isInWishlist(product.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-slate-600 hover:bg-red-50 hover:text-red-500'
                  ]"
                  :title="isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
                
                <button
                  @click="openQuickView(product)"
                  class="w-8 h-8 bg-white text-slate-600 rounded-full flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                  title="Quick View"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
            </div>
  
            <!-- Product Details -->
            <div class="flex-1 p-6">
              <div class="flex flex-col h-full">
                <!-- Header -->
                <div class="flex-1">
                  <div class="flex items-start justify-between mb-2">
                    <h3 class="text-lg font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
                      {{ product.name }}
                    </h3>
                    <div class="flex items-center gap-1 text-amber-500">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                      <span class="text-sm font-medium">{{ product.rating }}</span>
                      <span class="text-xs text-slate-500">({{ product.reviewCount }})</span>
                    </div>
                  </div>
  
                  <!-- Gemstone Details -->
                  <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span class="text-slate-500">Type:</span>
                      <span class="ml-2 font-medium text-slate-700">{{ product.gemstoneType }}</span>
                    </div>
                    <div>
                      <span class="text-slate-500">Carat:</span>
                      <span class="ml-2 font-medium text-slate-700">{{ product.carat }}ct</span>
                    </div>
                    <div>
                      <span class="text-slate-500">Cut:</span>
                      <span class="ml-2 font-medium text-slate-700">{{ product.cut }}</span>
                    </div>
                    <div>
                      <span class="text-slate-500">Clarity:</span>
                      <span class="ml-2 font-medium text-slate-700">{{ product.clarity }}</span>
                    </div>
                  </div>
  
                  <!-- Description -->
                  <p class="text-slate-600 text-sm mb-4 line-clamp-2">
                    {{ product.description }}
                  </p>
  
                  <!-- Certifications -->
                  <div v-if="product.certifications?.length" class="flex flex-wrap gap-2 mb-4">
                    <span
                      v-for="cert in product.certifications"
                      :key="cert"
                      class="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full"
                    >
                      {{ cert }}
                    </span>
                  </div>
                </div>
  
                <!-- Footer -->
                <div class="flex items-center justify-between pt-4 border-t border-slate-100">
                  <!-- Price -->
                  <div class="flex items-center gap-2">
                    <span class="text-2xl font-bold text-slate-800">
                      ${{ formatPrice(product.price) }}
                    </span>
                    <span
                      v-if="product.originalPrice && product.originalPrice > product.price"
                      class="text-sm text-slate-500 line-through"
                    >
                      ${{ formatPrice(product.originalPrice) }}
                    </span>
                  </div>
  
                  <!-- Actions -->
                  <div class="flex items-center gap-2">
                    <button
                      @click="addToCart(product)"
                      :disabled="product.stock === 0"
                      class="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
                    </button>
                    
                    <router-link
                      :to="`/products/${product.id}`"
                      class="border border-emerald-600 text-emerald-600 px-4 py-2 rounded-md hover:bg-emerald-50 transition-colors text-sm font-medium"
                    >
                      View Details
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useProductsStore } from '@/stores/products'
  import { useWishlistStore } from '@/stores/wishlist'
  import { useCartStore } from '@/stores/cart'
  
  const props = defineProps({
    products: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['clear-filters', 'quick-view'])
  
  const productsStore = useProductsStore()
  const wishlistStore = useWishlistStore()
  const cartStore = useCartStore()
  
  // Computed properties
  const isInWishlist = computed(() => (productId) => {
    return wishlistStore.isInWishlist(productId)
  })
  
  // Methods
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }
  
  const toggleWishlist = (productId) => {
    if (isInWishlist.value(productId)) {
      wishlistStore.removeFromWishlist(productId)
    } else {
      wishlistStore.addToWishlist(productId)
    }
  }
  
  const addToCart = (product) => {
    if (product.stock > 0) {
      cartStore.addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      })
    }
  }
  
  const clearFilters = () => {
    emit('clear-filters')
  }
  
  const openQuickView = (product) => {
    emit('quick-view', product)
  }
  </script>
  
  <style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  @media (max-width: 768px) {
    .group:hover .group-hover\:opacity-100 {
      opacity: 1;
    }
  }
  </style>