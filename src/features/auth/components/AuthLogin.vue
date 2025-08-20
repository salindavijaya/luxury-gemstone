<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Header -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
      <p class="text-slate-600">Sign in to your account to continue</p>
    </div>

    <!-- Login Form -->
    <form @submit.prevent="handleSubmit" novalidate class="space-y-6">
      <!-- Email Field -->
      <div class="relative">
        <input
          :id="emailFieldId"
          v-model="formData.email"
          type="email"
          autocomplete="email"
          class="peer w-full px-4 pt-6 pb-2 border rounded-lg text-slate-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
          :class="{
            'border-red-300 focus:ring-red-500': hasFieldError('email'),
            'border-slate-300': !hasFieldError('email'),
          }"
          placeholder="Email address"
          @blur="touchField('email')"
          @focus="clearFieldError"
          :aria-describedby="
            hasFieldError('email') ? `${emailFieldId}-error` : undefined
          "
          :aria-invalid="hasFieldError('email')"
        />
        <label
          :for="emailFieldId"
          class="absolute left-4 top-2 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-emerald-600"
        >
          Email Address
        </label>
        <!-- Email Error -->
        <div
          v-if="hasFieldError('email')"
          :id="`${emailFieldId}-error`"
          class="mt-1 text-sm text-red-600"
          role="alert"
        >
          {{ getFieldError("email") }}
        </div>
      </div>

      <!-- Password Field -->
      <div class="relative">
        <input
          :id="passwordFieldId"
          v-model="formData.password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          class="peer w-full px-4 pt-6 pb-2 pr-12 border rounded-lg text-slate-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
          :class="{
            'border-red-300 focus:ring-red-500': hasFieldError('password'),
            'border-slate-300': !hasFieldError('password'),
          }"
          placeholder="Password"
          @blur="touchField('password')"
          @focus="clearFieldError"
          :aria-describedby="
            hasFieldError('password') ? `${passwordFieldId}-error` : undefined
          "
          :aria-invalid="hasFieldError('password')"
        />
        <label
          :for="passwordFieldId"
          class="absolute left-4 top-2 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-emerald-600"
        >
          Password
        </label>
        <!-- Password Toggle -->
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-slate-600 transition-colors duration-200"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
        >
          <svg
            v-if="showPassword"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-.186-.186M19.5 19.5l-15-15"
            ></path>
          </svg>
          <svg
            v-else
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            ></path>
          </svg>
        </button>
        <!-- Password Error -->
        <div
          v-if="hasFieldError('password')"
          :id="`${passwordFieldId}-error`"
          class="mt-1 text-sm text-red-600"
          role="alert"
        >
          {{ getFieldError("password") }}
        </div>
      </div>

      <!-- Remember Me & Forgot Password -->
      <div class="flex items-center justify-between">
        <label class="flex items-center">
          <input
            v-model="formData.rememberMe"
            type="checkbox"
            class="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 focus:ring-2"
          />
          <span class="ml-2 text-sm text-slate-600">Remember me</span>
        </label>
        <button
          type="button"
          @click="$emit('switchMode', 'forgot')"
          class="text-sm text-emerald-600 hover:text-emerald-700 focus:outline-none focus:underline transition-colors duration-200"
        >
          Forgot password?
        </button>
      </div>

      <!-- General Error Message -->
      <div
        v-if="authError"
        class="p-3 bg-red-50 border border-red-200 rounded-lg"
        role="alert"
      >
        <div class="flex items-center">
          <svg
            class="w-5 h-5 text-red-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p class="text-sm text-red-700">{{ authError }}</p>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="!isFormValid || isLoading"
        class="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
      >
        <svg
          v-if="isLoading"
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {{ isLoading ? "Signing In..." : "Sign In" }}
      </button>
    </form>

    <!-- Social Login Options -->
    <div class="mt-8">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-slate-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-white text-slate-500">Or continue with</span>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          @click="handleSocialLogin('google')"
          class="w-full inline-flex justify-center py-3 px-4 border border-slate-300 rounded-lg bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span class="ml-2">Google</span>
        </button>

        <button
          type="button"
          @click="handleSocialLogin('facebook')"
          class="w-full inline-flex justify-center py-3 px-4 border border-slate-300 rounded-lg bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200"
        >
          <svg class="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
            <path
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
          <span class="ml-2">Facebook</span>
        </button>
      </div>
    </div>

    <!-- Register Link -->
    <div class="mt-8 text-center">
      <p class="text-sm text-slate-600">
        Don't have an account?
        <button
          @click="$emit('switchMode', 'register')"
          class="text-emerald-600 hover:text-emerald-700 font-medium focus:outline-none focus:underline transition-colors duration-200"
        >
          Sign up
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuth } from "@/features/auth/composables";
import { useValidation, validationRules } from "@/composables/useValidation";
import type { LoginCredentials } from "@/features/auth/store";

// Generate unique IDs for form fields
const generateId = () => `field_${Math.random().toString(36).substr(2, 9)}`;
const emailFieldId = generateId();
const passwordFieldId = generateId();

// Emits
const emit = defineEmits<{
  switchMode: [mode: "register" | "forgot" | "login"];
  success: [];
}>();

// Composables
const { login, isLoading, error: authError, clearError } = useAuth();

// Form state
const showPassword = ref(false);

// Initial form data
const initialData: LoginCredentials = {
  email: "",
  password: "",
  rememberMe: false,
};

// Validation rules
const rules = {
  email: [
    validationRules.required("Email is required"),
    validationRules.email(),
  ],
  password: [validationRules.required("Password is required")],
};

// Use validation composable
const {
  formData,
  isFormValid,
  validateForm,
  setFieldValue,
  touchField,
  getFieldError,
  hasFieldError,
} = useValidation(initialData, rules);

// Clear field error when user starts typing
const clearFieldError = () => {
  clearError();
};

// Handle form submission
const handleSubmit = async (): Promise<void> => {
  // Validate all fields
  const isValid = validateForm();

  if (!isValid) {
    // Touch all fields to show errors
    Object.keys(formData).forEach((field) => touchField(field));
    return;
  }

  try {
    await login(formData as LoginCredentials);
    emit("success");
  } catch (error) {
    // Error is handled by the auth store and displayed in the UI
    console.error("Login failed:", error);
  }
};

// Handle social login
const handleSocialLogin = (provider: string): void => {
  // Placeholder for social login implementation
  console.log(`Social login with ${provider}`);
  // In a real app, this would redirect to the OAuth provider
};

// Auto-focus email field on mount
onMounted(() => {
  const emailInput = document.getElementById(emailFieldId);
  emailInput?.focus();
});
</script>

<style scoped>
/* Custom styles for floating labels */
.peer:not(:placeholder-shown) + label,
.peer:focus + label {
  @apply top-2 text-xs text-emerald-600;
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
