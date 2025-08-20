import { defineStore } from "pinia";
import { ref, computed, readonly } from "vue";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export const useCartStore = defineStore("cart", () => {
  const items = ref<CartItem[]>([]);
  const isOpen = ref(false);

  const itemCount = computed(() =>
    items.value.reduce((t, i) => t + i.quantity, 0)
  );
  const subtotal = computed(() =>
    items.value.reduce((t, i) => t + i.price * i.quantity, 0)
  );

  function addItem(item: Omit<CartItem, "quantity"> & { quantity?: number }) {
    const idx = items.value.findIndex((i) => i.id === item.id);
    if (idx > -1) items.value[idx].quantity += item.quantity || 1;
    else
      items.value.push({ ...(item as CartItem), quantity: item.quantity || 1 });
    isOpen.value = true;
  }

  function removeItem(id: string) {
    items.value = items.value.filter((i) => i.id !== id);
  }

  function updateQuantity(id: string, qty: number) {
    const it = items.value.find((i) => i.id === id);
    if (!it) return;
    if (qty <= 0) removeItem(id);
    else it.quantity = Math.max(1, qty);
  }

  function clearCart() {
    items.value = [];
  }

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(p);

  const save = () => {
    try {
      localStorage.setItem("cart", JSON.stringify(items.value));
    } catch {}
  };
  const load = () => {
    try {
      const s = localStorage.getItem("cart");
      if (s) items.value = JSON.parse(s);
    } catch {}
  };

  return {
    items: readonly(items),
    isOpen,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    formatPrice,
    save,
    load,
  };
});
