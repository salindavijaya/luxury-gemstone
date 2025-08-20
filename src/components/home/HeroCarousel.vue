<template>
  <div class="relative h-full overflow-hidden">
    <!-- Image Carousel -->
    <div class="relative h-full">
      <transition-group name="fade">
        <div
          v-for="(image, index) in images"
          :key="image.url"
          v-show="currentIndex === index"
          class="absolute inset-0"
        >
          <img
            :src="image.url"
            :alt="image.alt"
            class="w-full h-full object-cover"
          />
        </div>
      </transition-group>
    </div>

    <!-- Navigation Arrows -->
    <div
      class="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-4"
    >
      <button
        @click="previousImage"
        class="bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all"
        aria-label="Previous image"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        @click="nextImage"
        class="bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all"
        aria-label="Next image"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>

    <!-- Indicators -->
    <div class="absolute bottom-4 inset-x-0 flex justify-center space-x-2">
      <button
        v-for="(_, index) in images"
        :key="index"
        @click="currentIndex = index"
        :class="[
          'w-2 h-2 rounded-full transition-all',
          currentIndex === index
            ? 'bg-white'
            : 'bg-white bg-opacity-50 hover:bg-opacity-75',
        ]"
        :aria-label="`Go to slide ${index + 1}`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

interface Image {
  url: string;
  alt: string;
}

const props = defineProps<{
  images: Image[];
  autoplay?: boolean;
  interval?: number;
}>();

const currentIndex = ref(0);
let autoplayInterval: number | null = null;

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length;
};

const previousImage = () => {
  currentIndex.value =
    currentIndex.value === 0 ? props.images.length - 1 : currentIndex.value - 1;
};

onMounted(() => {
  if (props.autoplay && props.images.length > 1) {
    autoplayInterval = window.setInterval(() => {
      nextImage();
    }, props.interval || 5000);
  }
});

onBeforeUnmount(() => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
