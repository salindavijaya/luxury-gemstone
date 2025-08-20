<template>
  <div class="space-y-8">
    <!-- Guest Checkout Toggle -->
    <div class="bg-slate-50 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-medium text-slate-800">Account Options</h3>
          <p class="text-xs text-slate-600 mt-1">
            {{
              isGuestCheckout
                ? "Checking out as guest"
                : "Logged in user checkout"
            }}
          </p>
        </div>
        <button
          @click="toggleGuestCheckout"
          class="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
        >
          {{ isGuestCheckout ? "Sign In" : "Checkout as Guest" }}
        </button>
      </div>
    </div>

    <!-- Shipping Address Form -->
    <div>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-slate-800">Shipping Address</h2>

        <!-- Saved Addresses (for logged-in users) -->
        <div
          v-if="!isGuestCheckout && savedAddresses.length > 0"
          class="relative"
        >
          <button
            @click="showSavedAddresses = !showSavedAddresses"
            class="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            Use Saved Address
          </button>

          <!-- Saved Addresses Dropdown -->
          <div
            v-if="showSavedAddresses"
            class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-slate-200 z-10"
          >
            <div class="py-2">
              <div
                v-for="address in savedAddresses"
                :key="address.id"
                @click="selectSavedAddress(address)"
                class="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
              >
                <div class="text-sm font-medium text-slate-800">
                  {{ address.label }}
                </div>
                <div class="text-xs text-slate-600 mt-1">
                  {{ formatAddress(address) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Address Form -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- First Name -->
        <div>
          <label
            for="firstName"
            class="block text-sm font-medium text-slate-700 mb-2"
          >
            First Name *
          </label>
          <input
            id="firstName"
            v-model="shippingForm.firstName"
            type="text"
            required
            class="w-full px-3 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            :class="{
              'border-red-300 focus:border-red-500 focus:ring-red-500':
                errors.firstName,
            }"
            @blur="validateField('firstName')"
          />
          <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">
            {{ errors.firstName }}
          </p>
        </div>

        <!-- Last Name -->
        <div>
          <label
            for="lastName"
            class="block text-sm font-medium text-slate-700 mb-2"
          >
            Last Name *
          </label>
          <input
            id="lastName"
            v-model="shippingForm.lastName"
            type="text"
            required
            class="w-full px-3 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            :class="{
              'border-red-300 focus:border-red-500 focus:ring-red-500':
                errors.lastName,
            }"
            @blur="validateField('lastName')"
          />
          <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">
            {{ errors.lastName }}
          </p>
        </div>

        <!-- Email (for guest checkout) -->
        <div v-if="isGuestCheckout" class="sm:col-span-2">
          <label
            for="email"
            class="block text-sm font-medium text-slate-700 mb-2"
          >
            Email Address *
          </label>
          <input
            id="email"
            v-model="shippingForm.email"
            type="email"
            required
            class="w-full px-3 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            :class="{
              'border-red-300 focus:border-red-500 focus:ring-red-500':
                errors.email,
            }"
            @blur="validateField('email')"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">
            {{ errors.email }}
          </p>
          <p class="mt-1 text-xs text-slate-500">
            Order confirmation will be sent to this email
          </p>
        </div>

        <!-- Phone -->
        <div class="sm:col-span-2">
          <label
            for="phone"
            class="block text-sm font-medium text-slate-700 mb-2"
          >
            Phone Number *
          </label>
          <input
            id="phone"
            v-model="shippingForm.phone"
            type="tel"
            required
            class="w-full px-3 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            :class="{
              'border-red-300 focus:border-red-500 focus:ring-red-500':
                errors.phone,
            }"
            @blur="validateField('phone')"
            placeholder="+1 (555) 123-4567"
          />
          <p v-if="errors.phone" class="mt-1 text-sm text-red-600">
            {{ errors.phone }}
          </p>
          <p class="mt-1 text-xs text-slate-500">
            For delivery updates and verification
          </p>
        </div>

        <!-- Address Line 1 -->
        <div class="sm:col-span-2">
          <label
            for="address1"
            class="block text-sm font-medium text-slate-700 mb-2"
          >
            Street Address *
          </label>
          <input
            id="address1"
            v-model="shippingForm.address1"
            type="text"
            required
            class="w-full px-3 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            :class="{
              'border-red-300 focus:border-red-500 focus:ring-red-500':
                errors.address1,
            }"
            @blur="validateField('address1')"
            placeholder="123 Main Street"
          />
          <p v-if="errors.address1" class="mt-1 text-sm text-red-600">
            {{ errors.address1 }}
          </p>
        </div>

        <!-- Address Line 2 -->
        <div class="sm:col-span-2">
          <label
            for="address2"
            class="block text-sm font-medium text-slate-700 mb-2"
          >
            Apartment, Suite, etc. (Optional)
          </label>
          <input
            id="address2"
            v-model="shippingForm.address2"
            type="text"
            class="w-full px-3 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="Apt 4B, Suite 100"
          />
        </div>

        <!-- City -->
        <div>
          <label
            for="city"
            class="block text-sm font-medium text-slate-700 mb-2"
          >
            City *
          </label>
          <input
            id="city"
            v-model="shippingForm.city"
            type="text"
            required
            class="w-full px-3 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            :class="{
              'border-red-300 focus:border-red-500 focus:ring-red-500':
                errors.city,
            }"
            @blur="validateField('city')"
            placeholder="New York"
          />
          <p v-if="errors.city" class="mt-1 text-sm text-red-600">
            {{ errors.city }}
          </p>
        </div>

        <!-- State -->
        <div>
          <label
            for="state"
            class="block text-sm font-medium text-slate-700 mb-2"
          >
            State *
          </label>
          <select
            id="state"
            v-model="shippingForm.state"
            required
            class="w-full px-3 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            :class="{
              'border-red-300 focus:border-red-500 focus:ring-red-500':
                errors.state,
            }"
            @change="validateField('state')"
          >
            <option value="">Select State</option>
            <option
              v-for="state in states"
              :key="state.code"
              :value="state.code"
            >
              {{ state.name }}
            </option>
          </select>
          <p v-if="errors.state" class="mt-1 text-sm text-red-600">
            {{ errors.state }}
          </p>
        </div>

        <!-- ZIP Code -->
        <div>
          <label
            for="zipCode"
            class="block text-sm font-medium text-slate-700 mb-2"
          >
            ZIP Code *
          </label>
          <input
            id="zipCode"
            v-model="shippingForm.zipCode"
            type="text"
            required
            class="w-full px-3 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            :class="{
              'border-red-300 focus:border-red-500 focus:ring-red-500':
                errors.zipCode,
            }"
            @blur="validateField('zipCode')"
            placeholder="10001"
          />
          <p v-if="errors.zipCode" class="mt-1 text-sm text-red-600">
            {{ errors.zipCode }}
          </p>
        </div>

        <!-- Country -->
        <div>
          <label
            for="country"
            class="block text-sm font-medium text-slate-700 mb-2"
          >
            Country *
          </label>
          <select
            id="country"
            v-model="shippingForm.country"
            required
            class="w-full px-3 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            :class="{
              'border-red-300 focus:border-red-500 focus:ring-red-500':
                errors.country,
            }"
            @change="validateField('country')"
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AU">Australia</option>
          </select>
          <p v-if="errors.country" class="mt-1 text-sm text-red-600">
            {{ errors.country }}
          </p>
        </div>
      </div>

      <!-- Save Address Option -->
      <div v-if="!isGuestCheckout" class="mt-6">
        <div class="flex items-center">
          <input
            id="saveAddress"
            v-model="saveAddress"
            type="checkbox"
            class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
          />
          <label for="saveAddress" class="ml-2 text-sm text-slate-700">
            Save this address for future orders
          </label>
        </div>
      </div>
    </div>

    <!-- Shipping Options -->
    <div>
      <h2 class="text-xl font-semibold text-slate-800 mb-6">Shipping Method</h2>

      <div class="space-y-4">
        <div
          v-for="option in shippingOptions"
          :key="option.id"
          @click="selectedShippingOption = option.id"
          class="relative border border-slate-300 rounded-lg p-4 cursor-pointer hover:border-emerald-300 transition-colors"
          :class="{
            'border-emerald-500 bg-emerald-50':
              selectedShippingOption === option.id,
          }"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-start gap-3">
              <input
                :id="`shipping-${option.id}`"
                v-model="selectedShippingOption"
                :value="option.id"
                type="radio"
                class="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <div>
                <label
                  :for="`shipping-${option.id}`"
                  class="block text-sm font-medium text-slate-800 cursor-pointer"
                >
                  {{ option.name }}
                </label>
                <p class="text-xs text-slate-600 mt-1">
                  {{ option.description }}
                </p>
                <div v-if="option.features" class="flex flex-wrap gap-2 mt-2">
                  <span
                    v-for="feature in option.features"
                    :key="feature"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="getFeatureBadgeClass(feature)"
                  >
                    {{ feature }}
                  </span>
                </div>
              </div>
            </div>

            <div class="text-right">
              <span class="text-sm font-semibold text-slate-800">
                {{
                  option.price === 0 ? "Free" : `$${option.price.toFixed(2)}`
                }}
              </span>
              <p class="text-xs text-slate-500 mt-1">{{ option.timeframe }}</p>
            </div>
          </div>

          <!-- Gemstone-specific Features -->
          <div
            v-if="option.gemstoneFeatures"
            class="mt-4 pt-4 border-t border-slate-200"
          >
            <div class="flex items-start gap-2">
              <svg
                class="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="text-xs font-medium text-amber-800">
                  Luxury Jewelry Features:
                </p>
                <ul class="text-xs text-amber-700 mt-1 space-y-1">
                  <li v-for="feature in option.gemstoneFeatures" :key="feature">
                    • {{ feature }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Special Instructions -->
    <div>
      <h2 class="text-xl font-semibold text-slate-800 mb-6">
        Special Instructions
      </h2>

      <div class="space-y-4">
        <!-- Delivery Instructions -->
        <div>
          <label
            for="deliveryInstructions"
            class="block text-sm font-medium text-slate-700 mb-2"
          >
            Delivery Instructions (Optional)
          </label>
          <textarea
            id="deliveryInstructions"
            v-model="deliveryInstructions"
            rows="3"
            class="w-full px-3 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none transition-colors"
            placeholder="Leave at front door, buzz apartment 4B, etc."
          ></textarea>
        </div>

        <!-- Gift Message -->
        <div>
          <div class="flex items-center mb-2">
            <input
              id="isGift"
              v-model="isGift"
              type="checkbox"
              class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
            />
            <label for="isGift" class="ml-2 text-sm font-medium text-slate-700">
              This is a gift
            </label>
          </div>

          <div v-if="isGift" class="mt-4">
            <label
              for="giftMessage"
              class="block text-sm font-medium text-slate-700 mb-2"
            >
              Gift Message (Optional)
            </label>
            <textarea
              id="giftMessage"
              v-model="giftMessage"
              rows="3"
              class="w-full px-3 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none transition-colors"
              placeholder="Happy Birthday! Hope you love this beautiful piece..."
              maxlength="500"
            ></textarea>
            <p class="text-xs text-slate-500 mt-1">
              {{ giftMessage.length }}/500 characters
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";

interface ShippingAddress {
  id?: string;
  label?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  timeframe: string;
  features?: string[];
  gemstoneFeatures?: string[];
}

interface State {
  code: string;
  name: string;
}

const emit = defineEmits<{
  "update:canProceed": [canProceed: boolean];
  "shipping-data": [data: any];
}>();

// Reactive state
const isGuestCheckout = ref(true);
const showSavedAddresses = ref(false);
const selectedShippingOption = ref("standard");
const saveAddress = ref(false);
const deliveryInstructions = ref("");
const isGift = ref(false);
const giftMessage = ref("");

// Form data
const shippingForm = reactive<ShippingAddress>({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
});

// Form validation
const errors = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address1: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
});

