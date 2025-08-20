<!-- WishlistActions.vue -->
<template>
  <div class="bg-white rounded-lg shadow-lg border border-slate-200 p-6">
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <!-- Selection Info -->
      <div class="flex items-center space-x-4">
        <span class="text-sm text-slate-600">
          {{ selectedItems.length }} of {{ totalItems }} selected
        </span>
        <button
          v-if="selectedItems.length > 0"
          @click="$emit('clear-selection')"
          class="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Clear Selection
        </button>
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap gap-3">
        <button
          v-if="selectedItems.length > 0"
          @click="$emit('add-to-cart', selectedItems)"
          class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          <ShoppingCartIcon class="w-4 h-4 mr-2 inline" />
          Add Selected to Cart ({{ selectedItems.length }})
        </button>

        <button
          v-if="selectedItems.length > 0"
          @click="showMoveToCollection = true"
          class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          <FolderIcon class="w-4 h-4 mr-2 inline" />
          Move to Collection
        </button>

        <button
          v-if="hasItems"
          @click="$emit('share-wishlist')"
          class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          <ShareIcon class="w-4 h-4 mr-2 inline" />
          Share Wishlist
        </button>

        <button
          @click="$emit('create-collection')"
          class="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          <PlusIcon class="w-4 h-4 mr-2 inline" />
          New Collection
        </button>

        <!-- More actions dropdown -->
        <div class="relative">
          <button
            @click="showMoreMenu = !showMoreMenu"
            class="p-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <MoreVerticalIcon class="w-4 h-4" />
          </button>
          
          <div
            v-if="showMoreMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-20"
          >
            <div class="p-2">
              <button
                v-if="selectedItems.length > 0"
                @click="handleRemoveSelected"
                class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <TrashIcon class="w-4 h-4 mr-2 inline" />
                Remove Selected
              </button>
              <button
                v-if="hasItems"
                @click="handleExportWishlist"
                class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                <DownloadIcon class="w-4 h-4 mr-2 inline" />
                Export Wishlist
              </button>
              <button
                v-if="selectedItems.length > 0"
                @click="handleCompareSelected"
                class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                <BarChart3Icon class="w-4 h-4 mr-2 inline" />
                Compare Selected
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop for dropdown -->
    <div
      v-if="showMoreMenu"
      @click="showMoreMenu = false"
      class="fixed inset-0 z-10"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  ShoppingCartIcon,
  FolderIcon,
  ShareIcon,
  PlusIcon,
  MoreVerticalIcon,
  TrashIcon,
  DownloadIcon,
  BarChart3Icon,
} from 'lucide-vue-next';

interface Props {
  selectedItems: string[];
  hasItems: boolean;
  totalItems?: number;
}

defineProps<Props>();
defineEmits<{
  'clear-selection': [];
  'add-to-cart': [itemIds: string[]];
  'create-collection': [];
  'share-wishlist': [];
}>();

const showMoreMenu = ref(false);
const showMoveToCollection = ref(false);

const handleRemoveSelected = () => {
  // Emit remove selected items
  showMoreMenu.value = false;
};

const handleExportWishlist = () => {
  // Export wishlist as CSV or PDF
  showMoreMenu.value = false;
};

const handleCompareSelected = () => {
  // Open comparison modal with selected items
  showMoreMenu.value = false;
};
</script>