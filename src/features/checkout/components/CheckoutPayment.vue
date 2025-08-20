<template>
  <div class="space-y-6">
    <!-- Payment Methods -->
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <h2 class="text-lg font-semibold text-slate-800 mb-4">Payment Method</h2>

      <div class="space-y-4">
        <!-- Credit Card -->
        <div class="relative">
          <input
            id="payment-card"
            v-model="selectedPaymentMethod"
            type="radio"
            name="payment-method"
            value="card"
            class="sr-only"
            @change="handlePaymentMethodChange"
          />
          <label
            for="payment-card"
            :class="[
              'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200',
              selectedPaymentMethod === 'card'
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-slate-200 hover:border-slate-300',
            ]"
          >
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <svg
                    class="w-6 h-6 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <div>
                    <p class="font-medium text-slate-800">
                      Credit or Debit Card
                    </p>
                    <p class="text-sm text-slate-500">
                      Visa, Mastercard, American Express
                    </p>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <img
                    src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg"
                    alt="Visa"
                    class="h-6 w-auto"
                  />
                  <img
                    src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg"
                    alt="Mastercard"
                    class="h-6 w-auto"
                  />
                  <img
                    src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd31dc8da3270a3aa16dd.svg"
                    alt="American Express"
                    class="h-6 w-auto"
                  />
                </div>
              </div>
            </div>
            <div
              :class="[
                'ml-4 w-5 h-5 rounded-full border-2 flex items-center justify-center',
                selectedPaymentMethod === 'card'
                  ? 'border-emerald-600 bg-emerald-600'
                  : 'border-slate-300',
              ]"
            >
              <div
                v-if="selectedPaymentMethod === 'card'"
                class="w-2 h-2 bg-white rounded-full"
              ></div>
            </div>
          </label>
        </div>

        <!-- PayPal -->
        <div class="relative">
          <input
            id="payment-paypal"
            v-model="selectedPaymentMethod"
            type="radio"
            name="payment-method"
            value="paypal"
            class="sr-only"
            @change="handlePaymentMethodChange"
          />
          <label
            for="payment-paypal"
            :class="[
              'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200',
              selectedPaymentMethod === 'paypal'
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-slate-200 hover:border-slate-300',
            ]"
          >
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <svg
                    class="w-6 h-6 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a9.124 9.124 0 0 1-.077.437c-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9L7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287z"
                    />
                  </svg>
                  <div>
                    <p class="font-medium text-slate-800">PayPal</p>
                    <p class="text-sm text-slate-500">
                      Pay with your PayPal account
                    </p>
                  </div>
                </div>
                <div class="text-blue-600 font-bold text-lg">PayPal</div>
              </div>
            </div>
            <div
              :class="[
                'ml-4 w-5 h-5 rounded-full border-2 flex items-center justify-center',
                selectedPaymentMethod === 'paypal'
                  ? 'border-emerald-600 bg-emerald-600'
                  : 'border-slate-300',
              ]"
            >
              <div
                v-if="selectedPaymentMethod === 'paypal'"
                class="w-2 h-2 bg-white rounded-full"
              ></div>
            </div>
          </label>
        </div>

        <!-- Apple Pay (if supported) -->
        <div v-if="applePaySupported" class="relative">
          <input
            id="payment-applepay"
            v-model="selectedPaymentMethod"
            type="radio"
            name="payment-method"
            value="applepay"
            class="sr-only"
            @change="handlePaymentMethodChange"
          />
          <label
            for="payment-applepay"
            :class="[
              'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200',
              selectedPaymentMethod === 'applepay'
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-slate-200 hover:border-slate-300',
            ]"
          >
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <svg
                    class="w-6 h-6 text-slate-800"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
                    />
                  </svg>
                  <div>
                    <p class="font-medium text-slate-800">Apple Pay</p>
                    <p class="text-sm text-slate-500">Touch ID or Face ID</p>
                  </div>
                </div>
                <div class="text-slate-800 font-medium">Apple Pay</div>
              </div>
            </div>
            <div
              :class="[
                'ml-4 w-5 h-5 rounded-full border-2 flex items-center justify-center',
                selectedPaymentMethod === 'applepay'
                  ? 'border-emerald-600 bg-emerald-600'
                  : 'border-slate-300',
              ]"
            >
              <div
                v-if="selectedPaymentMethod === 'applepay'"
                class="w-2 h-2 bg-white rounded-full"
              ></div>
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- Credit Card Form -->
    <div
      v-if="selectedPaymentMethod === 'card'"
      class="bg-white rounded-lg shadow-sm border p-6 animate-slide-down"
    >
      <PaymentForm
        :loading="processingPayment"
        :errors="paymentErrors"
        @update="updateCardData"
        @validate="validateCard"
      />
    </div>

    <!-- Billing Address -->
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-slate-800">Billing Address</h3>
        <label class="flex items-center space-x-2">
          <input
            v-model="sameAsShipping"
            type="checkbox"
            class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
            @change="handleBillingAddressToggle"
          />
          <span class="text-sm text-slate-600">Same as shipping address</span>
        </label>
      </div>

      <div v-if="!sameAsShipping" class="animate-slide-down">
        <BillingAddress
          :address="billingAddress"
          :errors="billingErrors"
          :loading="validatingAddress"
          @update="updateBillingAddress"
          @validate="validateBillingAddress"
        />
      </div>
    </div>

    <!-- Order Notes -->
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <h3 class="text-lg font-semibold text-slate-800 mb-4">Order Notes</h3>
      <textarea
        v-model="orderNotes"
        rows="3"
        class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 resize-none"
        placeholder="Special instructions for your order (optional)"
        maxlength="500"
      ></textarea>
      <div class="mt-2 flex justify-between items-center">
        <p class="text-xs text-slate-500">
          Optional: Add any special instructions or requests
        </p>
        <span class="text-xs text-slate-400">{{ orderNotes.length }}/500</span>
      </div>
    </div>

    <!-- Gift Options -->
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <div class="flex items-center space-x-3 mb-4">
        <svg
          class="w-5 h-5 text-amber-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"
            clip-rule="evenodd"
          />
          <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
        </svg>
        <h3 class="text-lg font-semibold text-slate-800">Gift Options</h3>
      </div>

      <div class="space-y-4">
        <label class="flex items-start space-x-3">
          <input
            v-model="isGift"
            type="checkbox"
            class="mt-1 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
          />
          <div>
            <p class="font-medium text-slate-800">This is a gift</p>
            <p class="text-sm text-slate-500">
              Include gift wrapping and message
            </p>
          </div>
        </label>

        <div v-if="isGift" class="ml-6 space-y-4 animate-slide-down">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Gift Message
            </label>
            <textarea
              v-model="giftMessage"
              rows="3"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              placeholder="Enter your gift message here..."
              maxlength="250"
            ></textarea>
            <p class="mt-1 text-xs text-slate-500">
              {{ giftMessage.length }}/250 characters
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Gift Wrapping Options
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                v-for="wrap in giftWrapOptions"
                :key="wrap.id"
                :class="[
                  'relative flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200',
                  selectedGiftWrap === wrap.id
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-slate-200 hover:border-slate-300',
                ]"
              >
                <input
                  v-model="selectedGiftWrap"
                  :value="wrap.id"
                  type="radio"
                  name="gift-wrap"
                  class="sr-only"
                />
                <img
                  :src="wrap.image"
                  :alt="wrap.name"
                  class="w-12 h-12 object-cover rounded mb-2"
                />
                <p class="text-sm font-medium text-slate-800 text-center">
                  {{ wrap.name }}
                </p>
                <p class="text-xs text-slate-500 text-center">
                  ${{ wrap.price }}
                </p>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Security Features -->
    <div class="bg-slate-50 rounded-lg border p-4">
      <div class="flex items-center space-x-3 mb-3">
        <svg
          class="w-5 h-5 text-emerald-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clip-rule="evenodd"
          />
        </svg>
        <h4 class="font-medium text-slate-800">Your payment is secure</h4>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
        <div class="flex items-center space-x-2">
          <svg
            class="w-4 h-4 text-emerald-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          <span>256-bit SSL encryption</span>
        </div>
        <div class="flex items-center space-x-2">
          <svg
            class="w-4 h-4 text-emerald-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          <span>PCI DSS compliant</span>
        </div>
        <div class="flex items-center space-x-2">
          <svg
            class="w-4 h-4 text-emerald-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Fraud protection</span>
        </div>
        <div class="flex items-center space-x-2">
          <svg
            class="w-4 h-4 text-emerald-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Money-back guarantee</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useCheckoutStore } from "@/features/checkout/store";