// Mock saved addresses
const savedAddresses: ShippingAddress[] = [
  {
    id: "1",
    label: "Home",
    firstName: "John",
    lastName: "Doe",
    phone: "+1 (555) 123-4567",
    address1: "123 Main Street",
    address2: "Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "US",
  },
  {
    id: "2",
    label: "Work",
    firstName: "John",
    lastName: "Doe",
    phone: "+1 (555) 987-6543",
    address1: "456 Business Ave",
    address2: "Suite 200",
    city: "New York",
    state: "NY",
    zipCode: "10002",
    country: "US",
  },
];

// States data
const states: State[] = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

// Shipping options with gemstone-specific features
const shippingOptions: ShippingOption[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    description: "Reliable delivery with tracking",
    price: 0,
    timeframe: "5-7 business days",
    features: ["Free", "Tracking Included"],
    gemstoneFeatures: [
      "Secure packaging with insurance up to $1,000",
      "Signature required for delivery",
    ],
  },
  {
    id: "express",
    name: "Express Shipping",
    description: "Faster delivery with priority handling",
    price: 24.99,
    timeframe: "2-3 business days",
    features: ["Priority Handling", "SMS Updates"],
    gemstoneFeatures: [
      "Enhanced secure packaging",
      "Full insurance coverage included",
      "Adult signature required",
      "Real-time GPS tracking",
    ],
  },
  {
    id: "overnight",
    name: "Overnight Delivery",
    description: "Next business day delivery",
    price: 49.99,
    timeframe: "1 business day",
    features: ["Next Day", "Premium Service"],
    gemstoneFeatures: [
      "White-glove handling",
      "Full replacement value insurance",
      "Direct courier delivery",
      "Photo confirmation upon delivery",
    ],
  },
  {
    id: "luxury",
    name: "Luxury Concierge Delivery",
    description: "Premium delivery experience",
    price: 99.99,
    timeframe: "Scheduled at your convenience",
    features: ["Concierge Service", "Flexible Scheduling"],
    gemstoneFeatures: [
      "Personal jewelry consultant delivery",
      "In-home authenticity verification",
      "Complimentary jewelry care kit",
      "Lifetime insurance options consultation",
    ],
  },
];

