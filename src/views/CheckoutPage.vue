<template>
  <div class="checkout-page">
    <CheckoutLayout>
      <!-- Order Progress -->
      <div class="bg-gray-50 border-b">
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between text-sm">
            <span>Order ID: #{{ orderId }}</span>
            <span>Estimated Delivery: {{ estimatedDelivery }}</span>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 py-8">
        <!-- Steps -->
        <CheckoutSteps 
          :currentStep="currentStep" 
          :completedSteps="completedSteps" 
        />

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <!-- Checkout Form -->
          <div class="lg:col-span-2">
            <div v-if="error" class="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
              {{ error }}
            </div>

            <component
              :is="currentComponent"
              :loading="loading"
              :shippingData="shippingData"
              :paymentData="paymentData"
              :billingData="billingData"
              @next-step="nextStep"
              @prev-step="prevStep"
              @update-shipping="updateShipping"
              @update-payment="updatePayment"
              @update-billing="updateBilling"
            />
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="sticky top-4 space-y-6">
              <!-- Cart Summary -->
              <CartSummery
                :subtotal="cartData.subtotal"
                :tax="cartData.tax"
                :shipping="cartData.shipping"
                :discount="cartData.discount"
                :total="cartData.total"
                :readonly="true"
              />

              <!-- Order Items Preview -->
              <div class="bg-white rounded-lg shadow p-4">
                <h3 class="text-lg font-semibold mb-4">Order Items</h3>
                <div class="space-y-4">
                  <div 
                    v-for="item in cartItems" 
                    :key="item.id"
                    class="flex items-center gap-4"
                  >
                    <img 
                      :src="item.image" 
                      :alt="item.name"
                      class="w-16 h-16 object-cover rounded"
                    />
                    <div class="flex-1">
                      <h4 class="font-medium">{{ item.name }}</h4>
                      <p class="text-sm text-gray-500">
                        Qty: {{ item.quantity }}
                      </p>
                    </div>
                    <span class="font-medium">${{ item.price * item.quantity }}</span>
                  </div>
                </div>
              </div>

              <!-- Delivery Info -->
              <div class="bg-white rounded-lg shadow p-4">
                <h3 class="text-lg font-semibold mb-4">Delivery Information</h3>
                <div class="text-sm space-y-2">
                  <p v-if="shippingData.address">
                    <span class="font-medium">Address:</span><br/>
                    {{ shippingData.address }}
                  </p>
                  <p v-if="selectedShipping">
                    <span class="font-medium">Method:</span><br/>
                    {{ selectedShipping.name }} ({{ selectedShipping.duration }})
                  </p>
                </div>
              </div>

              <!-- Support -->
              <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-medium mb-2">Need Help?</h3>
                <p class="text-sm text-gray-600 mb-3">
                  Our customer service is available 24/7
                </p>
                <router-link 
                  to="/contact" 
                  class="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Contact Support →
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CheckoutLayout>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 class="text-xl font-semibold mb-4">Confirm Order</h2>
        <p class="mb-6">
          Are you sure you want to place this order? The total amount of 
          ${{ cartData.total }} will be charged to your card.
        </p>
        <div class="flex justify-end gap-4">
          <button 
            @click="showConfirmation = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-700"
          >
            Cancel
          </button>
          <button
            @click="placeOrder"
            :disabled="loading"
            class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {{ loading ? 'Processing...' : 'Confirm Order' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import CheckoutLayout from '@/components/checkout/CheckoutLayout.vue'
import CheckoutSteps from '@/components/checkout/CheckoutSteps.vue'
import CheckoutShipping from '@/components/checkout/CheckoutShipping.vue'
import CheckoutPayment from '@/components/checkout/CheckoutPayment.vue'
import CheckoutReview from '@/components/checkout/CheckoutReview.vue'
import CartSummery from '@/components/cart/CartSummery.vue'
import { useCart } from '@/composables/useCart'
import { useCheckout } from '@/composables/useCheckout'
import { usePayment } from '@/composables/usePayment'

const router = useRouter()
const { cartItems, cartData } = useCart()
const { createOrder, validateOrder } = useCheckout()
const { processPayment } = usePayment()

const currentStep = ref(1)
const completedSteps = ref<number[]>([])
const loading = ref(false)
const error = ref('')
const showConfirmation = ref(false)
const orderId = ref(generateOrderId())
const estimatedDelivery = ref(calculateEstimatedDelivery())

// Form Data
const shippingData = ref({
  address: '',
  city: '',
  state: '',
  zip: '',
  country: ''
})

const paymentData = ref({
  cardNumber: '',
  expiry: '',
  cvv: '',
  name: ''
})

const billingData = ref({
  sameAsShipping: true,
  address: '',
  city: '',
  state: '',
  zip: '',
  country: ''
})

const selectedShipping = ref(null)

const currentComponent = computed(() => {
  switch (currentStep.value) {
    case 1:
      return CheckoutShipping
    case 2:
      return CheckoutPayment
    case 3:
      return CheckoutReview
    default:
      return CheckoutShipping
  }
})

const nextStep = async () => {
  if (loading.value) return

  try {
    loading.value = true
    error.value = ''

    if (currentStep.value === 1) {
      // Validate shipping data
      await validateShippingData()
      completedSteps.value.push(1)
    } else if (currentStep.value === 2) {
      // Validate payment data
      await validatePaymentData()
      completedSteps.value.push(2)
    } else if (currentStep.value === 3) {
      showConfirmation.value = true
      return
    }

    if (currentStep.value < 3) {
      currentStep.value++
    }
  } catch (err: any) {
    error.value = err.message || 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const updateShipping = (data: any) => {
  shippingData.value = { ...shippingData.value, ...data }
}

const updatePayment = (data: any) => {
  paymentData.value = { ...paymentData.value, ...data }
}

const updateBilling = (data: any) => {
  billingData.value = { ...billingData.value, ...data }
}

const validateShippingData = async () => {
  // Implement shipping validation logic
  if (!shippingData.value.address) {
    throw new Error('Please enter a shipping address')
  }
}

const validatePaymentData = async () => {
  // Implement payment validation logic
  if (!paymentData.value.cardNumber) {
    throw new Error('Please enter payment information')
  }
}

const placeOrder = async () => {
  if (loading.value) return

  try {
    loading.value = true
    error.value = ''

    // Validate final order
    await validateOrder({
      shipping: shippingData.value,
      payment: paymentData.value,
      billing: billingData.value,
      items: cartItems.value
    })

    // Process payment
    await processPayment(paymentData.value, cartData.total)

    // Create order
    const order = await createOrder({
      orderId: orderId.value,
      shipping: shippingData.value,
      payment: paymentData.value,
      billing: billingData.value,
      items: cartItems.value,
      total: cartData.total
    })

    // Navigate to success page
    router.push({
      name: 'checkoutSuccess',
      params: { orderId: order.id }
    })
  } catch (err: any) {
    error.value = err.message || 'Failed to place order. Please try again.'
  } finally {
    loading.value = false
    showConfirmation.value = false
  }
}

function generateOrderId(): string {
  return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
}

function calculateEstimatedDelivery(): string {
  const date = new Date()
  date.setDate(date.getDate() + 5)
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric'
  })
}
</script>
</script>
