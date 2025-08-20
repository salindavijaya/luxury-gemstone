import { computed } from "vue";
import { useCartStore } from "@/features/cart/store";
import type { Product } from "@/features/products/store";

/**
 * Composable for cart management
 * Provides reactive cart state and operations
 */
export function useCart() {
  const cartStore = useCartStore();

  // Reactive state
  const items = computed(() => cartStore.items);
  const itemCount = computed(() => cartStore.itemCount);
  const subtotal = computed(
    () => (cartStore as any).subtotal ?? (cartStore as any).totalPrice ?? 0
  );
  const tax = computed(() => (cartStore as any).tax ?? 0);
  const shipping = computed(() => (cartStore as any).shipping ?? 0);
  const discount = computed(() => (cartStore as any).discount ?? 0);
  const total = computed(
    () => (cartStore as any).total ?? (cartStore as any).totalPrice ?? 0
  );
  const isLoading = computed(() => (cartStore as any).isLoading ?? false);
  const error = computed(() => (cartStore as any).error ?? null);

  // Cart operations
  const addItem = async (product: any, quantity: number = 1, options?: any) => {
    try {
      await cartStore.addItem(product, quantity, options);
      return true;
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      return false;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await cartStore.removeItem(itemId);
      return true;
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      return false;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeItem(itemId);
    }

    try {
      await cartStore.updateQuantity(itemId, quantity);
      return true;
    } catch (error) {
      console.error("Failed to update item quantity:", error);
      return false;
    }
  };

  const moveToSavedForLater = async (itemId: string) => {
    try {
      await cartStore.moveToSavedForLater(itemId);
      return true;
    } catch (error) {
      console.error("Failed to move item to saved for later:", error);
      return false;
    }
  };

  const moveToCart = async (itemId: string) => {
    try {
      await cartStore.moveToCart(itemId);
      return true;
    } catch (error) {
      console.error("Failed to move item to cart:", error);
      return false;
    }
  };

  const clearCart = async () => {
    try {
      await cartStore.clearCart();
      return true;
    } catch (error) {
      console.error("Failed to clear cart:", error);
      return false;
    }
  };

  const applyDiscountCode = async (code: string) => {
    try {
      const fn =
        (cartStore as any).applyDiscountCode ??
        (cartStore as any).applyPromoCode;
      const success = fn ? await fn.call(cartStore, code) : false;
      return success;
    } catch (error) {
      console.error("Failed to apply discount code:", error);
      return false;
    }
  };

  const removeDiscountCode = async () => {
    try {
      const fn =
        (cartStore as any).removeDiscountCode ??
        (cartStore as any).removePromoCode;
      if (fn) await fn.call(cartStore);
      return true;
    } catch (error) {
      console.error("Failed to remove discount code:", error);
      return false;
    }
  };

  const restoreRecentItem = async (itemId: string) => {
    try {
      await cartStore.restoreRecentItem(itemId);
      return true;
    } catch (error) {
      console.error("Failed to restore recent item:", error);
      return false;
    }
  };

  // Utility functions
  const isItemInCart = (productId: string): boolean => {
    return cartStore.items.some((item: any) =>
      item.product ? item.product.id === productId : item.id === productId
    );
  };

  const getItemQuantity = (productId: string): number => {
    const item = cartStore.items.find((item: any) =>
      item.product ? item.product.id === productId : item.id === productId
    );
    return item ? item.quantity : 0;
  };

  const canAddItem = (product: Product, quantity: number = 1): boolean => {
    if (!product.inStock) return false;

    const currentQuantity = getItemQuantity(product.id);
    const totalQuantity = currentQuantity + quantity;

    return totalQuantity <= (product.stockQuantity || 0);
  };

  const getItemTotal = (item: any): number => {
    const product = item.product ? item.product : item;
    const basePrice = item.salePrice || product.price || 0;
    return basePrice * (item.quantity || 0);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const validateCartForCheckout = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (items.value.length === 0) {
      errors.push("Cart is empty");
    }

    for (const item of items.value) {
      const product = (item as any).product ? (item as any).product : item;
      if (!product.inStock) {
        errors.push(`${product.name} is out of stock`);
      }

      if ((item.quantity || 0) > (product.stockQuantity || 0)) {
        errors.push(`Only ${product.stockQuantity} ${product.name} available`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  };

  // Analytics helpers
  const getCartAnalytics = () => {
    return {
      itemCount: itemCount.value,
      subtotal: subtotal.value,
      total: total.value,
      averageItemValue: subtotal.value / (itemCount.value || 1),
      categories: [
        ...new Set(
          items.value.map((item: any) =>
            item.product ? item.product.category : item.category
          )
        ),
      ],
      topItem: items.value.reduce(
        (top: any, item: any) =>
          getItemTotal(item) > getItemTotal(top) ? item : top,
        items.value[0]
      ),
    };
  };

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
    updateTax: cartStore.updateTax,
  };
}