// Computed properties
const isFormValid = computed(() => {
  const requiredFields = [
    "firstName",
    "lastName",
    "phone",
    "address1",
    "city",
    "state",
    "zipCode",
    "country",
  ];

  // Add email validation for guest checkout
  if (isGuestCheckout.value) {
    requiredFields.push("email");
  }

  // Check if all required fields are filled and have no errors
  return requiredFields.every((field) => {
    const value = shippingForm[field as keyof ShippingAddress];
    return (
      value &&
      value.toString().trim() !== "" &&
      !errors[field as keyof typeof errors]
    );
  });
});

// Watchers
watch(isFormValid, (valid) => {
  emit("update:canProceed", valid);
});

watch(
  () => ({
    ...shippingForm,
    selectedShippingOption: selectedShippingOption.value,
  }),
  (data) => {
    emit("shipping-data", data);
  },
  { deep: true }
);

// Methods
const toggleGuestCheckout = () => {
  isGuestCheckout.value = !isGuestCheckout.value;
  showSavedAddresses.value = false;

  // Clear email field if switching to logged-in checkout
  if (!isGuestCheckout.value) {
    shippingForm.email = "";
    errors.email = "";
  }
};

const selectSavedAddress = (address: ShippingAddress) => {
  Object.assign(shippingForm, {
    firstName: address.firstName,
    lastName: address.lastName,
    phone: address.phone,
    address1: address.address1,
    address2: address.address2 || "",
    city: address.city,
    state: address.state,
    zipCode: address.zipCode,
    country: address.country,
  });

  showSavedAddresses.value = false;

  // Clear any existing errors
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });
};

