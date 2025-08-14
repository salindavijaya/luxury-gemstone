<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-slate-800">Shipping Options</h3>
    
    <div class="space-y-3">
      <div
        v-for="option in shippingOptions"
        :key="option.id"
        class="relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200"
        :class="[
          selectedOption?.id === option.id
            ? 'border-emerald-600 bg-emerald-50'
            : 'border-slate-200 hover:border-slate-300'
        ]"
        @click="selectOption(option)"
        role="radio"
        :aria-checked="selectedOption?.id === option.id"
        tabindex="0"
        @keydown.enter="selectOption(option)"
        @keydown.space.prevent="selectOption(option)"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-3">
            <div
              class="flex h-5 w-5 items-center justify-center rounded-full border-2 mt-0.5"
              :class="[
                selectedOption?.id === option.id
                  ? 'border-emerald-600 bg-emerald-600'
                  : 'border-slate-300'
              ]"
            >
              <div
                v-if="selectedOption?.id === option.id"
                class="h-2 w-2 rounded-full bg-white"
              ></div>
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-2">
                <h4 class="font-semibold text-slate-800">{{ option.name }}</h4>
                <span
                  v-if="option.recommended"
                  class="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-md"
                >
                  Recommended
                </span>
                <span
                  v-if="option.secure"
                  class="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-md"
                >
                  Secure
                </span>
              </div>
              
              <p class="text-sm text-slate-600 mt-1">{{ option.description }}</p>
              
              <div class="flex items-center justify-between mt-2">
                <div class="text-sm text-slate-500">
                  <span>{{ option.deliveryTime }}</span>
                  <span v-if="option.tracking" class="ml-2">• Tracking included</span>
                  <span v-if="option.insurance" class="ml-2">• Insured up to {{ formatCurrency(option.insuranceLimit) }}</span>
                </div>
              </div>
              
              <div v-if="option.features?.length" class="mt-2">
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="feature in option.features"
                    :key="feature"
                    class="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded"
                  >
                    {{ feature }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="text-right ml-4">
            <div class="font-semibold text-slate-800">
              {{ option.price === 0 ? 'Free' : formatCurrency(option.price) }}
            </div>
            <div v-if="option.originalPrice && option.originalPrice > option.price" class="text-sm text-slate-400 line-through">
              {{ formatCurrency(option.originalPrice) }}
            </div>
          </div>
        </div>
        
        <!-- Delivery Date Estimate -->
        <div v-if="option.estimatedDelivery" class="mt-3 pt-3 border-t border-slate-200">
          <div class="flex items-center space-x-2 text-sm text-slate-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Estimated delivery: {{ formatDate(option.estimatedDelivery) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Special Instructions -->
    <div class="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <div class="flex items-start space-x-2">
        <svg class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <div>
          <h4 class="text-sm font-medium text-amber-800">Important for Luxury Gemstones</h4>
          <p class="text-sm text-amber-700 mt-1">
            All shipments include signature confirmation and tamper-evident packaging. 
            For orders over $5,000, we recommend insured shipping with additional security measures.
          </p>
        </div>
      </div>
    </div>
    
    <!-- Delivery Instructions -->
    <div class="mt-4">
      <label for="delivery-instructions" class="block text-sm font-medium text-slate-700 mb-2">
        Special Delivery Instructions (Optional)
      </label>
      <textarea
        id="delivery-instructions"
        v-model="deliveryInstructions"
        rows="3"
        class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
        placeholder="e.g., Leave with doorman, Ring doorbell twice, etc."
        @input="$emit('update:deliveryInstructions', deliveryInstructions)"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface ShippingOption {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  deliveryTime: string
  estimatedDelivery?: Date
  tracking: boolean
  insurance: boolean
  insuranceLimit?: number
  secure: boolean
  recommended?: boolean
  features?: string[]
}

interface Props {
  modelValue?: ShippingOption | null
  cartTotal: number
  deliveryInstructions?: string
}

interface Emits {
  (e: 'update:modelValue', value: ShippingOption | null): void
  (e: 'update:deliveryInstructions', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  deliveryInstructions: ''
})

const emit = defineEmits<Emits>()

const selectedOption = ref<ShippingOption | null>(props.modelValue)
const deliveryInstructions = ref(props.deliveryInstructions)

// Calculate estimated delivery dates
const calculateDeliveryDate = (businessDays: number): Date => {
  const date = new Date()
  let addedDays = 0
  
  while (addedDays < businessDays) {
    date.setDate(date.getDate() + 1)
    // Skip weekends
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      addedDays++
    }
  }
  
  return date
}

// Shipping options with gemstone-specific features
const shippingOptions = computed<ShippingOption[]>(() => [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'Signature required delivery via USPS Priority Mail',
    price: props.cartTotal >= 1000 ? 0 : 15.99,
    originalPrice: props.cartTotal >= 1000 ? 15.99 : undefined,
    deliveryTime: '3-5 business days',
    estimatedDelivery: calculateDeliveryDate(4),
    tracking: true,
    insurance: true,
    insuranceLimit: 1000,
    secure: true,
    recommended: props.cartTotal < 2500,
    features: ['Signature Required', 'Basic Insurance']
  },
  {
    id: 'expedited',
    name: 'Expedited Shipping',
    description: 'Priority overnight delivery with enhanced security',
    price: 29.99,
    deliveryTime: '1-2 business days',
    estimatedDelivery: calculateDeliveryDate(2),
    tracking: true,
    insurance: true,
    insuranceLimit: 5000,
    secure: true,
    recommended: props.cartTotal >= 2500 && props.cartTotal < 10000,
    features: ['Express Delivery', 'Enhanced Insurance', 'Priority Handling']
  },
  {
    id: 'premium-secure',
    name: 'Premium Secure Delivery',
    description: 'White-glove delivery service with armed courier for high-value items',
    price: 149.99,
    deliveryTime: '1-2 business days',
    estimatedDelivery: calculateDeliveryDate(2),
    tracking: true,
    insurance: true,
    insuranceLimit: 100000,
    secure: true,
    recommended: props.cartTotal >= 10000,
    features: [
      'Armed Courier',
      'Full Insurance Coverage',
      'Real-time GPS Tracking',
      'Temperature Controlled',
      'Biometric Delivery Confirmation'
    ]
  },
  {
    id: 'international',
    name: 'International Secure',
    description: 'Fully insured international shipping with customs handling',
    price: 89.99,
    deliveryTime: '5-10 business days',
    estimatedDelivery: calculateDeliveryDate(8),
    tracking: true,
    insurance: true,
    insuranceLimit: 25000,
    secure: true,
    features: [
      'Customs Pre-clearance',
      'International Insurance',
      'Duty & Tax Calculation',
      'Multi-language Support'
    ]
  }
])

const selectOption = (option: ShippingOption) => {
  selectedOption.value = option
  emit('update:modelValue', option)
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

// Auto-select recommended option if none selected
onMounted(() => {
  if (!selectedOption.value) {
    const recommended = shippingOptions.value.find(option => option.recommended)
    if (recommended) {
      selectOption(recommended)
    }
  }
})
</script>

<style scoped>
.shipping-option:focus {
  outline: 2px solid theme('colors.emerald.600');
  outline-offset: 2px;
}
</style>