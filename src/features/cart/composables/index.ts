import { useCartStore } from "@/features/cart/store";

export const useCart = () => {
  const store = useCartStore();

  const addToCart = (item: any) =>
    (store as any).addItem && (store as any).addItem(item);

  return {
    // Keep refs/methods as-is (don't spread the store to avoid unwrapping refs)
    items: (store as any).items,
    isOpen: (store as any).isOpen,
    itemCount: (store as any).itemCount,
    totalPrice: (store as any).totalPrice ?? (store as any).subtotal,
    total:
      (store as any).total ??
      (store as any).totalPrice ??
      (store as any).subtotal,
    isEmpty: (store as any).isEmpty,

    // actions
    addItem: (store as any).addItem,
    addToCart,
    removeItem: (store as any).removeItem,
    updateQuantity: (store as any).updateQuantity,
    clearCart: (store as any).clearCart,
    toggleCart: (store as any).toggleCart,

    // compatibility helpers
    savedForLater: (store as any).savedForLater,
    recentlyRemoved: (store as any).recentlyRemoved,
    discountCode: (store as any).discountCode,
    applyDiscountCode:
      (store as any).applyDiscountCode ?? (store as any).applyPromoCode,
    removeDiscountCode:
      (store as any).removeDiscountCode ?? (store as any).removePromoCode,
    validateCartForCheckout: (store as any).validateCartForCheckout,
    initializeCart: (store as any).initializeCart,
    updateShipping: (store as any).updateShipping,
    updateTax: (store as any).updateTax,
  };
};
