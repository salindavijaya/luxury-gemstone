// components/ProductSort.vue
<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      @keydown.enter="toggleDropdown"
      @keydown.space.prevent="toggleDropdown"
      class="flex items-center gap-2 bg-white border border-slate-300 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      :aria-expanded="isOpen"
      aria-haspopup="true"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
      Sort: {{ selectedSortLabel }}
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      @click.away="closeDropdown"
      class="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-md shadow-lg z-10"
      role="menu"
      aria-orientation="vertical"
    >
      <div class="py-1">
        <button
          v-for="option in sortOptions"
          :key="option.value"
          @click="selectSort(option.value)"
          :class="[
            'block w-full text-left px-4 py-2 text-sm transition-colors',
            selectedSort === option.value
              ? 'bg-emerald-50 text-emerald-600 font-medium'
              : 'text-slate-700 hover:bg-slate-50'
          ]"
          role="menuitem"
        >
          <div class="flex items-center justify-between">
            <span>{{ option.label }}</span>
            <svg
              v-if="selectedSort === option.value"
              class="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
<template>
  <div class="space-y-4">
    <div
      v-for="product in products"
      :key="product.id"
      class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-emerald-300"
    >
      <div class="flex flex-col md:flex-row">
        <!-- Image -->
        <div class="relative w-full md:w-48 h-48 md:h-auto">
          <img
            :src="product.images[0]"
            :alt="product.name"
            class="w-full h-full object-cover"
            loading="lazy"
          />
          
          <!-- Badges -->
          <div class="absolute top-3 left-3 flex flex-col gap-1">
            <span 
              v-if="product.isNew"
              class="px-2 py-1 bg-emerald-600 text-white text-xs font-medium rounded-md"
            >
              NEW
            </span>
            <span 
              v-if="product.onSale"
              class="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-md"
            >
              SALE
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 p-6">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between h-full">
            <div class="flex-1">
              <!-- Header -->
              <div class="mb-3">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs text-slate-500 uppercase tracking-wide font-medium">
                    {{ product.gemstoneType }}
                  </span>
                  <span v-if="product.certification" class="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    {{ product.certification.agency }}
                  </span>
                </div>
                <h3 class="text-lg font-semibold text-slate-900 mb-2">
                  {{ product.name }}
                </h3>
                <p class="text-slate-600 text-sm line-clamp-2">
                  {{ product.description }}
                </p>
              </div>

              <!-- Specifications -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <dt class="text-xs font-medium text-slate-500 uppercase tracking-wide">Carat</dt>
                  <dd class="text-sm font-semibold text-slate-900">{{ product.specifications.carat }}ct</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-slate-500 uppercase tracking-wide">Cut</dt>
                  <dd class="text-sm font-semibold text-slate-900">{{ product.specifications.cut }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-slate-500 uppercase tracking-wide">Color</dt>
                  <dd class="text-sm font-semibold text-slate-900">{{ product.specifications.color }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-slate-500 uppercase tracking-wide">Clarity</dt>
                  <dd class="text-sm font-semibold text-slate-900">{{ product.specifications.clarity }}</dd>
                </div>
              </div>

              <!-- Rating and Reviews -->
              <div class="flex items-center gap-2 mb-4">
                <div class="flex items-center">
                  <template v-for="i in 5" :key="i">
                    <svg
                      :class="[
                        'w-4 h-4',
                        i <= Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-300'
                      ]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </template>
                </div>
                <span class="text-sm text-slate-600">
                  {{ product.rating }} ({{ product.reviewCount }} reviews)
                </span>
              </div>
            </div>

            <!-- Price and Actions -->
            <div class="lg:text-right lg:pl-6">
              <div class="mb-4">
                <div class="text-2xl font-bold text-slate-900">
                  ${{ formatPrice(product.price) }}
                </div>
                <div v-if="product.originalPrice" class="text-sm text-slate-500 line-through">
                  ${{ formatPrice(product.originalPrice) }}
                </div>
                <div class="text-sm text-slate-500">
                  ${{ formatPrice(Math.round(product.price / product.specifications.carat)) }}/ct
                </div>
              </div>

              <!-- Stock Status -->
              <div class="mb-4">
                <span 
                  :class="[
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    stockStatusClasses(product.stockStatus)
                  ]"
                >
                  {{ stockStatusText(product.stockStatus) }}
                </span>
              </div>

              <!-- Actions -->
              <div class="flex flex-col gap-2">
                <button
                  @click="$emit('productView', product)"
                  class="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  View Details
                </button>
                <button
                  @click="$emit('productQuickView', product)"
                  class="bg-white text-slate-700 px-4 py-2 rounded-md text-sm font-medium border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  Quick View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product, StockStatus } from '@/types/product';

interface Props {
  products: Product[];
}

defineProps<Props>();

const emit = defineEmits<{
  productView: [product: Product];
  productQuickView: [product: Product];
}>();

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US').format(price);
};

const stockStatusClasses = (status: StockStatus): string => {
  switch (status) {
    case 'in-stock':
      return 'bg-green-100 text-green-800';
    case 'low-stock':
      return 'bg-amber-100 text-amber-800';
    case 'out-of-stock':
      return 'bg-red-100 text-red-800';
    case 'pre-order':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};

const stockStatusText = (status: StockStatus): string => {
  switch (status) {
    case 'in-stock':
      return 'In Stock';
    case 'low-stock':
      return 'Low Stock';
    case 'out-of-stock':
      return 'Out of Stock';
    case 'pre-order':
      return 'Pre-Order';
    default:
      return 'Unknown';
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>