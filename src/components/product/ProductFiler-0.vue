/ components/ProductFilters.vue
<template>
  <div class="bg-white border border-slate-200 rounded-lg shadow-sm">
    <!-- Mobile Filter Header -->
    <div class="lg:hidden flex items-center justify-between p-4 border-b border-slate-200">
      <h3 class="text-lg font-semibold text-slate-900">Filters</h3>
      <button
        @click="$emit('close')"
        class="text-slate-400 hover:text-slate-600"
        aria-label="Close filters"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="p-4 space-y-6">
      <!-- Filter Header -->
      <div class="hidden lg:flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-900">Filters</h3>
        <button
          v-if="hasActiveFilters"
          @click="clearAllFilters"
          class="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Clear All
        </button>
      </div>

      <!-- Active Filters Chips -->
      <div v-if="hasActiveFilters" class="space-y-2">
        <h4 class="text-sm font-medium text-slate-700">Active Filters:</h4>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="chip in activeFilterChips"
            :key="chip.id"
            class="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-md"
          >
            {{ chip.label }}
            <button
              @click="removeFilter(chip.type, chip.value)"
              class="text-emerald-600 hover:text-emerald-800"
              :aria-label="`Remove ${chip.label} filter`"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        </div>
      </div>

      <!-- Price Range Filter -->
      <FilterPrice
        :min-price="priceRange[0]"
        :max-price="priceRange[1]"
        :selected-range="filters.priceRange"
        @update="updateFilters({ priceRange: $event })"
      />

      <!-- Category Filter -->
      <FilterCategory
        :categories="categories"
        :selected="filters.categories"
        @update="updateFilters({ categories: $event })"
      />

      <!-- Gemstone Type Filter -->
      <FilterGemstoneType
        :gemstone-types="gemstoneTypes"
        :selected="filters.gemstoneTypes"
        @update="updateFilters({ gemstoneTypes: $event })"
      />

      <!-- Carat Weight Filter -->
      <FilterCarat
        :min-carat="caratRange[0]"
        :max-carat="caratRange[1]"
        :selected-range="filters.caratRange"
        @update="updateFilters({ caratRange: $event })"
      />

      <!-- Color Filter -->
      <FilterColor
        :selected="filters.colors"
        @update="updateFilters({ colors: $event })"
      />

      <!-- Clarity Filter -->
      <FilterClarity
        :selected="filters.clarities"
        @update="updateFilters({ clarities: $event })"
      />

      <!-- Cut Filter -->
      <div class="border-b border-slate-100 pb-4">
        <h4 class="text-sm font-medium text-slate-900 mb-3">Cut Quality</h4>
        <div class="space-y-2">
          <label
            v-for="cut in cutOptions"
            :key="cut.value"
            class="flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              :checked="filters.cuts.includes(cut.value)"
              @change="toggleFilter('cuts', cut.value)"
              class="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
            />
            <span class="ml-2 text-sm text-slate-700">{{ cut.label }}</span>
          </label>
        </div>
      </div>

      <!-- Shape Filter -->
      <div class="border-b border-slate-100 pb-4">
        <h4 class="text-sm font-medium text-slate-900 mb-3">Shape</h4>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="shape in shapeOptions"
            :key="shape.value"
            @click="toggleFilter('shapes', shape.value)"
            :class="[
              'p-2 border rounded-lg text-xs font-medium transition-colors',
              filters.shapes.includes(shape.value)
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 text-slate-700 hover:border-slate-300'
            ]"
          >
            <div class="text-center">
              <div class="w-6 h-6 mx-auto mb-1 bg-slate-200 rounded"></div>
              <div>{{ shape.label }}</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Certification Filter -->
      <div class="border-b border-slate-100 pb-4">
        <h4 class="text-sm font-medium text-slate-900 mb-3">Certification</h4>
        <div class="space-y-2">
          <label
            v-for="cert in certificationOptions"
            :key="cert.value"
            class="flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              :checked="filters.certifications.includes(cert.value)"
              @change="toggleFilter('certifications', cert.value)"
              class="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
            />
            <span class="ml-2 text-sm text-slate-700">{{ cert.label }}</span>
          </label>
        </div>
      </div>

      <!-- Origin Filter -->
      <div v-if="origins.length > 0" class="border-b border-slate-100 pb-4">
        <h4 class="text-sm font-medium text-slate-900 mb-3">Origin</h4>
        <div class="space-y-2 max-h-32 overflow-y-auto">
          <label
            v-for="origin in origins"
            :key="origin"
            class="flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              :checked="filters.origins.includes(origin)"
              @change="toggleFilter('origins', origin)"
              class="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
            />
            <span class="ml-2 text-sm text-slate-700">{{ origin }}</span>
          </label>
        </div>
      </div>

      <!-- Stock Status Filter -->
      <div class="border-b border-slate-100 pb-4">
        <h4 class="text-sm font-medium text-slate-900 mb-3">Availability</h4>
        <div class="space-y-2">
          <label
            v-for="status in stockStatusOptions"
            :key="status.value"
            class="flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              :checked="filters.stockStatus.includes(status.value)"
              @change="toggleFilter('stockStatus', status.value)"
              class="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
            />
            <span class="ml-2 text-sm text-slate-700">{{ status.label }}</span>
          </label>
        </div>
      </div>

      <!-- Special Filters -->
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-slate-900">Special</h4>
        <div class="space-y-2">
          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              :checked="filters.onSale"
              @change="updateFilters({ onSale: $event.target.checked })"
              class="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
            />
            <span class="ml-2 text-sm text-slate-700">On Sale</span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              :checked="filters.featured"
              @change="updateFilters({ featured: $event.target.checked })"
              class="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
            />
            <span class="ml-2 text-sm text-slate-700">Featured</span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              :checked="filters.isNew"
              @change="updateFilters({ isNew: $event.target.checked })"
              class="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
            />
            <span class="ml-2 text-sm text-slate-700">New Arrivals</span>
          </label>
        </div>
      </div>

      <!-- Mobile Apply Button -->
      <div class="lg:hidden pt-4 border-t border-slate-200">
        <button
          @click="$emit('apply')"
          class="w-full bg-emerald-600 text-white py-2 px-4 rounded-md font-medium hover:bg-emerald-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFilters } from '@/composables/useFilters';
