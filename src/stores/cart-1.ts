import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUIStore } from './ui'

// Types
export interface CartItem {
  id: string
  productId: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  quantity: number
  image: string
  category: string
  certification?: string
  carat?: number
  cut?: string
  clarity?: string
  color?: string
  selectedOptions?: {
    setting?: string
    metalType?: string
    ringSize?: string
  }
  availability: 'in-stock' | 'limited' | 'pre-order'
  estimatedDelivery?: string
}

export interface ShippingOption {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
  icon: string
  trackingIncluded: boolean
  insuranceIncluded: boolean
}

export interface PromoCode {
  code: string
  type: 'percentage' | 'fixed' | 'shipping'
  value: number
  description: string
  minimumAmount?: number
  validUntil?: string
  usageLimit?: number
  usedCount?: number
}

export const useCartStore = defineStore('cart', () => {
  const uiStore = useUIStore()

  // State
  const items = ref<CartItem[]>([])
  const appliedPromoCode = ref<PromoCode | null>(null)
  const selectedShipping = ref<ShippingOption | null>(null)
  const isLoading = ref(false)
  const lastUpdated = ref<Date>(new Date())

  // Available shipping options
  const shippingOptions = ref<ShippingOption[]>([
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Secure delivery with signature required',
      price: 0,
      estimatedDays: '5-7 business days',
      icon: 'truck',
      trackingIncluded: true,
      insuranceIncluded: true
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Expedited secure delivery',
      price: 25,
      estimatedDays: '2-3 business days',
      icon: 'lightning-bolt',
      trackingIncluded: true,
      insuranceIncluded: true
    },
    {
      id: 'overnight',
      name: 'Overnight Delivery',
      description: 'Next business day delivery',
      price: 75,
      estimatedDays: '1 business day',
      icon: 'clock',
      trackingIncluded: true,
      insuranceIncluded: true
    },
    {
      id: 'white-glove',
      name: 'White Glove Service',
      description: 'Personal delivery and consultation',
      price: 200,
      estimatedDays: '2-5 business days',
      icon: 'user-tie',
      trackingIncluded: true,
      insuranceIncluded: true
    }
  ])

  // Mock promo codes
  const availablePromoCodes = ref<PromoCode[]>([
    {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      description: '10% off your first purchase',
      minimumAmount: 500,
      validUntil: '2024-12-31'
    },
    {
      code: 'LUXURY50',
      type: 'fixed',
      value: 50,
      description: '$50 off orders over $1000',
      minimumAmount: 1000,
      validUntil: '2024-12-31'
    },
    {
      code: 'FREESHIP',
      type: 'shipping',
      value: 100,
      description: 'Free shipping on all orders',
      minimumAmount: 200,
      validUntil: '2024-12-31'
    }
  ])

  // Computed properties
  const itemCount = computed(() => 
    items.value.reduce((total, item) => total + item.quantity, 0)
  )

  const subtotal = computed(() => 
    items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  )

  const originalSubtotal = computed(() => 
    items.value.reduce((total, item) => 
      total + ((item.originalPrice || item.price) * item.quantity), 0
    )
  )

  const discountAmount = computed(() => {
    if (!appliedPromoCode.value) return 0

    const promo = appliedPromoCode.value
    if (promo.type === 'percentage') {
      return subtotal.value * (promo.value / 100)
    } else if (promo.type === 'fixed') {
      return Math.min(promo.value, subtotal.value)
    }
    return 0
  })

  const shippingCost = computed(() => {
    if (!selectedShipping.value) return 0
    
    // Apply shipping promo if applicable
    if (appliedPromoCode.value?.type === 'shipping') {
      return Math.max(0, selectedShipping.value.price - appliedPromoCode.value.value)
    }
    
    return selectedShipping.value.price
  })

  const tax = computed(() => {
    const taxableAmount = subtotal.value - discountAmount.value
    return taxableAmount * 0.08 // 8% tax rate
  })

  const total = computed(() => 
    Math.max(0, subtotal.value - discountAmount.value + shippingCost.value + tax.value)
  )

  const savings = computed(() => 
    originalSubtotal.value - subtotal.value + discountAmount.value
  )

  const isEmpty = computed(()