<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-slate-800">Billing Address</h3>
      <div class="flex items-center space-x-2">
        <input
          id="same-as-shipping"
          v-model="sameAsShipping"
          type="checkbox"
          class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
          @change="handleSameAsShippingChange"
        />
        <label
          for="same-as-shipping"
          class="text-sm text-slate-700 cursor-pointer"
        >
          Same as shipping address
        </label>
      </div>
    </div>

    <transition
      name="billing-form"
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[600px]"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 max-h-[600px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="!sameAsShipping" class="overflow-hidden">
        <AddressForm
          v-model="billingAddress"
          :errors="errors"
          :loading="loading"
          required-fields="billing"
          @update:modelValue="handleAddressUpdate"
        />
      </div>
    </transition>

    <!-- Billing Address Summary (when same as shipping) -->
    <div
      v-if="sameAsShipping && shippingAddress"
      class="p-4 bg-slate-50 border border-slate-200 rounded-lg"
    >
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-sm font-medium text-slate-800">Billing Address</h4>
          <div class="text-sm text-slate-600 mt-1">
            <div>
              {{ shippingAddress.firstName }} {{ shippingAddress.lastName }}
            </div>
            <div>{{ shippingAddress.address1 }}</div>
            <div v-if="shippingAddress.address2">
              {{ shippingAddress.address2 }}
            </div>
            <div>
              {{ shippingAddress.city }}, {{ shippingAddress.state }}
              {{ shippingAddress.postalCode }}
            </div>
            <div>{{ shippingAddress.country }}</div>
          </div>
        </div>
        <div class="text-emerald-600">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Tax Information -->
    <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-start space-x-2">
        <svg
          class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
        <div>
          <h4 class="text-sm font-medium text-blue-800">Tax Information</h4>
          <p class="text-sm text-blue-700 mt-1">
            Sales tax will be calculated based on your billing address.
            <span v-if="taxRate > 0" class="font-medium">
              Current rate: {{ (taxRate * 100).toFixed(2) }}%
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- Business Purchase Options -->
    <div class="space-y-3">
      <div class="flex items-center space-x-2">
        <input
          id="business-purchase"
          v-model="isBusinessPurchase"
          type="checkbox"
          class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
          @change="handleBusinessPurchaseChange"
        />
        <label
          for="business-purchase"
          class="text-sm text-slate-700 cursor-pointer"
        >
          This is a business purchase
        </label>
      </div>

      <transition
        name="business-form"
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-32"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 max-h-32"
        leave-to-class="opacity-0 max-h-0"
      >
        <div v-if="isBusinessPurchase" class="overflow-hidden ml-6 space-y-3">
          <div>
            <label
              for="tax-id"
              class="block text-sm font-medium text-slate-700 mb-1"
            >
              Tax ID / VAT Number
            </label>
            <input
              id="tax-id"
              v-model="taxId"
              type="text"
              class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              :class="{ 'border-red-300': errors.taxId }"
              placeholder="Enter your business tax ID"
              @input="clearError('taxId')"
            />
            <p v-if="errors.taxId" class="mt-1 text-sm text-red-600">
              {{ errors.taxId }}
            </p>
          </div>

          <div>
            <label
              for="company-name"
              class="block text-sm font-medium text-slate-700 mb-1"
            >
              Company Name
            </label>
            <input
              id="company-name"
              v-model="companyName"
              type="text"
              class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              :class="{ 'border-red-300': errors.companyName }"
              placeholder="Enter your company name"
              @input="clearError('companyName')"
            />
            <p v-if="errors.companyName" class="mt-1 text-sm text-red-600">
              {{ errors.companyName }}
            </p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import AddressForm from "./AddressForm.vue";

interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

interface BillingData {
  address: Address | null;
  sameAsShipping: boolean;
  isBusinessPurchase: boolean;
  taxId?: string;
  companyName?: string;
}

interface Props {
  modelValue: BillingData;
  shippingAddress?: Address | null;
  errors?: Record<string, string>;
  loading?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: BillingData): void;
}

