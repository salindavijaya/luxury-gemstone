<template>
  <div 
    ref="containerRef"
    class="relative overflow-hidden rounded-lg bg-gray-100 group"
    :style="{ aspectRatio: aspectRatio }"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- Before Image -->
    <div class="absolute inset-0">
      <img
        :src="beforeImage"
        :alt="beforeAlt"
        class="w-full h-full object-cover"
        :class="{ 'blur-sm': isLoading }"
        @load="handleImageLoad"
        @error="handleImageError"
      />
    </div>

    <!-- After Image with clip mask -->
    <div 
      class="absolute inset-0"
      :style="{ 
        clipPath: `polygon(${sliderPosition}% 0%, 100% 0%, 100% 100%, ${sliderPosition}% 100%)` 
      }"
    >
      <img
        :src="afterImage"
        :alt="afterAlt"
        class="w-full h-full object-cover"
        :class="{ 'blur-sm': isLoading }"
        @load="handleImageLoad"
        @error="handleImageError"
      />
    </div>

    <!-- Slider Handle -->
    <div
      class="absolute top-0 bottom-0 z-10 flex items-center cursor-ew-resize"
      :style="{ left: `${sliderPosition}%` }"
    >
      <!-- Slider Line -->
      <div class="w-0.5 h-full bg-white shadow-lg"></div>
      
      <!-- Slider Circle -->
      <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div class="w-8 h-8 bg-white rounded-full shadow-lg border-2 border-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
          <div class="flex space-x-0.5">
            <div class="w-0.5 h-3 bg-emerald-600"></div>
            <div class="w-0.5 h-3 bg-emerald-600"></div>
          </div>
        </div>
      </div>

      <!-- Arrow indicators -->
      <div class="absolute -left-8 top-1/2 transform -translate-y-1/2">
        <ChevronLeft class="w-4 h-4 text-white drop-shadow-lg" />
      </div>
      <div class="absolute -right-8 top-1/2 transform -translate-y-1/2">
        <ChevronRight class="w-4 h-4 text-white drop-shadow-lg" />
      </div>
    </div>

    <!-- Labels -->
    <div class="absolute top-4 left-4 z-20">
      <div class="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm font-medium">
        {{ beforeLabel }}
      </div>
    </div>
    <div class="absolute top-4 right-4 z-20">
      <div class="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm font-medium">
        {{ afterLabel }}
      </div>
    </div>

    <!-- Loading Overlay -->
    <div 
      v-if="isLoading" 
      class="absolute inset-0 bg-gray-100 flex items-center justify-center z-30"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
    </div>

    <!-- Error State -->
    <div 
      v-if="hasError" 
      class="absolute inset-0 bg-gray-100 flex items-center justify-center z-30"
    >
      <div class="text-center">
        <AlertCircle class="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p class="text-gray-600 text-sm">Failed to load images</p>
        <button 
          @click="retryLoad"
          class="mt-2 px-3 py-1 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Fullscreen Toggle -->
    <button
      v-if="allowFullscreen"
      @click="toggleFullscreen"
      class="absolute bottom-4 right-4 z-20 bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-70 transition-opacity"
      :aria-label="isFullscreen ? 'Exit fullscreen' : 'View fullscreen'"
    >
      <Maximize v-if="!isFullscreen" class="w-4 h-4" />
      <Minimize v-else class="w-4 h-4" />
    </button>

    <!-- Instructions -->
    <div 
      v-if="showInstructions && !isDragging" 
      class="absolute bottom-4 left-4 z-20 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity"
    >
      {{ isTouchDevice ? 'Drag to compare' : 'Drag or click to compare' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { ChevronLeft, ChevronRight, AlertCircle, Maximize, Minimize } from 'lucide-vue-next';

export interface Props {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeAlt?: string;
  afterAlt?: string;
  initialPosition?: number;
  aspectRatio?: string;
  allowFullscreen?: boolean;
  showInstructions?: boolean;
  animationDuration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  beforeLabel: 'Before',
  afterLabel: 'After',
  beforeAlt: 'Before image',
  afterAlt: 'After image',
  initialPosition: 50,
  aspectRatio: '16/9',
  allowFullscreen: true,
  showInstructions: true,
  animationDuration: 300
});

const emit = defineEmits<{
  'position-change': [position: number];
  'drag-start': [];
  'drag-end': [];
  'fullscreen-toggle': [isFullscreen: boolean];
}>();

// Refs
const containerRef = ref<HTMLElement>();

// State
const sliderPosition = ref(props.initialPosition);
const isDragging = ref(false);
const isLoading = ref(true);
const hasError = ref(false);
const isFullscreen = ref(false);
const loadedImages = ref(0);

// Computed
const isTouchDevice = computed(() => 'ontouchstart' in window);

// Methods
const updateSliderPosition = (clientX: number): void => {
  if (!containerRef.value || !isDragging.value) return;

  const rect = containerRef.value.getBoundingClientRect();
  const x = clientX - rect.left;
  const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
  
  sliderPosition.value = percentage;
  emit('position-change', percentage);
};

const animateToPosition = (targetPosition: number): void => {
  const startPosition = sliderPosition.value;
  const startTime = performance.now();

  const animate = (currentTime: number): void => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / props.animationDuration, 1);
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    
    sliderPosition.value = startPosition + (targetPosition - startPosition) * easeOut;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      emit('position-change', targetPosition);
    }
  };

  requestAnimationFrame(animate);
};

