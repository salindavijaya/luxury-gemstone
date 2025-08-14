### components/gallery/ImageViewer.vue
```vue
<template>
  <div class="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
    <!-- Close Button -->
    <button
      @click="$emit('close')"
      class="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
    >
      <XMarkIcon class="w-6 h-6 text-white" />
    </button>

    <!-- Navigation Arrows -->
    <button
      v-if="images.length > 1"
      @click="previousImage"
      class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all"
    >
      <ChevronLeftIcon class="w-8 h-8 text-white" />
    </button>

    <button
      v-if="images.length > 1"
      @click="nextImage"
      class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all"
    >
      <ChevronRightIcon class="w-8 h-8 text-white" />
    </button>

    <!-- Image Container -->
    <div 
      ref="imageContainer"
      class="relative w-full h-full flex items-center justify-center p-4 overflow-hidden cursor-grab"
      :class="{ 'cursor-grabbing': isDragging }"
      @mousedown="startDrag"
      @mousemove="drag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
      @wheel="handleWheel"
    >
      <img
        :src="currentImage.url"
        :alt="currentImage.alt"
        class="max-w-full max-h-full object-contain select-none transition-transform duration-200"
        :style="{ transform: `translate(${panX}px, ${panY}px) scale(${scale})` }"
        @load="handleImageLoad"
        draggable="false"
      />
    </div>

    <!-- Image Counter -->
    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
      {{ currentIndex + 1 }} / {{ images.length }}
    </div>

    <!-- Zoom Controls -->
    <div class="absolute bottom-4 right-4 flex space-x-2">
      <button
        @click="zoomOut"
        class="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
        :disabled="scale <= minScale"
      >
        <MinusIcon class="w-5 h-5 text-white" />
      </button>
      <button
        @click="resetZoom"
        class="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md px-3 py-2 transition-all"
      >
        <span class="text-white text-sm">{{ Math.round(scale * 100) }}%</span>
      </button>
      <button
        @click="zoomIn"
        class="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
        :disabled="scale >= maxScale"
      >
        <PlusIcon class="w-5 h-5 text-white" />
      </button>
    </div>

    <!-- Thumbnail Strip -->
    <div class="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-30 rounded-lg p-2">
      <button
        v-for="(image, index) in images"
        :key="image.id"
        @click="selectImage(index)"
        class="w-16 h-16 rounded-md overflow-hidden border-2 transition-all"
        :class="index === currentIndex ? 'border-emerald-500' : 'border-transparent opacity-70 hover:opacity-100'"
      >
        <img
          :src="image.thumbnailUrl"
          :alt="image.alt"
          class="w-full h-full object-cover"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  XMarkIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  PlusIcon, 
  MinusIcon 
} from '@heroicons/vue/24/outline'

interface Image {
  id: string
  url: string
  thumbnailUrl: string
  alt?: string
}

interface Props {
  images: Image[]
  currentIndex: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  change: [index: number]
}>()

// Zoom and pan state
const scale = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const dragStartPanX = ref(0)
const dragStartPanY = ref(0)

// Zoom constraints
const minScale = 0.5
const maxScale = 5
const zoomStep = 0.2

// Current image
const currentImage = computed(() => props.images[props.currentIndex])

// Methods
const selectImage = (index: number) => {
  emit('change', index)
  resetTransform()
}

const nextImage = () => {
  const newIndex = (props.currentIndex + 1) % props.images.length
  selectImage(newIndex)
}

const previousImage = () => {
  const newIndex = props.currentIndex === 0 ? props.images.length - 1 : props.currentIndex - 1
  selectImage(newIndex)
}

const zoomIn = () => {
  if (scale.value < maxScale) {
    scale.value = Math.min(maxScale, scale.value + zoomStep)
  }
}

const zoomOut = () => {
  if (scale.value > minScale) {
    scale.value = Math.max(minScale, scale.value - zoomStep)
    
    // Reset pan if zoomed out too much
    if (scale.value === minScale) {
      panX.value = 0
      panY.value = 0
    }
  }
}

const resetZoom = () => {
  resetTransform()
}

const resetTransform = () => {
  scale.value = 1
  panX.value = 0
  panY.value = 0
}

// Drag functionality
const startDrag = (event: MouseEvent) => {
  if (scale.value > 1) {
    isDragging.value = true
    dragStartX.value = event.clientX
    dragStartY.value = event.clientY
    dragStartPanX.value = panX.value
    dragStartPanY.value = panY.value
  }
}

const drag = (event: MouseEvent) => {
  if (isDragging.value && scale.value > 1) {
    const deltaX = event.clientX - dragStartX.value
    const deltaY = event.clientY - dragStartY.value
    
    panX.value = dragStartPanX.value + deltaX
    panY.value = dragStartPanY.value + deltaY
  }
}

const stopDrag = () => {
  isDragging.value = false
}

// Wheel zoom
const handleWheel = (event: WheelEvent) => {
  event.preventDefault()
  
  if (event.deltaY < 0) {
    zoomIn()
  } else {
    zoomOut()
  }
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Escape':
      emit('close')
      break
    case 'ArrowLeft':
      previousImage()
      break
    case 'ArrowRight':
      nextImage()
      break
    case '+':
    case '=':
      zoomIn()
      break
    case '-':
      zoomOut()
      break
    case '0':
      resetZoom()
      break
  }
}

const handleImageLoad = () => {
  resetTransform()
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>