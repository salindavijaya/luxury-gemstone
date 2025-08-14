### components/product/ProductActions.vue
```vue
<template>
  <div class="space-y-6">
    <!-- Quantity and Size Selection -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <!-- Quantity Selector -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">
          Quantity
        </label>
        <QuantitySelector v-model="quantity" :max="product.stockQuantity" />
      </div>
      
      <!-- Size Guide -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">
          Size Comparison
        </label>
        <button
          @click="showSizeGuide = true"
          class="w-full px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          View Size Guide
        </button>
      </div>
    </div>

    <!-- Price Calculator -->
    <div class="bg-slate-50 rounded-lg p-4">
      <PriceCalculator 
        :base-price="product.price"
        :quantity="quantity"
        :shipping-cost="shippingCost"
        :tax-rate="taxRate"
      />
    </div>

    <!-- Action Buttons -->
    <div class="space-y-4">
      <!-- Primary Actions -->
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          @click="handleAddToCart"
          :disabled="!product.inStock || quantity > product.stockQuantity"
          class="flex-1 bg-emerald-600 text-white px-6 py-4 rounded-md font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          <ShoppingCartIcon class="w-5 h-5" />
          <span>{{ product.inStock ? 'Add to Cart' : 'Out of Stock' }}</span>
        </button>
        
        <button
          @click="handleBuyNow"
          :disabled="!product.inStock || quantity > product.stockQuantity"
          class="flex-1 bg-slate-900 text-white px-6 py-4 rounded-md font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Buy Now
        </button>
      </div>
      
      <!-- Secondary Actions -->
      <div class="grid grid-cols-2 gap-3">
        <button
          @click="handleAddToWishlist"
          class="flex items-center justify-center space-x-2 px-4 py-3 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
          :class="{ 'bg-red-50 border-red-300 text-red-700': isWishlisted }"
        >
          <HeartIcon 
            class="w-5 h-5" 
            :class="{ 'fill-current': isWishlisted }"
          />
          <span class="text-sm font-medium">
            {{ isWishlisted ? 'Wishlisted' : 'Wishlist' }}
          </span>
        </button>
        
        <button
          @click="handleCompare"
          class="flex items-center justify-center space-x-2 px-4 py-3 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ScaleIcon class="w-5 h-5" />
          <span class="text-sm font-medium">Compare</span>
        </button>
      </div>
    </div>

    <!-- Stock Information -->
    <div class="text-sm text-slate-600">
      <div class="flex items-center space-x-2">
        <div 
          class="w-2 h-2 rounded-full"
          :class="stockStatusColor"
        ></div>
        <span>{{ stockStatusText }}</span>
      </div>
      <p class="mt-1">{{ product.stockQuantity }} available</p>
    </div>

    <!-- Shipping Information -->
    <div class="border-t border-slate-200 pt-4">
      <h4 class="text-sm font-medium text-slate-900 mb-2">Shipping & Returns</h4>
      <ul class="space-y-1 text-sm text-slate-600">
        <li class="flex items-center space-x-2">
          <TruckIcon class="w-4 h-4" />
          <span>Free shipping on orders over $1,000</span>
        </li>
        <li class="flex items-center space-x-2">
          <ClockIcon class="w-4 h-4" />
          <span>Delivery in 2-5 business days</span>
        </li>
        <li class="flex items-center space-x-2">
          <ArrowPathIcon class="w-4 h-4" />
          <span>30-day return policy</span>
        </li>
        <li class="flex items-center space-x-2">
          <ShieldCheckIcon class="w-4 h-4" />
          <span>Insured shipping included</span>
        </li>
      </ul>
    </div>

    <!-- Authentication Modal -->
    <div v-if="showAuth" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4">Sign in required</h3>
        <p class="text-slate-600 mb-4">Please sign in to add items to your cart or wishlist.</p>
        <div class="flex space-x-3">
          <button
            @click="showAuth = false"
            class="flex-1 px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <router-link
            to="/login"
            class="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-md text-center hover:bg-emerald-700 transition-colors"
          >
            Sign In
          </router-link>
        </div>
      </div>
    </div>

    <!-- Size Guide Modal -->
    <SizeGuide 
      v-if="showSizeGuide"
      :product="product"
      @close="showSizeGuide = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  ScaleIcon, 
  TruckIcon, 
  ClockIcon, 
  ArrowPathIcon,
  ShieldCheckIcon 
} from '@heroicons/vue/24/outline'
import QuantitySelector from '../ui/QuantitySelector.vue'
import PriceCalculator from '../ui/PriceCalculator.vue'
import SizeGuide from '../ui/SizeGuide.vue'
import { useCart } from '@/composables/useCart'

interface Product {
  id: string
  name: string
  price: number
  inStock: boolean
  stockQuantity: number
}

interface Props {
  product: Product
}

const props = defineProps<Props>()
const emit = defineEmits<{
  addToCart: [quantity: number]
  addToWishlist: []
}>()

const router = useRouter()
const { addToCart } = useCart()

// Local state
const quantity = ref(1)
const isWishlisted = ref(false)
const showAuth = ref(false)
const showSizeGuide = ref(false)

// Computed values
const shippingCost = computed(() => {
  return props.product.price >= 1000 ? 0 : 25
})

const taxRate = computed(() => 0.08) // 8% tax rate

const stockStatusColor = computed(() => {
  if (props.product.stockQuantity > 10) return 'bg-green-500'
  if (props.product.stockQuantity > 5) return 'bg-yellow-500'
  return 'bg-red-500'
})

const stockStatusText = computed(() => {
  if (props.product.stockQuantity > 10) return 'In stock'
  if (props.product.stockQuantity > 5) return 'Limited stock'
  if (props.product.stockQuantity > 0) return 'Low stock'
  return 'Out of stock'
})

// Event handlers
const handleAddToCart = () => {
  // Check if user is authenticated (mock check)
  const isAuthenticated = localStorage.getItem('user') !== null
  
  if (!isAuthenticated) {
    showAuth.value = true
    return
  }

  addToCart({
    id: props.product.id,
    name: props.product.name,
    price: props.product.price,
    image: '', // Would be populated from product images
    quantity: quantity.value
  })
  
  emit('addToCart', quantity.value)
  
  // Show success notification
  // Implementation would depend on notification system
}

const handleBuyNow = () => {
  handleAddToCart()
  if (localStorage.getItem('user')) {
    router.push('/checkout')
  }
}

const handleAddToWishlist = () => {
  const isAuthenticated = localStorage.getItem('user') !== null
  
  if (!isAuthenticated) {
    showAuth.value = true
    return
  }
  
  isWishlisted.value = !isWishlisted.value
  emit('addToWishlist')
}

const handleCompare = () => {
  // Implementation for product comparison
  console.log('Adding to comparison:', props.product.id)
}
</script>