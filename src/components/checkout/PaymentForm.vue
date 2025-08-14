<template>
  <div class="space-y-6">
    <h3 v-if="title" class="text-lg font-semibold text-slate-900 mb-4">{{ title }}</h3>

    <!-- Payment Method Selection -->
    <div class="space-y-3">
      <h4 class="text-sm font-medium text-slate-700">Select Payment Method</h4>
      
      <div class="grid grid-cols-1 gap-3">
        <!-- Credit Card -->
        <label 
          class="relative flex items-center p-4 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
          :class="{ 'border-emerald-500 bg-emerald-50': paymentMethod === 'credit_card' }"
        >
          <input
            v-model="paymentMethod"
            type="radio"
            value="credit_card"
            class="sr-only"
            @change="handlePaymentMethodChange"
          />
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center">
              <div class="w-5 h-5 border-2 border-slate-300 rounded-full mr-3 flex items-center justify-center"
                   :class="{ 'border-emerald-500': paymentMethod === 'credit_card' }">
                <div v-if="paymentMethod === 'credit_card'" class="w-2 h-2 bg-emerald-500 rounded-full"></div>
              </div>
              <div>
                <div class="font-medium text-slate-900">Credit or Debit Card</div>
                <div class="text-sm text-slate-600">Visa, Mastercard, American Express</div>
              </div>
            </div>
            <div class="flex space-x-2">
              <img src="/api/placeholder/32/20" alt="Visa" class="h-5 opacity-60" />
              <img src="/api/placeholder/32/20" alt="Mastercard" class="h-5 opacity-60" />
              <img src="/api/placeholder/32/20" alt="Amex" class="h-5 opacity-60" />
            </div>
          </div>
        </label>

        <!-- PayPal -->
        <label 
          class="relative flex items-center p-4 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
          :class="{ 'border-emerald-500 bg-emerald-50': paymentMethod === 'paypal' }"
        >
          <input
            v-model="paymentMethod"
            type="radio"
            value="paypal"
            class="sr-only"
            @change="handlePaymentMethodChange"
          />
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center">
              <div class="w-5 h-5 border-2 border-slate-300 rounded-full mr-3 flex items-center justify-center"
                   :class="{ 'border-emerald-500': paymentMethod === 'paypal' }">
                <div v-if="paymentMethod === 'paypal'" class="w-2 h-2 bg-emerald-500 rounded-full"></div>
              </div>
              <div>
                <div class="font-medium text-slate-900">PayPal</div>
                <div class="text-sm text-slate-600">Pay with your PayPal account</div>
              </div>
            </div>
            <img src="/api/placeholder/60/24" alt="PayPal" class="h-6" />
          </div>
        </label>

        <!-- Apple Pay (if supported) -->
        <label 
          v-if="supportsApplePay"
          class="relative flex items-center p-4 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
          :class="{ 'border-emerald-500 bg-emerald-50': paymentMethod === 'apple_pay' }"
        >
          <input
            v-model="paymentMethod"
            type="radio"
            value="apple_pay"
            class="sr-only"
            @change="handlePaymentMethodChange"
          />
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center">
              <div class="w-5 h-5 border-2 border-slate-300 rounded-full mr-3 flex items-center justify-center"
                   :class="{ 'border-emerald-500': paymentMethod === 'apple_pay' }">
                <div v-if="paymentMethod === 'apple_pay'" class="w-2 h-2 bg-emerald-500 rounded-full"></div>
              </div>
              <div>
                <div class="font-medium text-slate-900">Apple Pay</div>
                <div class="text-sm text-slate-600">Touch ID or Face ID required</div>
              </div>
            </div>
            <img src="/api/placeholder/60/24" alt="Apple Pay" class="h-6" />
          </div>
        </label>
      </div>
    </div>

    <!-- Credit Card Form -->
    <div v-if="paymentMethod === 'credit_card'" class="space-y-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
      <h4 class="font-medium text-slate-900 mb-4">Card Information</h4>
      
      <!-- Card Number -->
      <div>
        <label for="cardNumber" class="block text-sm font-medium text-slate-700 mb-2">
          Card Number *
        </label>
        <div class="relative">
          <input
            id="cardNumber"
            v-model="cardInfo.number"
            type="text"
            required
            maxlength="19"
            class="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-mono"
            :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.cardNumber }"
            placeholder="1234 5678 9012 3456"
            @input="formatCardNumber"
            @blur="validateField('cardNumber')"
          />
          <!-- Card Type Icon -->
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <img v-if="cardType" :src="`/api/placeholder/32/20`" :alt="cardType" class="h-5" />
            <CreditCardIcon v-else class="h-5 w-5 text-slate-400" />
          </div>
        </div>
        <p v-if="errors.cardNumber" class="mt-1 text-sm text-red-600">{{ errors.cardNumber }}</p>
      </div>

      <!-- Expiry and CVV -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="expiry" class="block text-sm font-medium text-slate-700 mb-2">
            Expiry Date *
          </label>
          <input
            id="expiry"
            v-model="cardInfo.expiry"
            type="text"
            required
            maxlength="5"
            class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-mono"
            :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.expiry }"
            placeholder="MM/YY"
            @input="formatExpiry"
            @blur="validateField('expiry')"
          />
          <p v-if="errors.expiry" class="mt-1 text-sm text-red-600">{{ errors.expiry }}</p>
        </div>

        <div>
          <label for="cvv" class="block text-sm font-medium text-slate-700 mb-2">
            CVV *
          </label>
          <div class="relative">
            <input
              id="cvv"
              v-model="cardInfo.cvv"
              type="text"
              required
              maxlength="4"
              class="w-full px-4 py-3 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-mono"
              :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.cvv }"
              placeholder="123"
              @blur="validateField('cvv')"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
              @click="showCvvHelp = !showCvvHelp"
            >
              <QuestionMarkCircleIcon class="h-5 w-5 text-slate-400 hover:text-slate-600" />
            </button>
          </div>
          <p v-if="errors.cvv" class="mt-1 text-sm text-red-600">{{ errors.cvv }}</p>
          
          <!-- CVV Help Tooltip -->
          <div v-if="showCvvHelp" class="mt-2 p-3 bg-white border border-slate-200 rounded-lg shadow-lg text-sm">
            <p class="text-slate-700 mb-2">Your CVV is the security code on your card:</p>
            <ul class="text-slate-600 space-y-1">
              <li>• Visa/Mastercard: 3 digits on the back</li>
              <li>• American Express: 4 digits on the front</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Cardholder Name -->
      <div>
        <label for="cardName" class="block text-sm font-medium text-slate-700 mb-2">
          Cardholder Name *
        </label>
        <input
          id="cardName"
          v-model="cardInfo.name"
          type="text"
          required
          class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': errors.cardName }"
          placeholder="John Smith"
          @blur="validateField('cardName')"
        />
        <p v-if="errors.cardName" class="mt-1 text-sm text-red-600">{{ errors.cardName }}</p>
      </div>

      <!-- Save Card Option -->
      <div class="flex items-center">
        <input
          id="saveCard"
          v-model="cardInfo.saveCard"
          type="checkbox"
          class="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
        />
        <label for="saveCard" class="ml-2 text-sm text-slate-700">
          Save this card for future purchases
        </label>
      </div>
    </div>

    <!-- PayPal Integration -->
    <div v-if="paymentMethod === 'paypal'" class="p-4 border border-slate-200 rounded-lg bg-slate-50">
      <div class="text-center">
        <div class="mb-4">
          <img src="/api/placeholder/120/40" alt="PayPal" class="mx-auto h-8" />
        </div>
        <p class="text-sm text-slate-600 mb-4">
          You will be redirected to PayPal to complete your payment securely.
        </p>
        <button
          type="button"
          class="w-full bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors font-medium"
          @click="handlePayPalClick"
        >
          Continue with PayPal
        </button>
      </div>
    </div>

    <!-- Apple Pay Integration -->
    <div v-if="paymentMethod === 'apple_pay'" class="p-4 border border-slate-200 rounded-lg bg-slate-50">
      <div class="text-center">
        <div class="mb-4">
          <img src="/api/placeholder/120/40" alt="Apple Pay" class="mx-auto h-8" />
        </div>
        <p class="text-sm text-slate-600 mb-4">
          Use Touch ID or Face ID to complete your payment securely.
        </p>
        <button
          type="button"
          class="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium"
          @click="handleApplePayClick"
        >
          Pay with Apple Pay
        </button>
      </div>
    </div>

    <!-- Security Information -->
    <div class="flex items-center justify-center space-x-4 p-4 bg-slate-50 rounded-lg">
      <ShieldCheckIcon class="h-6 w-6 text-emerald-600" />
      <div class="text-sm text-slate-700">
        <span class="font-medium">Secure Payment</span> - Your payment information is encrypted and secure
      </div>
    </div>

    <!-- Trust Badges -->
    <div class="flex items-center justify-center space-x-6 py-4 border-t border-slate-200">
      <img src="/api/placeholder/60/30" alt="SSL Secured" class="h-6 opacity-60" />
      <img src="/api/placeholder/60/30" alt="PCI Compliant" class="h-6 opacity-60" />
      <img src="/api/placeholder/60/30" alt="Norton Secured" class="h-6 opacity-60" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { 
  CreditCardIcon, 
  ShieldCheckIcon, 
  QuestionMarkCircleIcon 
} from '@heroicons/vue/24/outline'

