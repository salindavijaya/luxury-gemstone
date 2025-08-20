<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Header -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-slate-800 mb-2">Create Account</h2>
      <p class="text-slate-600">Join our gemstone collection</p>
    </div>

    <!-- Registration Form -->
    <form @submit.prevent="handleRegister" class="space-y-6">
      <!-- First Name Field -->
      <div class="relative">
        <input
          v-model="form.firstName"
          :class="[
            'peer w-full px-4 pt-6 pb-2 text-slate-800 bg-slate-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white',
            errors.firstName
              ? 'border-red-500 focus:border-red-500'
              : touched.firstName
                ? 'border-emerald-500 focus:border-emerald-600'
                : 'border-slate-200 focus:border-emerald-500',
          ]"
          type="text"
          id="firstName"
          placeholder=" "
          :disabled="loading"
          @blur="touched.firstName = true"
          @input="validateField('firstName')"
          aria-describedby="firstName-error"
        />
        <label
          for="firstName"
          class="absolute left-4 top-4 text-slate-500 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-6 peer-focus:text-sm peer-focus:top-4 peer-focus:text-emerald-600"
        >
          First Name *
        </label>
        <div
          v-if="errors.firstName"
          id="firstName-error"
          class="mt-1 text-sm text-red-600"
          role="alert"
        >
          {{ errors.firstName }}
        </div>
      </div>

      <!-- Last Name Field -->
      <div class="relative">
        <input
          v-model="form.lastName"
          :class="[
            'peer w-full px-4 pt-6 pb-2 text-slate-800 bg-slate-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white',
            errors.lastName
              ? 'border-red-500 focus:border-red-500'
              : touched.lastName
                ? 'border-emerald-500 focus:border-emerald-600'
                : 'border-slate-200 focus:border-emerald-500',
          ]"
          type="text"
          id="lastName"
          placeholder=" "
          :disabled="loading"
          @blur="touched.lastName = true"
          @input="validateField('lastName')"
          aria-describedby="lastName-error"
        />
        <label
          for="lastName"
          class="absolute left-4 top-4 text-slate-500 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-6 peer-focus:text-sm peer-focus:top-4 peer-focus:text-emerald-600"
        >
          Last Name *
        </label>
        <div
          v-if="errors.lastName"
          id="lastName-error"
          class="mt-1 text-sm text-red-600"
          role="alert"
        >
          {{ errors.lastName }}
        </div>
      </div>

      <!-- Email Field -->
      <div class="relative">
        <input
          v-model="form.email"
          :class="[
            'peer w-full px-4 pt-6 pb-2 text-slate-800 bg-slate-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white',
            errors.email
              ? 'border-red-500 focus:border-red-500'
              : touched.email
                ? 'border-emerald-500 focus:border-emerald-600'
                : 'border-slate-200 focus:border-emerald-500',
          ]"
          type="email"
          id="email"
          placeholder=" "
          :disabled="loading"
          @blur="touched.email = true"
          @input="validateField('email')"
          aria-describedby="email-error"
          autocomplete="email"
        />
        <label
          for="email"
          class="absolute left-4 top-4 text-slate-500 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-6 peer-focus:text-sm peer-focus:top-4 peer-focus:text-emerald-600"
        >
          Email Address *
        </label>
        <div
          v-if="errors.email"
          id="email-error"
          class="mt-1 text-sm text-red-600"
          role="alert"
        >
          {{ errors.email }}
        </div>
      </div>

      <!-- Password Field -->
      <div class="relative">
        <input
          v-model="form.password"
          :class="[
            'peer w-full px-4 pt-6 pb-2 pr-12 text-slate-800 bg-slate-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white',
            errors.password
              ? 'border-red-500 focus:border-red-500'
              : touched.password
                ? 'border-emerald-500 focus:border-emerald-600'
                : 'border-slate-200 focus:border-emerald-500',
          ]"
          :type="showPassword ? 'text' : 'password'"
          id="password"
          placeholder=" "
          :disabled="loading"
          @blur="touched.password = true"
          @input="validateField('password')"
          aria-describedby="password-error password-strength"
          autocomplete="new-password"
        />
        <label
          for="password"
          class="absolute left-4 top-4 text-slate-500 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-6 peer-focus:text-sm peer-focus:top-4 peer-focus:text-emerald-600"
        >
          Password *
        </label>
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute right-3 top-6 text-slate-400 hover:text-slate-600 transition-colors duration-200"
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
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414l-7.071 7.071m15.556-7.071l-7.071-7.071m0 0L6.464 3.515m5.657 5.657l7.071 7.071"
            />
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
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>

        <!-- Password Strength Indicator -->
        <div
          v-if="form.password && touched.password"
          id="password-strength"
          class="mt-2"
        >
          <div class="flex space-x-1 mb-2">
            <div
              v-for="i in 4"
              :key="i"
              :class="[
                'h-1 flex-1 rounded-full transition-all duration-300',
                i <= passwordStrength.score
                  ? passwordStrength.score <= 1
                    ? 'bg-red-500'
                    : passwordStrength.score <= 2
                      ? 'bg-amber-500'
                      : passwordStrength.score <= 3
                        ? 'bg-blue-500'
                        : 'bg-emerald-500'
                  : 'bg-slate-200',
              ]"
            />
          </div>
          <p
            :class="[
              'text-xs',
              passwordStrength.score <= 1
                ? 'text-red-600'
                : passwordStrength.score <= 2
                  ? 'text-amber-600'
                  : passwordStrength.score <= 3
                    ? 'text-blue-600'
                    : 'text-emerald-600',
            ]"
          >
            {{ passwordStrength.message }}
          </p>
        </div>

        <div
          v-if="errors.password"
          id="password-error"
          class="mt-1 text-sm text-red-600"
          role="alert"
        >
          {{ errors.password }}
        </div>
      </div>

      <!-- Confirm Password Field -->
      <div class="relative">
        <input
          v-model="form.confirmPassword"
          :class="[
            'peer w-full px-4 pt-6 pb-2 pr-12 text-slate-800 bg-slate-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:bg-white',
            errors.confirmPassword
              ? 'border-red-500 focus:border-red-500'
              : touched.confirmPassword
                ? 'border-emerald-500 focus:border-emerald-600'
                : 'border-slate-200 focus:border-emerald-500',
          ]"
          :type="showConfirmPassword ? 'text' : 'password'"
          id="confirmPassword"
          placeholder=" "
          :disabled="loading"
          @blur="touched.confirmPassword = true"
          @input="validateField('confirmPassword')"
          aria-describedby="confirmPassword-error"
          autocomplete="new-password"
        />
        <label
          for="confirmPassword"
          class="absolute left-4 top-4 text-slate-500 text-sm transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-6 peer-focus:text-sm peer-focus:top-4 peer-focus:text-emerald-600"
        >
          Confirm Password *
        </label>
        <button
          type="button"
          @click="showConfirmPassword = !showConfirmPassword"
          class="absolute right-3 top-6 text-slate-400 hover:text-slate-600 transition-colors duration-200"
          :aria-label="
            showConfirmPassword
              ? 'Hide confirm password'
              : 'Show confirm password'
          "
        >
          <svg
            v-if="showConfirmPassword"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414l-7.071 7.071m15.556-7.071l-7.071-7.071m0 0L6.464 3.515m5.657 5.657l7.071 7.071"
            />
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
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
        <div
          v-if="errors.confirmPassword"
          id="confirmPassword-error"
          class="mt-1 text-sm text-red-600"
          role="alert"
        >
          {{ errors.confirmPassword }}
        </div>
      </div>

      <!-- Terms and Conditions -->
      <div class="flex items-start space-x-3">
        <input
          v-model="form.acceptTerms"
          type="checkbox"
          id="acceptTerms"
          class="mt-1 w-4 h-4 text-emerald-600 bg-slate-50 border-slate-300 rounded focus:ring-emerald-500 focus:ring-2"
          :disabled="loading"
          @change="validateField('acceptTerms')"
          aria-describedby="terms-error"
        />
        <label for="acceptTerms" class="text-sm text-slate-600 leading-5">
          I agree to the
          <a
            href="#"
            class="text-emerald-600 hover:text-emerald-700 underline font-medium"
            >Terms of Service</a
          >
          and
          <a
            href="#"
            class="text-emerald-600 hover:text-emerald-700 underline font-medium"
            >Privacy Policy</a
          >
        </label>
      </div>
      <div
        v-if="errors.acceptTerms"
        id="terms-error"
        class="text-sm text-red-600"
        role="alert"
      >
        {{ errors.acceptTerms }}
      </div>

      <!-- Newsletter Subscription -->
      <div class="flex items-start space-x-3">
        <input
          v-model="form.subscribeNewsletter"
          type="checkbox"
          id="subscribeNewsletter"
          class="mt-1 w-4 h-4 text-emerald-600 bg-slate-50 border-slate-300 rounded focus:ring-emerald-500 focus:ring-2"
          :disabled="loading"
        />
        <label
          for="subscribeNewsletter"
          class="text-sm text-slate-600 leading-5"
        >
          Subscribe to our newsletter for exclusive gemstone offers and updates
        </label>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading || !isFormValid"
        :class="[
          'w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-200',
          loading || !isFormValid
            ? 'bg-slate-300 cursor-not-allowed'
            : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-md hover:shadow-lg',
        ]"
        aria-describedby="submit-status"
      >
        <span v-if="loading" class="flex items-center justify-center">
          <svg
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
          Creating Account...
        </span>
        <span v-else>Create Account</span>
      </button>

      <!-- Error Message -->
      <div
        v-if="submitError"
        id="submit-status"
        class="text-sm text-red-600 text-center"
        role="alert"
      >
        {{ submitError }}
      </div>
    </form>

    <!-- Social Registration -->
    <div class="mt-8">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-slate-200"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-white text-slate-500">Or continue with</span>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          class="w-full inline-flex justify-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          :disabled="loading"
          @click="handleSocialRegister('google')"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
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
          class="w-full inline-flex justify-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          :disabled="loading"
          @click="handleSocialRegister('facebook')"
        >
          <svg
            class="w-5 h-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
          <span class="ml-2">Facebook</span>
        </button>
      </div>
    </div>

    <!-- Login Link -->
    <div class="mt-8 text-center">
      <p class="text-sm text-slate-600">
        Already have an account?
        <button
          @click="$emit('switch-to-login')"
          class="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors duration-200 focus:outline-none focus:underline"
        >
          Sign in here
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import { useValidation } from "@/composables/useValidation";

