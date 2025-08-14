<template>
  <div
    ref="containerRef"
    class="w-full"
    :class="containerClass"
  >
    <!-- Items grid/list -->
    <div
      :class="[
        'transition-all duration-300',
        gridClass,
        {
          'opacity-50': loading && items.length === 0,
          'grid': useGrid,
          'flex flex-col': !useGrid
        }
      ]"
    >
      <div
        v-for="(item, index) in items"
        :key="getItemKey(item, index)"
        :class="itemClass"
        @click="$emit('itemClick', { item, index })"
      >
        <slot
          :item="item"
          :index="index"
          :loading="loading"
        >
          <!-- Default item template -->
          <div class="p-4 border border-slate-200 rounded-lg bg-white hover:shadow-md transition-shadow">
            {{ item }}
          </div>
        </slot>
      </div>
    </div>

    <!-- Loading state -->
    <div
      v-if="loading"
      ref="loadingRef"
      class="flex items-center justify-center py-8"
      :class="loadingClass"
    >
      <div class="flex flex-col items-center space-y-3">
        <div class="relative">
          <div class="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
        <span class="text-sm text-slate-600 font-medium">{{ loadingText }}</span>
        <div 
          v-if="showProgress && loadingProgress > 0"
          class="w-32 h-1 bg-slate-200 rounded-full overflow-hidden"
        >
          <div 
            class="h-full bg-emerald-500 transition-all duration-300 rounded-full"
            :style="{ width: `${loadingProgress}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Load more trigger (intersection observer target) -->
    <div
      ref="triggerRef"
      class="h-1 w-full"
      :class="{ 'opacity-0': !hasMore || loading }"
      aria-hidden="true"
    ></div>

    <!-- Manual load more button -->
    <div
      v-if="!autoLoad && hasMore && !loading"
      class="flex justify-center py-6"
    >
      <button
        @click="loadMore"
        class="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="loading"
      >
        {{ loadMoreText }}
      </button>
    </div>

    <!-- End of results indicator -->
    <div
      v-if="!hasMore && items.length > 0 && !loading"
      class="flex flex-col items-center justify-center py-8 text-slate-500"
      :class="endMessageClass"
    >
      <svg class="w-12 h-12 mb-3 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      <p class="text-sm font-medium">{{ endMessage }}</p>
      <p v-if="endSubMessage" class="text-xs text-slate-400 mt-1">{{ endSubMessage }}</p>
    </div>

    <!-- Error state -->
    <div
      v-if="error"
      class="flex flex-col items-center justify-center py-8 px-4"
      :class="errorClass"
    >
      <svg class="w-12 h-12 mb-3 text-red-300" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      <p class="text-sm font-medium text-red-600 mb-3">{{ errorMessage }}</p>
      <button
        @click="retry"
        class="px-4 py-2 bg-red-100 text-red-700 font-medium rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
      >
        {{ retryText }}
      </button>
    </div>

    <!-- Empty state -->
    <div
      v-if="!loading && items.length === 0 && !error"
      class="flex flex-col items-center justify-center py-12 px-4 text-center"
      :class="emptyClass"
    >
      <div class="w-24 h-24 mb-4 text-slate-200">
        <slot name="empty-icon">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </slot>
      </div>
      <h3 class="text-lg font-medium text-slate-900 mb-2">{{ emptyTitle }}</h3>
      <p class="text-sm text-slate-500 mb-4">{{ emptyMessage }}</p>
      <slot name="empty-action">
        <button
          v-if="emptyActionText"
          @click="$emit('emptyAction')"
          class="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
        >
          {{ emptyActionText }}
        </button>
      </slot>
    </div>

    <!-- Scroll to top button -->
    <button
      v-if="showScrollToTop && shouldShowScrollToTop"
      @click="scrollToTop"
      class="fixed bottom-6 right-6 bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 z-50"
      :class="scrollToTopClass"
      aria-label="Scroll to top"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import { debounce, throttle } from 'lodash-es'

