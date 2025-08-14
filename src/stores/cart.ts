import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  gemType: string
  carat: number
  cut: string
  color: string
  clarity: string
  quantity: number
  inStock: boolean
}

export interface ShippingInfo {
  method: 'standard' | 'express' | 'overnight'
  cost: number
  estimatedDays: string
}

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])
  const isOpen = ref(false)
  const shippingMethod = ref<ShippingInfo['method']>('standard')
  const promoCode = ref('')
  const promoDiscount = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const itemCount = computed(() => 
    items.value.reduce((total, item) => total + item.quantity, 0)
  )

  const subtotal = computed(() => 
    items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  )

  const shippingCost = computed(() => {
    const shippingRates = {
      standard: 0, // Free shipping for luxury items
      express: 25,
      overnight: 50
    }
    return subtotal.value > 1000 ? 0 : shippingRates[shippingMethod.value]
  })

  const discount = computed(() => {
    return Math.round(subtotal.value * (promoDiscount.value / 100))
  })

  const total = computed(() => 
    Math.max(0, subtotal.value + shippingCost.value - discount.value)
  )

  const isEmpty = computed(() => items.value.length === 0)

  // Actions
  const addItem = async (product: Omit<CartItem, 'quantity'>) => {
    try {
      isLoading.value = true
      error.value = null

      const existingItem = items.value.find(item => item.id === product.id)
      
      if (existingItem) {
        if (existingItem.quantity < 5) { // Max quantity limit
          existingItem.quantity += 1
        } else {
          throw new Error('Maximum quantity reached for this item')
        }
      } else {
        items.value.push({ ...product, quantity: 1 })
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add item to cart'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      isLoading.value = true
      error.value = null

      const index = items.value.findIndex(item => item.id === itemId)
      if (index > -1) {
        items.value.splice(index, 1)
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200))
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to remove item'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1 || quantity > 5) {
      throw new Error('Quantity must be between 1 and 5')
    }

    try {
      isLoading.value = true
      error.value = null

      const item = items.value.find(item => item.id === itemId)
      if (item) {
        item.quantity = quantity
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200))
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update quantity'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const applyPromoCode = async (code: string) => {
    try {
      isLoading.value = true
      error.value = null

      // Simulate API call to validate promo code
      await new Promise(resolve => setTimeout(resolve, 500))

      const validCodes: Record<string, number> = {
        'LUXURY10': 10,
        'FIRST15': 15,
        'PREMIUM20': 20,
        'VIP25': 25
      }

      if (validCodes[code.toUpperCase()]) {
        promoCode.value = code.toUpperCase()
        promoDiscount.value = validCodes[code.toUpperCase()]
      } else {
        throw new Error('Invalid promo code')
      }
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to apply promo code'
      promoCode.value = ''
      promoDiscount.value = 0
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const removePromoCode = () => {
    promoCode.value = ''
    promoDiscount.value = 0
  }

  const updateShipping = (method: ShippingInfo['method']) => {
    shippingMethod.value = method
  }

  const clearCart = async () => {
    try {
      isLoading.value = true
      error.value = null

      items.value = []
      promoCode.value = ''
      promoDiscount.value = 0
      shippingMethod.value = 'standard'

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to clear cart'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const toggleCart = () => {
    isOpen.value = !isOpen.value
  }

  const openCart = () => {
    isOpen.value = true
  }

  const closeCart = () => {
    isOpen.value = false
  }

  // Utility functions
  const getShippingOptions = (): ShippingInfo[] => [
    {
      method: 'standard',
      cost: subtotal.value > 1000 ? 0 : 0,
      estimatedDays: '5-7 business days'
    },
    {
      method: 'express',
      cost: subtotal.value > 1000 ? 0 : 25,
      estimatedDays: '2-3 business days'
    },
    {
      method: 'overnight',
      cost: subtotal.value > 1000 ? 0 : 50,
      estimatedDays: '1 business day'
    }
  ]

  const isItemInCart = (productId: string): boolean => {
    return items.value.some(item => item.id === productId)
  }

  const getItemQuantity = (productId: string): number => {
    const item = items.value.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  // Clear error after 5 seconds
  const clearError = () => {
    setTimeout(() => {
      error.value = null
    }, 5000)
  }

  // Initialize cart from localStorage on store creation
  const initializeCart = () => {
    try {
      const savedCart = localStorage.getItem('luxury-gems-cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        items.value = parsedCart.items || []
        promoCode.value = parsedCart.promoCode || ''
        promoDiscount.value = parsedCart.promoDiscount || 0
        shippingMethod.value = parsedCart.shippingMethod || 'standard'
      }
    } catch (err) {
      console.warn('Failed to load cart from localStorage:', err)
    }
  }

  // Save cart to localStorage whenever it changes
  const saveCart = () => {
    try {
      const cartData = {
        items: items.value,
        promoCode: promoCode.value,
        promoDiscount: promoDiscount.value,
        shippingMethod: shippingMethod.value
      }
      localStorage.setItem('luxury-gems-cart', JSON.stringify(cartData))
    } catch (err) {
      console.warn('Failed to save cart to localStorage:', err)
    }
  }

  return {
    // State
    items,
    isOpen,
    shippingMethod,
    promoCode,
    promoDiscount,
    isLoading,
    error,
    
    // Getters
    itemCount,
    subtotal,
    shippingCost,
    discount,
    total,
    isEmpty,
    
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    applyPromoCode,
    removePromoCode,
    updateShipping,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    
    // Utilities
    getShippingOptions,
    isItemInCart,
    getItemQuantity,
    clearError,
    initializeCart,
    saveCart
  }
})