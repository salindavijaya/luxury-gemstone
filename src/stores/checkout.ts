import { defineStore } from "pinia";
import { ref } from "vue";

export const useCheckoutStore = defineStore("checkout", () => {
  const billingAddress = ref(null as any);
  const shippingAddress = ref(null as any);
  const paymentMethod = ref("credit_card");
  const isProcessing = ref(false);

  const initialize = async () => {
    // noop stub
    return true;
  };

  // Additional fields and methods used by components
  const paymentData = ref(null as any);
  const selectedShipping = ref(null as any);
  const orderPreferences = ref({} as any);
  const currentStep = ref(0);

  const setCurrentStep = (step: number) => {
    currentStep.value = step;
  };

  const updatePaymentMethod = (method: string) => {
    paymentMethod.value = method;
  };

  const updateBillingOption = (sameAsShipping: boolean) => {
    if (sameAsShipping) billingAddress.value = shippingAddress.value;
  };

  const updatePaymentData = (data: any) => {
    paymentData.value = data;
  };

  const updateBillingAddress = (addr: any) => {
    billingAddress.value = addr;
  };

  const updateOrderPreferences = (prefs: any) => {
    orderPreferences.value = prefs;
  };

  const completeOrder = async (order: any) => {
    // noop
    return { success: true };
  };

  return {
    // State
    billingAddress,
    shippingAddress,
    paymentMethod,
    isProcessing,
    paymentData,
    selectedShipping,
    orderPreferences,
    currentStep,

    // Methods
    initialize,
    setCurrentStep,
    updatePaymentMethod,
    updateBillingOption,
    updatePaymentData,
    updateBillingAddress,
    updateOrderPreferences,
    completeOrder,
  };
});
