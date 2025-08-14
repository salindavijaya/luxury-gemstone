<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-full opacity-0"
    >
      <div
        v-if="visible"
        :class="toastClasses"
        class="fixed top-4 right-4 z-50 max-w-sm w-full shadow-lg rounded-lg p-4 flex items-start gap-3"
        role="alert"
        :aria-live="type === 'error' ? 'assertive' : 'polite'"
      >
        <!-- Icon -->
        <div class="flex-shrink-0">
          <CheckCircleIcon
            v-if="type === 'success'"
            class="h-5 w-5 text-emerald-400"
            aria-hidden="true"
          />
          <ExclamationTriangleIcon
            v-else-if="type === 'warning'"
            class="h-5 w-5 text-amber-400"
            aria-hidden="true"
          />
          <XCircleIcon
            v-else-if="type === 'error'"
            class="h-5 w-5 text-red-400"
            aria-hidden="true"
          />
          <InformationCircleIcon
            v-else
            class="h-5 w-5 text-blue-400"
            aria-hidden="true"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h3 v-if="title" class="text-sm font-medium text-slate-900">
            {{ title }}
          </h3>
          <p class="text-sm text-slate-600 mt-1">
            {{ message }}
          </p>
          
          <!-- Actions -->
          <div v-if="actions && actions.length > 0" class="mt-3 flex gap-2">
            <button
              v-for="action in actions"
              :key="action.label"
              @click="handleAction(action)"
              :class="[
                'text-xs font-medium px-3 py-1 rounded-md transition-colors',
                action.primary
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              ]"
            >
              {{ action.label }}
            </button>
          </div>
        </div>

        <!-- Close Button -->
        <button
          @click="close"
          class="flex-shrink-0 ml-4 text-slate-400 hover:text-slate-600 transition-colors"
          :aria-label="$t?.('common.close') || 'Close'"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>

        <!-- Progress Bar -->
        <div
          v-if="duration && duration > 0"
          class="absolute bottom-0 left-0 h-1 bg-slate-200 rounded-b-lg overflow-hidden"
        >
          <div
            class="h-full bg-emerald-500 transition-all ease-linear"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

// Types
interface ToastAction {
  label: string
  handler: () => void
  primary?: boolean
}

interface Props {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number // in milliseconds, 0 for persistent
  actions?: ToastAction[]
  persistent?: boolean
}

// Props with defaults
const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 5000,
  persistent: false
})

// Emits
const emit = defineEmits<{
  close: []
}>()

// Reactive state
const visible = ref(false)
const progress = ref(100)
let progressInterval: ReturnType<typeof setInterval> | null = null
let closeTimeout: ReturnType<typeof setTimeout> | null = null

// Computed properties
const toastClasses = computed(() => {
  const baseClasses = 'bg-white border-l-4'
  
  const typeClasses = {
    success: 'border-emerald-500',
    error: 'border-red-500',
    warning: 'border-amber-500',
    info: 'border-blue-500'
  }
  
  return `${baseClasses} ${typeClasses[props.type]}`
})

// Methods
const show = () => {
  visible.value = true
  
  if (props.duration > 0 && !props.persistent) {
    startProgressBar()
    closeTimeout = setTimeout(close, props.duration)
  }
}

const close = () => {
  visible.value = false
  clearTimers()
  emit('close')
}

const handleAction = (action: ToastAction) => {
  action.handler()
  close()
}

const startProgressBar = () => {
  if (props.duration <= 0) return
  
  const interval = 50 // Update every 50ms
  const decrement = (100 * interval) / props.duration
  
  progressInterval = setInterval(() => {
    progress.value -= decrement
    if (progress.value <= 0) {
      progress.value = 0
      clearInterval(progressInterval!)
    }
  }, interval)
}

const clearTimers = () => {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
}

const pauseTimer = () => {
  clearTimers()
}

const resumeTimer = () => {
  if (props.duration > 0 && !props.persistent && visible.value) {
    const remainingDuration = (progress.value / 100) * props.duration
    if (remainingDuration > 0) {
      startProgressBar()
      closeTimeout = setTimeout(close, remainingDuration)
    }
  }
}

// Lifecycle
onMounted(() => {
  show()
})

onUnmounted(() => {
  clearTimers()
})

// Watch for hover events to pause/resume timer
watch(visible, (newVisible) => {
  if (!newVisible) {
    clearTimers()
  }
})

// Expose methods for parent component
defineExpose({
  show,
  close,
  pauseTimer,
  resumeTimer
})
</script>

<style scoped>
/* Custom styles for enhanced visual appeal */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Hover effects */
.toast:hover {
  transform: scale(1.02);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .toast {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
}
</style>