// Types
interface CardInfo {
  number: string
  expiry: string
  cvv: string
  name: string
  saveCard: boolean
}

interface PaymentData {
  method: 'credit_card' | 'paypal' | 'apple_pay'
  cardInfo?: CardInfo
}

interface ValidationErrors {
  cardNumber?: string
  expiry?: string
  cvv?: string
  cardName?: string
}

interface Props {
  title?: string
  value?: PaymentData
}

interface Emits {
  (e: 'update:value', data: PaymentData): void
  (e: 'validate', isValid: boolean): void
  (e: 'payment-method-change', method: string): void
}

// Props & Emits
const props = withDefaults(defineProps<Props>(), {
  title: '',
  value: () => ({
    method: 'credit_card' as const,
    cardInfo: {
      number: '',
      expiry: '',
      cvv: '',
      name: '',
      saveCard: false
    }
  })
})

const emit = defineEmits<Emits>()

// State
const paymentMethod = ref<'credit_card' | 'paypal' | 'apple_pay'>(props.value.method)
const cardInfo = reactive<CardInfo>({
  number: '',
  expiry: '',
  cvv: '',
  name: '',
  saveCard: false,
  ...props.value.cardInfo
})
const errors = reactive<ValidationErrors>({})
const showCvvHelp = ref(false)

