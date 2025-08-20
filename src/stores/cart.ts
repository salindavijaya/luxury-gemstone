import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  CartItem,
  CartDiscount,
  SavedForLaterItem,
  CartData,
  CartValidation,
} from "../types/cart";
import type {
  Address,
  PaymentMethod,
  ShippingOption,
  ShippingDetails,
  BillingDetails,
  PaymentDetails,
} from "../types/checkout";
import type {
  BaseEntity,
  ValidationError,
  Currency,
  ErrorMessages,
} from "../types/common";

export const useCartStore = defineStore("cart", () => {
  // Cart State
  const items = ref<CartItem[]>([]);
  const recentlyRemoved = ref<CartItem[]>([]);
  const savedForLater = ref<SavedForLaterItem[]>([]);
  const discountCode = ref<CartDiscount | null>(null);
  const selectedShippingOption = ref<ShippingOption | null>(null);
  const cartData = ref<CartData>({
    items: [],
    savedForLater: [],
    recentlyRemoved: [],
    itemCount: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    discountCode: null,
    total: 0,
    currency: "USD",
    isLoading: false,
    error: null,
  });

  // Checkout State
  const currentCheckoutStep = ref(1);
  const shippingAddress = ref<Address>({
    id: "", // Required by BaseEntity
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    firstName: "",
    lastName: "",
    company: "",
    address1: "", // Changed from addressLine1
    address2: "", // Changed from addressLine2
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    phone: "", // Changed from phoneNumber
    type: "shipping",
    isDefault: false,
  });
  const billingAddress = ref<Address>({
    id: "", // Required by BaseEntity
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    firstName: "",
    lastName: "",
    company: "",
    address1: "", // Changed from addressLine1
    address2: "", // Changed from addressLine2
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    phone: "", // Changed from phoneNumber
    type: "billing",
    isDefault: false,
  });
  const useSameAddress = ref(true);
  const paymentMethod = ref<PaymentMethod>({
    id: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: "card",
    name: "Credit Card",
    details: {
      cardholderName: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    },
    isDefault: false,
  });
  const orderNotes = ref("");
  const isGuestCheckout = ref(true);
  const errors = ref<ErrorMessages>({});

  // Available shipping options
  const shippingOptions = ref<ShippingOption[]>([
    {
      id: "standard",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: "Standard Shipping",
      code: "STANDARD",
      carrier: "FedEx",
      description: "Regular insured shipping",
      price: 25,
      duration: "5-7 business days",
      estimatedDays: 7,
      tracking: true,
      insurance: true,
      insuranceLimit: 5000,
      secure: true,
      recommended: true,
      features: ["Insured", "Tracking included", "Signature required"],
    },
    {
      id: "express",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: "Express Shipping",
      code: "EXPRESS",
      carrier: "FedEx",
      description: "Priority overnight delivery",
      price: 75,
      duration: "1-2 business days",
      estimatedDays: 2,
      tracking: true,
      insurance: true,
      insuranceLimit: 10000,
      secure: true,
      features: [
        "Next-day delivery",
        "Priority handling",
        "Real-time tracking",
      ],
    },
    {
      id: "white-glove",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: "White Glove Delivery",
      code: "WHITE_GLOVE",
      carrier: "Luxury Delivery Service",
      description: "Hand delivery with signature",
      price: 150,
      duration: "2-3 business days",
      estimatedDays: 3,
      tracking: true,
      insurance: true,
      insuranceLimit: 50000,
      secure: true,
      features: ["Personal delivery", "Inspection service", "Security escort"],
    },
  ]);

  // Computed values from cartData
  const itemCount = computed(() => cartData.value.itemCount);
  const subtotal = computed(() => cartData.value.subtotal);
  const discountAmount = computed(() => cartData.value.discount);

  const updateCartData = () => {
    const count = items.value.reduce((sum, item) => sum + item.quantity, 0);
    const itemsSubtotal = items.value.reduce((sum, item) => {
      const price = item.salePrice ?? item.product.price;
      return sum + price * item.quantity;
    }, 0);

    let discount = 0;
    if (discountCode.value) {
      if (discountCode.value.type === "percentage") {
        discount = itemsSubtotal * (discountCode.value.value / 100);
      } else if (discountCode.value.type === "fixed") {
        discount = discountCode.value.value;
      }
    }

    cartData.value = {
      ...cartData.value,
      items: items.value,
      savedForLater: savedForLater.value,
      recentlyRemoved: recentlyRemoved.value,
      itemCount: count,
      subtotal: itemsSubtotal,
      discount,
      shipping: selectedShippingOption.value?.price || 0,
      tax: (itemsSubtotal - discount) * 0.0875, // 8.75% tax rate
      total:
        itemsSubtotal - discount + (selectedShippingOption.value?.price || 0),
      discountCode: discountCode.value?.code || null,
    };
  };

  const taxAmount = computed(() => cartData.value.tax);
  const shippingCost = computed(() => cartData.value.shipping);
  const total = computed(() => cartData.value.total);

  // Actions
  const addItem = (product: Omit<CartItem, "quantity">) => {
    const existingItem = items.value.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.value.push({
        ...product,
        quantity: 1,
        options: {},
      });
    }

    updateCartData();
    saveToLocalStorage();
  };

  const removeItem = (itemId: string) => {
    const itemIndex = items.value.findIndex((item) => item.id === itemId);
    if (itemIndex > -1) {
      const removedItem = items.value.splice(itemIndex, 1)[0];
      recentlyRemoved.value.unshift(removedItem);

      // Keep only last 5 recently removed items
      if (recentlyRemoved.value.length > 5) {
        recentlyRemoved.value = recentlyRemoved.value.slice(0, 5);
      }

      updateCartData();
      saveToLocalStorage();
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    const item = items.value.find((item) => item.id === itemId);
    if (item) {
      if (quantity <= 0) {
        removeItem(itemId);
      } else {
        item.quantity = quantity;
        updateCartData();
        saveToLocalStorage();
      }
    }
  };

  const restoreItem = (item: CartItem) => {
    const index = recentlyRemoved.value.findIndex(
      (removed) => removed.id === item.id
    );
    if (index > -1) {
      recentlyRemoved.value.splice(index, 1);
      addItem(item);
    }
  };

  const updateItemOptions = (itemId: string, options: Record<string, any>) => {
    const item = items.value.find((item) => item.id === itemId);
    if (item) {
      item.options = { ...item.options, ...options };
      updateCartData();
      saveToLocalStorage();
    }
  };

  const applyDiscountCode = async (code: string): Promise<boolean> => {
    // Mock discount codes
    const validCodes: Record<string, CartDiscount> = {
      LUXURY10: {
        code: "LUXURY10",
        type: "percentage",
        value: 10,
        minimum: 0,
        maximum: 500,
        validUntil: new Date("2024-12-31").toISOString(),
      },
      FIRST100: {
        code: "FIRST100",
        type: "fixed",
        value: 100,
        minimum: 250,
        maximum: 100,
        validUntil: new Date("2024-12-31").toISOString(),
      },
      SHIPFREE: {
        code: "SHIPFREE",
        type: "shipping",
        value: 100,
        minimum: 500,
        maximum: 100,
        validUntil: new Date("2024-12-31").toISOString(),
      },
    };

    const discount = validCodes[code.toUpperCase()];
    if (discount) {
      discountCode.value = discount;
      saveToLocalStorage();
      return true;
    }
    return false;
  };

  const removeDiscountCode = () => {
    discountCode.value = null;
    saveToLocalStorage();
  };

  const selectShippingOption = (option: ShippingOption) => {
    selectedShippingOption.value = option;
    saveToLocalStorage();
  };

  const clearCart = () => {
    items.value = [];
    recentlyRemoved.value = [];
    discountCode.value = null;
    selectedShippingOption.value = null;
    saveToLocalStorage();
  };

  const nextCheckoutStep = () => {
    if (currentCheckoutStep.value < 3) {
      currentCheckoutStep.value++;
    }
  };

  const prevCheckoutStep = () => {
    if (currentCheckoutStep.value > 1) {
      currentCheckoutStep.value--;
    }
  };

  const setCheckoutStep = (step: number) => {
    currentCheckoutStep.value = step;
  };

  const updateShippingAddress = (address: Address) => {
    shippingAddress.value = { ...address };
    if (useSameAddress.value) {
      billingAddress.value = { ...address };
    }
    saveToLocalStorage();
  };

  const updateBillingAddress = (address: Address) => {
    billingAddress.value = { ...address };
    saveToLocalStorage();
  };

  const toggleSameAddress = () => {
    useSameAddress.value = !useSameAddress.value;
    if (useSameAddress.value) {
      billingAddress.value = { ...shippingAddress.value };
    }
    saveToLocalStorage();
  };

  const updatePaymentMethod = (method: PaymentMethod) => {
    paymentMethod.value = { ...method };
    saveToLocalStorage();
  };

  const saveToLocalStorage = () => {
    try {
      const cartData = {
        items: items.value,
        discountCode: discountCode.value,
        selectedShippingOption: selectedShippingOption.value,
        shippingAddress: shippingAddress.value,
        billingAddress: billingAddress.value,
        useSameAddress: useSameAddress.value,
        orderNotes: orderNotes.value,
        isGuestCheckout: isGuestCheckout.value,
      };
      localStorage.setItem("luxury-cart", JSON.stringify(cartData));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem("luxury-cart");
      if (savedData) {
        const cartData = JSON.parse(savedData);
        items.value = cartData.items || [];
        discountCode.value = cartData.discountCode || null;
        selectedShippingOption.value = cartData.selectedShippingOption || null;
        shippingAddress.value =
          cartData.shippingAddress || shippingAddress.value;
        billingAddress.value = cartData.billingAddress || billingAddress.value;
        useSameAddress.value = cartData.useSameAddress ?? true;
        orderNotes.value = cartData.orderNotes || "";
        isGuestCheckout.value = cartData.isGuestCheckout ?? true;
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
  };

  // Initialize from localStorage
  loadFromLocalStorage();

  return {
    // State
    items,
    savedForLater,
    recentlyRemoved,
    discountCode,
    selectedShippingOption,
    shippingOptions,
    currentCheckoutStep,
    shippingAddress,
    billingAddress,
    useSameAddress,
    paymentMethod,
    orderNotes,
    isGuestCheckout,
    cartData,

    // Computed
    itemCount,
    subtotal,
    discountAmount,
    taxAmount,
    shippingCost,
    total,

    // Actions
    addItem,
    removeItem,
    updateQuantity,
    restoreItem,
    updateItemOptions,
    applyDiscountCode,
    removeDiscountCode,
    selectShippingOption,
    clearCart,
    nextCheckoutStep,
    prevCheckoutStep,
    setCheckoutStep,
    updateShippingAddress,
    updateBillingAddress,
    toggleSameAddress,
    updatePaymentMethod,
    updateCartData,
    loadFromLocalStorage,
  };
});