// Define component emits
const emit = defineEmits<{
  "switch-to-login": [];
  "register-success": [user: any];
}>();

// Form state
const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
  subscribeNewsletter: false,
});

// UI state
const loading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const submitError = ref("");

// Form validation state
const touched = reactive({
  firstName: false,
  lastName: false,
  email: false,
  password: false,
  confirmPassword: false,
  acceptTerms: false,
});

const errors = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: "",
});

// Use validation composable
const {
  validateRequired,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} = useValidation();

// Password strength calculation
const passwordStrength = computed(() => {
  const password = form.password;
  if (!password) return { score: 0, message: "" };

  let score = 0;
  let feedback = [];

  // Length check
  if (password.length >= 8) score++;
  else feedback.push("at least 8 characters");

  // Uppercase check
  if (/[A-Z]/.test(password)) score++;
  else feedback.push("uppercase letter");

  // Lowercase check
  if (/[a-z]/.test(password)) score++;
  else feedback.push("lowercase letter");

  // Number or special character check
  if (/[\d\W]/.test(password)) score++;
  else feedback.push("number or special character");

  const messages = [
    "Very weak password",
    "Weak password",
    "Fair password",
    "Good password",
    "Strong password",
  ];

  return {
    score,
    message:
      score === 4
        ? messages[4]
        : `${messages[score]} - needs ${feedback.join(", ")}`,
  };
});