import PaymentForm from "@/components/forms/PaymentForm.vue";
import BillingAddress from "@/components/forms/BillingAddress.vue";

// Store
const checkoutStore = useCheckoutStore();

// Reactive state
const selectedPaymentMethod = ref("card");
const sameAsShipping = ref(true);
const processingPayment = ref(false);
const validatingAddress = ref(false);
const orderNotes = ref("");
const isGift = ref(false);
const giftMessage = ref("");
const selectedGiftWrap = ref("elegant");

// Form data
const cardData = ref({
  number: "",
  expiry: "",
  cvc: "",
  name: "",
});

const billingAddress = ref({
  firstName: "",
  lastName: "",
  company: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
});

// Error states
const paymentErrors = ref({});
const billingErrors = ref({});

// Device capabilities
const applePaySupported = ref(false);

// Gift wrap options
const giftWrapOptions = [
  {
    id: "elegant",
    name: "Elegant Box",
    price: 15,
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&h=100&fit=crop",
  },
  {
    id: "luxury",
    name: "Luxury Velvet",
    price: 25,
    image:
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=100&h=100&fit=crop",
  },
  {
    id: "premium",
    name: "Premium Wooden",
    price: 35,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
  },
];

// Computed properties
const isFormValid = computed(() => {
  if (selectedPaymentMethod.value === "card") {
    return Boolean(
      cardData.value.number &&
        cardData.value.expiry &&
        cardData.value.cvc &&
        cardData.value.name &&
        Object.keys(paymentErrors.value).length === 0
    );
  }

  if (!sameAsShipping.value) {
    return Boolean(
      billingAddress.value.firstName &&
        billingAddress.value.lastName &&
        billingAddress.value.address1 &&
        billingAddress.value.city &&
        Object.keys(billingErrors.value).length === 0
    );
  }

  return true;
});

