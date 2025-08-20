<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <router-link to="/" class="flex items-center">
            <div
              class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center mr-3"
            >
              <svg
                class="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </div>
            <span class="text-xl font-bold text-slate-800">LuxGems</span>
          </router-link>

          <!-- Security Indicators -->
          <div class="flex items-center gap-4">
            <div
              class="hidden sm:flex items-center gap-2 text-sm text-slate-600"
            >
              <svg
                class="w-4 h-4 text-emerald-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Secure Checkout</span>
            </div>

            <!-- Help Button -->
            <button
              @click="showHelp = true"
              class="p-2 text-slate-500 hover:text-slate-700 rounded-md transition-colors"
              aria-label="Get help"
            >
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
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-8">
          <!-- Progress Steps -->
          <div class="mb-8">
            <nav aria-label="Progress">
              <ol class="flex items-center">
                <li
                  v-for="(step, index) in steps"
                  :key="step.id"
                  :class="[
                    index !== steps.length - 1 ? 'pr-8 sm:pr-20' : '',
                    'relative',
                  ]"
                >
                  <!-- Step Connector Line -->
                  <div
                    v-if="index !== steps.length - 1"
                    class="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div
                      :class="[
                        'h-0.5 w-full',
                        isStepCompleted(index) || currentStep > index + 1
                          ? 'bg-emerald-600'
                          : 'bg-slate-200',
                      ]"
                    />
                  </div>

                  <!-- Step Content -->
                  <div class="relative flex items-center">
                    <!-- Step Icon -->
                    <div
                      :class="[
                        'flex items-center justify-center w-8 h-8 rounded-full border-2',
                        getStepClasses(index),
                      ]"
                    >
                      <svg
                        v-if="isStepCompleted(index)"
                        class="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span
                        v-else
                        :class="[
                          'text-sm font-medium',
                          currentStep === index + 1
                            ? 'text-emerald-600'
                            : currentStep > index + 1
                              ? 'text-white'
                              : 'text-slate-400',
                        ]"
                      >
                        {{ index + 1 }}
                      </span>
                    </div>

                    <!-- Step Label -->
                    <span
                      :class="[
                        'ml-3 text-sm font-medium',
                        currentStep === index + 1
                          ? 'text-emerald-600'
                          : isStepCompleted(index)
                            ? 'text-slate-700'
                            : 'text-slate-500',
                      ]"
                    >
                      {{ step.title }}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <!-- Step Content -->
          <div class="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <div class="mb-6">
              <h1 class="text-2xl font-bold text-slate-800">
                {{ currentStepData.title }}
              </h1>
              <p v-if="currentStepData.description" class="text-slate-600 mt-2">
                {{ currentStepData.description }}
              </p>
            </div>

            <!-- Dynamic Step Content -->
            <div class="min-h-[400px]">
              <slot />
            </div>

            <!-- Navigation Buttons -->
            <div
              class="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t border-slate-200"
            >
              <button
                v-if="currentStep > 1"
                @click="previousStep"
                class="inline-flex items-center px-6 py-3 border border-slate-300 shadow-sm text-base font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
              >
                <svg
                  class="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>

              <div class="sm:ml-auto">
                <button
                  @click="nextStep"
                  :disabled="!canProceed"
                  :class="[
                    'inline-flex items-center px-8 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
                    canProceed
                      ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
                      : 'bg-slate-400 cursor-not-allowed',
                  ]"
                >
                  {{
                    currentStep === steps.length ? "Place Order" : "Continue"
                  }}
                  <svg
                    v-if="currentStep < steps.length"
                    class="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="mt-8 lg:mt-0 lg:col-span-4">
          <div class="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            <h2 class="text-lg font-semibold text-slate-800 mb-4">
              Order Summary
            </h2>

            <!-- Cart Items -->
            <div class="space-y-4 mb-6">
              <div
                v-for="item in cartItems"
                :key="item.id"
                class="flex items-center gap-3"
              >
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="w-12 h-12 object-cover rounded-md border border-slate-200"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-800 truncate">
                    {{ item.name }}
                  </p>
                  <p class="text-xs text-slate-500">Qty: {{ item.quantity }}</p>
                </div>
                <p class="text-sm font-semibold text-slate-800">
                  ${{ formatPrice(item.price * item.quantity) }}
                </p>
              </div>
            </div>

            <!-- Summary Details -->
            <div class="space-y-3 border-t border-slate-200 pt-4">
              <div class="flex justify-between text-sm">
                <span class="text-slate-600">Subtotal</span>
                <span class="text-slate-800">${{ formatPrice(subtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-600">Shipping</span>
                <span class="text-slate-800">
                  {{ shipping === 0 ? "Free" : `$${formatPrice(shipping)}` }}
                </span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-600">Tax</span>
                <span class="text-slate-800">${{ formatPrice(tax) }}</span>
              </div>
              <div
                class="flex justify-between text-base font-semibold text-slate-800 border-t border-slate-200 pt-3"
              >
                <span>Total</span>
                <span>${{ formatPrice(total) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Help Modal -->
    <div
      v-if="showHelp"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <!-- Background overlay -->
        <div
          class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity"
          @click="showHelp = false"
        ></div>

        <!-- Modal panel -->
        <div
          class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
        >
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 sm:mx-0 sm:h-10 sm:w-10"
            >
              <svg
                class="h-6 w-6 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3
                class="text-lg leading-6 font-medium text-slate-800"
                id="modal-title"
              >
                Need Help?
              </h3>
              <div class="mt-2">
                <p class="text-sm text-slate-500">
                  Our luxury jewelry experts are here to assist you with your
                  purchase.
                </p>
                <div class="mt-4 space-y-3">
                  <div class="flex items-center gap-2">
                    <svg
                      class="w-4 h-4 text-emerald-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                      />
                    </svg>
                    <span class="text-sm text-slate-700"
                      >+1 (555) 123-GEMS</span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <svg
                      class="w-4 h-4 text-emerald-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                      />
                      <path
                        d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                      />
                    </svg>
                    <span class="text-sm text-slate-700"
                      >support@luxgems.com</span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <svg
                      class="w-4 h-4 text-emerald-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="text-sm text-slate-700">Available 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              @click="showHelp = false"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutStep {
  id: string;
  title: string;
  description?: string;
}

interface Props {
  currentStep: number;
  canProceed?: boolean;
  cartItems?: CartItem[];
  subtotal?: number;
  shipping?: number;
  tax?: number;
}

const props = withDefaults(defineProps<Props>(), {
  canProceed: true,
  cartItems: () => [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
});

const emit = defineEmits<{
  "step-change": [step: number];
  "next-step": [];
  "previous-step": [];
}>();

const router = useRouter();
const showHelp = ref(false);

// Checkout steps configuration
const steps: CheckoutStep[] = [
  {
    id: "shipping",
    title: "Shipping",
    description: "Enter your shipping address and delivery preferences",
  },
  {
    id: "payment",
    title: "Payment",
    description: "Select your payment method and billing information",
  },
  {
    id: "review",
    title: "Review",
    description: "Review your order details before placing your order",
  },
];

// Computed properties
const currentStepData = computed(
  () => steps[props.currentStep - 1] || steps[0]
);
const total = computed(() => props.subtotal + props.shipping + props.tax);

// Methods
const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

const isStepCompleted = (stepIndex: number): boolean => {
  return props.currentStep > stepIndex + 1;
};

const getStepClasses = (stepIndex: number): string => {
  if (isStepCompleted(stepIndex)) {
    return "bg-emerald-600 border-emerald-600";
  } else if (props.currentStep === stepIndex + 1) {
    return "border-emerald-600 bg-white";
  } else {
    return "border-slate-300 bg-white";
  }
};

const nextStep = () => {
  if (props.canProceed) {
    if (props.currentStep < steps.length) {
      emit("next-step");
    } else {
      // Place order logic would go here
      router.push("/checkout/success");
    }
  }
};

const previousStep = () => {
  if (props.currentStep > 1) {
    emit("previous-step");
  }
};

// Mock cart data for demonstration
onMounted(() => {
  // This would typically come from a store or props
  if (props.cartItems.length === 0) {
    // Add mock data if no cart items provided
    const mockItems: CartItem[] = [
      {
        id: "1",
        name: "Royal Blue Sapphire Ring",
        price: 2499.0,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
      },
      {
        id: "2",
        name: "Diamond Tennis Bracelet",
        price: 1899.0,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop",
      },
    ];
    // This would be replaced by actual store data
    Object.assign(props, {
      cartItems: mockItems,
      subtotal: 4398.0,
      shipping: 0,
      tax: 351.84,
    });
  }
});
</script>

<style scoped>
/* Custom styles for better visual hierarchy */
.sticky {
  position: sticky;
}

/* Smooth transitions for step indicators */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Enhanced focus styles for accessibility */
button:focus-visible {
  outline: 2px solid rgb(16 185 129);
  outline-offset: 2px;
}
</style>
