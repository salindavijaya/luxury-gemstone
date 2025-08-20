<template>
  <div class="space-y-4">
    <h3 v-if="title" class="text-lg font-semibold text-slate-900 mb-4">
      {{ title }}
    </h3>

    <!-- Full Name -->
    <div>
      <label
        for="fullName"
        class="block text-sm font-medium text-slate-700 mb-2"
      >
        Full Name *
      </label>
      <input
        id="fullName"
        v-model="localAddress.fullName"
        type="text"
        required
        class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
        :class="{
          'border-red-300 focus:ring-red-500 focus:border-red-500':
            errors.fullName,
        }"
        placeholder="Enter your full name"
        @blur="validateField('fullName')"
        @input="clearError('fullName')"
      />
      <p v-if="errors.fullName" class="mt-1 text-sm text-red-600">
        {{ errors.fullName }}
      </p>
    </div>

    <!-- Company (Optional) -->
    <div>
      <label
        for="company"
        class="block text-sm font-medium text-slate-700 mb-2"
      >
        Company (Optional)
      </label>
      <input
        id="company"
        v-model="localAddress.company"
        type="text"
        class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
        placeholder="Company name"
      />
    </div>

    <!-- Street Address -->
    <div>
      <label for="street" class="block text-sm font-medium text-slate-700 mb-2">
        Street Address *
      </label>
      <input
        id="street"
        v-model="localAddress.street"
        type="text"
        required
        class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
        :class="{
          'border-red-300 focus:ring-red-500 focus:border-red-500':
            errors.street,
        }"
        placeholder="Street address"
        @blur="validateField('street')"
        @input="clearError('street')"
      />
      <p v-if="errors.street" class="mt-1 text-sm text-red-600">
        {{ errors.street }}
      </p>
    </div>

    <!-- Apartment/Unit -->
    <div>
      <label
        for="apartment"
        class="block text-sm font-medium text-slate-700 mb-2"
      >
        Apartment, Unit, etc. (Optional)
      </label>
      <input
        id="apartment"
        v-model="localAddress.apartment"
        type="text"
        class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
        placeholder="Apt, suite, unit, building, floor, etc."
      />
    </div>

    <!-- City and State/Province -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label for="city" class="block text-sm font-medium text-slate-700 mb-2">
          City *
        </label>
        <input
          id="city"
          v-model="localAddress.city"
          type="text"
          required
          class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          :class="{
            'border-red-300 focus:ring-red-500 focus:border-red-500':
              errors.city,
          }"
          placeholder="City"
          @blur="validateField('city')"
          @input="clearError('city')"
        />
        <p v-if="errors.city" class="mt-1 text-sm text-red-600">
          {{ errors.city }}
        </p>
      </div>

      <div>
        <label
          for="state"
          class="block text-sm font-medium text-slate-700 mb-2"
        >
          State/Province *
        </label>
        <select
          id="state"
          v-model="localAddress.state"
          required
          class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors appearance-none bg-white"
          :class="{
            'border-red-300 focus:ring-red-500 focus:border-red-500':
              errors.state,
          }"
          @blur="validateField('state')"
          @change="clearError('state')"
        >
          <option value="">Select State/Province</option>
          <optgroup label="United States">
            <option
              v-for="state in usStates"
              :key="state.code"
              :value="state.code"
            >
              {{ state.name }}
            </option>
          </optgroup>
          <optgroup label="Canada">
            <option
              v-for="province in canadaProvinces"
              :key="province.code"
              :value="province.code"
            >
              {{ province.name }}
            </option>
          </optgroup>
        </select>
        <p v-if="errors.state" class="mt-1 text-sm text-red-600">
          {{ errors.state }}
        </p>
      </div>
    </div>

    <!-- ZIP/Postal Code and Country -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label
          for="zipCode"
          class="block text-sm font-medium text-slate-700 mb-2"
        >
          ZIP/Postal Code *
        </label>
        <input
          id="zipCode"
          v-model="localAddress.zipCode"
          type="text"
          required
          class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
          :class="{
            'border-red-300 focus:ring-red-500 focus:border-red-500':
              errors.zipCode,
          }"
          :placeholder="getZipPlaceholder()"
          @blur="validateField('zipCode')"
          @input="clearError('zipCode')"
        />
        <p v-if="errors.zipCode" class="mt-1 text-sm text-red-600">
          {{ errors.zipCode }}
        </p>
      </div>

      <div>
        <label
          for="country"
          class="block text-sm font-medium text-slate-700 mb-2"
        >
          Country *
        </label>
        <select
          id="country"
          v-model="localAddress.country"
          required
          class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors appearance-none bg-white"
          :class="{
            'border-red-300 focus:ring-red-500 focus:border-red-500':
              errors.country,
          }"
          @blur="validateField('country')"
          @change="handleCountryChange"
        >
          <option value="">Select Country</option>
          <option
            v-for="country in countries"
            :key="country.code"
            :value="country.code"
          >
            {{ country.name }}
          </option>
        </select>
        <p v-if="errors.country" class="mt-1 text-sm text-red-600">
          {{ errors.country }}
        </p>
      </div>
    </div>

    <!-- Phone Number -->
    <div>
      <label for="phone" class="block text-sm font-medium text-slate-700 mb-2">
        Phone Number *
      </label>
      <input
        id="phone"
        v-model="localAddress.phone"
        type="tel"
        required
        class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
        :class="{
          'border-red-300 focus:ring-red-500 focus:border-red-500':
            errors.phone,
        }"
        placeholder="+1 (555) 123-4567"
        @blur="validateField('phone')"
        @input="clearError('phone')"
      />
      <p v-if="errors.phone" class="mt-1 text-sm text-red-600">
        {{ errors.phone }}
      </p>
    </div>

    <!-- Delivery Instructions (Optional) -->
    <div v-if="showDeliveryInstructions">
      <label
        for="instructions"
        class="block text-sm font-medium text-slate-700 mb-2"
      >
        Delivery Instructions (Optional)
      </label>
      <textarea
        id="instructions"
        v-model="localAddress.instructions"
        rows="3"
        class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
        placeholder="Special delivery instructions, gate codes, etc."
      ></textarea>
    </div>

    <!-- Address Verification -->
    <div
      v-if="showVerification && isVerified"
      class="flex items-center p-3 bg-emerald-50 rounded-lg"
    >
      <CheckCircleIcon class="h-5 w-5 text-emerald-600 mr-2" />
      <span class="text-sm text-emerald-800">Address verified</span>
    </div>

    <div
      v-if="showVerification && !isVerified && isValidating"
      class="flex items-center p-3 bg-amber-50 rounded-lg"
    >
      <div
        class="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600 mr-2"
      ></div>
      <span class="text-sm text-amber-800">Verifying address...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from "vue";