import type { Cut, Color, Clarity, Shape, CertificationAgency, StockStatus } from '@/types/product';
import FilterPrice from './FilterPrice.vue';
import FilterCategory from './FilterCategory.vue';
import FilterGemstoneType from './FilterGemstoneType.vue';
import FilterCarat from './FilterCarat.vue';
import FilterColor from './FilterColor.vue';
import FilterClarity from './FilterClarity.vue';

const emit = defineEmits<{
  close: [];
  apply: [];
}>();

const {
  filters,
  categories,
  gemstoneTypes,
  origins,
  priceRange,
  caratRange,
  hasActiveFilters,
  updateFilters,
  clearAllFilters,
  toggleFilter,
} = useFilters();

const cutOptions = [
  { value: 'excellent' as Cut, label: 'Excellent' },
  { value: 'very-good' as Cut, label: 'Very Good' },
  { value: 'good' as Cut, label: 'Good' },
  { value: 'fair' as Cut, label: 'Fair' },
];

const shapeOptions = [
  { value: 'round' as Shape, label: 'Round' },
  { value: 'princess' as Shape, label: 'Princess' },
  { value: 'cushion' as Shape, label: 'Cushion' },
  { value: 'oval' as Shape, label: 'Oval' },
  { value: 'emerald' as Shape, label: 'Emerald' },
  { value: 'pear' as Shape, label: 'Pear' },
  { value: 'marquise' as Shape, label: 'Marquise' },
  { value: 'asscher' as Shape, label: 'Asscher' },
  { value: 'radiant' as Shape, label: 'Radiant' },
  { value: 'heart' as Shape, label: 'Heart' },
];

const certificationOptions = [
  { value: 'GIA' as CertificationAgency, label: 'GIA' },
  { value: 'AGS' as CertificationAgency, label: 'AGS' },
  { value: 'SSEF' as CertificationAgency, label: 'SSEF' },
  { value: 'Gübelin' as CertificationAgency, label: 'Gübelin' },
];

const stockStatusOptions = [
  { value: 'in-stock' as StockStatus, label: 'In Stock' },
  { value: 'low-stock' as StockStatus, label: 'Low Stock' },
  { value: 'pre-order' as StockStatus, label: 'Pre-Order' },
];

const activeFilterChips = computed(() => {
  const chips: Array<{ id: string; label: string; type: string; value: any }> = [];

  // Price range chip
  if (filters.value.priceRange[0] > priceRange.value[0] || filters.value.priceRange[1] < priceRange.value[1]) {
    chips.push({
      id: 'price',
      label: `${filters.value.priceRange[0].toLocaleString()} - ${filters.value.priceRange[1].toLocaleString()}`,
      type: 'priceRange',
      value: priceRange.value,
    });
  }

  // Category chips
  filters.value.categories.forEach(category => {
    chips.push({
      id: `category-${category}`,
      label: category,
      type: 'categories',
      value: category,
    });
  });

  // Gemstone type chips
  filters.value.gemstoneTypes.forEach(type => {
    chips.push({
      id: `gemstone-${type}`,
      label: type.charAt(0).toUpperCase() + type.slice(1),
      type: 'gemstoneTypes',
      value: type,
    });
  });

  // Other filter chips...
  return chips;
});

const removeFilter = (type: string, value: any) => {
  if (type === 'priceRange') {
    updateFilters({ priceRange: priceRange.value });
  } else if (type === 'caratRange') {
    updateFilters({ caratRange: caratRange.value });
  } else {
    toggleFilter(type as any, value);
  }
};
</script>full text-left px-4 py-2 text-sm transition-colors',
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