interface Props {
  items: any[]
  loading?: boolean
  hasMore?: boolean
  error?: boolean
  autoLoad?: boolean
  threshold?: number
  rootMargin?: string
  useGrid?: boolean
  itemKey?: string | ((item: any, index: number) => string | number)
  containerClass?: string
  gridClass?: string
  itemClass?: string
  loadingClass?: string
  loadingText?: string
  loadMoreText?: string
  showProgress?: boolean
  loadingProgress?: number
  endMessage?: string
  endSubMessage?: string
  endMessageClass?: string
  errorMessage?: string
  errorClass?: string
  retryText?: string
  emptyTitle?: string
  emptyMessage?: string
  emptyActionText?: string
  emptyClass?: string
  showScrollToTop?: boolean
  scrollToTopThreshold?: number
  scrollToTopClass?: string
  retryAttempts?: number
  retryDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  hasMore: true,
  error: false,
  autoLoad: true,
  threshold: 0.1,
  rootMargin: '100px',
  useGrid: true,
  itemKey: 'id',
  containerClass: '',
  gridClass: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
  itemClass: '',
  loadingClass: '',
  loadingText: 'Loading more items...',
  loadMoreText: 'Load More',
  showProgress: false,
  loadingProgress: 0,
  endMessage: 'You\'ve reached the end!',
  endSubMessage: '',
  endMessageClass: '',
  errorMessage: 'Failed to load more items',
  errorClass: '',
  retryText: 'Try Again',
  emptyTitle: 'No items found',
  emptyMessage: 'There are no items to display at the moment.',
  emptyActionText: '',
  emptyClass: '',
  showScrollToTop: true,
  scrollToTopThreshold: 1000,
  scrollToTopClass: '',
  retryAttempts: 3,
  retryDelay: 1000
})

const emit = defineEmits<{
  loadMore: []
  itemClick: [{ item: any; index: number }]
  scrollToTop: []
  emptyAction: []
  retry: []
}>()

// Refs
const containerRef = ref<HTMLElement>()
const triggerRef = ref<HTMLElement>()
const loadingRef = ref<HTMLElement>()

// State
const currentRetryAttempt = ref(0)
const scrollPosition = ref(0)
const isRetrying = ref(false)

// Intersection Observer for auto-loading
const { isIntersecting: triggerIntersecting } = useIntersectionObserver(
  triggerRef,
  {
    threshold: props.threshold,
    rootMargin: props.rootMargin
  }
)

// Computed
const shouldShowScrollToTop = computed(() => {
  return scrollPosition.value > props.scrollToTopThreshold
})

const getItemKey = (item: any, index: number): string | number => {
  if (typeof props.itemKey === 'function') {
    return props.itemKey(item, index)
  }
  return item[props.itemKey] || index
}

// Methods
const loadMore = async () => {
  if (props.loading || !props.hasMore || props.error) return
  
  try {
    emit('loadMore')
    currentRetryAttempt.value = 0
  } catch (error) {
    console.error('Error loading more items:', error)
  }
}

const retry = async () => {
  if (isRetrying.value) return
  
  isRetrying.value = true
  currentRetryAttempt.value++
  
  try {
    await new Promise(resolve => setTimeout(resolve, props.retryDelay))
    emit('retry')
    emit('loadMore')
  } catch (error) {
    console.error('Error retrying load:', error)
  } finally {
    isRetrying.value = false
  }
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
  emit('scrollToTop')
}

const updateScrollPosition = throttle(() => {
  scrollPosition.value = window.scrollY || document.documentElement.scrollTop
}, 100)

// Auto-retry with exponential backoff
const autoRetry = () => {
  if (currentRetryAttempt.value < props.retryAttempts) {
    const delay = props.retryDelay * Math.pow(2, currentRetryAttempt.value)
    setTimeout(() => {
      retry()
    }, delay)
  }
}

// Watchers
watch(triggerIntersecting, (isIntersecting) => {
  if (isIntersecting && props.autoLoad && !props.loading && props.hasMore && !props.error) {
    loadMore()
  }
})

watch(() => props.error, (hasError) => {
  if (hasError) {
    autoRetry()
  }
})

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', updateScrollPosition, { passive: true })
  updateScrollPosition()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollPosition)
})

// Public API
const refresh = () => {
  currentRetryAttempt.value = 0
  isRetrying.value = false
}

const scrollToItem = (index: number) => {
  const container = containerRef.value
  if (!container) return
  
  const items = container.querySelectorAll('[data-item]')
  const targetItem = items[index] as HTMLElement
  
  if (targetItem) {
    targetItem.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

defineExpose({
  loadMore,
  retry,
  scrollToTop,
  scrollToItem,
  refresh
})
</script>

<style scoped>
/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Loading animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Grid responsive improvements */
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

/* High contrast support */
@media (prefers-contrast: high) {
  .text-slate-500 {
    color: #000;
  }
  .text-slate-300 {
    color: #333;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus styles */
button:focus-visible {
  outline: 2px solid theme('colors.emerald.500');
  outline-offset: 2px;
}
</style>