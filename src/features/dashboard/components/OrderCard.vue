<!-- OrderCard.vue -->
<template>
  <div
    class="bg-white rounded-lg shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow"
  >
    <div
      class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
    >
      <!-- Order Info -->
      <div class="flex-1">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-slate-900">
              Order #{{ order.orderNumber }}
            </h3>
            <p class="text-slate-500 text-sm">
              Placed on {{ formatDate(order.date) }}
            </p>
          </div>
          <span
            :class="[
              'inline-flex px-3 py-1 text-xs font-medium rounded-full',
              getStatusClasses(order.status),
            ]"
          >
            {{ getStatusText(order.status) }}
          </span>
        </div>

        <!-- Items Preview -->
        <div class="flex items-center space-x-4 mb-4">
          <div class="flex -space-x-2">
            <img
              v-for="(item, index) in order.items.slice(0, 3)"
              :key="item.id"
              :src="item.image"
              :alt="item.name"
              :class="[
                'w-12 h-12 rounded-lg border-2 border-white object-cover',
                index > 0 ? 'ml-2' : '',
              ]"
            />
            <div
              v-if="order.items.length > 3"
              class="w-12 h-12 bg-slate-100 rounded-lg border-2 border-white flex items-center justify-center text-xs font-medium text-slate-600"
            >
              +{{ order.items.length - 3 }}
            </div>
          </div>
          <div>
            <p class="font-medium text-slate-900">
              {{ order.items.length }} item{{
                order.items.length === 1 ? "" : "s"
              }}
            </p>
            <p class="text-2xl font-bold text-emerald-600">
              ${{ order.total.toFixed(2) }}
            </p>
          </div>
        </div>

        <!-- Tracking Info -->
        <div v-if="order.tracking && order.status !== 'delivered'" class="mb-4">
          <div class="flex items-center space-x-2 text-sm text-slate-600">
            <TruckIcon class="w-4 h-4" />
            <span>Tracking: {{ order.tracking }}</span>
            <span v-if="order.estimatedDelivery" class="text-emerald-600">
              • Est. delivery {{ formatDate(order.estimatedDelivery ?? "") }}
            </span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 lg:flex-col lg:w-48">
        <button
          @click="$emit('view-details', order)"
          class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
        >
          View Details
        </button>
        <button
          v-if="order.tracking && order.status !== 'delivered'"
          @click="$emit('track-order', order)"
          class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          Track Order
        </button>
        <button
          @click="$emit('reorder', order)"
          class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          Reorder
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TruckIcon } from "lucide-vue-next";
import type { Order } from "@/types";

interface Props {
  order: Order;
}

defineProps<Props>();
defineEmits<{
  "view-details": [order: Order];
  "track-order": [order: Order];
  reorder: [order: Order];
}>();

import { formatDate } from "@/utils/formatDate";

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
</script>