import { CheckCircleIcon } from "@heroicons/vue/24/solid";

// Types
interface Address {
  fullName: string;
  company?: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  instructions?: string;
}

interface ValidationErrors {
  fullName?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
}

interface Props {
  title?: string;
  address?: Address;
  showDeliveryInstructions?: boolean;
  showVerification?: boolean;
  required?: boolean;
}

interface Emits {
  (e: "update:address", address: Address): void;
  (e: "validate", isValid: boolean): void;
}

// Props & Emits
const props = withDefaults(defineProps<Props>(), {
  title: "",
  address: () => ({
    fullName: "",
    company: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: "",
    instructions: "",
  }),
  showDeliveryInstructions: true,
  showVerification: false,
  required: true,
});

const emit = defineEmits<Emits>();

// State
const localAddress = reactive<Address>({ ...props.address });
const errors = reactive<ValidationErrors>({});
const isVerified = ref(false);
const isValidating = ref(false);

// Data
const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "UK", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
];

const usStates = [
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

const canadaProvinces = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NS", name: "Nova Scotia" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "YT", name: "Yukon" },
];

// Computed
const isValid = computed(() => {
  if (!props.required) return true;

  const requiredFields = [
    "fullName",
    "street",
    "city",
    "state",
    "zipCode",
    "country",
    "phone",
  ];
  return (
    requiredFields.every((field) => localAddress[field as keyof Address]) &&
    Object.keys(errors).length === 0
  );
});