const props = withDefaults(defineProps<Props>(), {
  shippingAddress: null,
  errors: () => ({}),
  loading: false,
});

const emit = defineEmits<Emits>();

// Local reactive data
const sameAsShipping = ref(props.modelValue.sameAsShipping);
const billingAddress = ref<Address | null>(props.modelValue.address);
const isBusinessPurchase = ref(props.modelValue.isBusinessPurchase);
const taxId = ref(props.modelValue.taxId || "");
const companyName = ref(props.modelValue.companyName || "");

// Computed tax rate based on billing address (mock implementation)
const taxRate = computed(() => {
  const address = sameAsShipping.value
    ? props.shippingAddress
    : billingAddress.value;
  if (!address?.state) return 0;

  // Mock tax rates by state
  const taxRates: Record<string, number> = {
    CA: 0.0875,
    NY: 0.08,
    TX: 0.0625,
    FL: 0.06,
    WA: 0.065,
    OR: 0.0, // No sales tax
    NH: 0.0, // No sales tax
    MT: 0.0, // No sales tax
    DE: 0.0, // No sales tax
  };

  return taxRates[address.state] || 0.05; // Default 5% for other states
});

const handleSameAsShippingChange = () => {
  if (sameAsShipping.value && props.shippingAddress) {
    billingAddress.value = { ...props.shippingAddress };
  } else if (!sameAsShipping.value) {
    billingAddress.value = null;
  }
  emitUpdate();
};

const handleAddressUpdate = (address: Address | null) => {
  billingAddress.value = address;
  emitUpdate();
};

const handleBusinessPurchaseChange = () => {
  if (!isBusinessPurchase.value) {
    taxId.value = "";
    companyName.value = "";
  }
  emitUpdate();
};

const clearError = (field: string) => {
  // Emit error clearing to parent
  emit("update:modelValue", {
    ...props.modelValue,
    address: billingAddress.value,
    sameAsShipping: sameAsShipping.value,
    isBusinessPurchase: isBusinessPurchase.value,
    taxId: taxId.value,
    companyName: companyName.value,
  });
};

const emitUpdate = () => {
  const billingData: BillingData = {
    address: sameAsShipping.value
      ? props.shippingAddress
      : billingAddress.value,
    sameAsShipping: sameAsShipping.value,
    isBusinessPurchase: isBusinessPurchase.value,
    taxId: isBusinessPurchase.value ? taxId.value : undefined,
    companyName: isBusinessPurchase.value ? companyName.value : undefined,
  };

  emit("update:modelValue", billingData);
};

// Watch for changes in shipping address when same as shipping is enabled
watch(
  () => props.shippingAddress,
  (newShippingAddress) => {
    if (sameAsShipping.value && newShippingAddress) {
      billingAddress.value = { ...newShippingAddress };
      emitUpdate();
    }
  },
  { deep: true }
);

// Watch for prop changes
watch(
  () => props.modelValue,
  (newValue) => {
    sameAsShipping.value = newValue.sameAsShipping;
    billingAddress.value = newValue.address;
    isBusinessPurchase.value = newValue.isBusinessPurchase;
    taxId.value = newValue.taxId || "";
    companyName.value = newValue.companyName || "";
  },
  { deep: true }
);

// Emit tax rate changes
watch(taxRate, () => {
  emitUpdate();
});
</script>

<style scoped>
.billing-form-enter-active,
.billing-form-leave-active,
.business-form-enter-active,
.business-form-leave-active {
  overflow: hidden;
}

.billing-form-enter-from,
.billing-form-leave-to {
  max-height: 0;
  opacity: 0;
}

.billing-form-enter-to,
.billing-form-leave-from {
  max-height: 600px;
  opacity: 1;
}

.business-form-enter-from,
.business-form-leave-to {
  max-height: 0;
  opacity: 0;
}

.business-form-enter-to,
.business-form-leave-from {
  max-height: 128px;
  opacity: 1;
}
</style>
