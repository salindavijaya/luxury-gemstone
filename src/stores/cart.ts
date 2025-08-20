import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  weight?: number
  cut?: string
  clarity?: string
  color?: string
  certification?: string
  quantity: number
  insuranceSelected: boolean
  appraisalRequested: boolean
  giftMessage?: string
  specialInstructions?: string
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

export interface PaymentMethod {
  type: 'credit' | 'paypal' | 'bank'
  cardNumber?: string
  expiryMonth?: string
  expiryYear?: string
  cvv?: string
  cardholderName?: string
}

export interface DiscountCode {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  description: string
}

export interface ShippingOption {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: number
  secure: boolean
}

export const useCartStore = defineStore('cart', () => {
  // Cart State
  const items = ref<CartItem[]>([])
  const recentlyRemoved = ref<CartItem[]>([])
  const discountCode = ref<DiscountCode | null>(null)
  const selectedShippingOption = ref<ShippingOption | null>(null)
  
  // Checkout State
  const currentCheckoutStep = ref(1)
  const shippingAddress = ref<ShippingAddress>({
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: ''
  })
  const billingAddress = ref<ShippingAddress>({
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: ''
  })
  const useSameAddress = ref(true)
  const paymentMethod = ref<PaymentMethod>({ type: 'credit' })
  const orderNotes = ref('')
  const isGuestCheckout = ref(true)
  
  // Available shipping options
  const shippingOptions = ref<ShippingOption[]>([
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Regular insured shipping',
      price: 25,
      estimatedDays: 7,
      secure: true
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Priority overnight delivery',
      price: 75,
      estimatedDays: 2,
      secure: true
    },
    {
      id: 'white-glove',
      name: 'White Glove Delivery',
      description: 'Hand delivery with signature',
      price: 150,
      estimatedDays: 3,
      secure: true
    }
  ])

  // Computed values
  const itemCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  
  const subtotal = computed(() => 
    items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  )
  
  const insuranceTotal = computed(() =>
    items.value.reduce((sum, item) => 
      sum + (item.insuranceSelected ? item.price * item.quantity * 0.02 : 0), 0
    )
  )
  
  const appraisalTotal = computed(() =>
    items.value.reduce((sum, item) => sum + (item.appraisalRequested ? 150 : 0), 0)
  )
  
  const discountAmount = computed(() => {
    if (!discountCode.value) return 0
    if (discountCode.value.type === 'percentage') {
      return subtotal.value * (discountCode.value.value / 100)
    }
    return discountCode.value.value
  })
  
  const taxRate = 0.0875 // 8.75% tax rate
  const taxAmount = computed(() => (subtotal.value - discountAmount.value) * taxRate)
  
  const shippingCost = computed(() => selectedShippingOption.value?.price || 0)
  
  const total = computed(() => 
    subtotal.value + insuranceTotal.value + appraisalTotal.value + 
    taxAmount.value + shippingCost.value - discountAmount.value
  )

  // Actions
  const addItem = (product: Omit<CartItem, 'quantity' | 'insuranceSelected' | 'appraisalRequested'>) => {
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      items.value.push({
        ...product,
        quantity: 1,
        insuranceSelected: product.price > 1000, // Auto-select insurance for high-value items
        appraisalRequested: false
      })
    }
    
    saveToLocalStorage()
  }

  const removeItem = (itemId: string) => {
    const itemIndex = items.value.findIndex(item => item.id === itemId)
    if (itemIndex > -1) {
      const removedItem = items.value.splice(itemIndex, 1)[0]
      recentlyRemoved.value.unshift(removedItem)
      
      // Keep only last 5 recently removed items
      if (recentlyRemoved.value.length > 5) {
        recentlyRemoved.value = recentlyRemoved.value.slice(0, 5)
      }
      
      saveToLocalStorage()
    }
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    const item = items.value.find(item => item.id === itemId)
    if (item) {
      if (quantity <= 0) {
        removeItem(itemId)
      } else {
        item.quantity = quantity
        saveToLocalStorage()
      }
    }
  }

  const restoreItem = (item: CartItem) => {
    const index = recentlyRemoved.value.findIndex(removed => removed.id === item.id)
    if (index > -1) {
      recentlyRemoved.value.splice(index, 1)
      addItem(item)
    }
  }

  const toggleInsurance = (itemId: string) => {
    const item = items.value.find(item => item.id === itemId)
    if (item) {
      item.insuranceSelected = !item.insuranceSelected
      saveToLocalStorage()
    }
  }

  const toggleAppraisal = (itemId: string) => {
    const item = items.value.find(item => item.id === itemId)
    if (item) {
      item.appraisalRequested = !item.appraisalRequested
      saveToLocalStorage()
    }
  }

  const applyDiscountCode = async (code: string): Promise<boolean> => {
    // Mock discount codes
    const validCodes: Record<string, DiscountCode> = {
      'LUXURY10': { code: 'LUXURY10', type: 'percentage', value: 10, description: '10% off your order' },
      'FIRST100': { code: 'FIRST100', type: 'fixed', value: 100, description: '$100 off first order' },
      'GEMSTONE15': { code: 'GEMSTONE15', type: 'percentage', value: 15, description: '15% off gemstones' }
    }
    
    const discount = validCodes[code.toUpperCase()]
    if (discount) {
      discountCode.value = discount
      saveToLocalStorage()
      return true
    }
    return false
  }

  const removeDiscountCode = () => {
    discountCode.value = null
    saveToLocalStorage()
  }

  const selectShippingOption = (option: ShippingOption) => {
    selectedShippingOption.value = option
    saveToLocalStorage()
  }

  const clearCart = () => {
    items.value = []
    recentlyRemoved.value = []
    discountCode.value = null
    selectedShippingOption.value = null
    saveToLocalStorage()
  }

  const nextCheckoutStep = () => {
    if (currentCheckoutStep.value < 3) {
      currentCheckoutStep.value++
    }
  }

  const prevCheckoutStep = () => {
    if (currentCheckoutStep.value > 1) {
      currentCheckoutStep.value--
    }
  }

  const setCheckoutStep = (step: number) => {
    currentCheckoutStep.value = step
  }

  const updateShippingAddress = (address: ShippingAddress) => {
    shippingAddress.value = { ...address }
    if (useSameAddress.value) {
      billingAddress.value = { ...address }
    }
    saveToLocalStorage()
  }

  const updateBillingAddress = (address: ShippingAddress) => {
    billingAddress.value = { ...address }
    saveToLocalStorage()
  }

  const toggleSameAddress = () => {
    useSameAddress.value = !useSameAddress.value
    if (useSameAddress.value) {
      billingAddress.value = { ...shippingAddress.value }
    }
    saveToLocalStorage()
  }

  const updatePaymentMethod = (method: PaymentMethod) => {
    paymentMethod.value = { ...method }
    saveToLocalStorage()
  }

  const saveToLocalStorage = () => {
    try {
      const cartData = {
        items: items.value,
        discountCode: discountCode.value,
        selectedShippingOption: selectedShippingOption.value,
        shippingAddress: shippingAddress.value,
        billingAddress: billingAddress.value,
        useSameAddress: useSameAddress.value,
        orderNotes: orderNotes.value,
        isGuestCheckout: isGuestCheckout.value
      }
      localStorage.setItem('luxury-cart', JSON.stringify(cartData))
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error)
    }
  }

  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem('luxury-cart')
      if (savedData) {
        const cartData = JSON.parse(savedData)
        items.value = cartData.items || []
        discountCode.value = cartData.discountCode || null
        selectedShippingOption.value = cartData.selectedShippingOption || null
        shippingAddress.value = cartData.shippingAddress || shippingAddress.value
        billingAddress.value = cartData.billingAddress || billingAddress.value
        useSameAddress.value = cartData.useSameAddress ?? true
        orderNotes.value = cartData.orderNotes || ''
        isGuestCheckout.value = cartData.isGuestCheckout ?? true
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
    }
  }

  // Initialize from localStorage
  loadFromLocalStorage()

  return {
    // State
    items,
    recentlyRemoved,
    discountCode,
    selectedShippingOption,
    shippingOptions,
    currentCheckoutStep,
    shippingAddress,
    billingAddress,
    useSameAddress,
    paymentMethod,
    orderNotes,
    isGuestCheckout,
    
    // Computed
    itemCount,
    subtotal,
    insuranceTotal,
    appraisalTotal,
    discountAmount,
    taxAmount,
    shippingCost,
    total,
    
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    restoreItem,
    toggleInsurance,
    toggleAppraisal,
    applyDiscountCode,
    removeDiscountCode,
    selectShippingOption,
    clearCart,
    nextCheckoutStep,
    prevCheckoutStep,
    setCheckoutStep,
    updateShippingAddress,
    updateBillingAddress,
    toggleSameAddress,
    updatePaymentMethod,
    loadFromLocalStorage
  }
})