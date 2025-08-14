### components/gallery/Image360Viewer.vue
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

    <!-- 360 Viewer Container -->
    <div class="relative w-full h-full max-w-4xl max-h-4xl">
      <!-- Loading State -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
        <div class="text-center text-white">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4 mx-auto"></div>
          <p>Loading 360° view...</p>
          <p class="text-sm text-slate-300">{{ loadedImages }} / {{ totalImages }} images</p>
        </div>
      </div>

      <!-- 360 View -->
      <div 
        v-show="!loading"
        ref="viewer360"
        class="w-full h-full cursor-grab select-none"
        :class="{ 'cursor-grabbing': isDragging }"
        @mousedown="startDrag"
        @mousemove="drag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
        @touchstart="startTouch"
        @touchmove="touchMove"
        @touchend="stopTouch"
      >
        <img
          v-for="(image, index) in images360"
          :key="index"
          :src="image"
          :alt="`360 view frame ${index + 1}`"
          class="absolute inset-0 w-full h-full object-contain"
          :class="{ 'opacity-100': index === currentFrame, 'opacity-0': index !== currentFrame }"
          @load="handleImageLoad"
          draggable="false"
        />
      </div>

      <!-- Controls -->
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black bg-opacity-50 rounded-full px-6 py-3">
        <!-- Play/Pause -->
        <button
          @click="toggleAutoRotate"
          class="text-white hover:text-emerald-400 transition-colors"
        >
          <PlayIcon v-if="!isAutoRotating" class="w-6 h-6" />
          <PauseIcon v-else class="w-6 h-6" />
        </button>

        <!-- Progress -->
        <div class="text-white text-sm">
          {{ currentFrame + 1 }} / {{ totalFrames }}
        </div>

        <!-- Speed Control -->
        <select
          v-model="rotationSpeed"
          class="bg-transparent text-white text-sm border border-white border-opacity-30 rounded px-2 py-1"
        >
          <option value="slow">Slow</option>
          <option value="normal">Normal</option>
          <option value="fast">Fast</option>
        </select>
      </div>

      <!-- Instructions -->
      <div class="absolute top-4 left-4 text-white text-sm bg-black bg-opacity-50 rounded-lg p-3">
        <p class="font-medium mb-1">360° View</p>
        <p>Drag to rotate • Click play to auto-rotate</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { XMarkIcon, PlayIcon, PauseIcon } from '@heroicons/vue/24/outline'

interface Props {
  productId: string
}

const props = defineProps<Props>()
defineEmits<{
  close: []
}>()

// State
const loading = ref(true)
const loadedImages = ref(0)
const currentFrame = ref(0)
const isDragging = ref(false)
const isAutoRotating = ref(false)
const rotationSpeed = ref('normal')
const dragStartX = ref(0)
const dragStartFrame = ref(0)

// 360 images - in a real app, these would be loaded from an API
const images360 = ref<string[]>([])
const totalFrames = 36 // Standard 360 view has 36 frames (10-degree intervals)

// Generate mock 360 images
const generateMock360Images = () => {
  const mockImages: string[] = []
  for (let i = 0; i < totalFrames; i++) {
    // In a real app, these would be actual 360-degree product images
    mockImages.push(`https://picsum.photos/800/600?random=${props.productId}-360-${i}`)
  }
  return mockImages
}

const totalImages = computed(() => images360.value.length)

// Auto-rotation
let autoRotateInterval: number | null = null

const speeds = {
  slow: 200,
  normal: 100,
  fast: 50
}

const startAutoRotate = () => {
  if (autoRotateInterval) return
  
  autoRotateInterval = window.setInterval(() => {
    currentFrame.value = (currentFrame.value + 1) % totalFrames
  }, speeds[rotationSpeed.value as keyof typeof speeds])
}

const stopAutoRotate = () => {
  if (autoRotateInterval) {
    clearInterval(autoRotateInterval)
    autoRotateInterval = null
  }
}

const toggleAutoRotate = () => {
  isAutoRotating.value = !isAutoRotating.value
  
  if (isAutoRotating.value) {
    startAutoRotate()
  } else {
    stopAutoRotate()
  }
}

// Mouse drag functionality
const startDrag = (event: MouseEvent) => {
  isDragging.value = true
  dragStartX.value = event.clientX
  dragStartFrame.value = currentFrame.value
  stopAutoRotate()
  isAutoRotating.value = false
}

const drag = (event: MouseEvent) => {
  if (!isDragging.value) return
  
  const deltaX = event.clientX - dragStartX.value
  const sensitivity = 2 // Adjust sensitivity
  const frameChange = Math.floor(deltaX / sensitivity)
  
  let newFrame = dragStartFrame.value + frameChange
  
  // Handle wrapping
  while (newFrame < 0) newFrame += totalFrames
  while (newFrame >= totalFrames) newFrame -= totalFrames
  
  currentFrame.value = newFrame
}

const stopDrag = () => {
  isDragging.value = false
}

// Touch functionality
const startTouch = (event: TouchEvent) => {
  if (event.touches.length === 1) {
    isDragging.value = true
    dragStartX.value = event.touches[0].clientX
    dragStartFrame.value = currentFrame.value
    stopAutoRotate()
    isAutoRotating.value = false
  }
}

const touchMove = (event: TouchEvent) => {
  if (!isDragging.value || event.touches.length !== 1) return
  
  event.preventDefault()
  
  const deltaX = event.touches[0].clientX - dragStartX.value
  const sensitivity = 3
  const frameChange = Math.floor(deltaX / sensitivity)
  
  let newFrame = dragStartFrame.value + frameChange
  
  while (newFrame < 0) newFrame += totalFrames
  while (newFrame >= totalFrames) newFrame -= totalFrames
  
  currentFrame.value = newFrame
}

const stopTouch = () => {
  isDragging.value = false
}

// Image loading
const handleImageLoad = () => {
  loadedImages.value++
  
  if (loadedImages.value === totalImages.value) {
    loading.value = false
  }
}

// Watch rotation speed changes
watch(rotationSpeed, () => {
  if (isAutoRotating.value) {
    stopAutoRotate()
    startAutoRotate()
  }
})

// Lifecycle
onMounted(() => {
  images360.value = generateMock360Images()
  
  // Start auto-rotation after loading
  setTimeout(() => {
    if (!isDragging.value) {
      isAutoRotating.value = true
      startAutoRotate()
    }
  }, 1000)
})

onUnmounted(() => {
  stopAutoRotate()
})
</script>