// stores/notifications.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Notification } from "@/types";

export const useNotificationsStore = defineStore("notifications", () => {
  const notifications = ref<Notification[]>([]);

  const unreadCount = computed(
    () => notifications.value.filter((n) => !n.read).length
  );

  const recentNotifications = computed(() => notifications.value.slice(0, 5));

  const addNotification = (notification: Omit<Notification, "id">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
    };
    notifications.value.unshift(newNotification);
  };

  // backward-compatible alias used in some components
  const add = (notification: Omit<Notification, "id">) =>
    addNotification(notification);

  const markAsRead = async (id: string) => {
    const notification = notifications.value.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
    }
  };

  const markAllAsRead = async () => {
    notifications.value.forEach((n) => (n.read = true));
  };

  const deleteNotification = async (id: string) => {
    notifications.value = notifications.value.filter((n) => n.id !== id);
  };

  return {
    notifications,
    unreadCount,
    recentNotifications,
    addNotification,
    add,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
});
