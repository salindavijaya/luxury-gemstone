<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-slate-800">Recently Viewed</h2>
      <button
        v-if="recentItems.length > 0"
        @click="clearHistory"
        class="text-sm text-slate-600 hover:text-slate-800 font-medium"
        :disabled="isClearing"
      >
        {{ isClearing ? 'Clearing...' : 'Clear History' }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="n in 4"
        :key="n"
        class="animate-pulse"
      >
        <div class="bg-slate-200 aspect-square rounded-lg mb-3"></div>
        <div class="space-y-2">
          <div class="bg-slate-200 h-4 rounded w-3/4"></div>
          <div class="bg-slate-200 h-3 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="recentItems.length === 0"
      class="text-center py-12"
    >
      <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-slate-800 mb-2">No Recently Viewed Items</h3>
      <p class="text-slate-600 mb-4">Start browsing our gemstone collection to see your recently viewed items here.</p>
      <router-link
        to="/products"
        class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
      >
        Browse Products
      </router-link>
    </div>

    <!-- Items Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="item in recentItems"
        :key="item.id"
        class="group cursor-pointer"
        @click="navigateToProduct(item.id)"
      >
        <div class="relative overflow-hidden rounded-lg bg-slate-50 aspect-square mb-3">
          <img
            :src="item.image"
            :alt="item.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div class="absolute top-2 right-2 flex space-x-1">
            <button
              @click.stop="toggleWishlist(item)"
              class="p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              :class="{ 'text-red-500': item.isWishlisted, 'text-slate-600': !item.isWishlisted }"
              :title="item.isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'"
            >
              <svg class="w-4 h-4" :fill="item.isWishlisted ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>
            <button
              @click.stop="removeFromHistory(item.id)"
              class="p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors text-slate-600"
              title="Remove from history"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <!-- Quick Add to Cart -->
          <div class="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click.stop="addToCart(item)"
              class="w-full bg-emerald-600 text-white text-sm py-2 rounded-md hover:bg-emerald-700 transition-colors"
              :disabled="!item.inStock"
            >
              {{ item.inStock ? 'Add to Cart' : 'Out of Stock' }}
            </button>
          </div>
        </div>
        
        <div class="space-y-1">
          <h3 class="font-medium text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-2">
            {{ item.name }}
          </h3>
          <p class="text-sm text-slate-600">{{ item.category }}</p>
          <div class="flex items-center justify-between">
            <span class="font-semibold text-emerald-600">${{ item.price.toLocaleString() }}</span>
            <span class="text-xs text-slate-500">{{ formatTimeAgo(item.viewedAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Load More -->
    <div
      v-if="hasMore && recentItems.length > 0"
      class="text-center mt-8"
    >
      <button
        @click="loadMore"
        :disabled="isLoadingMore"
        class="px-6 py-2 border border-emerald-600 text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors disabled:opacity-50"
      >
        {{ isLoadingMore ? 'Loading...' : 'Load More' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWishlistStore } from '@/stores/wishlist'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types'

interface RecentItem extends Product {
  viewedAt: Date
  isWishlisted: boolean
}

// Stores
const wishlistStore = useWishlistStore()
const cartStore = useCartStore()
const router = useRouter()

// Reactive state
const recentItems = ref<RecentItem[]>([])
const isLoading = ref(true)
const isLoadingMore = ref(false)
const isClearing = ref(false)
const hasMore = ref(false)
const currentPage = ref(1)
const pageSize = 8

// Mock data
const mockRecentItems: RecentItem[] = [
  {
    id: '1',
    name: 'Royal Blue Sapphire Ring',
    category: 'Sapphire',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
    inStock: true,
    viewedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isWishlisted: true,
    description: 'Exquisite royal blue sapphire with exceptional clarity',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400'],
    specs: {
      carat: 3.2,
      cut: 'Oval',
      color: 'Royal Blue',
      clarity: 'VVS1',
      certification: 'GIA'
    },
    collection: 'Royal Collection'
  },
  {
    id: '2',
    name: 'Emerald Cut Diamond Necklace',
    category: 'Diamond',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
    inStock: true,
    viewedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isWishlisted: false,
    description: 'Elegant emerald cut diamond necklace',
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'],
    specs: {
      carat: 5.0,
      cut: 'Emerald',
      color: 'D',
      clarity: 'FL',
      certification: 'GIA'
    },
    collection: 'Diamond Collection'
  },
  {
    id: '3',
    name: 'Vintage Ruby Earrings',
    category: 'Ruby',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400',
    inStock: false,
    viewedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isWishlisted: true,
    description: 'Vintage-inspired ruby earrings with intricate details',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400'],
    specs: {
      carat: 2.1,
      cut: 'Round',
      color: 'Pigeon Blood Red',
      clarity: 'VS1',
      certification: 'GRS'
    },
    collection: 'Vintage Collection'
  },
  {
    id: '4',
    name: 'Tanzanite Pendant',
    category: 'Tanzanite',
    price: 6200,
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400',
    inStock: true,
    viewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isWishlisted: false,
    description: 'Rare tanzanite pendant with white gold setting',
    images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400'],
    specs: {
      carat: 4.5,
      cut: 'Cushion',
      color: 'Vivid Blue',
      clarity: 'VS2',
      certification: 'GIA'
    },
    collection: 'Exotic Collection'
  }
]

// Methods
const loadRecentItems = async (page = 1) => {
  if (page === 1) {
    isLoading.value = true
  } else {
    isLoadingMore.value = true
  }

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const items = mockRecentItems.slice(startIndex, endIndex)
    
    if (page === 1) {
      recentItems.value = items
    } else {
      recentItems.value.push(...items)
    }
    
    hasMore.value = endIndex < mockRecentItems.length
  } catch (error) {
    console.error('Error loading recent items:', error)
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
  }
}

const loadMore = () => {
  currentPage.value++
  loadRecentItems(currentPage.value)
}

const clearHistory = async () => {
  isClearing.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    recentItems.value = []
    hasMore.value = false
  } catch (error) {
    console.error('Error clearing history:', error)
  } finally {
    isClearing.value = false
  }
}

const removeFromHistory = async (itemId: string) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200))
    recentItems.value = recentItems.value.filter(item => item.id !== itemId)
  } catch (error) {
    console.error('Error removing item:', error)
  }
}

const navigateToProduct = (productId: string) => {
  router.push(`/products/${productId}`)
}

const toggleWishlist = (item: RecentItem) => {
  if (item.isWishlisted) {
    wishlistStore.removeFromWishlist(item.id)
  } else {
    wishlistStore.addToWishlist(item)
  }
  item.isWishlisted = !item.isWishlisted
}

const addToCart = (item: RecentItem) => {
  if (item.inStock) {
    cartStore.addToCart(item)
  }
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return `${hours}h ago`
  } else {
    const days = Math.floor(diffInMinutes / 1440)
    return `${days}d ago`
  }
}

// Lifecycle
onMounted(() => {
  loadRecentItems()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>