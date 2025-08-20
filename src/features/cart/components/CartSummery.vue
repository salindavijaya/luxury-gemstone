<template>
  <div class="bg-slate-50 rounded-lg p-6 space-y-4">
    <!-- Order Summary Header -->
    <h3 class="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
      Order Summary
    </h3>

    <!-- Items Summary -->
    <div class="space-y-3">
      <div class="flex justify-between text-sm">
        <span class="text-slate-600">Subtotal ({{ totalItems }} items)</span>
        <span class="text-slate-800 font-medium">${{ formatPrice(subtotal) }}</span>
      </div>

      <!-- Discount Section -->
      <div v-if="discount > 0" class="flex justify-between text-sm">
        <span class="text-emerald-600">Discount</span>
        <span class="text-emerald-600 font-medium">-${{ formatPrice(discount) }}</span>
      </div>

      <!-- Shipping Section -->
      <div class="flex justify-between text-sm">
        <span class="text-slate-600">Shipping</span>
        <span v-if="shippingCost === 0" class="text-emerald-600 font-medium">Free</span>
        <span v-else class="text-slate-800 font-medium">${{ formatPrice(shippingCost) }}</span>
      </div>

      <!-- Insurance (Gemstone-specific) -->
      <div v-if="insuranceCost > 0" class="flex justify-between text-sm">
        <div class="flex items-center gap-1">
          <span class="text-slate-600">Jewelry Insurance</span>
          <button 
            @click="showInsuranceInfo = !showInsuranceInfo"
            class="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Insurance information"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </button>
        </div>
        <span class="text-slate-800 font-medium">${{ formatPrice(insuranceCost) }}</span>
      </div>

      <!-- Insurance Info Panel -->
      <div v-if="showInsuranceInfo" class="bg-slate-100 rounded-md p-3 text-xs text-slate-600">
        <p class="mb-2">
          <strong>Comprehensive Coverage:</strong> Protection against loss, theft, and damage during transit and beyond.
        </p>
        <ul class="space-y-1 ml-4 list-disc">
          <li>Full replacement value coverage</li>
          <li>Worldwide protection</li>
          <li>No deductible</li>
        </ul>
      </div>

      <!-- Tax Section -->
      <div class="flex justify-between text-sm">
        <span class="text-slate-600">Tax</span>
        <span class="text-slate-800 font-medium">${{ formatPrice(tax) }}</span>
      </div>

      <!-- Special Handling (Gemstone-specific) -->
      <div v-if="specialHandling > 0" class="flex justify-between text-sm">
        <span class="text-slate-600">Secure Packaging</span>
        <span class="text-slate-800 font-medium">${{ formatPrice(specialHandling) }}</span>
      </div>
    </div>

    <!-- Total Section -->
    <div class="border-t border-slate-200 pt-4">
      <div class="flex justify-between items-center">
        <span class="text-lg font-semibold text-slate-800">Total</span>
        <span class="text-2xl font-bold text-emerald-600">${{ formatPrice(total) }}</span>
      </div>
      
      <!-- Savings Display -->
      <div v-if="totalSavings > 0" class="text-right mt-1">
        <span class="text-sm text-emerald-600 font-medium">
          You save ${{ formatPrice(totalSavings) }}
        </span>
      </div>
    </div>

    <!-- Payment Methods -->
    <div class="border-t border-slate-200 pt-4">
      <p class="text-xs text-slate-500 mb-3">We accept:</p>
      <div class="flex flex-wrap gap-2">
        <div class="bg-white rounded border border-slate-200 px-2 py-1">
          <svg class="w-8 h-5" viewBox="0 0 32 20" fill="none">
            <!-- Visa Icon -->
            <rect width="32" height="20" rx="3" fill="#1A1F71"/>
            <path d="M11.7 6.8L10.2 13.2H8.7L7.2 8.9C7.1 8.6 6.9 8.4 6.7 8.3C6.1 8 5.4 7.8 4.7 7.6L4.8 7.4H7.8C8.2 7.4 8.5 7.7 8.6 8.1L9.5 12.1L11.7 6.8H11.7ZM17.8 6.8H16.3L15.2 10.6L14.8 8.9C14.7 8.5 14.4 8.2 14 8.2H11.8L11.9 8.4C12.7 8.6 13.4 9 14 9.4L15.4 13.2H16.9L19.1 6.8H17.8ZM23.2 6.8C22.8 6.8 22.5 7.1 22.4 7.5L20.2 13.2H21.7L22.1 12.1H24L24.2 13.2H25.5L24.4 6.8H23.2ZM22.5 11H23.6L23.3 9.8L22.5 11Z" fill="white"/>
          </svg>
        </div>
        <div class="bg-white rounded border border-slate-200 px-2 py-1">
          <svg class="w-8 h-5" viewBox="0 0 32 20" fill="none">
            <!-- Mastercard Icon -->
            <rect width="32" height="20" rx="3" fill="#EB001B"/>
            <circle cx="12" cy="10" r="6" fill="#EB001B"/>
            <circle cx="20" cy="10" r="6" fill="#FF5F00"/>
            <circle cx="16" cy="10" r="6" fill="#F79E1B"/>
          </svg>
        </div>
        <div class="bg-white rounded border border-slate-200 px-2 py-1">
          <svg class="w-8 h-5" viewBox="0 0 32 20" fill="none">
            <!-- Amex Icon -->
            <rect width="32" height="20" rx="3" fill="#006FCF"/>
            <path d="M8 7H12L10 10L12 13H8L6 10L8 7ZM16 7H20V8.5H16V7ZM16 9H19V10.5H16V9ZM16 11H20V12.5H16V11Z" fill="white"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Security Badges -->
    <div class="border-t border-slate-200 pt-4">
      <div class="flex items-center justify-center gap-4 text-xs text-slate-500">
        <div class="flex items-center gap-1">
          <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
          </svg>
          <span>SSL Secured</span>
        </div>
        <div class="flex items-center gap-1">
          <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span>Verified Secure</span>
        </div>
      </div>
    </div>

    <!-- Gemstone Authenticity Guarantee -->
    <div class="border-t border-slate-200 pt-4">
      <div class="bg-amber-50 border border-amber-200 rounded-md p-3">
        <div class="flex items-start gap-2">
          <svg class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <h4 class="text-sm font-semibold text-amber-800">Authenticity Guarantee</h4>
            <p class="text-xs text-amber-700 mt-1">
              All gemstones come with certified authenticity and 30-day return policy.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Promo Code Section -->
    <div class="border-t border-slate-200 pt-4">
      <div v-if="!showPromoInput" class="text-center">
        <button 
          @click="showPromoInput = true"
          class="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
        >
          Have a promo code?
        </button>
      </div>
      
      <div v-else class="space-y-2">
        <div class="flex gap-2">
          <input
            v-model="promoCode"
            type="text"
            placeholder="Enter promo code"
            class="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            :disabled="isApplyingPromo"
          >
          <button
            @click="applyPromoCode"
            :disabled="!promoCode.trim() || isApplyingPromo"
            class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="isApplyingPromo">...</span>
            <span v-else>Apply</span>
          </button>
        </div>
        
        <!-- Promo Error -->
        <p v-if="promoError" class="text-xs text-red-600">{{ promoError }}</p>
        
        <!-- Applied Promo -->
        <div v-if="appliedPromo" class="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span class="text-sm text-emerald-800 font-medium">{{ appliedPromo.code }}</span>
          </div>
          <button 
            @click="removePromoCode"
            class="text-emerald-700 hover:text-emerald-800 transition-colors"
            aria-label="Remove promo code"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface PromoCode {
  code: string
  discount: number
  type: 'percentage' | 'fixed'
}

