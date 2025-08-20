import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import type { CartItem, Product } from '@/types/cart'

/**
 * Composable for cart management
 * Provides reactive cart state and operations
 */
export function useCart() {
  const cartStore = useCartStore()

  // Reactive state
  const items = computed(() => cartStore.items)
  const itemCount = computed(() => cartStore.itemCount)
  const subtotal = computed(() => cartStore.subtotal)
  const tax = computed(() => cartStore.tax)
  const shipping = computed(() => cartStore.shipping)
  const discount = computed(() => cartStore.discount)
  const total = computed(() => cartStore.total)
  const isLoading = computed(() => cartStore.isLoading)
  const error = computed(() => cartStore.error)

  // Cart operations
  const addItem = async (product: Product, quantity: number = 1, options?: any) => {
    try {
      await cartStore.addItem(product, quantity, options)
      return true
    } catch (error) {
      console.error('Failed to add item to cart:', error)
      return false
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      await cartStore.removeItem(itemId)
      return true
    } catch (error) {
      console.error('Failed to remove item from cart:', error)
      return false
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeItem(itemId)
    }
    
    try {
      await cartStore.updateQuantity(itemId, quantity)
      return true
    } catch (error) {
      console.error('Failed to update item quantity:', error)
      return false
    }
  }

  const moveToSavedForLater = async (itemId: string) => {
    try {
      await cartStore.moveToSavedForLater(itemId)
      return true
    } catch (error) {
      console.error('Failed to move item to saved for later:', error)
      return false
    }
  }

  const moveToCart = async (itemId: string) => {
    try {
      await cartStore.moveToCart(itemId)
      return true
    } catch (error) {
      console.error('Failed to move item to cart:', error)
      return false
    }
  }

  const clearCart = async () => {
    try {
      await cartStore.clearCart()
      return true
    } catch (error) {
      console.error('Failed to clear cart:', error)
      return false
    }
  }

  const applyDiscountCode = async (code: string) => {
    try {
      const success = await cartStore.applyDiscountCode(code)
      return success
    } catch (error) {
      console.error('Failed to apply discount code:', error)
      return false
    }
  }

  const removeDiscountCode = async () => {
    try {
      await cartStore.removeDiscountCode()
      return true
    } catch (error) {
      console.error('Failed to remove discount code:', error)
      return false
    }
  }

  const restoreRecentItem = async (itemId: string) => {
    try {
      await cartStore.restoreRecentItem(itemId)
      return true
    } catch (error) {
      console.error('Failed to restore recent item:', error)
      return false
    }
  }

  // Utility functions
  const isItemInCart = (productId: string): boolean => {
    return cartStore.items.some(item => item.product.id === productId)
  }

  const getItemQuantity = (productId: string): number => {
    const item = cartStore.items.find(item => item.product.id === productId)
    return item ? item.quantity : 0
  }

  const canAddItem = (product: Product, quantity: number = 1): boolean => {
    if (!product.inStock) return false
    
    const currentQuantity = getItemQuantity(product.id)
    const totalQuantity = currentQuantity + quantity
    
    return totalQuantity <= (product.stockQuantity || 0)
  }

  const getItemTotal = (item: CartItem): number => {
    const basePrice = item.salePrice || item.product.price
    return basePrice * item.quantity
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const validateCartForCheckout = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = []
    
    if (items.value.length === 0) {
      errors.push('Cart is empty')
    }
    
    for (const item of items.value) {
      if (!item.product.inStock) {
        errors.push(`${item.product.name} is out of stock`)
      }
      
      if (item.quantity > (item.product.stockQuantity || 0)) {
        errors.push(`Only ${item.product.stockQuantity} ${item.product.name} available`)
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  // Analytics helpers
  const getCartAnalytics = () => {
    return {
      itemCount: itemCount.value,
      subtotal: subtotal.value,
      total: total.value,
      averageItemValue: subtotal.value / (itemCount.value || 1),
      categories: [...new Set(items.value.map(item => item.product.category))],
      topItem: items.value.reduce((top, item) => 
        getItemTotal(item) > getItemTotal(top) ? item : top, items.value[0]
      )
    }
  }

  return {
    // State
    items,
    itemCount,
    subtotal,
    tax,
    shipping,
    discount,
    total,
    isLoading,
    error,
    savedForLater: computed(() => cartStore.savedForLater),
    recentlyRemoved: computed(() => cartStore.recentlyRemoved),
    discountCode: computed(() => cartStore.discountCode),
    
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    moveToSavedForLater,
    moveToCart,
    clearCart,
    applyDiscountCode,
    removeDiscountCode,
    restoreRecentItem,
    
    // Utilities
    isItemInCart,
    getItemQuantity,
    canAddItem,
    getItemTotal,
    formatCurrency,
    validateCartForCheckout,
    getCartAnalytics,
    
    // Store methods
    initializeCart: cartStore.initializeCart,
    updateShipping: cartStore.updateShipping,
    updateTax: cartStore.updateTax
  }
}