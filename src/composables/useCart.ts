### composables/useCart.ts
```typescript
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

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
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isOpen = ref(false)

  // Computed values
  const itemCount = computed(() => 
    items.value.reduce((total, item) => total + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  )

  const isEmpty = computed(() => items.value.length === 0)

  // Methods
  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const existingItem = items.value.find(cartItem => cartItem.id === item.id)
    
    if (existingItem) {
      existingItem.quantity += item.quantity || 1
    } else {
      items.value.push({
        ...item,
        quantity: item.quantity || 1
      })
    }
    
    // Auto-open cart for visual feedback
    isOpen.value = true
    setTimeout(() => {
      isOpen.value = false
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
        item.quantity = quantity
      }
    }
  }

  const clearCart = () => {
    items.value = []
  }

  const toggleCart = () => {
    isOpen.value = !isOpen.value
  }

  return {
    // State
    items: readonly(items),
    isOpen,
    
    // Computed
    itemCount,
    totalPrice,
    isEmpty,
    
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart
  }
})

// Composable wrapper
export const useCart = () => {
  const store = useCartStore()
  
  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    store.addItem(item)
  }
  
  return {
    ...store,
    addToCart
  }
}