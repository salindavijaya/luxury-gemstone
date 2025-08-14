### stores/cart.ts
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  carat?: number
  clarity?: string
  color?: string
  cut?: string
  shape?: string
}

export interface ShippingInfo {
  method: 'standard' | 'expedited' | 'overnight'
  cost: number
  estimatedDays: string
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isOpen = ref(false)
  const shippingMethod = ref<ShippingInfo['method']>('standard')

  // Computed values
  const itemCount = computed(() => 
    items.value.reduce((total, item) => total + item.quantity, 0)
  )

  const subtotal = computed(() =>
    items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  )

  const shippingCost = computed(() => {
    if (subtotal.value >= 1000) return 0 // Free shipping over $1000
    
    const shippingRates: Record<ShippingInfo['method'], number> = {
      standard: 25,
      expedited: 45,
      overnight: 85
    }
    
    return shippingRates[shippingMethod.value]
  })

  const taxRate = 0.08 // 8% tax rate
  const tax = computed(() => (subtotal.value + shippingCost.value) * taxRate)

  const total = computed(() => subtotal.value + shippingCost.value + tax.value)

  const isEmpty = computed(() => items.value.length === 0)

  const shippingOptions = computed((): ShippingInfo[] => [
    {
      method: 'standard',
      cost: subtotal.value >= 1000 ? 0 : 25,
      estimatedDays: '5-7 business days'
    },
    {
      method: 'expedited',
      cost: subtotal.value >= 1000 ? 20 : 45,
      estimatedDays: '2-3 business days'
    },
    {
      method: 'overnight',
      cost: subtotal.value >= 1000 ? 60 : 85,
      estimatedDays: '1 business day'
    }
  ])

  // Actions
  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const existingItemIndex = items.value.findIndex(cartItem => cartItem.id === item.id)
    
    if (existingItemIndex > -1) {
      items.value[existingItemIndex].quantity += item.quantity || 1
    } else {
      items.value.push({
        ...item,
        quantity: item.quantity || 1
      })
    }
    
    // Show success feedback
    isOpen.value = true
    
    // Auto-close after delay
    setTimeout(() => {
      if (isOpen.value) {
        isOpen.value = false
      }
    }, 3000)
  }

  const removeItem = (itemId: string) => {
    const index = items.value.findIndex(item => item.id === itemId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    const item = items.value.find(item => item.id === itemId)
    if (item) {
      if (quantity <= 0) {
        removeItem(itemId)
      } else {
        item.quantity = Math.max(1, quantity)
      }
    }
  }

  const clearCart = () => {
    items.value = []
  }

  const toggleCart = () => {
    isOpen.value = !isOpen.value
  }

  const closeCart = () => {
    isOpen.value = false
  }

  const openCart = () => {
    isOpen.value = true
  }

  const setShippingMethod = (method: ShippingInfo['method']) => {
    shippingMethod.value = method
  }

  // Utility methods
  const getItemById = (itemId: string) => {
    return items.value.find(item => item.id === itemId)
  }

  const hasItem = (itemId: string) => {
    return items.value.some(item => item.id === itemId)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  // Persistence
  const saveToStorage = () => {
    try {
      localStorage.setItem('cart-items', JSON.stringify(items.value))
      localStorage.setItem('shipping-method', shippingMethod.value)
    } catch (error) {
      console.warn('Failed to save cart to storage:', error)
    }
  }

  const loadFromStorage = () => {
    try {
      const savedItems = localStorage.getItem('cart-items')
      const savedShipping = localStorage.getItem('shipping-method')
      
      if (savedItems) {
        items.value = JSON.parse(savedItems)
      }
      
      if (savedShipping) {
        shippingMethod.value = savedShipping as ShippingInfo['method']
      }
    } catch (error) {
      console.warn('Failed to load cart from storage:', error)
    }
  }

  return {
    // State
    items: readonly(items),
    isOpen,
    shippingMethod: readonly(shippingMethod),
    
    // Computed
    itemCount,
    subtotal,
    shippingCost,
    tax,
    total,
    isEmpty,
    shippingOptions,
    
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    closeCart,
    openCart,
    setShippingMethod,
    
    // Utilities
    getItemById,
    hasItem,
    formatPrice,
    saveToStorage,
    loadFromStorage
  }
}, {
  persist: true // Enable persistence with Pinia plugin
})