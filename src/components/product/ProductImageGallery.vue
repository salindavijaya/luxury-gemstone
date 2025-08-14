### components/product/ProductImageGallery.vue
```vue
<template>
  <div class="space-y-4">
    <!-- Main Image Display -->
    <div class="relative aspect-square bg-white rounded-lg shadow-lg overflow-hidden group">
      <!-- Loading State -->
      <div v-if="currentImageLoading" class="absolute inset-0 flex items-center justify-center bg-slate-100">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>

      <!-- Main Image -->
      <div 
        ref="imageContainer"
        class="relative w-full h-full overflow-hidden cursor-zoom-in"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
        @mouseenter="handleMouseEnter"
        @click="openLightbox"
      >
        <img
          :src="currentImage.url"
          :alt="alt"
          class="w-full h-full object-contain transition-transform duration-200"
          :class="{ 'scale-110': isZoomed }"
          :style="zoomStyle"
          @load="handleImageLoad"
          @error="handleImageError"
        />
        
        <!-- Zoom Lens -->
        <div
          v-if="showZoomLens && isDesktop"
          class="absolute border-2 border-emerald-500 bg-emerald-500 bg-opacity-20 pointer-events-none"
          :style="lensStyle"
        ></div>

        <!-- Image Controls -->
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <!-- Previous/Next Arrows -->
          <button
            v-if="images.length > 1"
            @click.stop="previousImage"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
            aria-label="Previous image"
          >
            <ChevronLeftIcon class="w-6 h-6 text-slate-700" />
          </button>

          <button
            v-if="images.length > 1"
            @click.stop="nextImage"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
            aria-label="Next image"
          >
            <ChevronRightIcon class="w-6 h-6 text-slate-700" />
          </button>

          <!-- Fullscreen Button -->
          <button
            @click.stop="openLightbox"
            class="absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
            aria-label="View fullscreen"
          >
            <MagnifyingGlassIcon class="w-5 h-5 text-slate-700" />
          </button>

          <!-- 360 View Button -->
          <button
            v-if="has360View"
            @click.stop="toggle360View"
            class="absolute top-4 left-4 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-md px-3 py-2 shadow-lg transition-all"
            :class="{ 'bg-emerald-600 text-white': is360Active }"
          >
            <span class="text-xs font-medium">360°</span>
          </button>
        </div>

        <!-- Image Counter -->
        <div v-if="images.length > 1" class="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
          {{ currentImageIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </div>

    <!-- Thumbnail Navigation -->
    <ImageThumbnails
      :images="images"
      :current-index="currentImageIndex"
      @select="selectImage"
    />

    <!-- Image Lightbox -->
    <ImageViewer
      v-if="lightboxOpen"
      :images="images"
      :current-index="currentImageIndex"
      @close="closeLightbox"
      @change="selectImage"
    />

    <!-- 360 Viewer -->
    <Image360Viewer
      v-if="is360Active && has360View"
      :product-id="productId"
      @close="toggle360View"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import ImageThumbnails from '../gallery/ImageThumbnails.vue'
import ImageViewer from '../gallery/ImageViewer.vue'
import Image360Viewer from '../gallery/Image360Viewer.vue'
import { useImageGallery } from '@/composables/useImageGallery'

interface Image {
  id: string
  url: string
  thumbnailUrl: string
  alt?: string
}

interface Props {
  images: Image[]
  alt: string
  has360View?: boolean
  productId?: string
}

const props = withDefaults(defineProps<Props>(), {
  has360View: false
})

const emit = defineEmits<{
  imageError: [url: string]
}>()

// Composable
const {
  currentImageIndex,
  currentImage,
  lightboxOpen,
  isZoomed,
  zoomStyle,
  lensStyle,
  showZoomLens,
  selectImage,
  nextImage,
  previousImage,
  openLightbox,
  closeLightbox,
  handleMouseMove,
  handleMouseLeave,
  handleMouseEnter
} = useImageGallery(props.images)

// Local state
const imageContainer = ref<HTMLElement>()
const currentImageLoading = ref(false)
const is360Active = ref(false)

// Computed
const isDesktop = computed(() => window.innerWidth >= 1024)

// Methods
const handleImageLoad = () => {
  currentImageLoading.value = false
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  emit('imageError', img.src)
  currentImageLoading.value = false
}

const toggle360View = () => {
  is360Active.value = !is360Active.value
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    previousImage()
  } else if (event.key === 'ArrowRight') {
    nextImage()
  } else if (event.key === 'Escape') {
    closeLightbox()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>