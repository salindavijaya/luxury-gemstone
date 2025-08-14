<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-slate-800">Product Comparison</h2>
      <button
        v-if="comparisonItems.length > 0"
        @click="clearAll"
        class="text-sm text-slate-600 hover:text-slate-800 font-medium"
      >
        Clear All
      </button>
    </div>

    <!-- Add Products Section -->
    <div class="mb-6">
      <div class="flex flex-wrap gap-2 mb-4">
        <button
          v-for="slot in 3"
          :key="slot"
          @click="openProductSelector(slot)"
          class="flex-1 min-w-48 h-32 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center hover:border-emerald-500 transition-colors"
          :class="{ 'bg-slate-50': comparisonItems[slot - 1] }"
        >
          <div v-if="comparisonItems[slot - 1]" class="text-center">
            <img
              :src="comparisonItems[slot - 1].image"
              :alt="comparisonItems[slot - 1].name"
              class="w-16 h-16 object-cover rounded-md mx-auto mb-2"
            />
            <p class="text-sm font-medium text-slate-800 line-clamp-2">
              {{ comparisonItems[slot - 1].name }}
            </p>
          </div>
          <div v-else class="text-center">
            <svg class="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <p class="text-sm text-slate-600">Add Product {{ slot }}</p>
          </div>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="comparisonItems.length === 0" class="text-center py-12">
      <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-slate-800 mb-2">Compare Products</h3>
      <p class="text-slate-600 mb-4">Add up to 3 products to compare their features side by side.</p>
    </div>

    <!-- Comparison Table -->
    <div v-else-if="comparisonItems.length > 1" class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-slate-200">
            <th class="text-left py-4 px-2 font-medium text-slate-800 w-40">Features</th>
            <th
              v-for="(item, index) in comparisonItems"
              :key="item.id"
              class="text-center py-4 px-2 relative"
            >
              <button
                @click="removeProduct(index)"
                class="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              <img
                :src="item.image"
                :alt="item.name"
                class="w-20 h-20 object-cover rounded-lg mx-auto mb-2"
              />
              <h3 class="font-medium text-slate-800 text-sm line-clamp-2">{{ item.name }}</h3>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <!-- Price -->
          <tr>
            <td class="py-4 px-2 font-medium text-slate-700">Price</td>
            <td
              v-for="item in comparisonItems"
              :key="`price-${item.id}`"
              class="py-4 px-2 text-center font-semibold text-emerald-600"
            >
              ${{ item.price.toLocaleString() }}
            </td>
          </tr>

          <!-- Carat -->
          <tr>
            <td class="py-4 px-2 font-medium text-slate-700">Carat Weight</td>
            <td
              v-for="item in comparisonItems"
              :key="`carat-${item.id}`"
              class="py-4 px-2 text-center"
            >
              {{ item.specs.carat }} ct
            </td>
          </tr>

          <!-- Cut -->
          <tr>
            <td class="py-4 px-2 font-medium text-slate-700">Cut</td>
            <td
              v-for="item in comparisonItems"
              :key="`cut-${item.id}`"
              class="py-4 px-2 text-center"
            >
              {{ item.specs.cut }}
            </td>
          </tr>

          <!-- Color -->
          <tr>
            <td class="py-4 px-2 font-medium text-slate-700">Color</td>
            <td
              v-for="item in comparisonItems"
              :key="`color-${item.id}`"
              class="py-4 px-2 text-center"
            >
              {{ item.specs.color }}
            </td>
          </tr>

          <!-- Clarity -->
          <tr>
            <td class="py-4 px-2 font-medium text-slate-700">Clarity</td>
            <td
              v-for="item in comparisonItems"
              :key="`clarity-${item.id}`"
              class="py-4 px-2 text-center"
            >
              {{ item.specs.clarity }}
            </td>
          </tr>

          <!-- Certification -->
          <tr>
            <td class="py-4 px-2 font-medium text-slate-700">Certification</td>
            <td
              v-for="item in comparisonItems"
              :key="`cert-${item.id}`"
              class="py-4 px-2 text-center"
            >
              {{ item.specs.certification }}
            </td>
          </tr>

          <!-- Collection -->
          <tr>
            <td class="py-4 px-2 font-medium text-slate-700">Collection</td>
            <td
              v-for="item in comparisonItems"
              :key="`collection-${item.id}`"
              class="py-4 px-2 text-center"
            >
              {{ item.collection }}
            </td>
          </tr>

          <!-- Availability -->
          <tr>
            <td class="py-4 px-2 font-medium text-slate-700">Availability</td>
            <td
              v-for="item in comparisonItems"
              :key="`stock-${item.id}`"
              class="py-4 px-2 text-center"
            >
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="item.inStock 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'"
              >
                {{ item.inStock ? 'In Stock' : 'Out of Stock' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-200">
        <button
          v-for="(item, index) in comparisonItems"
          :key="`action-${item.id}`"
          @click="addToCart(item)"
          :disabled="!item.inStock"
          class="flex-1 min-w-32 bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>

    <!-- Product Selector Modal -->
    <Modal
      v-if="showProductSelector"
      @close="showProductSelector = false"
      title="Select Product to Compare"
      size="lg"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        <div
          v-for="product in availableProducts"
          :key="product.id"
          @click="addToComparison(product)"
          class="border border-slate-200 rounded-lg p-4 hover:border-emerald-500 cursor-pointer transition-colors"
        >
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-32 object-cover rounded-md mb-3"
          />
          <h3 class="font-medium text-slate-800 mb-1 line-clamp-2">{{ product.name }}</h3>
          <p class="text-sm text-slate-600 mb-2">{{ product.category }}</p>
          <p class="font-semibold text-emerald-600">${{ product.price.toLocaleString() }}</p>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import Modal from './Modal.vue'
import type { Product } from '@/types'

// Props
interface Props {
  initialProducts?: Product[]
}

const props = withDefaults(defineProps<Props>(), {
  initialProducts: () => []
})

// Stores
const cartStore = useCartStore()

// State
const comparisonItems = ref<Product[]>(props.initialProducts)
const showProductSelector = ref(false)
const selectedSlot = ref<number>(0)

// Mock available products
const availableProducts = ref<Product[]>([
  {
    id: '1',
    name: 'Royal Blue Sapphire Ring',
    category: 'Sapphire',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
    inStock: true,
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
  },
  {
    id: '5',
    name: 'Pink Diamond Solitaire',
    category: 'Diamond',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53ff5d?w=400',
    inStock: true,
    description: 'Rare pink diamond in platinum setting',
    images: ['https://images.unsplash.com/photo-1588444837495-c6cfeb53ff5d?w=400'],
    specs: {
      carat: 2.8,
      cut: 'Round',
      color: 'Fancy Pink',
      clarity: 'VS1',
      certification: 'GIA'
    },
    collection: 'Rare Collection'
  }
])

// Computed
const filteredProducts = computed(() => {
  return availableProducts.value.filter(product => 
    !comparisonItems.value.some(item => item.id === product.id)
  )
})

// Methods
const openProductSelector = (slot: number) => {
  selectedSlot.value = slot - 1
  showProductSelector.value = true
}

const addToComparison = (product: Product) => {
  if (selectedSlot.value < comparisonItems.value.length) {
    comparisonItems.value[selectedSlot.value] = product
  } else {
    comparisonItems.value.push(product)
  }
  showProductSelector.value = false
}

const removeProduct = (index: number) => {
  comparisonItems.value.splice(index, 1)
}

const clearAll = () => {
  comparisonItems.value = []
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
  table {
    font-size: 0.875rem;
  }
  
  th, td {
    padding: 0.75rem 0.25rem;
  }
}
</style>