// Computed
const supportsApplePay = computed(() => {
  return 'ApplePaySession' in window && ApplePaySession?.canMakePayments()
})

const cardType = computed(() => {
  const number = cardInfo.number.replace(/\s/g, '')
  
  if (/^4/.test(number)) return 'Visa'
  if (/^5[1-5]/.test(number)) return 'Mastercard'
  if (/^3[47]/.test(number)) return 'American Express'
  if (/^6/.test(number)) return 'Discover'
  
  return null
})

const isValid = computed(() => {
  if (paymentMethod.value !== 'credit_card') {
    return true // PayPal and Apple Pay validation happens externally
  }
  
  const requiredFields = ['number', 'expiry', 'cvv', 'name']
  const hasAllFields = requiredFields.every(field => cardInfo[field as keyof CardInfo])
  const hasNoErrors = Object.keys(errors).length === 0
  
  return hasAllFields && hasNoErrors
})

// Methods
const handlePaymentMethodChange = () => {
  emit('payment-method-change', paymentMethod.value)
  clearAllErrors()
}

const formatCardNumber = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '')
  
  // Format with spaces every 4 digits
  const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
  cardInfo.number = formattedValue
}

const formatExpiry = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '')
  
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4)
  }
  
  cardInfo.expiry = value
}

const validateField = (field: keyof ValidationErrors) => {
  switch (field) {
    case 'cardNumber':
      if (!cardInfo.number.trim()) {
        errors.cardNumber = 'Card number is required'
      } else if (!isValidCardNumber(cardInfo.number)) {
        errors.cardNumber = 'Invalid card number'
      } else {
        delete errors.cardNumber
      }
      break
      
    case 'expiry':
      if (!cardInfo.expiry.trim()) {
        errors.expiry = 'Expiry date is required'
      } else if (!isValidExpiry(cardInfo.expiry)) {
        errors.expiry = 'Invalid expiry date'
      } else {
        delete errors.expiry
      }
      break
      
    case 'cvv':
      if (!cardInfo.cvv.trim()) {
        errors.cvv = 'CVV is required'
      } else if (!isValidCVV(cardInfo.cvv, cardType.value)) {
        errors.cvv = 'Invalid CVV'
      } else {
        delete errors.cvv
      }
      break
      
    case 'cardName':
      if (!cardInfo.name.trim()) {
        errors.cardName = 'Cardholder name is required'
      } else if (cardInfo.name.trim().length < 2) {
        errors.cardName = 'Name must be at least 2 characters'
      } else {
        delete errors.cardName
      }
      break
  }
}