interface Props {
  subtotal: number
  shippingCost?: number
  tax?: number
  discount?: number
  insuranceCost?: number
  specialHandling?: number
  totalItems: number
}

const props = withDefaults(defineProps<Props>(), {
  shippingCost: 0,
  tax: 0,
  discount: 0,
  insuranceCost: 0,
  specialHandling: 0
})

// Reactive state
const showInsuranceInfo = ref(false)
const showPromoInput = ref(false)
const promoCode = ref('')
const isApplyingPromo = ref(false)
const promoError = ref('')
const appliedPromo = ref<PromoCode | null>(null)

// Computed properties
const total = computed(() => 
  props.subtotal + props.shippingCost + props.tax + props.insuranceCost + props.specialHandling - props.discount
)

const totalSavings = computed(() => props.discount)

// Mock promo codes for demonstration
const validPromoCodes: PromoCode[] = [
  { code: 'WELCOME10', discount: 10, type: 'percentage' },
  { code: 'SAVE50', discount: 50, type: 'fixed' },
  { code: 'LUXURY15', discount: 15, type: 'percentage' }
]

// Methods
const formatPrice = (price: number): string => {
  return price.toFixed(2)
}

const applyPromoCode = async () => {
  isApplyingPromo.value = true
  promoError.value = ''
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const promo = validPromoCodes.find(p => p.code.toLowerCase() === promoCode.value.toLowerCase())
  
  if (promo) {
    appliedPromo.value = promo
    showPromoInput.value = false
    promoCode.value = ''
  } else {
    promoError.value = 'Invalid promo code'
  }
  
  isApplyingPromo.value = false
}

const removePromoCode = () => {
  appliedPromo.value = null
  showPromoInput.value = false
  promoCode.value = ''
  promoError.value = ''
}
</script>

<style scoped>
/* Custom styles for enhanced visual hierarchy */
.bg-slate-50 {
  background-color: rgb(248 250 252);
}
</style>