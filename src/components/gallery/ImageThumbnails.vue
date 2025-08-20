### components/gallery/ImageThumbnails.vue ```vue
<template>
  <div class="flex space-x-2 overflow-x-auto pb-2">
    <button
      v-for="(image, index) in images"
      :key="image.id"
      @click="selectImage(index)"
      class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105"
      :class="
        index === currentIndex
          ? 'border-emerald-500 shadow-lg'
          : 'border-slate-200 hover:border-slate-300'
      "
      :aria-label="`View image ${index + 1}`"
    >
      <img
        :src="image.thumbnailUrl"
        :alt="image.alt || `Product image ${index + 1}`"
        class="w-full h-full object-cover"
        :class="{ 'opacity-50': index !== currentIndex }"
        loading="lazy"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
interface Image {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt?: string;
}

interface Props {
  images: Image[];
  currentIndex: number;
}

defineProps<Props>();

const emit = defineEmits<{
  select: [index: number];
}>();

const selectImage = (index: number) => {
  emit("select", index);
};
</script>