// Mouse Events
const handleMouseDown = (event: MouseEvent): void => {
  event.preventDefault();
  isDragging.value = true;
  updateSliderPosition(event.clientX);
  emit('drag-start');
};

const handleMouseMove = (event: MouseEvent): void => {
  if (isDragging.value) {
    updateSliderPosition(event.clientX);
  }
};

const handleMouseUp = (): void => {
  if (isDragging.value) {
    isDragging.value = false;
    emit('drag-end');
  }
};

// Touch Events
const handleTouchStart = (event: TouchEvent): void => {
  event.preventDefault();
  isDragging.value = true;
  const touch = event.touches[0];
  updateSliderPosition(touch.clientX);
  emit('drag-start');
};

const handleTouchMove = (event: TouchEvent): void => {
  event.preventDefault();
  if (isDragging.value) {
    const touch = event.touches[0];
    updateSliderPosition(touch.clientX);
  }
};

const handleTouchEnd = (): void => {
  if (isDragging.value) {
    isDragging.value = false;
    emit('drag-end');
  }
};

// Image Loading
const handleImageLoad = (): void => {
  loadedImages.value++;
  if (loadedImages.value >= 2) {
    isLoading.value = false;
    hasError.value = false;
  }
};

const handleImageError = (): void => {
  hasError.value = true;
  isLoading.value = false;
};

const retryLoad = (): void => {
  hasError.value = false;
  isLoading.value = true;
  loadedImages.value = 0;
  
  // Force re-render of images
  nextTick(() => {
    const images = containerRef.value?.querySelectorAll('img');
    images?.forEach(img => {
      const src = img.src;
      img.src = '';
      img.src = src;
    });
  });
};

// Fullscreen
const toggleFullscreen = (): void => {
  isFullscreen.value = !isFullscreen.value;
  
  if (isFullscreen.value) {
    containerRef.value?.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
  
  emit('fullscreen-toggle', isFullscreen.value);
};

// Keyboard Navigation
const handleKeyDown = (event: KeyboardEvent): void => {
  if (!containerRef.value) return;

  const step = event.shiftKey ? 10 : 2;
  let newPosition = sliderPosition.value;

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      newPosition = Math.max(0, sliderPosition.value - step);
      break;
    case 'ArrowRight':
      event.preventDefault();
      newPosition = Math.min(100, sliderPosition.value + step);
      break;
    case 'Home':
      event.preventDefault();
      newPosition = 0;
      break;
    case 'End':
      event.preventDefault();
      newPosition = 100;
      break;
    case ' ':
      event.preventDefault();
      newPosition = 50;
      break;
    case 'f':
      if (props.allowFullscreen) {
        event.preventDefault();
        toggleFullscreen();
      }
      break;
    default:
      return;
  }

  if (newPosition !== sliderPosition.value) {
    animateToPosition(newPosition);
  }
};

// Lifecycle
onMounted(() => {
  // Add keyboard listeners
  document.addEventListener('keydown', handleKeyDown);
  
  // Add mouse listeners for global mouse up
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mousemove', handleMouseMove);

  // Fullscreen change listener
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement;
  });

  // Set focus for keyboard navigation
  if (containerRef.value) {
    containerRef.value.setAttribute('tabindex', '0');
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('mouseup', handleMouseUp);
  document.removeEventListener('mousemove', handleMouseMove);
});

// Exposed methods for programmatic control
defineExpose({
  setPosition: (position: number) => {
    animateToPosition(Math.max(0, Math.min(100, position)));
  },
  resetPosition: () => {
    animateToPosition(props.initialPosition);
  },
  toggleFullscreen,
  getCurrentPosition: () => sliderPosition.value
});
</script>

<style scoped>
/* Custom cursor for the container */
.group:hover {
  cursor: ew-resize;
}

/* Smooth transition for clip path */
.group:not(.dragging) {
  transition: clip-path 0.1s ease-out;
}

/* Hide scrollbars in fullscreen mode */
:fullscreen {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

:fullscreen::-webkit-scrollbar {
  display: none;
}

/* Custom focus styles */
.group:focus {
  outline: 2px solid theme('colors.emerald.600');
  outline-offset: 2px;
}

/* Animation for slider handle */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.group:hover .animate-pulse {
  animation: pulse 2s infinite;
}
</style>