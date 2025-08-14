// components/ProductGrid.vue
<template>
  <div class="space-y-6">
    <!-- Grid Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <h2 class="text-xl font-semibold text-slate-900">
          Products
          <span class="text-sm font-normal text-slate-500 ml-2">
            ({{ totalProducts }} {{ totalProducts === 1 ? 'item' : 'items' }})
          </span>
        </h2>
        
        <!-- View Toggle -->
        <div class="flex items-center border border-slate-200 rounded-lg p-1">
          <button
            @click="$emit('viewModeChange', 'grid')"
            :class="[
              'p-2 rounded-md transition-colors',
              viewMode === 'grid' 
                ? 'bg-emerald-100 text-emerald-600' 
                : 'text-slate-400 hover:text-slate-600'
            ]"
            aria-label="Grid view"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            @click="$emit('viewModeChange', 'list')"
            :class="[
              'p-2 rounded-md transition-colors',
              viewMode === 'list' 
                ? 'bg-emerald-100 text-emerald-600' 
                : 'text-slate-400 hover:text-slate-600'
            ]"
            aria-label="List view"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Sort Dropdown -->
      <ProductSort @sort-change="$emit('sortChange', $event)" />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="i in 8" 
        :key="i"
        class="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse"
      >
        <div class="aspect-square bg-slate-200"></div>
        <div class="p-4 space-y-3">
          <div class="h-4 bg-slate-200 rounded w-3/4"></div>
          <div class="h-3 bg-slate-200 rounded w-1/2"></div>
          <div class="h-3 bg-slate-200 rounded w-2/3"></div>
          <div class="h-5 bg-slate-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-slate-900 mb-2">Failed to load products</h3>
      <p class="text-slate-600 mb-4">{{ error }}</p>
      <button
        @click="$emit('retry')"
        class="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
      >
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="products.length === 0" class="text-center py-12">
      <div class="text-slate-400 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-slate-900 mb-2">No products found</h3>
      <p class="text-slate-600 mb-4">Try adjusting your filters or search terms</p>
      <button
        @click="$emit('clearFilters')"
        class="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
      >
        Clear Filters
      </button>
    </div>

    <!-- Products Grid -->
    <div v-else>
      <div 
        :class="[
          'grid gap-6 transition-all duration-300',
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        ]"
      >
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          @view="$emit('productView', $event)"
          @quick-view="$emit('productQuickView', $event)"
          @toggle-wishlist="$emit('toggleWishlist', $event)"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center">
        <nav class="flex items-center gap-2" aria-label="Pagination">
          <button
            @click="$emit('pageChange', currentPage - 1)"
            :disabled="currentPage === 1"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              currentPage === 1 
                ? 'text-slate-400 cursor-not-allowed' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            ]"
          >
            Previous
          </button>
          
          <template v-for="page in paginationPages" :key="page">
            <button
              v-if="typeof page === 'number'"
              @click="$emit('pageChange', page)"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                page === currentPage
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              ]"
            >
              {{ page }}
            </button>
            <span v-else class="px-3 py-2 text-slate-400">...</span>
          </template>
          
          <button
            @click="$emit('pageChange', currentPage + 1)"
            :disabled="currentPage === totalPages"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              currentPage === totalPages 
                ? 'text-slate-400 cursor-not-allowed' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            ]"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product, ViewMode } from '@/types/product';
import ProductCard from './ProductCard.vue';
import ProductSort from './ProductSort.vue';

interface Props {
  products: Product[];
  totalProducts: number;
  viewMode: ViewMode;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  viewModeChange: [mode: ViewMode];
  sortChange: [sort: string];
  productView: [product: Product];
  productQuickView: [product: Product];
  toggleWishlist: [product: Product];
  pageChange: [page: number];
  clearFilters: [];
  retry: [];
}>();

const paginationPages = computed(() => {
  const pages: (number | string)[] = [];
  const total = props.totalPages;
  const current = props.currentPage;
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(total);
    }
  }
  
  return pages;
});
</script>