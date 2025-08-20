<template>
  <div class="bg-white border-b border-slate-200">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav aria-label="Checkout progress" class="py-6">
        <ol class="flex items-center justify-center space-x-8">
          <!-- Step 1: Shipping -->
          <li class="flex items-center">
            <div class="flex items-center">
              <div 
                :class="[
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200',
                  currentStep >= 1 
                    ? 'bg-emerald-600 border-emerald-600 text-white' 
                    : 'border-slate-300 bg-white text-slate-500'
                ]"
                :aria-current="currentStep === 1 ? 'step' : undefined"
              >
                <svg 
                  v-if="currentStep > 1" 
                  class="w-6 h-6" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path 
                    fill-rule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  />
                </svg>
                <svg 
                  v-else 
                  class="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div class="ml-3 hidden sm:block">
                <p 
                  :class="[
                    'text-sm font-medium transition-colors duration-200',
                    currentStep >= 1 ? 'text-emerald-600' : 'text-slate-500'
                  ]"
                >
                  Shipping
                </p>
                <p class="text-xs text-slate-400">Address & delivery</p>
              </div>
            </div>
          </li>

          <!-- Connector Line -->
          <li class="hidden sm:block">
            <div 
              :class="[
                'w-16 h-0.5 transition-colors duration-200',
                currentStep > 1 ? 'bg-emerald-600' : 'bg-slate-300'
              ]"
              aria-hidden="true"
            ></div>
          </li>

          <!-- Step 2: Payment -->
          <li class="flex items-center">
            <div class="flex items-center">
              <div 
                :class="[
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200',
                  currentStep >= 2 
                    ? 'bg-emerald-600 border-emerald-600 text-white' 
                    : 'border-slate-300 bg-white text-slate-500'
                ]"
                :aria-current="currentStep === 2 ? 'step' : undefined"
              >
                <svg 
                  v-if="currentStep > 2" 
                  class="w-6 h-6" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path 
                    fill-rule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  />
                </svg>
                <svg 
                  v-else 
                  class="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div class="ml-3 hidden sm:block">
                <p 
                  :class="[
                    'text-sm font-medium transition-colors duration-200',
                    currentStep >= 2 ? 'text-emerald-600' : 'text-slate-500'
                  ]"
                >
                  Payment
                </p>
                <p class="text-xs text-slate-400">Payment method</p>
              </div>
            </div>
          </li>

          <!-- Connector Line -->
          <li class="hidden sm:block">
            <div 
              :class="[
                'w-16 h-0.5 transition-colors duration-200',
                currentStep > 2 ? 'bg-emerald-600' : 'bg-slate-300'
              ]"
              aria-hidden="true"
            ></div>
          </li>

          <!-- Step 3: Review -->
          <li class="flex items-center">
            <div class="flex items-center">
              <div 
                :class="[
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200',
                  currentStep >= 3 
                    ? 'bg-emerald-600 border-emerald-600 text-white' 
                    : 'border-slate-300 bg-white text-slate-500'
                ]"
                :aria-current="currentStep === 3 ? 'step' : undefined"
              >
                <svg 
                  v-if="currentStep > 3" 
                  class="w-6 h-6" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path 
                    fill-rule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  />
                </svg>
                <svg 
                  v-else 
                  class="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <div class="ml-3 hidden sm:block">
                <p 
                  :class="[
                    'text-sm font-medium transition-colors duration-200',
                    currentStep >= 3 ? 'text-emerald-600' : 'text-slate-500'
                  ]"
                >
                  Review
                </p>
                <p class="text-xs text-slate-400">Confirm order</p>
              </div>
            </div>
          </li>
        </ol>

        <!-- Mobile Step Indicator -->
        <div class="sm:hidden mt-4">
          <div class="flex justify-center">
            <span class="text-sm text-slate-600">
              Step {{ currentStep }} of 3: 
              <span class="font-medium text-slate-800">
                {{ stepNames[currentStep - 1] }}
              </span>
            </span>
          </div>
          <div class="mt-2 bg-slate-200 rounded-full h-2">
            <div 
              :class="[
                'h-2 rounded-full transition-all duration-300 bg-emerald-600'
              ]"
              :style="{ width: `${(currentStep / 3) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- Step Actions (for screen readers) -->
        <div class="sr-only" aria-live="polite" aria-atomic="true">
          <p v-if="currentStep === 1">
            Currently on step 1 of 3: Enter your shipping information
          </p>
          <p v-else-if="currentStep === 2">
            Currently on step 2 of 3: Select your payment method
          </p>
          <p v-else-if="currentStep === 3">
            Currently on step 3 of 3: Review and confirm your order
          </p>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  currentStep: number
}

const props = withDefaults(defineProps<Props>(), {
  currentStep: 1
})

// Step names for mobile display
const stepNames = ['Shipping', 'Payment', 'Review']

// Computed properties for accessibility and validation
const isValidStep = computed(() => {
  return props.currentStep >= 1 && props.currentStep <= 3
})

// Emit events for step navigation (if needed)
const emit = defineEmits<{
  stepClick: [step: number]
}>()

/**
 * Handle step click (for future navigation enhancement)
 * Currently disabled to enforce linear flow
 */
const handleStepClick = (step: number) => {
  // Only allow clicking on completed or current steps
  if (step <= props.currentStep) {
    emit('stepClick', step)
  }
}
</script>

<style scoped>
/* Smooth transitions for all state changes */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.transition-all {
  transition: all 0.3s ease;
}

/* Focus styles for accessibility */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px #059669;
}

/* Enhanced mobile progress bar */
@media (max-width: 640px) {
  .progress-bar {
    background: linear-gradient(
      to right, 
      #059669 0%, 
      #059669 var(--progress, 0%), 
      #e2e8f0 var(--progress, 0%), 
      #e2e8f0 100%
    );
  }
}

/* Hover effects for interactive elements */
.hover-effect:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Step completion animation */
@keyframes checkmark {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-checkmark {
  animation: checkmark 0.6s ease-out;
}