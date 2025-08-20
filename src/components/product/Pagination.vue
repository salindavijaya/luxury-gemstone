<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});
const emit = defineEmits(["page-change"]);
const setPage = (p: number) => emit("page-change", p);
</script>
<template>
  <div class="flex items-center gap-2">
    <button
      :disabled="props.currentPage <= 1"
      @click="setPage(props.currentPage - 1)"
    >
      Prev
    </button>
    <span>{{ props.currentPage }} / {{ props.totalPages }}</span>
    <button
      :disabled="props.currentPage >= props.totalPages"
      @click="setPage(props.currentPage + 1)"
    >
      Next
    </button>
  </div>
</template>
