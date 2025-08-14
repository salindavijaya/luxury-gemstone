<template>
  <div :class="containerClasses" :aria-label="ariaLabel">
    <!-- Spinner -->
    <div v-if="type === 'spinner'" :class="spinnerClasses">
      <svg class="animate-spin" :class="sizeClasses" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
          fill="none"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>

    <!-- Dots -->
    <div v-else-if="type === 'dots'" :class="dotsContainerClasses">
      <div
        v-for="i in 3"
        :key="i"
        :class="[dotClasses, `animate-bounce`]"
        :style="{ animationDelay: `${(i - 1) * 0.1}s` }"
      ></div>
    </div>

    <!-- Pulse -->
    <div v-else-if="type === 'pulse'" :class="pulseClasses">
      <div class="absolute inset-0 rounded-full bg-current opacity-20 animate-ping"></div>
      <div class="relative rounded-full bg-current opacity-60"></div>
    </div>

    <!-- Bars -->
    <div v-else-if="type === 'bars'" :class="barsContainerClasses">
      <div
        v-for="i in 4"
        :key="i"
        :class="[barClasses, 'animate-pulse']"
        :style="{ 
          animationDelay: `${(i - 1) * 0.15}s`,
          height: `${20 + (i % 2) * 10}px`
        }"
      ></div>
    </div>

    <!-- Skeleton -->
    <div v-else-if="type === 'skeleton'" :class="skeletonClasses">
      <div class="animate-pulse space-y-3">
        <div class="h-4 bg-slate-200 rounded w-3/4"></div>
        <div class="h-4 bg-slate-200 rounded w-1/2"></div>
        <div class="h-4 bg-slate-200 rounded w-5/6"></div>
      </div>
    </div>

    <!-- Ring -->
    <div v-else-if="type === 'ring'" :class="ringClasses">
      <div class="animate-spin rounded-full border-2 border-slate-200">
        <div :class="[
          'rounded-full border-2 border-transparent border-t-current',
          sizeClasses
        ]"></div>
      </div>
    </div>

    <!-- Text -->
    <div v-if="text" :class="textClasses">
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Types
interface Props {
  type?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'skeleton' | 'ring'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'white' | 'slate' | 'emerald'
  text?: string
  overlay?: boolean
  fullscreen?: boolean
  center?: boolean
}

// Props with defaults
const props = withDefaults(defineProps<Props>(), {
  type: 'spinner',
  size: 'md',
  color: 'primary',
  center: false,
  overlay: false,
  fullscreen: false
})

// Computed properties
const containerClasses = computed(() => {
  const base = 'flex items-center gap-3'
  
  if (props.fullscreen) {
    return `${base} fixed inset-0 bg-white bg-opacity-90 z-50 justify-center`
  }
  
  if (props.overlay) {
    return `${base} absolute inset-0 bg-white bg-opacity-75 z-10 justify-center`
  }
  
  if (props.center) {
    return `${base} justify-center`
  }
  
  return base
})

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }
  return sizes[props.size]
})

const colorClasses = computed(() => {
  const colors = {
    primary: 'text-emerald-600',
    secondary: 'text-slate-600',
    white: 'text-white',
    slate: 'text-slate-400',
    emerald: 'text-emerald-500'
  }
  return colors[props.color]
})

const spinnerClasses = computed(() => {
  return `${colorClasses.value}`
})

const dotsContainerClasses = computed(() => {
  return 'flex space-x-1'
})

const dotClasses = computed(() => {
  const sizes = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  }
  return `${sizes[props.size]} ${colorClasses.value} bg-current rounded-full`
})

const pulseClasses = computed(() => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }
  return `${sizes[props.size]} ${colorClasses.value} relative`
})

const barsContainerClasses = computed(() => {
  return 'flex items-end space-x-1'
})

const barClasses = computed(() => {
  const widths = {
    xs: 'w-0.5',
    sm: 'w-1',
    md: 'w-1.5',
    lg: 'w-2',
    xl: 'w-3'
  }
  return `${widths[props.size]} ${colorClasses.value} bg-current rounded-t`
})

const skeletonClasses = computed(() => {
  const widths = {
    xs: 'w-16',
    sm: 'w-24',
    md: 'w-32',
    lg: 'w-48',
    xl: 'w-64'
  }
  return widths[props.size]
})

const ringClasses = computed(() => {
  return `${sizeClasses.value} ${colorClasses.value}`
})

const textClasses = computed(() => {
  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }
  return `${textSizes[props.size]} ${colorClasses.value} font-medium`
})

const ariaLabel = computed(() => {
  return props.text || 'Loading...'
})
</script>

<style scoped>
/* Custom animations */
@keyframes bounce-delay {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.animate-bounce-delay {
  animation: bounce-delay 1.4s infinite ease-in-out;
}

/* Skeleton shimmer effect */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}

/* Ensure smooth animations */
.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

/* Custom pulse animation for bars */
@keyframes pulse-bar {
  0%, 100% {
    opacity: 1;
    transform: scaleY(1);
  }
  50% {
    opacity: 0.5;
    transform: scaleY(0.5);
  }
}

.animate-pulse-bar {
  animation: pulse-bar 1.5s ease-in-out infinite;
}

/* Overlay styles */
.loading-overlay {
  backdrop-filter: blur(1px);
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .animate-spin,
  .animate-pulse,
  .animate-bounce,
  .animate-ping {
    animation: none;
  }
}
</style>