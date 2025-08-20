<template>
  <div class="cart-page">
    <div class="container mx-auto px-4 py-8">
      <!-- Breadcrumb -->
      <nav class="text-sm mb-6">
        <router-link to="/" class="text-gray-500 hover:text-primary-600">Home</router-link>
        <span class="mx-2">→</span>
        <span class="text-gray-900">Shopping Cart</span>
      </nav>

      <h1 class="text-3xl font-semibold mb-8">Shopping Cart</h1>

      <div v-if="isEmpty">
        <CartEmpty />
        <!-- Recently Viewed Items -->
        <div class="mt-12">
          <h2 class="text-2xl font-semibold mb-6">Recently Viewed Items</h2>
          <RecentlyViewed />
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <!-- Cart Items -->
          <div class="space-y-4">
            <CartItem
              v-for="item in cartItems"
              :key="item.id"
              :item="item"
              @update-quantity="updateItemQuantity"
              @remove-item="removeFromCart"
              @save-for-later="saveForLater"
            />
          </div>

          <!-- Saved For Later -->
          <div v-if="savedItems.length > 0" class="mt-8">
            <h2 class="text-xl font-semibold mb-4">Saved For Later</h2>
            <div class="space-y-4">
              <CartItem
                v-for="item in savedItems"
                :key="item.id"
                :item="item"
                :is-saved="true"
                @move-to-cart="moveToCart"
                @remove-item="removeFromSaved"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-8 flex flex-wrap gap-4">
            <button
              @click="clearCart"
              class="text-red-600 hover:text-red-700"
            >
              Clear Cart
            </button>
            <router-link
              to="/products"
              class="text-primary-600 hover:text-primary-700"
            >
              Continue Shopping
            </router-link>
          </div>
        </div>

        <div class="lg:col-span-1">
          <!-- Cart Summary -->
          <div class="sticky top-4">
            <CartSummery
              :subtotal="subtotal"
              :tax="tax"
              :shipping="shipping"
              :total="total"
              @proceed-to-checkout="proceedToCheckout"
            />

            <!-- Discount Code -->
            <div class="mt-4">
              <input
                v-model="discountCode"
                type="text"
                placeholder="Enter discount code"
                class="w-full px-4 py-2 border rounded-md"
              />
              <button
                @click="applyDiscount"
                class="w-full mt-2 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200"
              >
                Apply Discount
              </button>
            </div>

            <!-- Payment Methods Preview -->
            <div class="mt-6">
              <h3 class="text-sm font-medium text-gray-700 mb-2">We Accept</h3>
              <div class="flex gap-2">
                <img src="@/assets/images/payment/visa.svg" alt="Visa" class="h-8">
                <img src="@/assets/images/payment/mastercard.svg" alt="Mastercard" class="h-8">
                <img src="@/assets/images/payment/amex.svg" alt="American Express" class="h-8">
                <img src="@/assets/images/payment/paypal.svg" alt="PayPal" class="h-8">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Recommendations -->
      <div class="mt-16">
        <h2 class="text-2xl font-semibold mb-6">You Might Also Like</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ProductCard
            v-for="product in recommendedProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </div>

    <!-- Authentication Modal -->
    <AuthModal v-if="showAuthModal" @close="showAuthModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import CartEmpty from '@/components/cart/CartEmpty.vue'
import CartItem from '@/components/cart/CartItem.vue'
import CartSummery from '@/components/cart/CartSummery.vue'
import RecentlyViewed from '@/components/dashboard/RecentlyViewed.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import AuthModal from '@/components/auth/AuthModal.vue'
import { useCart } from '@/composables/useCart'
import { useProducts } from '@/composables/useProducts'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { cartItems, updateQuantity, removeItem, savedItems, moveToCart, saveForLater, clearAll } = useCart()
const { getRecommendedProducts } = useProducts()
const { isAuthenticated } = useAuth()

const discountCode = ref('')
const showAuthModal = ref(false)
const recommendedProducts = ref([])

const isEmpty = computed(() => cartItems.value.length === 0)
const subtotal = computed(() => 
  cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
)
const tax = computed(() => subtotal.value * 0.1) // 10% tax
const shipping = computed(() => isEmpty.value ? 0 : 15) // Fixed shipping
const total = computed(() => subtotal.value + tax.value + shipping.value)

const updateItemQuantity = (itemId: string, quantity: number) => {
  updateQuantity(itemId, quantity)
}

const removeFromCart = (itemId: string) => {
  removeItem(itemId)
}

const removeFromSaved = (itemId: string) => {
  // Implement remove from saved items
}

const proceedToCheckout = () => {
  if (!isAuthenticated.value) {
    showAuthModal.value = true
    return
  }
  router.push('/checkout')
}

const clearCart = () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    clearAll()
  }
}

const applyDiscount = () => {
  // Implement discount logic
}

onMounted(async () => {
  recommendedProducts.value = await getRecommendedProducts()
})
</script>