// Methods
const validateField = (field: keyof ValidationErrors) => {
  const value = localAddress[field as keyof Address] as string;

  switch (field) {
    case "fullName":
      if (!value.trim()) {
        errors.fullName = "Full name is required";
      } else if (value.trim().length < 2) {
        errors.fullName = "Full name must be at least 2 characters";
      }
      break;

    case "street":
      if (!value.trim()) {
        errors.street = "Street address is required";
      }
      break;

    case "city":
      if (!value.trim()) {
        errors.city = "City is required";
      }
      break;

    case "state":
      if (!value) {
        errors.state = "State/Province is required";
      }
      break;

    case "zipCode":
      if (!value.trim()) {
        errors.zipCode = "ZIP/Postal code is required";
      } else if (!isValidZipCode(value, localAddress.country)) {
        errors.zipCode = "Invalid ZIP/Postal code format";
      }
      break;

    case "country":
      if (!value) {
        errors.country = "Country is required";
      }
      break;

    case "phone":
      if (!value.trim()) {
        errors.phone = "Phone number is required";
      } else if (!isValidPhone(value)) {
        errors.phone = "Invalid phone number format";
      }
      break;
  }

  // If validation passed, verify address if needed
  if (props.showVerification && !errors[field] && isAddressComplete()) {
    verifyAddress();
  }
};

const clearError = (field: keyof ValidationErrors) => {
  delete errors[field];
};

const isValidZipCode = (zip: string, country: string): boolean => {
  switch (country) {
    case "US":
      return /^\d{5}(-\d{4})?$/.test(zip);
    case "CA":
      return /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(zip);
    case "UK":
      return /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(zip);
    default:
      return zip.length >= 3;
  }
};

const isValidPhone = (phone: string): boolean => {
  // Remove all non-digit characters for validation
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
};

const getZipPlaceholder = (): string => {
  switch (localAddress.country) {
    case "US":
      return "12345 or 12345-6789";
    case "CA":
      return "K1A 0A6";
    case "UK":
      return "SW1A 1AA";
    default:
      return "Postal code";
  }
};

const handleCountryChange = () => {
  // Clear state when country changes
  localAddress.state = "";
  clearError("country");
  clearError("state");
  clearError("zipCode");
};

const isAddressComplete = (): boolean => {
  return !!(
    localAddress.fullName &&
    localAddress.street &&
    localAddress.city &&
    localAddress.state &&
    localAddress.zipCode &&
    localAddress.country
  );
};

const verifyAddress = async () => {
  if (!props.showVerification) return;

  isValidating.value = true;
  isVerified.value = false;

  try {
    // Simulate address verification API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real app, you would call an address verification service
    // const response = await addressVerificationService.verify(localAddress)
    // isVerified.value = response.isValid

    isVerified.value = true;
  } catch (error) {
    console.error("Address verification failed:", error);
    isVerified.value = false;
  } finally {
    isValidating.value = false;
  }
};

const validateAll = (): boolean => {
  if (!props.required) return true;

  const requiredFields: (keyof ValidationErrors)[] = [
    "fullName",
    "street",
    "city",
    "state",
    "zipCode",
    "country",
    "phone",
  ];

  requiredFields.forEach((field) => {
    validateField(field);
  });

  return Object.keys(errors).length === 0;
};

// Watch for address changes and emit updates
watch(
  localAddress,
  (newAddress) => {
    emit("update:address", { ...newAddress });
  },
  { deep: true }
);

// Watch for validation changes and emit validity
watch(
  isValid,
  (valid) => {
    emit("validate", valid);
  },
  { immediate: true }
);

// Watch for props.address changes
watch(
  () => props.address,
  (newAddress) => {
    Object.assign(localAddress, newAddress);
  },
  { deep: true }
);

// Expose validation method for parent components
defineExpose({
  validate: validateAll,
  isValid: isValid.value,
  errors,
});
</script>

<style scoped>
/* Custom select arrow */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}

/* Focus styles for better accessibility */
input:focus,
select:focus,
textarea:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Error state styling */
.border-red-300:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>
