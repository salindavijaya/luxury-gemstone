import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from './useCart'

interface Address {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

interface ShippingOption {
  id: string
  name: string
  price: number
  deliveryTime: string
  description: string
}

interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay'
  name: string
  details?: any
}

interface BillingData {
  address: Address | null
  sameAsShipping: boolean
  isBusinessPurchase: boolean
  taxId?: string
  companyName?: string
}

interface CheckoutData {
  customer: {
    email: string
    isGuest: boolean
    createAccount?: boolean
    password?: string
  }
  shipping: {
    address: Address | null
    option: ShippingOption | null
    instructions?: string
  }
  billing: BillingData
  payment: {
    method: PaymentMethod | null
    cardData?: any
  }
  orderNotes?: string
  giftMessage?: string
  marketingConsent: boolean
  termsAccepted: boolean
}

export type CheckoutStep = 'shipping' | 'payment' | 'review'

/**
 * Composable for checkout process management
 * Handles multi-step checkout flow and data persistence
 */
export function useCheckout() {
  const router = useRouter()
  const { total, items, validateCartForCheckout } = useCart()

  // Checkout state
  const currentStep = ref<CheckoutStep>('shipping')
  const isProcessing = ref(false)
  const error = ref<string | null>(null)
  const completedSteps = ref<Set<CheckoutStep>>(new Set())

  // Checkout data
  const checkoutData = reactive<CheckoutData>({
    customer: {
      email: '',
      isGuest: true,
      createAccount: false,
      password: ''
    },
    shipping: {
      address: null,
      option: null,
      instructions: ''
    },
    billing: {
      address: null,
      sameAsShipping: true,
      isBusinessPurchase: false,
      taxId: '',
      companyName: ''
    },
    payment: {
      method: null,
      cardData: null
    },
    orderNotes: '',
    giftMessage: '',
    marketingConsent: false,
    termsAccepted: false
  })

  // Validation errors for each step
  const validationErrors = ref<Record<string, Record<string, string>>>({
    shipping: {},
    payment: {},
    review: {}
  })

  // Computed properties
  const canProceedToPayment = computed(() => {
    return (
      checkoutData.customer.email &&
      checkoutData.shipping.address &&
      checkoutData.shipping.option &&
      completedSteps.value.has('shipping')
    )
  })

  const canProceedToReview = computed(() => {
    return (
      canProceedToPayment.value &&
      checkoutData.billing.address &&
      checkoutData.payment.method &&
      completedSteps.value.has('payment')
    )
  })

  const canCompleteOrder = computed(() => {
    return (
      canProceedToReview.value &&
      checkoutData.termsAccepted &&
      completedSteps.value.has('review')
    )
  })

  const orderSummary = computed(() => {
    const subtotal = total.value
    const shippingCost = checkoutData.shipping.option?.price || 0
    const taxRate = calculateTaxRate()
    const taxAmount = subtotal * taxRate
    const finalTotal = subtotal + shippingCost + taxAmount

    return {
      subtotal,
      shipping: shippingCost,
      tax: taxAmount,
      total: finalTotal,
      itemCount: items.value.length
    }
  })

  // Step navigation
  const goToStep = (step: CheckoutStep) => {
    clearError()
    
    switch (step) {
      case 'payment':
        if (!canProceedToPayment.value) {
          error.value = 'Please complete shipping information first'
          return false
        }
        break
      case 'review':
        if (!canProceedToReview.value) {
          error.value = 'Please complete payment information first'
          return false
        }
        break
    }
    
    currentStep.value = step
    return true
  }

  const nextStep = () => {
    switch (currentStep.value) {
      case 'shipping':
        if (validateShippingStep()) {
          completedSteps.value.add('shipping')
          return goToStep('payment')
        }
        break
      case 'payment':
        if (validatePaymentStep()) {
          completedSteps.value.add('payment')
          return goToStep('review')
        }
        break
      case 'review':
        if (validateReviewStep()) {
          completedSteps.value.add('review')
          return processOrder()
        }
        break
    }
    return false
  }

  const previousStep = () => {
    switch (currentStep.value) {
      case 'payment':
        return goToStep('shipping')
      case 'review':
        return goToStep('payment')
      default:
        return false
    }
  }

  // Validation functions
  const validateShippingStep = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (!checkoutData.customer.email) {
      errors.email = 'Email is required'
    } else if (!isValidEmail(checkoutData.customer.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!checkoutData.shipping.address) {
      errors.address = 'Shipping address is required'
    } else {
      const addr = checkoutData.shipping.address
      if (!addr.firstName) errors.firstName = 'First name is required'
      if (!addr.lastName) errors.lastName = 'Last name is required'
      if (!addr.address1) errors.address1 = 'Address is required'
      if (!addr.city) errors.city = 'City is required'
      if (!addr.state) errors.state = 'State is required'
      if (!addr.postalCode) errors.postalCode = 'Postal code is required'
      if (!addr.country) errors.country = 'Country is required'
    }
    
    if (!checkoutData.shipping.option) {
      errors.shippingOption = 'Please select a shipping option'
    }
    
    validationErrors.value.shipping = errors
    return Object.keys(errors).length === 0
  }

  const validatePaymentStep = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (!checkoutData.payment.method) {
      errors.paymentMethod = 'Please select a payment method'
    }
    
    if (!checkoutData.billing.address && !checkoutData.billing.sameAsShipping) {
      errors.billingAddress = 'Billing address is required'
    }
    
    if (checkoutData.billing.isBusinessPurchase) {
      if (!checkoutData.billing.taxId) {
        errors.taxId = 'Tax ID is required for business purchases'
      }
      if (!checkoutData.billing.companyName) {
        errors.companyName = 'Company name is required for business purchases'
      }
    }
    
    validationErrors.value.payment = errors
    return Object.keys(errors).length === 0
  }

  const validateReviewStep = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (!checkoutData.termsAccepted) {
      errors.terms = 'You must accept the terms and conditions'
    }
    
    const cartValidation = validateCartForCheckout()
    if (!cartValidation.valid) {
      errors.cart = cartValidation.errors.join(', ')
    }
    
    validationErrors.value.review = errors
    return Object.keys(errors).length === 0
  }

  // Order processing
  const processOrder = async () => {
    isProcessing.value = true
    error.value = null
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock order creation
      const orderId = generateOrderId()
      
      // Store order data (in real app, this would be an API call)
      const orderData = {
        id: orderId,
        items: items.value,
        customer: checkoutData.customer,
        shipping: checkoutData.shipping,
        billing: checkoutData.billing,
        payment: checkoutData.payment,
        summary: orderSummary.value,
        orderNotes: checkoutData.orderNotes,
        giftMessage: checkoutData.giftMessage,
        createdAt: new Date().toISOString(),
        status: 'confirmed'
      }
      
      // Clear sensitive payment data
      clearPaymentData()
      
      // Navigate to success page
      router.push(`/checkout/success/${orderId}`)
      
      return orderId
    } catch (err) {
      error.value = 'Failed to process order. Please try again.'
      throw err
    } finally {
      isProcessing.value = false
    }
  }

  // Utility functions
  const calculateTaxRate = (): number => {
    const address = checkoutData.billing.sameAsShipping 
      ? checkoutData.shipping.address 
      : checkoutData.billing.address
    
    if (!address?.state) return 0
    
    // Mock tax rates by state
    const taxRates: Record<string, number> = {
      'CA': 0.0875,
      'NY': 0.08,
      'TX': 0.0625,
      'FL': 0.06,
      'WA': 0.065,
      'OR': 0.0,
      'NH': 0.0,
      'MT': 0.0,
      'DE': 0.0
    }
    
    return taxRates[address.state] || 0.05
  }

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const generateOrderId = (): string => {
    const timestamp = Date.now().toString(36)
    const randomStr = Math.random().toString(36).substring(2, 8)
    return `GEM-${timestamp}-${randomStr}`.toUpperCase()
  }

  const clearError = () => {
    error.value = null
  }

  const clearPaymentData = () => {
    if (checkoutData.payment.cardData) {
      delete checkoutData.payment.cardData
    }
  }

  // Data persistence (localStorage)
  const saveCheckoutData = () => {
    try {
      const dataToSave = { ...checkoutData }
      // Remove sensitive payment data before saving
      if (dataToSave.payment.cardData) {
        delete dataToSave.payment.cardData
      }
      localStorage.setItem('checkout-data', JSON.stringify(dataToSave))
    } catch (err) {
      console.warn('Failed to save checkout data:', err)
    }
  }

  const loadCheckoutData = () => {
    try {
      const saved = localStorage.getItem('checkout-data')
      if (saved) {
        const data = JSON.parse(saved)
        Object.assign(checkoutData, data)
      }
    } catch (err) {
      console.warn('Failed to load checkout data:', err)
    }
  }

  const clearCheckoutData = () => {
    try {
      localStorage.removeItem('checkout-data')
    } catch (err) {
      console.warn('Failed to clear checkout data:', err)
    }
  }

  // Auto-save checkout data
  watch(checkoutData, saveCheckoutData, { deep: true })

  // Load saved data on initialization
  loadCheckoutData()

  return {
    // State
    currentStep,
    isProcessing,
    error,
    completedSteps,
    checkoutData,
    validationErrors,
    
    // Computed
    canProceedToPayment,
    canProceedToReview,
    canCompleteOrder,
    orderSummary,
    
    // Navigation
    goToStep,
    nextStep,
    previousStep,
    
    // Validation
    validateShippingStep,
    validatePaymentStep,
    validateReviewStep,
    
    // Processing
    processOrder,
    
    // Utilities
    calculateTaxRate,
    isValidEmail,
    clearError,
    saveCheckoutData,
    loadCheckoutData,
    clearCheckoutData
  }
}