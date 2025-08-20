<!-- DashboardSidebar.vue -->
<template>
  <div class="w-64 bg-white shadow-lg border-r border-slate-200 h-full">
    <div class="p-6">
      <div class="flex items-center space-x-3">
        <div
          class="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center"
        >
          <GemIcon class="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 class="text-lg font-bold text-slate-900">Gemstone</h2>
          <p class="text-xs text-slate-500">Luxury Collection</p>
        </div>
      </div>
    </div>

    <nav class="px-3 pb-6">
      <div class="space-y-1">
        <button
          v-for="item in navigationItems"
          :key="item.id"
          @click="$emit('navigate', item.id)"
          :class="[
            'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            currentPage === item.id
              ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-600'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900',
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.label }}
          <span
            v-if="item.badge"
            class="ml-auto bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full"
          >
            {{ item.badge }}
          </span>
        </button>
      </div>

      <div class="mt-8 pt-6 border-t border-slate-200">
        <h3
          class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3"
        >
          Quick Actions
        </h3>
        <div class="space-y-1">
          <button
            v-for="action in quickActions"
            :key="action.id"
            @click="handleQuickAction(action.id)"
            class="w-full flex items-center px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors"
          >
            <component :is="action.icon" class="w-4 h-4 mr-3" />
            {{ action.label }}
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useWishlistStore } from "@/features/wishlist/store";
import { useNotificationsStore } from "@/features/notifications/store";
import {
  HomeIcon,
  ShoppingBagIcon,
  HeartIcon,
  MapPinIcon,
  SettingsIcon,
  SearchIcon,
  GiftIcon,
  GemIcon,
} from "lucide-vue-next";

interface Props {
  isMobile: boolean;
  currentPage: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  navigate: [page: string];
}>();

const wishlistStore = useWishlistStore();
const notificationsStore = useNotificationsStore();

const navigationItems = computed(() => [
  {
    id: "overview",
    label: "Overview",
    icon: HomeIcon,
  },
  {
    id: "orders",
    label: "Orders",
    icon: ShoppingBagIcon,
  },
  {
    id: "wishlist",
    label: "Wishlist",
    icon: HeartIcon,
    badge: wishlistStore.totalItems || undefined,
  },
  {
    id: "addresses",
    label: "Addresses",
    icon: MapPinIcon,
  },
  {
    id: "settings",
    label: "Settings",
    icon: SettingsIcon,
  },
]);

const quickActions = [
  {
    id: "browse",
    label: "Browse Gemstones",
    icon: SearchIcon,
  },
  {
    id: "gift-cards",
    label: "Gift Cards",
    icon: GiftIcon,
  },
];

const handleQuickAction = (actionId: string) => {
  switch (actionId) {
    case "browse":
      window.location.href = "/products";
      break;
    case "gift-cards":
      window.location.href = "/gift-cards";
      break;
  }
};
</script>
