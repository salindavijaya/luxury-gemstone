<!-- OrderInvoice.vue -->
<template>
  <div class="max-w-4xl mx-auto bg-white">
    <div class="p-8 print:p-0">
      <!-- Header -->
      <div class="flex justify-between items-start mb-8 pb-8 border-b border-slate-200 print:border-slate-400">
        <div>
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
              <GemIcon class="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-slate-900">Gemstone Luxury</h1>
              <p class="text-slate-600">Premium Gemstone Collection</p>
            </div>
          </div>
          <div class="text-sm text-slate-600">
            <p>123 Jewelry District</p>
            <p>New York, NY 10013</p>
            <p>Phone: (555) 123-4567</p>
            <p>Email: orders@gemstoneluxury.com</p>
          </div>
        </div>
        <div class="text-right">
          <h2 class="text-2xl font-bold text-slate-900 mb-2">INVOICE</h2>
          <div class="text-sm text-slate-600 space-y-1">
            <p><strong>Invoice #:</strong> {{ order.orderNumber }}</p>
            <p><strong>Date:</strong> {{ formatDate(order.date) }}</p>
            <p v-if="order.status === 'delivered'">
              <strong>Payment:</strong> Paid
            </p>
          </div>
        </div>
      </div>

      <!-- Billing Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 class="text-lg font-semibold text-slate-900 mb-3">Bill To:</h3>
          <div class="text-sm text-slate-600 space-y-1">
            <p class="font-medium text-slate-900">
              {{ order.billingAddress.firstName }} {{ order.billingAddress.lastName }}
            </p>
            <p v-if="order.billingAddress.company">{{ order.billingAddress.company }}</p>
            <p>{{ order.billingAddress.address1 }}</p>
            <p v-if="order.billingAddress.address2">{{ order.billingAddress.address2 }}</p>
            <p>
              {{ order.billingAddress.city }}, {{ order.billingAddress.state }} 
              {{ order.billingAddress.postalCode }}
            </p>
            <p>{{ order.billingAddress.country }}</p>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-slate-900 mb-3">Ship To:</h3>
          <div class="text-sm text-slate-600 space-y-1">
            <p class="font-medium text-slate-900">
              {{ order.shippingAddress.firstName }} {{ order.shippingAddress.lastName }}
            </p>
            <p v-if="order.shippingAddress.company">{{ order.shippingAddress.company }}</p>
            <p>{{ order.shippingAddress.address1 }}</p>
            <p v-if="order.shippingAddress.address2">{{ order.shippingAddress.address2 }}</p>
            <p>
              {{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} 
              {{ order.shippingAddress.postalCode }}
            </p>
            <p>{{ order.shippingAddress.country }}</p>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div class="mb-8">
        <table class="w-full">
          <thead>
            <tr class="border-b-2 border-slate-200">
              <th class="text-left py-3 text-sm font-semibold text-slate-900">Item</th>
              <th class="text-center py-3 text-sm font-semibold text-slate-900">SKU</th>
              <th class="text-center py-3 text-sm font-semibold text-slate-900">Qty</th>
              <th class="text-right py-3 text-sm font-semibold text-slate-900">Price</th>
              <th class="text-right py-3 text-sm font-semibold text-slate-900">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in order.items"
              :key="item.id"
              class="border-b border-slate-100"
            >
              <td class="py-4">
                <div>
                  <h4 class="font-medium text-slate-900">{{ item.name }}</h4>
                  <div class="text-xs text-slate-500 mt-1 space-y-1">
                    <p>{{ item.gemstoneType }} • {{ item.weight }}ct • {{ item.cut }}</p>
                    <p>Color: {{ item.color }} • Clarity: {{ item.clarity }}</p>
                    <p v-if="item.certification">{{ item.certification }}</p>
                  </div>
                </div>
              </td>
              <td class="text-center py-4 text-sm text-slate-600">{{ item.sku }}</td>
              <td class="text-center py-4 text-sm text-slate-600">{{ item.quantity }}</td>
              <td class="text-right py-4 text-sm text-slate-600">
                ${{ item.price.toFixed(2) }}
              </td>
              <td class="text-right py-4 text-sm font-medium text-slate-900">
                ${{ (item.price * item.quantity).toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div class="flex justify-end">
        <div class="w-80">
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-600">Subtotal:</span>
              <span class="text-slate-900">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-600">Shipping:</span>
              <span class="text-slate-900">${{ shipping.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-600">Tax:</span>
              <span class="text-slate-900">${{ tax.toFixed(2) }}</span>
            </div>
            <div class="border-t border-slate-200 pt-2 mt-2">
              <div class="flex justify-between text-lg font-bold">
                <span class="text-slate-900">Total:</span>
                <span class="text-slate-900">${{ order.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Information -->
      <div class="mt-8 pt-8 border-t border-slate-200">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-lg font-semibold text-slate-900 mb-3">Payment Method</h3>
            <div class="text-sm text-slate-600">
              <p>Credit Card ending in {{ order.paymentMethod.slice(-4) }}</p>
              <p>Paid on {{ formatDate(order.date) }}</p>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-slate-900 mb-3">Certification</h3>
            <div class="text-xs text-slate-500">
              <p>All gemstones are certified authentic and conflict-free.</p>
              <p>Certificate numbers and details are provided with each item.</p>
              <p>For questions, contact us at (555) 123-4567.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 pt-8 border-t border-slate-200 text-center text-xs text-slate-500">
        <p>Thank you for your business!</p>
        <p class="mt-2">
          This invoice was generated on {{ new Date().toLocaleDateString() }}
        </p>
      </div>
    </div>

    <!-- Print Actions -->
    <div class="flex justify-end space-x-3 p-6 border-t border-slate-200 print:hidden">
      <button
        @click="$emit('close')"
        class="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
      >
        Close
      </button>
      <button
        @click="printInvoice"
        class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
      >
        <PrinterIcon class="w-4 h-4 mr-2 inline" />
        Print Invoice
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { GemIcon, PrinterIcon } from 'lucide-vue-next';
import type { Order } from '@/types';

interface Props {
  order: Order;
}

const props = defineProps<Props>();
defineEmits<{
  close: [];
}>();

const subtotal = computed(() => {
  return props.order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const shipping = computed(() => subtotal.value * 0.05);
const tax = computed(() => subtotal.value * 0.08);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const printInvoice = () => {
  window.print();
};
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  .print-container, .print-container * {
    visibility: visible;
  }
  .print-container {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>