const isValidCardNumber = (number: string): boolean => {
  const digits = number.replace(/\s/g, '')
  
  // Luhn algorithm
  let sum = 0
  let alternate = false
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits.charAt(i), 10)
    
    if (alternate) {
      n *= 2
      if (n > 9) {
        n = (n % 10) + 1
      }
    }
    
    sum += n
    alternate = !alternate
  }
  
  return sum % 10 === 0 && digits.length >= 13 && digits.length <= 19
}

const isValidExpiry = (expiry: string): boolean => {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false
  
  const [month, year] = expiry.split('/').map(Number)
  const now = new Date()
  const currentYear = now.getFullYear() % 100
  const currentMonth = now.getMonth() + 1
  
  if (month < 1 || month > 12) return false
  if (year < currentYear) return false
  if (year === currentYear && month < currentMonth) return false
  
  return true
}

const isValidCVV = (cvv: string, cardType: string | null): boolean => {
  if (cardType === 'American Express') {
    return /^\d{4}$/.test(cvv)
  }
  return /^\d{3}$/.test(cvv)
}

const clearAllErrors = () => {
  Object.keys(errors).forEach(key => {
    delete errors[key as keyof ValidationErrors]
  })
}

const handlePayPalClick = () => {
  // In a real app, this would initiate PayPal checkout
  console.log('Initiating PayPal payment...')
  // PayPal SDK integration would go here
}

const handleApplePayClick = () => {
  // In a real app, this would initiate Apple Pay
  console.log('Initiating Apple Pay...')
  // Apple Pay integration would go here
}

const validateAll = (): boolean => {
  if (paymentMethod.value !== 'credit_card') return true
  
  const fields: (keyof ValidationErrors)[] = ['cardNumber', 'expiry', 'cvv', 'cardName']
  fields.forEach(field => validateField(field))
  
  return Object.keys(errors).length === 0
}

// Watchers
watch(
  [paymentMethod, cardInfo],
  () => {
    const paymentData: PaymentData = {
      method: paymentMethod.value,
      ...(paymentMethod.value === 'credit_card' && { cardInfo: { ...cardInfo } })
    }
    
    emit('update:value', paymentData)
  },
  { deep: true }
)

watch(
  isValid,
  (valid) => {
    emit('validate', valid)
  },
  { immediate: true }
)

// Expose validation method
defineExpose({
  validate: validateAll,
  isValid: isValid.value,
  errors
})
</script>

<style scoped>
/* Custom radio button styling */
input[type="radio"]:checked + div .w-5 {
  border-color: #10b981;
}

/* Focus styles for accessibility */
input:focus,
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Card number formatting */
.font-mono {
  letter-spacing: 0.05em;
}

/* Smooth transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Trust badge styling */
img[alt*="SSL"],
img[alt*="PCI"],
img[alt*="Norton"] {
  filter: grayscale(1);
  transition: filter 0.2s ease;
}

img[alt*="SSL"]:hover,
img[alt*="PCI"]:hover,
img[alt*="Norton"]:hover {
  filter: grayscale(0.5);
}
</style>