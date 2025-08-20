<!-- OrderDetails.vue -->
<template>
  <div class="max-w-4xl mx-auto">
    <div class="space-y-6">
      <!-- Order Header -->
      <div class="bg-slate-50 rounded-lg p-6">
        <div
          class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h2 class="text-2xl font-bold text-slate-900 mb-2">
              Order #{{ order.orderNumber }}
            </h2>
            <div class="flex items-center space-x-4 text-sm text-slate-600">
              <span>Placed {{ formatDate(order.date) }}</span>
              <span>•</span>
              <span class="flex items-center">
                <CreditCardIcon class="w-4 h-4 mr-1" />
                {{ order.paymentMethod }}
              </span>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <span
              :class="[
                'inline-flex px-3 py-2 text-sm font-medium rounded-lg',
                getStatusClasses(order.status),
              ]"
            >
              {{ getStatusText(order.status) }}
            </span>
            <button
              v-if="order.status !== 'cancelled'"
              @click="showInvoice = true"
              class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <PrinterIcon class="w-4 h-4 mr-2 inline" />
              Invoice
            </button>
          </div>
        </div>
      </div>

      <!-- Order Tracking -->
      <div
        v-if="order.tracking"
        class="bg-white rounded-lg border border-slate-200 p-6"
      >
        <h3 class="text-lg font-semibold text-slate-900 mb-4">
          Order Tracking
        </h3>
        <OrderTracker :order="order" />
      </div>

      <!-- Order Items -->
      <div class="bg-white rounded-lg border border-slate-200">
        <div class="p-6 border-b border-slate-200">
          <h3 class="text-lg font-semibold text-slate-900">Order Items</h3>
        </div>
        <div class="p-6">
          <div class="space-y-6">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex items-start space-x-4 pb-6 border-b border-slate-200 last:border-b-0 last:pb-0"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="w-24 h-24 rounded-lg object-cover"
              />
              <div class="flex-1">
                <h4 class="text-lg font-medium text-slate-900 mb-2">
                  {{ item.name }}
                </h4>
                <div
                  class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-3"
                >
                  <div>
                    <span class="font-medium">Type:</span>
                    {{ item.gemstoneType }}
                  </div>
                  <div>
                    <span class="font-medium">Weight:</span> {{ item.weight }}ct
                  </div>
                  <div>
                    <span class="font-medium">Cut:</span> {{ item.cut }}
                  </div>
                  <div>
                    <span class="font-medium">Clarity:</span> {{ item.clarity }}
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="text-sm text-slate-600">
                    <span class="font-medium">SKU:</span> {{ item.sku }}
                    <span v-if="item.certification" class="ml-4">
                      <ShieldCheckIcon class="w-4 h-4 inline mr-1" />
                      {{ item.certification }}
                    </span>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-semibold text-slate-900">
                      ${{ item.price.toFixed(2) }}
                    </p>
                    <p class="text-sm text-slate-500">
                      Qty: {{ item.quantity }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Addresses and Payment -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Shipping Address -->
        <div class="bg-white rounded-lg border border-slate-200 p-6">
          <h3
            class="text-lg font-semibold text-slate-900 mb-4 flex items-center"
          >
            <TruckIcon class="w-5 h-5 mr-2" />
            Shipping Address
          </h3>
          <div class="text-sm text-slate-600 space-y-1">
            <p class="font-medium text-slate-900">
              {{ order.shippingAddress.firstName }}
              {{ order.shippingAddress.lastName }}
            </p>
            <p v-if="order.shippingAddress.company">
              {{ order.shippingAddress.company }}
            </p>
            <p>{{ order.shippingAddress.address1 }}</p>
            <p v-if="order.shippingAddress.address2">
              {{ order.shippingAddress.address2 }}
            </p>
            <p>
              {{ order.shippingAddress.city }},
              {{ order.shippingAddress.state }}
              {{ order.shippingAddress.postalCode }}
            </p>
            <p>{{ order.shippingAddress.country }}</p>
          </div>
        </div>

        <!-- Billing Address -->
        <div class="bg-white rounded-lg border border-slate-200 p-6">
          <h3
            class="text-lg font-semibold text-slate-900 mb-4 flex items-center"
          >
            <CreditCardIcon class="w-5 h-5 mr-2" />
            Billing Address
          </h3>
          <div class="text-sm text-slate-600 space-y-1">
            <p class="font-medium text-slate-900">
              {{ order.billingAddress.firstName }}
              {{ order.billingAddress.lastName }}
            </p>
            <p v-if="order.billingAddress.company">
              {{ order.billingAddress.company }}
            </p>
            <p>{{ order.billingAddress.address1 }}</p>
            <p v-if="order.billingAddress.address2">
              {{ order.billingAddress.address2 }}
            </p>
            <p>
              {{ order.billingAddress.city }}, {{ order.billingAddress.state }}
              {{ order.billingAddress.postalCode }}
            </p>
            <p>{{ order.billingAddress.country }}</p>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="bg-white rounded-lg border border-slate-200 p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Order Summary</h3>
        <div class="space-y-3">
          <div class="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>${{ (order.total * 0.9).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-slate-600">
            <span>Shipping</span>
            <span>${{ (order.total * 0.05).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-slate-600">
            <span>Tax</span>
            <span>${{ (order.total * 0.05).toFixed(2) }}</span>
          </div>
          <div class="border-t border-slate-200 pt-3">
            <div class="flex justify-between text-lg font-bold text-slate-900">
              <span>Total</span>
              <span>${{ order.total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Invoice Modal -->
    <Modal v-model="showInvoice" title="Order Invoice" size="lg">
      <OrderInvoice :order="order" @close="showInvoice = false" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  TruckIcon,
  CreditCardIcon,
  PrinterIcon,
  ShieldCheckIcon,
} from "lucide-vue-next";
import type { Order } from "@/types";
import OrderTracker from "./OrderTrack.vue";
import OrderInvoice from "./OrderInvoice.vue";
import Modal from "../UI/Modal.vue";

interface Props {
  order: Order;
}

defineProps<Props>();
defineEmits<{
  close: [];
}>();

const showInvoice = ref(false);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
</script>
