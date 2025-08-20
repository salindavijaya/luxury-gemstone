<template>
  <div
    ref="containerRef"
    :class="[
      'relative overflow-hidden transition-all duration-300',
      containerClass,
      {
        'animate-pulse bg-slate-200': isLoading,
        'bg-transparent': !isLoading,
      },
    ]"
    :style="{ aspectRatio: `${aspectRatio}` }"
  >
    <!-- Placeholder/Blur -->
    <div
      v-if="isLoading || showPlaceholder"
      class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200"
      :class="placeholderClass"
    >
      <div v-if="showPlaceholder" class="text-slate-400 text-sm font-medium">
        {{ placeholderText }}
      </div>
      <svg
        v-else
        class="w-8 h-8 text-slate-300 animate-spin"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
          class="opacity-25"
        />
        <path
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          class="opacity-75"
        />
      </svg>
    </div>

    <!-- Low quality placeholder -->
    <img
      v-if="lowQualitySrc && !isLoaded && !error"
      :src="lowQualitySrc"
      :alt="alt"
      class="absolute inset-0 w-full h-full object-cover filter blur-sm transition-opacity duration-300"
      :class="{ 'opacity-50': isLoading, 'opacity-100': !isLoading }"
      loading="lazy"
    />

    <!-- Main image -->
    <img
      v-show="isLoaded && !error"
      ref="imageRef"
      :src="currentSrc"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      :class="[
        'w-full h-full object-cover transition-all duration-500',
        imageClass,
        {
          'opacity-0 scale-105': !isLoaded,
          'opacity-100 scale-100': isLoaded,
          'hover:scale-110': zoomOnHover && !isMobile,
        },
      ]"
      @load="onImageLoad"
      @error="onImageError"
    />

    <!-- Error state -->
    <div
      v-if="error"
      class="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-500"
      :class="errorClass"
    >
      <svg
        class="w-12 h-12 mb-2 text-slate-300"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
          clip-rule="evenodd"
        />
      </svg>
      <p class="text-sm text-center px-2">{{ errorText }}</p>
      <button
        v-if="showRetry"
        @click="retry"
        class="mt-2 px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
      >
        Retry
      </button>
    </div>

    <!-- Loading overlay -->
    <div
      v-if="isLoading && showLoadingOverlay"
      class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center"
    >
      <div class="bg-white bg-opacity-90 rounded-lg p-3">
        <div
          class="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>
    </div>

    <!-- Progressive loading indicator -->
    <div
      v-if="showProgress && isLoading"
      class="absolute bottom-0 left-0 right-0 h-1 bg-slate-200"
    >
      <div
        class="h-full bg-emerald-500 transition-all duration-300"
        :style="{ width: `${loadingProgress}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useIntersectionObserver } from "@/composables/useIntersectionObserver";

interface Props {
  src: string;
  alt: string;
  lowQualitySrc?: string;
  aspectRatio?: string | number;
  eager?: boolean;
  zoomOnHover?: boolean;
  showPlaceholder?: boolean;
  placeholderText?: string;
  showRetry?: boolean;
  showLoadingOverlay?: boolean;
  showProgress?: boolean;
  errorText?: string;
  containerClass?: string;
  imageClass?: string;
  placeholderClass?: string;
  errorClass?: string;
  rootMargin?: string;
  threshold?: number;
  retryAttempts?: number;
  webpFallback?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  aspectRatio: "1",
  eager: false,
  zoomOnHover: true,
  showPlaceholder: false,
  placeholderText: "Loading...",
  showRetry: true,
  showLoadingOverlay: false,
  showProgress: false,
  errorText: "Failed to load image",
  containerClass: "rounded-lg",
  imageClass: "",
  placeholderClass: "",
  errorClass: "",
  rootMargin: "50px",
  threshold: 0.1,
  retryAttempts: 3,
  webpFallback: true,
});

const emit = defineEmits<{
  load: [event: Event];
  error: [event: Event];
  intersect: [isIntersecting: boolean];
}>();

// Refs
const containerRef = ref<HTMLElement>();
const imageRef = ref<HTMLImageElement>();

// State
const isLoaded = ref(false);
const isLoading = ref(false);
const error = ref(false);
const currentAttempt = ref(0);
const loadingProgress = ref(0);
const isMobile = ref(false);

// Computed
const currentSrc = computed(() => {
  if (props.webpFallback && supportsWebP.value) {
    return convertToWebP(props.src);
  }
  return props.src;
});

const supportsWebP = ref(false);

// Mobile detection
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

// WebP support detection
const checkWebPSupport = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
};

// Convert image URL to WebP
const convertToWebP = (url: string): string => {
  if (url.includes(".webp")) return url;
  return url.replace(/\.(jpg|jpeg|png)$/i, ".webp");
};

// Intersection Observer
const { isIntersecting } = useIntersectionObserver(containerRef, {
  rootMargin: props.rootMargin,
  threshold: props.threshold,
});

// Watch for intersection and start loading
watch(isIntersecting, (intersecting) => {
  emit("intersect", intersecting);
  if (intersecting && !isLoaded.value && !error.value && !isLoading.value) {
    loadImage();
  }
});

// Loading simulation for progress bar
const simulateProgress = () => {
  if (!props.showProgress) return;

  const intervals = [
    { time: 100, progress: 20 },
    { time: 200, progress: 40 },
    { time: 300, progress: 60 },
    { time: 400, progress: 80 },
  ];

  intervals.forEach(({ time, progress }) => {
    setTimeout(() => {
      if (isLoading.value && loadingProgress.value < progress) {
        loadingProgress.value = progress;
      }
    }, time);
  });
};

const loadImage = async () => {
  if (isLoading.value || isLoaded.value) return;

  isLoading.value = true;
  error.value = false;
  loadingProgress.value = 0;

  simulateProgress();

  try {
    await nextTick();
    // Image loading is handled by the img element's onload/onerror
  } catch (err) {
    onImageError(new Event("error"));
  }
};

const onImageLoad = (event: Event) => {
  isLoading.value = false;
  isLoaded.value = true;
  error.value = false;
  loadingProgress.value = 100;

  // Fade in effect
  setTimeout(() => {
    loadingProgress.value = 0;
  }, 500);

  emit("load", event);
};

const onImageError = (event: Event) => {
  isLoading.value = false;
  error.value = true;
  currentAttempt.value++;
  loadingProgress.value = 0;

  emit("error", event);

  // Auto retry with exponential backoff
  if (currentAttempt.value < props.retryAttempts) {
    const delay = Math.pow(2, currentAttempt.value) * 1000;
    setTimeout(() => {
      retry();
    }, delay);
  }
};

const retry = () => {
  if (currentAttempt.value >= props.retryAttempts) {
    currentAttempt.value = 0;
  }

  isLoaded.value = false;
  error.value = false;
  loadImage();
};

// Initialize
onMounted(() => {
  supportsWebP.value = checkWebPSupport();
  checkMobile();
  window.addEventListener("resize", checkMobile);

  // Start loading immediately if eager or already intersecting
  if (props.eager || isIntersecting.value) {
    loadImage();
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

// Preload images
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Expose methods
defineExpose({
  reload: retry,
  preload: () => preloadImage(currentSrc.value),
});
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .bg-slate-100 {
    @apply bg-gray-100;
  }
  .bg-slate-200 {
    @apply bg-gray-200;
  }
  .text-slate-300 {
    @apply text-gray-600;
  }
}
</style>