// Lifecycle
onMounted(() => {
  checkApplePaySupport();
  loadSavedPaymentData();
});

// Watchers
watch(
  () => checkoutStore.shippingAddress,
  (newAddress) => {
    if (sameAsShipping.value && newAddress) {
      syncBillingAddress();
    }
  },
  { deep: true }
);

watch([orderNotes, isGift, giftMessage, selectedGiftWrap], () => {
  saveOrderPreferences();
});

/**
 * Check if Apple Pay is supported on this device
 */
const checkApplePaySupport = () => {
  if ((window as any).ApplePaySession) {
    applePaySupported.value = Boolean(
      (window as any).ApplePaySession.canMakePayments &&
        (window as any).ApplePaySession.canMakePayments()
    );
  }
};

/**
 * Load saved payment data from store
 */
const loadSavedPaymentData = () => {
  const saved = checkoutStore.paymentData;
  if (saved) {
    selectedPaymentMethod.value = saved.method || "card";
    sameAsShipping.value = saved.sameAsShipping !== false;
    orderNotes.value = saved.orderNotes || "";
    isGift.value = saved.isGift || false;
    giftMessage.value = saved.giftMessage || "";
    selectedGiftWrap.value = saved.giftWrap || "elegant";
  }
};

/**
 * Handle payment method change
 */
const handlePaymentMethodChange = () => {
  checkoutStore.updatePaymentMethod(selectedPaymentMethod.value);

  // Clear previous payment errors
  paymentErrors.value = {};

  // Reset card data if switching away from card
  if (selectedPaymentMethod.value !== "card") {
    cardData.value = {
      number: "",
      expiry: "",
      cvc: "",
      name: "",
    };
  }
};

/**
 * Handle billing address toggle
 */
const handleBillingAddressToggle = () => {
  if (sameAsShipping.value) {
    syncBillingAddress();
    billingErrors.value = {};
  }

  checkoutStore.updateBillingOption(sameAsShipping.value);
};

/**
 * Sync billing address with shipping address
 */
const syncBillingAddress = () => {
  const shipping = checkoutStore.shippingAddress;
  if (shipping) {
    billingAddress.value = { ...shipping };
  }
};

/**
 * Update card data
 */
const updateCardData = (data: any) => {
  cardData.value = { ...cardData.value, ...data };
  checkoutStore.updatePaymentData({
    method: selectedPaymentMethod.value,
    cardData: cardData.value,
  });
};

/**
 * Validate card data
 */
const validateCard = (errors: any) => {
  paymentErrors.value = errors;
};

/**
 * Update billing address
 */
const updateBillingAddress = (address: any) => {
  billingAddress.value = { ...billingAddress.value, ...address };
  checkoutStore.updateBillingAddress(billingAddress.value);
};

/**
 * Validate billing address
 */
const validateBillingAddress = async (address: any) => {
  validatingAddress.value = true;
  try {
    // Simulate address validation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const errors: any = {};
    if (!address.firstName) errors.firstName = "First name is required";
    if (!address.lastName) errors.lastName = "Last name is required";
    if (!address.address1) errors.address1 = "Address is required";
    if (!address.city) errors.city = "City is required";
    if (!address.zipCode) errors.zipCode = "ZIP code is required";

    billingErrors.value = errors;
  } finally {
    validatingAddress.value = false;
  }
};

/**
 * Save order preferences
 */
const saveOrderPreferences = () => {
  checkoutStore.updateOrderPreferences({
    notes: orderNotes.value,
    isGift: isGift.value,
    giftMessage: giftMessage.value,
    giftWrap: selectedGiftWrap.value,
  });
};

// Emit validation state
const emit = defineEmits<{
  "validation-change": [isValid: boolean];
}>();

watch(isFormValid, (valid) => {
  emit("validation-change", valid);
});
</script>

<style scoped>
/* Slide down animation for dynamic content */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 1000px;
  }
}

.animate-slide-down {
  animation: slideDown 0.3s ease-out;
}

/* Enhanced focus styles for accessibility */
input:focus,
textarea:focus,
select:focus {
  outline: 2px solid #059669;
  outline-offset: 2px;
}

/* Custom radio button styles */
input[type="radio"]:checked + label {
  border-color: #059669;
  background-color: #ecfdf5;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.2s ease;
}

/* Payment method card hover effects */
label:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Gift wrap option hover effects */
.gift-wrap-option:hover {
  transform: scale(1.02);
}
</style>
