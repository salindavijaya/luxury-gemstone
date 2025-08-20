<!-- DashboardOverview.vue -->
<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div
      class="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg p-6 text-white"
    >
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold mb-2">
            Welcome back, {{ user?.firstName }}!
          </h2>
          <p class="text-emerald-100">
            Member since {{ formatDate(user?.memberSince || "") }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-emerald-100 text-sm">Loyalty Points</p>
          <p class="text-2xl font-bold">
            {{ user?.loyaltyPoints?.toLocaleString() ?? "0" }}
          </p>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-lg p-6 shadow-lg border border-slate-200"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-600">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-slate-900 mt-1">
              {{ stat.value }}
            </p>
            <p
              v-if="stat.change"
              :class="[
                'text-sm mt-1',
                stat.changeType === 'positive'
                  ? 'text-emerald-600'
                  : 'text-red-600',
              ]"
            >
              {{ stat.change }}
            </p>
          </div>
          <div :class="['p-3 rounded-lg', stat.bgColor]">
            <component :is="stat.icon" :class="['w-6 h-6', stat.iconColor]" />
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Orders -->
      <div class="bg-white rounded-lg shadow-lg border border-slate-200">
        <div class="p-6 border-b border-slate-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-900">Recent Orders</h3>
            <button
              @click="$emit('navigate', 'orders')"
              class="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
        </div>
        <div class="p-6">
          <div v-if="recentOrders.length === 0" class="text-center py-8">
            <ShoppingBagIcon class="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p class="text-slate-500">No recent orders</p>
            <button
              @click="goToBrowse"
              class="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="order in recentOrders.slice(0, 3)"
              :key="order.id"
              class="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <img
                  :src="order.items[0]?.image"
                  :alt="order.items[0]?.name"
                  class="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p class="font-medium text-slate-900">
                    Order #{{ order.orderNumber }}
                  </p>
                  <p class="text-sm text-slate-500">
                    {{ formatDate(order.date) }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-medium text-slate-900">
                  ${{ order.total.toFixed(2) }}
                </p>
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                    getStatusClasses(order.status),
                  ]"
                >
                  {{ getStatusText(order.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Wishlist Preview -->
      <div class="bg-white rounded-lg shadow-lg border border-slate-200">
        <div class="p-6 border-b border-slate-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-900">Wishlist</h3>
            <button
              @click="$emit('navigate', 'wishlist')"
              class="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
        </div>
        <div class="p-6">
          <div v-if="wishlistItems.length === 0" class="text-center py-8">
            <HeartIcon class="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p class="text-slate-500">Your wishlist is empty</p>
          </div>
          <div v-else class="grid grid-cols-2 gap-4">
            <div
              v-for="item in wishlistItems.slice(0, 4)"
              :key="item.id"
              class="group cursor-pointer"
            >
              <div
                class="aspect-square bg-slate-100 rounded-lg mb-3 overflow-hidden"
              >
                <img
                  :src="item.product.image"
                  :alt="item.product.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h4 class="text-sm font-medium text-slate-900 truncate">
                {{ item.product.name }}
              </h4>
              <p class="text-sm text-emerald-600 font-semibold">
                ${{ item.product.price.toFixed(2) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recently Viewed -->
    <RecentlyViewed />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useUserStore } from "@/features/user/store";
import { useWishlistStore } from "@/features/wishlist/store";
import {
  ShoppingBagIcon,
  HeartIcon,
  TruckIcon,
  StarIcon,
} from "lucide-vue-next";
import RecentlyViewed from "./RecentlyViewed.vue";

const emit = defineEmits<{
  navigate: [page: string];
}>();

const userStore = useUserStore();
const wishlistStore = useWishlistStore();

const user = computed(() => userStore.user);
const wishlistItems = computed(() => wishlistStore.items);

// Mock data - in real app, these would come from API
const recentOrders = ref([]);
const orderStats = ref({
  total: 12,
  thisMonth: 3,
  delivered: 10,
  pending: 2,
});

const stats = computed(() => [
  {
    label: "Total Orders",
    value: orderStats.value.total.toString(),
    change: "+2 this month",
    changeType: "positive",
    icon: ShoppingBagIcon,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    label: "Wishlist Items",
    value: wishlistItems.value.length.toString(),
    icon: HeartIcon,
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600",
  },
  {
    label: "In Transit",
    value: orderStats.value.pending.toString(),
    icon: TruckIcon,
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    label: "Loyalty Points",
    value: (user.value?.loyaltyPoints || 0).toLocaleString(),
    change: "+250 this month",
    changeType: "positive",
    icon: StarIcon,
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
]);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getStatusClasses = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-emerald-100 text-emerald-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "confirmed":
      return "bg-amber-100 text-amber-800";
    case "pending":
      return "bg-slate-100 text-slate-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "delivered":
      return "Delivered";
    case "shipped":
      return "Shipped";
    case "confirmed":
      return "Confirmed";
    case "pending":
      return "Pending";
    case "cancelled":
      return "Cancelled";
    default:
      return "Unknown";
  }
};

const goToBrowse = () => {
  window.location.href = "/products";
};

onMounted(() => {
  // Initialize mock data
  // In a real app, this would be API calls
});
</script>
