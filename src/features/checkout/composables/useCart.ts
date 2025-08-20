import { computed } from "vue";
import { useCartStore } from "@/features/cart/store";

export const useCart = () => {
  const store = useCartStore();

  const cartItems = computed(() => store.items);
  const cartTotal = computed(() => store.total);
  const itemCount = computed(() => store.itemCount);
  const isEmpty = computed(() => store.isEmpty);

  const addToCart = (item: any, quantity = 1) => {
    store.addItem(item, quantity);
  };

  const removeFromCart = (itemId: string) => {
    store.removeItem(itemId);
  };

  const updateQuantity = (item: any) => {
    const foundItem = store.items.find((i: any) => i.id === item.id);
    if (foundItem) {
      foundItem.quantity = item.quantity;
    }
  };

  const clearCart = () => {
    store.clearCart();
  };

  const validateCartForCheckout = () => {
    // Check if cart has items
    if (isEmpty.value) {
      throw new Error("Cart is empty");
    }

    // Check if all items are in stock
    const outOfStockItems = cartItems.value.filter((item) => !item.inStock);
    if (outOfStockItems.length > 0) {
      throw new Error("Some items are out of stock");
    }

    return true;
  };

  return {
    items: cartItems,
    total: cartTotal,
    itemCount,
    isEmpty,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    validateCartForCheckout,
  };
};