// Form validation
const isFormValid = computed(() => {
  return (
    !errors.firstName &&
    !errors.lastName &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword &&
    !errors.acceptTerms &&
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.password &&
    form.confirmPassword &&
    form.acceptTerms
  );
});

// Validation functions
const validateField = (field: keyof typeof form) => {
  switch (field) {
    case "firstName":
      errors.firstName = validateRequired(form.firstName, "First name");
      break;
    case "lastName":
      errors.lastName = validateRequired(form.lastName, "Last name");
      break;
    case "email":
      errors.email =
        validateRequired(form.email, "Email") || validateEmail(form.email);
      break;
    case "password":
      errors.password =
        validateRequired(form.password, "Password") ||
        validatePassword(form.password);
      // Re-validate confirm password if it exists
      if (form.confirmPassword) {
        errors.confirmPassword = validatePasswordMatch(
          form.password,
          form.confirmPassword
        );
      }
      break;
    case "confirmPassword":
      errors.confirmPassword =
        validateRequired(form.confirmPassword, "Confirm password") ||
        validatePasswordMatch(form.password, form.confirmPassword);
      break;
    case "acceptTerms":
      errors.acceptTerms = form.acceptTerms
        ? ""
        : "You must accept the terms and conditions";
      break;
  }
};

// Registration handler
const handleRegister = async () => {
  // Validate all fields
  Object.keys(form).forEach((field) => {
    touched[field as keyof typeof touched] = true;
    validateField(field as keyof typeof form);
  });

  if (!isFormValid.value) {
    submitError.value = "Please correct the errors above";
    return;
  }

  loading.value = true;
  submitError.value = "";

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock successful registration
    const userData = {
      id: Date.now(),
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      subscribeNewsletter: form.subscribeNewsletter,
      createdAt: new Date().toISOString(),
    };

    // Emit success event
    emit("register-success", userData);

    // Reset form (use any cast to satisfy strict template typing)
    Object.keys(form).forEach((key) => {
      const formKey = key as keyof typeof form;
      (form as any)[formKey] =
        typeof (form as any)[formKey] === "boolean" ? false : "";
    });

    Object.keys(touched).forEach((key) => {
      touched[key as keyof typeof touched] = false;
    });

    Object.keys(errors).forEach((key) => {
      errors[key as keyof typeof errors] = "";
    });
  } catch (error) {
    console.error("Registration error:", error);
    submitError.value = "Registration failed. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Social registration handler
const handleSocialRegister = async (provider: "google" | "facebook") => {
  loading.value = true;
  submitError.value = "";

  try {
    // Simulate social registration
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log(`Register with ${provider}`);
    // In a real app, this would integrate with the social provider's SDK
  } catch (error) {
    console.error(`${provider} registration error:`, error);
    submitError.value = `${provider.charAt(0).toUpperCase() + provider.slice(1)} registration failed. Please try again.`;
  } finally {
    loading.value = false;
  }
};

// Auto-focus first field on mount
onMounted(() => {
  const firstInput = document.getElementById("firstName");
  if (firstInput) {
    firstInput.focus();
  }
});
</script>

<style scoped>
/* Additional styles for enhanced form appearance */
.peer:focus ~ label {
  color: rgb(5, 150, 105); /* emerald-600 */
}

/* Smooth transitions for form validation states */
input:focus {
  transform: translateY(-1px);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Password strength indicator animations */
.password-strength-bar {
  transition: all 0.3s ease-in-out;
}

/* Social button hover effects */
.social-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Checkbox custom styling */
input[type="checkbox"]:checked {
  background-color: rgb(5, 150, 105);
  border-color: rgb(5, 150, 105);
}

/* Loading animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