const formatAddress = (address: ShippingAddress): string => {
  const parts = [
    address.address1,
    address.address2,
    address.city,
    address.state,
    address.zipCode,
  ].filter(Boolean);

  return parts.join(", ");
};

const validateField = (fieldName: keyof typeof errors) => {
  const value = shippingForm[fieldName as keyof ShippingAddress] as string;

  switch (fieldName) {
    case "firstName":
    case "lastName":
      errors[fieldName] = !value?.trim()
        ? `${fieldName === "firstName" ? "First" : "Last"} name is required`
        : "";
      break;

    case "email":
      if (isGuestCheckout.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        errors.email = !value?.trim()
          ? "Email is required"
          : !emailRegex.test(value)
            ? "Please enter a valid email address"
            : "";
      }
      break;

    case "phone":
      const phoneRegex = /^[\+]?[\s\-\(\)]*([0-9][\s\-\(\)]*)*/;
      errors.phone = !value?.trim()
        ? "Phone number is required"
        : !phoneRegex.test(value) || value.replace(/\D/g, "").length < 10
          ? "Please enter a valid phone number"
          : "";
      break;

    case "address1":
      errors.address1 = !value?.trim() ? "Street address is required" : "";
      break;

    case "city":
      errors.city = !value?.trim() ? "City is required" : "";
      break;

    case "state":
      errors.state = !value?.trim() ? "State is required" : "";
      break;

    case "zipCode":
      const zipRegex = /^\d{5}(-\d{4})?$/;
      errors.zipCode = !value?.trim()
        ? "ZIP code is required"
        : !zipRegex.test(value)
          ? "Please enter a valid ZIP code"
          : "";
      break;

    case "country":
      errors.country = !value?.trim() ? "Country is required" : "";
      break;
  }
};

const getFeatureBadgeClass = (feature: string): string => {
  const lowerFeature = feature.toLowerCase();

  if (lowerFeature.includes("free")) {
    return "bg-emerald-100 text-emerald-800";
  } else if (
    lowerFeature.includes("priority") ||
    lowerFeature.includes("express")
  ) {
    return "bg-amber-100 text-amber-800";
  } else if (
    lowerFeature.includes("premium") ||
    lowerFeature.includes("luxury")
  ) {
    return "bg-purple-100 text-purple-800";
  } else {
    return "bg-slate-100 text-slate-800";
  }
};

// Initialize validation on mount
const initializeValidation = () => {
  // Validate all fields on component mount if they have values
  Object.keys(errors).forEach((key) => {
    const fieldName = key as keyof typeof errors;
    if (shippingForm[fieldName as keyof ShippingAddress]) {
      validateField(fieldName);
    }
  });
};

// Call initialization
initializeValidation();
</script>

<style scoped>
/* Enhanced focus styles for accessibility */
input:focus,
select:focus,
textarea:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Smooth transitions for form interactions */
input,
select,
textarea {
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}

/* Custom radio button styling */
input[type="radio"]:checked {
  background-color: rgb(16 185 129);
  border-color: rgb(16 185 129);
}

/* Custom checkbox styling */
input[type="checkbox"]:checked {
  background-color: rgb(16 185 129);
  border-color: rgb(16 185 129);
}

/* Hover effects for shipping options */
.cursor-pointer:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
</style>
