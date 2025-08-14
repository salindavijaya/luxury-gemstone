<template>
  <div class="space-y-6">
    <!-- Order Summary -->
    <div class="bg-white rounded-lg shadow-sm border">
      <div class="p-6 border-b border-slate-200">
        <h2 class="text-xl font-semibold text-slate-800">Review Your Order</h2>
        <p class="text-sm text-slate-600 mt-1">Please review all details before completing your purchase</p>
      </div>

      <div class="p-6 space-y-6">
        <!-- Cart Items -->
        <div>
          <h3 class="font-medium text-slate-800 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V10a1 1 0 011-1z"/>
            </svg>
            Items ({{ cartStore.itemCount }})
          </h3>
          <div class="space-y-4">
            <div 
              v-for="item in cartStore.items" 
              :key="item.id"
              class="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg"
            >
              <img 
                :src="item.image" 
                :alt="item.name"
                class="w-16 h-16 object-cover rounded-lg border"
              >
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-slate-800 truncate">{{ item.name }}</h4>
                <p class="text-sm text-slate-600">{{ item.gemstone }} • {{ item.certification }}</p>
                <div class="flex items-center space-x-4 mt-1">
                  <span class="text-sm text-slate-500">Qty: {{ item.quantity }}</span>
                  <span v-if="item.insurance" class="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                    Insurance Included
                  </span>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-slate-800">${{ (item.price * item.quantity).toLocaleString() }}</p>
                <p v-if="item.quantity > 1" class="text-sm text-slate-500">${{ item.price.toLocaleString() }} each</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Shipping Information -->
        <div class="border-t border-slate-200 pt-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-medium text-slate-800 flex items-center">
              <svg class="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              Shipping Information
            </h3>
            <button 
              @click="editShipping"
              class="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Edit
            </button>
          </div>
          <div class="bg-slate-50 rounded-lg p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-medium text-slate-700 mb-2">Shipping Address</h4>
                <div class="text-sm text-slate-600 space-y-1">
                  <p>{{ shippingAddress.firstName }} {{ shippingAddress.lastName }}</p>
                  <p v-if="shippingAddress.company">{{ shippingAddress.company }}</p>
                  <p>{{ shippingAddress.address1 }}</p>
                  <p v-if="shippingAddress.address2">{{ shippingAddress.address2 }}</p>
                  <p>{{ shippingAddress.city }}, {{ shippingAddress.state }} {{ shippingAddress.zipCode }}</p>
                  <p>{{ shippingAddress.country }}</p>
                  <p v-if="shippingAddress.phone" class="mt-2">
                    <span class="text-slate-500">Phone:</span> {{ shippingAddress.phone }}
                  </p>
                </div>
              </div>
              <div>
                <h4 class="font-medium text-slate-700 mb-2">Shipping Method</h4>
                <div class="text-sm text-slate-600">
                  <p class="font-medium">{{ selectedShipping.name }}</p>
                  <p>{{ selectedShipping.description }}</p>
                  <p class="text-emerald-600 font-medium mt-1">
                    {{ selectedShipping.price === 0 ? 'Free' : `${selectedShipping.price}` }}
                  </p>
                  <p v-if="selectedShipping.estimatedDelivery" class="text-slate-500 mt-1">
                    Estimated delivery: {{ selectedShipping.estimatedDelivery }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Information -->
        <div class="border-t border-slate-200 pt-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-medium text-slate-800 flex items-center">
              <svg class="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
              </svg>
              Payment Information
            </h3>
            <button 
              @click="editPayment"
              class="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Edit
            </button>
          </div>
          <div class="bg-slate-50 rounded-lg p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-medium text-slate-700 mb-2">Payment Method</h4>
                <div class="flex items-center space-x-3">
                  <div 
                    v-if="paymentData.method === 'card'"
                    class="flex items-center space-x-2"
                  >
                    <svg class="w-8 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                    </svg>
                    <span class="text-sm text-slate-600">
                      •••• •••• •••• {{ paymentData.cardData?.number?.slice(-4) }}
                    </span>
                  </div>
                  <div 
                    v-else-if="paymentData.method === 'paypal'"
                    class="flex items-center space-x-2"
                  >
                    <svg class="w-8 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a9.124 9.124 0 0 1-.077.437c-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9L7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287z"/>
                    </svg>
                    <span class="text-sm text-slate-600">PayPal</span>
                  </div>
                  <div 
                    v-else-if="paymentData.method === 'applepay'"
                    class="flex items-center space-x-2"
                  >
                    <svg class="w-8 h-5 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <span class="text-sm text-slate-600">Apple Pay</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 class="font-medium text-slate-700 mb-2">Billing Address</h4>
                <div class="text-sm text-slate-600">
                  <p v-if="paymentData.sameAsShipping">Same as shipping address</p>
                  <div v-else class="space-y-1">
                    <p>{{ billingAddress.firstName }} {{ billingAddress.lastName }}</p>
                    <p v-if="billingAddress.company">{{ billingAddress.company }}</p>
                    <p>{{ billingAddress.address1 }}</p>
                    <p v-if="billingAddress.address2">{{ billingAddress.address2 }}</p>
                    <p>{{ billingAddress.city }}, {{ billingAddress.state }} {{ billingAddress.zipCode }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Preferences -->
        <div v-if="orderPreferences.notes || orderPreferences.isGift" class="border-t border-slate-200 pt-6">
          <h3 class="font-medium text-slate-800 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Order Preferences
          </h3>
          <div class="bg-slate-50 rounded-lg p-4 space-y-3">
            <div v-if="orderPreferences.notes">
              <h4 class="font-medium text-slate-700 mb-1">Order Notes</h4>
              <p class="text-sm text-slate-600">{{ orderPreferences.notes }}</p>
            </div>
            <div v-if="orderPreferences.isGift">
              <h4 class="font-medium text-slate-700 mb-1">Gift Options</h4>
              <div class="space-y-2">
                <p class="text-sm text-slate-600">
                  <span class="font-medium">Gift Wrapping:</span> {{ getGiftWrapName(orderPreferences.giftWrap) }}
                </p>
                <div v-if="orderPreferences.giftMessage">
                  <p class="text-sm font-medium text-slate-700">Gift Message:</p>
                  <p class="text-sm text-slate-600 italic mt-1">"{{ orderPreferences.giftMessage }}"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Total -->
    <div class="bg-white rounded-lg shadow-sm border">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-4">Order Total</h3>
        <div class="space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-slate-600">Subtotal ({{ cartStore.itemCount }} items)</span>
            <span class="text-slate-800">${{ cartStore.subtotal.toLocaleString() }}</span>
          </div>
          <div v-if="cartStore.discount > 0" class="flex justify-between text-sm">
            <span class="text-slate-600">Discount</span>
            <span class="text-emerald-600">-${{ cartStore.discount.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-600">Shipping</span>
            <span class="text-slate-800">
              {{ selectedShipping.price === 0 ? 'Free' : `${selectedShipping.price.toLocaleString()}` }}
            </span>
          </div>
          <div v-if="giftWrapCost > 0" class="flex justify-between text-sm">
            <span class="text-slate-600">Gift Wrapping</span>
            <span class="text-slate-800">${{ giftWrapCost.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-600">Tax</span>
            <span class="text-slate-800">${{ cartStore.tax.toLocaleString() }}</span>
          </div>
          <div class="border-t border-slate-200 pt-3">
            <div class="flex justify-between text-lg font-semibold">
              <span class="text-slate-800">Total</span>
              <span class="text-slate-800">${{ finalTotal.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Terms and Conditions -->
    <div class="bg-slate-50 rounded-lg border p-4">
      <label class="flex items-start space-x-3">
        <input
          v-model="agreedToTerms"
          type="checkbox"
          class="mt-1 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
          required
        >
        <div class="text-sm text-slate-600">
          <p>
            I agree to the 
            <a href="/terms" target="_blank" class="text-emerald-600 hover:text-emerald-700 underline">Terms and Conditions</a>, 
            <a href="/privacy" target="_blank" class="text-emerald-600 hover:text-emerald-700 underline">Privacy Policy</a>, 
            and 
            <a href="/return-policy" target="_blank" class="text-emerald-600 hover:text-emerald-700 underline">Return Policy</a>.
          </p>
          <p class="mt-1">
            I understand that all gemstones are certified authentic and come with a 30-day return guarantee.
          </p>
        </div>
      </label>
    </div>

    <!-- Place Order Button -->
    <div class="sticky bottom-0 bg-white border-t border-slate-200 p-4 -mx-4">
      <button
        @click="placeOrder"
        :disabled="!agreedToTerms || isProcessingOrder"
        :class="[
          'w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200',
          agreedToTerms && !isProcessingOrder
            ? 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg transform hover:-translate-y-0.5'
            : 'bg-slate-400 cursor-not-allowed'
        ]"
      >
        <span v-if="isProcessingOrder" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing Order...
        </span>
        <span v-else>
          Complete Purchase • ${{ finalTotal.toLocaleString() }}
        </span>
      </button>
    </div>

    <!-- Security Notice -->
    <div class="text-center">
      <div class="inline-flex items-center space-x-2 text-xs text-slate-500">
        <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
        </svg>
        <span>Your order is secured with 256-bit SSL encryption</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useCheckoutStore } from '@/stores/checkout'

// Router and stores
const router = useRouter()
const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()

// Reactive state
const agreedToTerms = ref(false)
const isProcessingOrder = ref(false)

// Mock data (in a real app, these would come from the store)
const giftWrapOptions = {
  elegant: { name: 'Elegant Box', price: 15 },
  luxury: { name: 'Luxury Velvet', price: 25 },
  premium: { name: 'Premium Wooden', price: 35 }
}

// Computed properties
const shippingAddress = computed(() => checkoutStore.shippingAddress || {})
const selectedShipping = computed(() => checkoutStore.selectedShipping || {})
const paymentData = computed(() => checkoutStore.paymentData || {})
const billingAddress = computed(() => checkoutStore.billingAddress || {})
const orderPreferences = computed(() => checkoutStore.orderPreferences || {})

const giftWrapCost = computed(() => {
  if (!orderPreferences.value.isGift || !orderPreferences.value.giftWrap) return 0
  return giftWrapOptions[orderPreferences.value.giftWrap as keyof typeof giftWrapOptions]?.price || 0
})

const finalTotal = computed(() => {
  return cartStore.total + (selectedShipping.value.price || 0) + giftWrapCost.value
})

// Methods
const getGiftWrapName = (wrapId: string) => {
  return giftWrapOptions[wrapId as keyof typeof giftWrapOptions]?.name || 'Unknown'
}

const editShipping = () => {
  checkoutStore.setCurrentStep(1)
}

const editPayment = () => {
  checkoutStore.setCurrentStep(2)
}

/**
 * Process the order and redirect to success page
 */
const placeOrder = async () => {
  if (!agreedToTerms.value) return

  isProcessingOrder.value = true
  
  try {
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Create order object
    const order = {
      id: `ORDER-${Date.now()}`,
      items: cartStore.items,
      shippingAddress: shippingAddress.value,
      billingAddress: paymentData.value.sameAsShipping ? shippingAddress.value : billingAddress.value,
      shippingMethod: selectedShipping.value,
      paymentMethod: paymentData.value,
      orderPreferences: orderPreferences.value,
      subtotal: cartStore.subtotal,
      shipping: selectedShipping.value.price || 0,
      tax: cartStore.tax,
      giftWrap: giftWrapCost.value,
      total: finalTotal.value,
      status: 'processing',
      createdAt: new Date().toISOString()
    }
    
    // Save order to checkout store
    checkoutStore.completeOrder(order)
    
    // Clear cart
    await cartStore.clearCart()
    
    // Redirect to success page
    router.push('/checkout/success')
    
  } catch (error) {
    console.error('Order processing failed:', error)
    // Handle error - show notification, etc.
  } finally {
    isProcessingOrder.value = false
  }
}

// Emit events for parent component
const emit = defineEmits<{
  'validation-change': [isValid: boolean]
}>()

// Watch for validation changes
const isValid = computed(() => agreedToTerms.value && !isProcessingOrder.value)

// Initialize component
onMounted(() => {
  emit('validation-change', isValid.value)
})
</script>

<style scoped>
/* Smooth animations for interactive elements */
.transition-all {
  transition: all 0.2s ease;
}

/* Enhanced button hover effects */
button:not(:disabled):hover {
  transform: translateY(-2px);
}

button:disabled {
  transform: none;
}

/* Sticky footer shadow */
.sticky {
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Focus styles for accessibility */
input:focus,
button:focus,
a:focus {
  outline: 2px solid #059669;
  outline-offset: 2px;
}

/* Enhanced card styling */
.bg-slate-50 {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* Order summary styling */
.order-summary-item {
  transition: background-color 0.2s ease;
}

.order-summary-item:hover {
  background-color: rgba(15, 23, 42, 0.02);
}
</style>