<template>
    <div class="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <!-- Header -->
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-slate-800 mb-2">Reset Password</h2>
        <p class="text-slate-600 text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
  
      <!-- Form -->
      <form @submit.prevent="handleSubmit" novalidate>
        <!-- Email Field -->
        <div class="relative mb-6">
          <input
            id="email"
            ref="emailRef"
            v-model="formData.email"
            type="email"
            class="peer w-full px-4 pt-6 pb-2 bg-slate-50 border border-slate-300 rounded-md text-slate-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
            :class="{
              'border-red-500 focus:ring-red-500 focus:border-red-500': errors.email,
              'border-emerald-500': !errors.email && formData.email
            }"
            placeholder="Email address"
            autocomplete="email"
            :disabled="isLoading"
            @blur="validateField('email')"
            @input="clearFieldError('email')"
            aria-describedby="email-error"
            :aria-invalid="!!errors.email"
          />
          <label
            for="email"
            class="absolute left-4 top-2 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-emerald-600"
          >
            Email address
          </label>
          <div
            v-if="errors.email"
            id="email-error"
            class="absolute -bottom-5 left-0 text-xs text-red-500"
            role="alert"
          >
            {{ errors.email }}
          </div>
        </div>
  
        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          :disabled="isLoading || !isFormValid"
          :aria-busy="isLoading"
        >
          <span v-if="!isLoading">Send Reset Link</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </span>
        </button>
      </form>
  
      <!-- Success Message -->
      <div
        v-if="isSuccess"
        class="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-md"
        role="alert"
      >
        <div class="flex items-center">
          <svg class="w-5 h-5 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <p class="text-sm text-emerald-800">
            Reset link sent! Check your email for further instructions.
          </p>
        </div>
      </div>
  
      <!-- Back to Login -->
      <div class="mt-6 text-center">
        <button
          type="button"
          @click="$emit('switchTo', 'login')"
          class="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200 focus:outline-none focus:underline"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, nextTick } from 'vue'
  import { useValidation } from '@/composables/useValidation'
  import { useAuth } from '@/composables/useAuth'
  
  // Define emits
  defineEmits<{
    switchTo: [page: 'login' | 'register' | 'forgot-password']
  }>()
  
  // Composables
  const { validateEmail } = useValidation()
  const { requestPasswordReset } = useAuth()
  
  // Refs
  const emailRef = ref<HTMLInputElement>()
  
  // Form data
  const formData = ref({
    email: ''
  })
  
  // State
  const isLoading = ref(false)
  const isSuccess = ref(false)
  
  // Validation errors
  const errors = ref<Record<string, string>>({})
  
  // Computed properties
  const isFormValid = computed(() => {
    return formData.value.email && !errors.value.email
  })
  
  // Methods
  const validateField = (field: keyof typeof formData.value) => {
    const value = formData.value[field]
    
    switch (field) {
      case 'email':
        errors.value.email = validateEmail(value) || ''
        break
    }
  }
  
  const clearFieldError = (field: keyof typeof errors.value) => {
    if (errors.value[field]) {
      errors.value[field] = ''
    }
  }
  
  const validateForm = (): boolean => {
    validateField('email')
    
    return Object.values(errors.value).every(error => !error)
  }
  
  const handleSubmit = async () => {
    if (!validateForm() || isLoading.value) return
  
    isLoading.value = true
    isSuccess.value = false
  
    try {
      // Call the password reset function
      await requestPasswordReset(formData.value.email)
      
      isSuccess.value = true
      
      // Reset form after successful submission
      formData.value.email = ''
      errors.value = {}
      
    } catch (error: any) {
      // Handle specific error cases
      if (error.message?.includes('not found')) {
        errors.value.email = 'No account found with this email address'
      } else {
        errors.value.email = error.message || 'Failed to send reset link. Please try again.'
      }
    } finally {
      isLoading.value = false
    }
  }
  
  // Lifecycle
  onMounted(async () => {
    // Auto-focus the email input
    await nextTick()
    emailRef.value?.focus()
  })
  </script>
  
  <style scoped>
  /* Additional custom styles if needed */
  .peer:focus ~ label {
    @apply text-emerald-600;
  }
  
  .peer:not(:placeholder-shown) ~ label {
    @apply top-2 text-xs;
  }
  
  /* Loading spinner animation */
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