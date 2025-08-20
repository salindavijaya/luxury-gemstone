import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface RecentlyViewedItem {
  id: string;
  name: string;
  price: number;
  image: string;
  timestamp: Date;
}

export const useDashboardStore = defineStore("dashboard", () => {
  const recentlyViewed = ref<RecentlyViewedItem[]>([]);
  const notificationCount = ref(0);
  const unreadOrders = ref(0);

  const addToRecentlyViewed = (item: Omit<RecentlyViewedItem, "timestamp">) => {
    // Remove if already exists
    recentlyViewed.value = recentlyViewed.value.filter((i) => i.id !== item.id);

    // Add to front
    recentlyViewed.value.unshift({
      ...item,
      timestamp: new Date(),
    });

    // Keep only last 10 items
    if (recentlyViewed.value.length > 10) {
      recentlyViewed.value.pop();
    }
  };

  const clearRecentlyViewed = () => {
    recentlyViewed.value = [];
  };

  const incrementNotifications = () => {
    notificationCount.value++;
  };

  const clearNotifications = () => {
    notificationCount.value = 0;
  };

  const incrementUnreadOrders = () => {
    unreadOrders.value++;
  };

  const clearUnreadOrders = () => {
    unreadOrders.value = 0;
  };

  const hasNotifications = computed(() => notificationCount.value > 0);
  const hasUnreadOrders = computed(() => unreadOrders.value > 0);

  return {
    recentlyViewed,
    notificationCount,
    unreadOrders,
    hasNotifications,
    hasUnreadOrders,
    addToRecentlyViewed,
    clearRecentlyViewed,
    incrementNotifications,
    clearNotifications,
    incrementUnreadOrders,
    clearUnreadOrders,
  };
});
