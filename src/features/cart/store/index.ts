import { defineStore } from "pinia";
import { ref, computed } from "vue";

// Cart store state type
export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

// Cart item type
export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  gemType: string;
  carat: number;
  cut: string;
  color: string;
  clarity: string;
  quantity: number;
  inStock: boolean;
  // compatibility fields used by templates
  category?: string;
  weight?: number;
  certification?: string;
  insuranceSelected?: boolean;
  appraisalRequested?: boolean;
  specialInstructions?: string;
  gemstone?: string;
  // per-cart computed/derived fields
  insurance?: boolean | number;
  discountAmount?: number;
}

export interface ShippingInfo {
  method: "standard" | "express" | "overnight";
  cost: number;
  estimatedDays: string;
}

export const useCartStore = defineStore("cart", () => {
  // State
  const items = ref<CartItem[]>([]);
  const isOpen = ref(false);
  const shippingMethod = ref<ShippingInfo["method"]>("standard");
  const promoCode = ref("");
  const promoDiscount = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  // Compatibility shims
  const recentlyRemoved = ref<CartItem[]>([]);
  const savedForLater = ref<CartItem[]>([]);
  const discountCode = computed(() =>
    promoCode.value
      ? {
          code: promoCode.value,
          type: "percentage",
          value: promoDiscount.value,
          description: "",
        }
      : null
  );

  // Getters
  const itemCount = computed(() =>
    items.value.reduce((total, item) => total + item.quantity, 0)
  );

  const subtotal = computed(() =>
    items.value.reduce((total, item) => total + item.price * item.quantity, 0)
  );

  const shippingCost = computed(() => {
    const shippingRates = {
      standard: 0, // Free shipping for luxury items
      express: 25,
      overnight: 50,
    };
    return subtotal.value > 1000 ? 0 : shippingRates[shippingMethod.value];
  });

  const discount = computed(() => {
    return Math.round(subtotal.value * (promoDiscount.value / 100));
  });

  // compatibility alias expected by UI
  const discountAmount = computed(() => discount.value);

  const total = computed(() =>
    Math.max(0, subtotal.value + shippingCost.value - discount.value)
  );

  // Backwards compatibility aliases used in older components
  const itemsCount = computed(() => itemCount.value);
  const totalPrice = computed(() => total.value);

  const isEmpty = computed(() => items.value.length === 0);

  // Actions
  // Accept optional quantity and options for backward compatibility
  const addItem = async (
    product: Omit<CartItem, "quantity"> | CartItem,
    quantity: number = 1,
    options?: Partial<CartItem>
  ) => {
    try {
      isLoading.value = true;
      error.value = null;

      const id = (product as any).id;
      const existingItem = items.value.find((item) => item.id === id);

      if (existingItem) {
        if (existingItem.quantity < 5) {
          // Max quantity limit
          existingItem.quantity += quantity;
        } else {
          throw new Error("Maximum quantity reached for this item");
        }
      } else {
        const base =
          "quantity" in (product as any)
            ? (product as CartItem)
            : { ...(product as any), quantity };
        items.value.push({ ...base, ...options });
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to add item to cart";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // alias for older API
  const addToCart = async (
    product: Omit<CartItem, "quantity"> | CartItem,
    quantity: number = 1,
    options?: Partial<CartItem>
  ) => addItem(product, quantity, options);

  const removeItem = async (itemId: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const index = items.value.findIndex((item) => item.id === itemId);
      if (index > -1) {
        const [removed] = items.value.splice(index, 1);
        recentlyRemoved.value.unshift(removed);
        if (recentlyRemoved.value.length > 5)
          recentlyRemoved.value = recentlyRemoved.value.slice(0, 5);
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to remove item";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1 || quantity > 5) {
      throw new Error("Quantity must be between 1 and 5");
    }

    try {
      isLoading.value = true;
      error.value = null;

      const item = items.value.find((item) => item.id === itemId);
      if (item) {
        item.quantity = quantity;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to update quantity";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const applyPromoCode = async (code: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      // Simulate API call to validate promo code
      await new Promise((resolve) => setTimeout(resolve, 500));

      const validCodes: Record<string, number> = {
        LUXURY10: 10,
        FIRST15: 15,
        PREMIUM20: 20,
        VIP25: 25,
      };

      if (validCodes[code.toUpperCase()]) {
        promoCode.value = code.toUpperCase();
        promoDiscount.value = validCodes[code.toUpperCase()];
      } else {
        throw new Error("Invalid promo code");
      }
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to apply promo code";
      promoCode.value = "";
      promoDiscount.value = 0;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const removePromoCode = () => {
    promoCode.value = "";
    promoDiscount.value = 0;
  };

  // Backwards-compatible methods for saved for later and restoration
  const restoreRecentItem = async (itemId: string) => {
    const item = recentlyRemoved.value.find((r) => r.id === itemId);
    if (item) {
      items.value.unshift(item);
      recentlyRemoved.value = recentlyRemoved.value.filter(
        (r) => r.id !== itemId
      );
      saveCart();
      return true;
    }
    return false;
  };

  // Generic restore: accept id or item object
  const restoreItemGeneric = async (itemOrId: string | CartItem) => {
    if (!itemOrId) return false;
    if (typeof itemOrId === "string") return restoreRecentItem(itemOrId);
    // item object passed directly
    const existing = items.value.find((i) => i.id === itemOrId.id);
    if (!existing) {
      items.value.unshift(itemOrId);
      saveCart();
      return true;
    }
    return false;
  };

  const moveToSavedForLater = async (itemId: string) => {
    const idx = items.value.findIndex((i) => i.id === itemId);
    if (idx > -1) {
      const [item] = items.value.splice(idx, 1);
      savedForLater.value.unshift(item);
      saveCart();
      return true;
    }
    return false;
  };

  const moveToCart = async (itemId: string) => {
    const idx = savedForLater.value.findIndex((i) => i.id === itemId);
    if (idx > -1) {
      const [item] = savedForLater.value.splice(idx, 1);
      items.value.unshift(item);
      saveCart();
      return true;
    }
    return false;
  };

  const toggleInsurance = (itemId: string | CartItem) => {
    const id = typeof itemId === "string" ? itemId : itemId?.id;
    const item = items.value.find((i) => i.id === id);
    if (item) {
      item.insuranceSelected = !item.insuranceSelected;
      saveCart();
    }
  };

  const updateTax = (_rate: number) => {
    // shim: no-op for now
    return;
  };

  const updateShipping = (method: ShippingInfo["method"]) => {
    shippingMethod.value = method;
  };

  const clearCart = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      items.value = [];
      promoCode.value = "";
      promoDiscount.value = 0;
      shippingMethod.value = "standard";

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to clear cart";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const toggleCart = () => {
    isOpen.value = !isOpen.value;
  };

  const openCart = () => {
    isOpen.value = true;
  };

  const closeCart = () => {
    isOpen.value = false;
  };

  // Utility functions
  const getShippingOptions = (): ShippingInfo[] => [
    {
      method: "standard",
      cost: subtotal.value > 1000 ? 0 : 0,
      estimatedDays: "5-7 business days",
    },
    {
      method: "express",
      cost: subtotal.value > 1000 ? 0 : 25,
      estimatedDays: "2-3 business days",
    },
    {
      method: "overnight",
      cost: subtotal.value > 1000 ? 0 : 50,
      estimatedDays: "1 business day",
    },
  ];

  const isItemInCart = (productId: string): boolean => {
    return items.value.some((item) => item.id === productId);
  };

  const getItemQuantity = (productId: string): number => {
    const item = items.value.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Clear error after 5 seconds
  const clearError = () => {
    setTimeout(() => {
      error.value = null;
    }, 5000);
  };

  // Initialize cart from localStorage on store creation
  const initializeCart = () => {
    try {
      const savedCart = localStorage.getItem("luxury-gems-cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        items.value = parsedCart.items || [];
        promoCode.value = parsedCart.promoCode || "";
        promoDiscount.value = parsedCart.promoDiscount || 0;
        shippingMethod.value = parsedCart.shippingMethod || "standard";
        recentlyRemoved.value = parsedCart.recentlyRemoved || [];
        savedForLater.value = parsedCart.savedForLater || [];
      }
    } catch (err) {
      console.warn("Failed to load cart from localStorage:", err);
    }
  };

  // Save cart to localStorage whenever it changes
  const saveCart = () => {
    try {
      const cartData = {
        items: items.value,
        promoCode: promoCode.value,
        promoDiscount: promoDiscount.value,
        shippingMethod: shippingMethod.value,
        recentlyRemoved: recentlyRemoved.value,
        savedForLater: savedForLater.value,
      };
      localStorage.setItem("luxury-gems-cart", JSON.stringify(cartData));
    } catch (err) {
      console.warn("Failed to save cart to localStorage:", err);
    }
  };

  return {
    // State
    items,
    isOpen,
    shippingMethod,
    promoCode,
    promoDiscount,
    isLoading,
    error,
    recentlyRemoved,
    savedForLater,
    discountCode,

    // Getters
    itemCount,
    subtotal,
    shippingCost,
    discount,
    discountAmount,
    total,
    // backward-compatible aliases
    itemsCount,
    totalPrice,
    isEmpty,

    // Actions
    addItem,
    addToCart,
    removeItem,
    updateQuantity,
    applyPromoCode,
    removePromoCode,
    updateShipping,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    restoreRecentItem,
    moveToSavedForLater,
    moveToCart,
    updateTax,
    toggleInsurance,

    // Compatibility aliases (older components expect these)
    savedItems: savedForLater,
    loadCart: initializeCart,
    saveForLater: moveToSavedForLater,
    restoreItem: restoreItemGeneric,
    saveAllForLater: () => {
      // move all items to savedForLater
      savedForLater.value = [...items.value, ...savedForLater.value];
      items.value = [];
      saveCart();
    },
    tax: 0,

    // Utilities
    getShippingOptions,
    isItemInCart,
    getItemQuantity,
    clearError,
    initializeCart,
    saveCart,
  };
});
