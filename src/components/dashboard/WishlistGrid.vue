<!-- WishlistGrid.vue -->
<template>
  <div>
    <!-- View Toggle -->
    <div class="flex justify-end mb-4">
      <div class="flex bg-slate-100 rounded-lg p-1">
        <button
          @click="$emit('view-change', 'grid')"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-md transition-colors',
            viewMode === 'grid'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          ]"
        >
          <GridIcon class="w-4 h-4 mr-2 inline" />
          Grid
        </button>
        <button
          @click="$emit('view-change', 'list')"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-md transition-colors',
            viewMode === 'list'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          ]"
        >
          <ListIcon class="w-4 h-4 mr-2 inline" />
          List
        </button>
      </div>
    </div>

    <!-- Grid View -->
    <div
      v-if="viewMode === 'grid'"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="item in items"
        :key="item.id"
        class="group bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow"
      >
        <!-- Selection checkbox -->
        <div class="absolute top-3 left-3 z-10">
          <input
            :checked="selectedItems.includes(item.id)"
            @change="$emit('toggle-selection', item.id)"
            type="checkbox"
            class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
          >
        </div>

        <!-- Product Image -->
        <div class="aspect-square bg-slate-100 overflow-hidden relative">
          <img
            :src="item.product.image"
            :alt="item.product.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          >
          <!-- Quick actions overlay -->
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div class="flex space-x-2">
              <button
                @click="$emit('add-to-cart', [item.id])"
                class="p-2 bg-white text-slate-700 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                title="Add to Cart"
              >
                <ShoppingCartIcon class="w-5 h-5" />
              </button>
              <button
                @click="viewProduct(item.product)"
                class="p-2 bg-white text-slate-700 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                title="View Details"
              >
                <EyeIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Product Info -->
        <div class="p-4">
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-sm font-medium text-slate-900 truncate flex-1 mr-2">
              {{ item.product.name }}
            </h3>
            <button
              @click="$emit('remove-item', item.id)"
              class="text-slate-400 hover:text-red-500 transition-colors"
              title="Remove from wishlist"
            >
              <XIcon class="w-4 h-4" />
            </button>
          </div>

          <!-- Gemstone Details -->
          <div class="text-xs text-slate-500 mb-3 space-y-1">
            <p>{{ item.product.gemstoneType }} • {{ item.product.weight }}ct</p>
            <p>{{ item.product.cut }} • {{ item.product.clarity }}</p>
            <p v-if="item.product.certification" class="flex items-center">
              <ShieldCheckIcon class="w-3 h-3 mr-1" />
              {{ item.product.certification }}
            </p>
          </div>

          <!-- Price and Stock -->
          <div class="flex items-center justify-between mb-3">
            <div>
              <span class="text-lg font-bold text-emerald-600">
                ${{ item.product.price.toFixed(2) }}
              </span>
              <span v-if="item.product.originalPrice" class="text-sm text-slate-400 line-through ml-2">
                ${{ item.product.originalPrice.toFixed(2) }}
              </span>
            </div>
            <span :class="[
              'text-xs px-2 py-1 rounded-full',
              item.product.inStock 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-red-100 text-red-800'
            ]">
              {{ item.product.inStock ? 'In Stock' : 'Out of Stock' }}
            </span>
          </div>

          <!-- Price Alert -->
          <div class="flex items-center justify-between mb-3">
            <label class="flex items-center text-xs text-slate-600">
              <input
                :checked="item.priceAlert"
                @change="$emit('toggle-price-alert', item.id)"
                type="checkbox"
                class="h-3 w-3 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded mr-2"
              >
              Price alerts
            </label>
            <span class="text-xs text-slate-400">
              Added {{ formatDate(item.addedDate) }}
            </span>
          </div>

          <!-- Actions -->
          <div class="flex space-x-2">
            <button
              @click="$emit('add-to-cart', [item.id])"
              :disabled="!item.product.inStock"
              class="flex-1 px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
            <div class="relative">
              <button
                @click="toggleCollectionMenu(item.id)"
                class="p-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                title="Move to collection"
              >
                <FolderIcon class="w-4 h-4" />
              </button>
              
              <!-- Collection dropdown -->
              <div
                v-if="showCollectionMenu === item.id"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-20"
              >
                <div class="p-2">
                  <button
                    @click="moveToCollection(item.id, '')"
                    class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors"
                  >
                    No Collection
                  </button>
                  <button
                    v-for="collection in collections"
                    :key="collection.id"
                    @click="moveToCollection(item.id, collection.id)"
                    class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors"
                  >
                    {{ collection.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="space-y-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="bg-white rounded-lg shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow"
      >
        <div class="flex items-center space-x-4">
          <!-- Selection checkbox -->
          <input
            :checked="selectedItems.includes(item.id)"
            @change="$emit('toggle-selection', item.id)"
            type="checkbox"
            class="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
          >

          <!-- Product Image -->
          <img
            :src="item.product.image"
            :alt="item.product.name"
            class="w-24 h-24 rounded-lg object-cover"
          >

          <!-- Product Details -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div class="flex-1 mr-4">
                <h3 class="text-lg font-medium text-slate-900 mb-1">
                  {{ item.product.name }}
                </h3>
                <div class="flex flex-wrap gap-4 text-sm text-slate-500 mb-2">
                  <span>{{ item.product.gemstoneType }}</span>
                  <span>{{ item.product.weight }}ct</span>
                  <span>{{ item.product.cut }}</span>
                  <span>{{ item.product.clarity }}</span>
                </div>
                <div class="flex items-center space-x-4 text-xs text-slate-400">
                  <span>Added {{ formatDate(item.addedDate) }}</span>
                  <span v-if="item.product.certification" class="flex items-center">
                    <ShieldCheckIcon class="w-3 h-3 mr-1" />
                    {{ item.product.certification }}
                  </span>
                </div>
              </div>

              <!-- Price and Actions -->
              <div class="flex flex-col items-end space-y-3">
                <div class="text-right">
                  <span class="text-xl font-bold text-emerald-600">
                    ${{ item.product.price.toFixed(2) }}
                  </span>
                  <span v-if="item.product.originalPrice" class="block text-sm text-slate-400 line-through">
                    ${{ item.product.originalPrice.toFixed(2) }}
                  </span>
                </div>

                <div class="flex space-x-2">
                  <button
                    @click="$emit('add-to-cart', [item.id])"
                    :disabled="!item.product.inStock"
                    class="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    Add to Cart
                  </button>
                  <button
                    @click="$emit('remove-item', item.id)"
                    class="px-3 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <XIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Collection Menu Backdrop -->
    <div
      v-if="showCollectionMenu"
      @click="showCollectionMenu = null"
      class="fixed inset-0 z-10"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  GridIcon,
  ListIcon,
  ShoppingCartIcon,
  EyeIcon,
  XIcon,
  ShieldCheckIcon,
  FolderIcon,
} from 'lucide-vue-next';
import type { WishlistItem, WishlistCollection } from '@/types';

interface Props {
  items: WishlistItem[];
  selectedItems: string[];
  viewMode: 'grid' | 'list';
  collections?: WishlistCollection[];
}

defineProps<Props>();
defineEmits<{
  'toggle-selection': [itemId: string];
  'remove-item': [itemId: string];
  'toggle-price-alert': [itemId: string];
  'move-to-collection': [itemId: string, collectionId: string];
  'add-to-cart': [itemIds: string[]];
  'view-change': [mode: 'grid' | 'list'];
}>();

const showCollectionMenu = ref<string | null>(null);

const toggleCollectionMenu = (itemId: string) => {
  showCollectionMenu.value = showCollectionMenu.value === itemId ? null : itemId;
};

const moveToCollection = (itemId: string, collectionId: string) => {
  emit('move-to-collection', itemId, collectionId);
  showCollectionMenu.value = null;
};

const viewProduct = (product: any) => {
  window.location.href = `/products/${product.id}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};
</script>