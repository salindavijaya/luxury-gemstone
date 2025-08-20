import { defineStore } from "pinia";
import { ref } from "vue";
import type { Order } from "@/types";

export const useOrdersStore = defineStore("orders", () => {
  const orders = ref<Order[]>([]);
  const isLoading = ref(false);

  const fetchOrders = async () => {
    isLoading.value = true;
    try {
      // placeholder: real API integration to come
      await new Promise((r) => setTimeout(r, 200));
      orders.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const getOrderById = (id: string) => orders.value.find((o) => o.id === id);

  return {
    orders,
    isLoading,
    fetchOrders,
    getOrderById,
  };
});
