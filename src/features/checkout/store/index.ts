import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Address } from "@/types";

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  description?: string;
  deliveryTime?: string;
}

export interface PaymentData {
  method: "card" | "paypal" | "applepay";
  sameAsShipping: boolean;
  cardData?: {
    number: string;
    expiryDate: string;
    cvv: string;
    name: string;
  };
  paypalEmail?: string;
}

export interface OrderPreferences {
  notes?: string;
  isGift: boolean;
  giftWrap: string;
  giftMessage?: string;
  estimatedDelivery?: string;
}

export interface CheckoutState {
  shippingAddress: Address | null;
  billingAddress: Address | null;
  shippingMethod: string | null;
  paymentMethod: string | null;
  selectedShipping: ShippingOption | null;
  paymentData: PaymentData | null;
  orderPreferences: OrderPreferences | null;
  currentStep: number;
}

export const useCheckoutStore = defineStore("checkout", () => {
  const state = ref<CheckoutState>({
    shippingAddress: null,
    billingAddress: null,
    shippingMethod: null,
    paymentMethod: null,
    selectedShipping: null,
    paymentData: null,
    orderPreferences: null,
    currentStep: 1,
  });

  const shippingAddress = computed(() => state.value.shippingAddress);
  const billingAddress = computed(() => state.value.billingAddress);
  const shippingMethod = computed(() => state.value.shippingMethod);
  const paymentMethod = computed(() => state.value.paymentMethod);

  function setShippingAddress(address: Address) {
    state.value.shippingAddress = address;
  }

  function setBillingAddress(address: Address) {
    state.value.billingAddress = address;
  }

  function setShippingMethod(method: string) {
    state.value.shippingMethod = method;
  }

  function setPaymentMethod(method: string) {
    state.value.paymentMethod = method;
  }

  function resetState() {
    state.value = {
      shippingAddress: null,
      billingAddress: null,
      shippingMethod: null,
      paymentMethod: null,
      selectedShipping: null,
      paymentData: null,
      orderPreferences: null,
      currentStep: 1,
    };
  }

  function updateBillingOption(sameAsShipping: boolean) {
    if (sameAsShipping) {
      state.value.billingAddress = state.value.shippingAddress;
    }
  }

  function updatePaymentData(data: PaymentData) {
    state.value.paymentData = data;
  }

  function updateBillingAddress(address: Address) {
    state.value.billingAddress = address;
  }

  function updateOrderPreferences(prefs: OrderPreferences) {
    state.value.orderPreferences = prefs;
  }

  function setCurrentStep(step: number) {
    state.value.currentStep = step;
  }

  async function completeOrder(order: any) {
    // Implementation goes here
  }

  return {
    shippingAddress,
    billingAddress,
    shippingMethod,
    paymentMethod,
    selectedShipping: computed(() => state.value.selectedShipping),
    paymentData: computed(() => state.value.paymentData),
    orderPreferences: computed(() => state.value.orderPreferences),
    currentStep: computed(() => state.value.currentStep),
    setShippingAddress,
    setBillingAddress,
    setShippingMethod,
    setPaymentMethod,
    updateBillingOption,
    updatePaymentData,
    updateBillingAddress,
    updateOrderPreferences,
    setCurrentStep,
    completeOrder,
    resetState,
  };
});
