<template>
  <template>
    <div class="space-y-4">
      <h4 class="font-medium text-slate-900">Price Breakdown</h4>

      <div class="space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-slate-600">Base Price ({{ quantity }}x)</span>
          <span class="font-medium">{{ formatPrice(subtotal) }}</span>
        </div>

        <div v-if="shippingCost > 0" class="flex justify-between text-sm">
          <span class="text-slate-600">Shipping</span>
          <span class="font-medium">{{ formatPrice(shippingCost) }}</span>
        </div>

        <div v-else class="flex justify-between text-sm">
          <span class="text-emerald-600">Free Shipping</span>
          <span class="font-medium text-emerald-600">$0.00</span>
        </div>

        <div class="flex justify-between text-sm">
          <span class="text-slate-600"
            >Tax ({{ Math.round(taxRate * 100) }}%)</span
          >
          <span class="font-medium">{{ formatPrice(tax) }}</span>
        </div>

        <div class="border-t border-slate-200 pt-2">
          <div class="flex justify-between">
            <span class="font-semibold text-slate-900">Total</span>
            <span class="font-bold text-lg text-slate-900">{{
              formatPrice(total)
            }}</span>
          </div>
        </div>
      </div>

      <!-- Financing Option -->
      <div class="bg-blue-50 rounded-lg p-3 text-sm">
        <div class="flex items-center space-x-2 mb-1">
          <CreditCardIcon class="w-4 h-4 text-blue-600" />
          <span class="font-medium text-blue-900">Financing Available</span>
        </div>
        <p class="text-blue-700">
          As low as {{ formatPrice(total / 12) }}/month for 12 months
        </p>
      </div>
    </div>
  </template>

  <script setup lang="ts">
    import { computed } from "vue";
    import { CreditCardIcon } from "@heroicons/vue/24/outline";

    interface Props {
      basePrice: number;
      quantity: number;
      shippingCost: number;
      taxRate: number;
    }

    const props = defineProps<Props>();

    // Computed values
    const subtotal = computed(() => props.basePrice * props.quantity);
    const tax = computed(
      () => (subtotal.value + props.shippingCost) * props.taxRate
    );
    const total = computed(
      () => subtotal.value + props.shippingCost + tax.value
    );

    // Format price utility
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
    };
  </script>
</template>
