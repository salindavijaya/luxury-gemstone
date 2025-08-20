import { ref, computed, reactive } from "vue";

interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "apple_pay" | "google_pay" | "bank_transfer";
  name: string;
  description?: string;
  fee?: number;
  processingTime?: string;
  icon?: string;
}

interface CardData {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  name: string;
}

interface PaymentValidationErrors {
  [key: string]: string;
}

interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "completed" | "failed";
  paymentMethod: PaymentMethod;
  metadata?: Record<string, any>;
}

/**
 * Composable for payment processing and validation
 * Handles payment methods, card validation, and payment processing preparation
 */
export function usePayment() {
  // Payment state
  const selectedPaymentMethod = ref<PaymentMethod | null>(null);
  const cardData = reactive<CardData>({
    number: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    name: "",
  });

  const isProcessing = ref(false);
  const validationErrors = ref<PaymentValidationErrors>({});
  const paymentIntent = ref<PaymentIntent | null>(null);

  // Available payment methods for luxury gemstones
  const paymentMethods: PaymentMethod[] = [
    {
      id: "credit-card",
      type: "card",
      name: "Credit/Debit Card",
      description: "Visa, Mastercard, American Express, Discover",
      fee: 0,
      processingTime: "Instant",
      icon: "credit-card",
    },
    {
      id: "paypal",
      type: "paypal",
      name: "PayPal",
      description: "Pay with your PayPal account or PayPal Credit",
      fee: 0,
      processingTime: "Instant",
      icon: "paypal",
    },
    {
      id: "apple-pay",
      type: "apple_pay",
      name: "Apple Pay",
      description: "Touch ID or Face ID authentication",
      fee: 0,
      processingTime: "Instant",
      icon: "apple",
    },
    {
      id: "google-pay",
      type: "google_pay",
      name: "Google Pay",
      description: "Quick and secure payments",
      fee: 0,
      processingTime: "Instant",
      icon: "google",
    },
    {
      id: "bank-transfer",
      type: "bank_transfer",
      name: "Bank Wire Transfer",
      description: "Direct bank transfer for high-value purchases",
      fee: 0,
      processingTime: "1-3 business days",
      icon: "bank",
    },
  ];

  // Computed properties
  const isApplePayAvailable = computed(() => {
    return Boolean(
      window.ApplePaySession &&
        (window as any).ApplePaySession.canMakePayments &&
        (window as any).ApplePaySession.canMakePayments()
    );
  });

  const isGooglePayAvailable = computed(() => {
    return Boolean((window as any).google && (window as any).google.payments);
  });

  const filteredPaymentMethods = computed(() => {
    return paymentMethods.filter((method) => {
      if (method.type === "apple_pay" && !isApplePayAvailable.value) {
        return false;
      }
      if (method.type === "google_pay" && !isGooglePayAvailable.value) {
        return false;
      }
      return true;
    });
  });

  const requiresCardData = computed(() => {
    return selectedPaymentMethod.value?.type === "card";
  });

  const isCardDataValid = computed(() => {
    if (!requiresCardData.value) return true;

    return (
      isValidCardNumber(cardData.number) &&
      isValidExpiryDate(cardData.expiryMonth, cardData.expiryYear) &&
      isValidCVV(cardData.cvv) &&
      cardData.name.trim().length > 0
    );
  });

  // Payment method selection
  const selectPaymentMethod = (method: PaymentMethod) => {
    selectedPaymentMethod.value = method;
    clearValidationErrors();

    // Reset card data if switching away from card payment
    if (method.type !== "card") {
      resetCardData();
    }
  };

  // Card validation functions
  const isValidCardNumber = (number: string): boolean => {
    const cleaned = number.replace(/\s+/g, "");

    // Basic length check
    if (cleaned.length < 13 || cleaned.length > 19) {
      return false;
    }

    // Luhn algorithm
    let sum = 0;
    let shouldDouble = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  };

  const isValidExpiryDate = (month: string, year: string): boolean => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const expMonth = parseInt(month);
    const expYear = parseInt(year);

    if (expMonth < 1 || expMonth > 12) {
      return false;
    }

    if (expYear < currentYear) {
      return false;
    }

    if (expYear === currentYear && expMonth < currentMonth) {
      return false;
    }

    return true;
  };

  const isValidCVV = (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv);
  };

  // Card number formatting
  const formatCardNumber = (number: string): string => {
    const cleaned = number.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = cleaned.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return cleaned;
    }
  };

  // Get card brand from number
  const getCardBrand = (number: string): string => {
    const cleaned = number.replace(/\s+/g, "");

    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    if (/^6(?:011|5)/.test(cleaned)) return "discover";
    if (/^(?:2131|1800|35)/.test(cleaned)) return "jcb";

    return "unknown";
  };

  // Validation
  const validatePaymentData = (): boolean => {
    const errors: PaymentValidationErrors = {};

    if (!selectedPaymentMethod.value) {
      errors.paymentMethod = "Please select a payment method";
    }

    if (requiresCardData.value) {
      if (!cardData.number.trim()) {
        errors.cardNumber = "Card number is required";
      } else if (!isValidCardNumber(cardData.number)) {
        errors.cardNumber = "Please enter a valid card number";
      }

      if (!cardData.expiryMonth || !cardData.expiryYear) {
        errors.expiry = "Expiry date is required";
      } else if (
        !isValidExpiryDate(cardData.expiryMonth, cardData.expiryYear)
      ) {
        errors.expiry = "Please enter a valid expiry date";
      }

      if (!cardData.cvv.trim()) {
        errors.cvv = "CVV is required";
      } else if (!isValidCVV(cardData.cvv)) {
        errors.cvv = "Please enter a valid CVV";
      }

      if (!cardData.name.trim()) {
        errors.cardName = "Cardholder name is required";
      }
    }

    validationErrors.value = errors;
    return Object.keys(errors).length === 0;
  };

  // Payment processing preparation
  const createPaymentIntent = async (
    amount: number,
    currency: string = "USD"
  ): Promise<PaymentIntent | null> => {
    if (!selectedPaymentMethod.value || !validatePaymentData()) {
      return null;
    }

    isProcessing.value = true;

    try {
      // Simulate payment intent creation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const intent: PaymentIntent = {
        id: `pi_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
        amount,
        currency,
        status: "pending",
        paymentMethod: selectedPaymentMethod.value,
        metadata: {
          cardBrand: requiresCardData.value
            ? getCardBrand(cardData.number)
            : undefined,
          last4: requiresCardData.value ? cardData.number.slice(-4) : undefined,
        },
      };

      paymentIntent.value = intent;
      return intent;
    } catch (error) {
      console.error("Failed to create payment intent:", error);
      return null;
    } finally {
      isProcessing.value = false;
    }
  };

  // Process payment (mock implementation)
  const processPayment = async (intentId: string): Promise<boolean> => {
    if (!paymentIntent.value || paymentIntent.value.id !== intentId) {
      return false;
    }

    isProcessing.value = true;

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock success/failure (90% success rate)
      const success = Math.random() > 0.1;

      if (success) {
        paymentIntent.value.status = "completed";
        return true;
      } else {
        paymentIntent.value.status = "failed";
        return false;
      }
    } catch (error) {
      console.error("Payment processing failed:", error);
      paymentIntent.value.status = "failed";
      return false;
    } finally {
      isProcessing.value = false;
    }
  };

  // Utility functions
  const resetCardData = () => {
    cardData.number = "";
    cardData.expiryMonth = "";
    cardData.expiryYear = "";
    cardData.cvv = "";
    cardData.name = "";
  };

  const clearValidationErrors = () => {
    validationErrors.value = {};
  };

  const formatCurrency = (amount: number, currency: string = "USD"): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  // Security helpers
  const maskCardNumber = (number: string): string => {
    const cleaned = number.replace(/\s+/g, "");
    if (cleaned.length < 4) return cleaned;
    return `****-****-****-${cleaned.slice(-4)}`;
  };

  const getPaymentSummary = () => {
    if (!selectedPaymentMethod.value) return null;

    return {
      method: selectedPaymentMethod.value,
      cardSummary: requiresCardData.value
        ? {
            brand: getCardBrand(cardData.number),
            last4: cardData.number.slice(-4),
            maskedNumber: maskCardNumber(cardData.number),
          }
        : null,
    };
  };

  return {
    // State
    selectedPaymentMethod,
    cardData,
    isProcessing,
    validationErrors,
    paymentIntent,

    // Computed
    paymentMethods: filteredPaymentMethods,
    requiresCardData,
    isCardDataValid,
    isApplePayAvailable,
    isGooglePayAvailable,

    // Actions
    selectPaymentMethod,
    validatePaymentData,
    createPaymentIntent,
    processPayment,
    resetCardData,
    clearValidationErrors,

    // Utilities
    formatCardNumber,
    getCardBrand,
    maskCardNumber,
    getPaymentSummary,
    formatCurrency,

    // Validation helpers
    isValidCardNumber,
    isValidExpiryDate,
    isValidCVV,
  };
}
