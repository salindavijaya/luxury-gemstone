<!-- DashboardWishlist.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-lg border border-slate-200 p-6">
      <div
        class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h2 class="text-xl font-semibold text-slate-900">My Wishlist</h2>
          <p class="text-slate-500 text-sm mt-1">
            {{ filteredItems.length }} item{{
              filteredItems.length === 1 ? "" : "s"
            }}
            {{ selectedCollection ? `in "${selectedCollection.name}"` : "" }}
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <select
            v-model="selectedCollectionId"
            class="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">All Items</option>
            <option
              v-for="collection in collections"
              :key="collection.id"
              :value="collection.id"
            >
              {{ collection.name }}
            </option>
          </select>
          <button
            @click="showCreateCollection = true"
            class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            <PlusIcon class="w-4 h-4 mr-2 inline" />
            New Collection
          </button>
        </div>
      </div>
    </div>

    <!-- Collections Management -->
    <div
      v-if="collections.length > 0"
      class="bg-white rounded-lg shadow-lg border border-slate-200"
    >
      <div class="p-6 border-b border-slate-200">
        <h3 class="text-lg font-semibold text-slate-900">Collections</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="collection in collections"
            :key="collection.id"
            :class="[
              'p-4 border rounded-lg cursor-pointer transition-colors',
              selectedCollectionId === collection.id
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-slate-200 hover:border-slate-300',
            ]"
            @click="selectedCollectionId = collection.id"
          >
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-medium text-slate-900">{{ collection.name }}</h4>
              <div class="flex items-center space-x-2">
                <span
                  class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full"
                >
                  {{ getCollectionItemCount(collection.id) }}
                </span>
                <button
                  @click.stop="toggleCollectionShare(collection)"
                  :class="[
                    'p-1 rounded transition-colors',
                    collection.isPublic
                      ? 'text-emerald-600 hover:bg-emerald-50'
                      : 'text-slate-400 hover:bg-slate-50',
                  ]"
                >
                  <ShareIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
            <p
              v-if="collection.description"
              class="text-sm text-slate-500 truncate"
            >
              {{ collection.description }}
            </p>
            <p class="text-xs text-slate-400 mt-2">
              Created {{ formatDate(collection.createdDate) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Wishlist Actions -->
    <WishlistActions
      :selected-items="selectedItems"
      :has-items="filteredItems.length > 0"
      @clear-selection="clearSelection"
      @add-to-cart="handleAddToCart"
      @create-collection="showCreateCollection = true"
      @share-wishlist="handleShareWishlist"
    />

    <!-- Wishlist Grid -->
    <div
      v-if="isLoading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="i in 8"
        :key="i"
        class="bg-white rounded-lg shadow-lg border border-slate-200 p-4 animate-pulse"
      >
        <div class="aspect-square bg-slate-200 rounded-lg mb-4"></div>
        <div class="h-4 bg-slate-200 rounded mb-2"></div>
        <div class="h-4 bg-slate-200 rounded w-2/3"></div>
      </div>
    </div>

    <div
      v-else-if="filteredItems.length === 0"
      class="bg-white rounded-lg shadow-lg border border-slate-200 p-12 text-center"
    >
      <HeartIcon class="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-slate-900 mb-2">
        {{
          selectedCollection ? "Collection is empty" : "Your wishlist is empty"
        }}
      </h3>
      <p class="text-slate-500 mb-6">
        {{
          selectedCollection
            ? "Add items to this collection from your main wishlist"
            : "Save items you love for later"
        }}
      </p>
      <button
        @click="goToBrowse"
        class="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
      >
        Browse Gemstones
      </button>
    </div>

    <WishlistGrid
      v-else
      :items="filteredItems"
      :selected-items="selectedItems"
      :view-mode="viewMode"
      @toggle-selection="toggleItemSelection"
      @remove-item="handleRemoveItem"
      @toggle-price-alert="handleTogglePriceAlert"
      @move-to-collection="handleMoveToCollection"
    />

    <!-- Create Collection Modal -->
    <Modal v-model="showCreateCollection" title="Create New Collection">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Collection Name *
          </label>
          <input
            v-model="newCollectionName"
            type="text"
            placeholder="Enter collection name"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            v-model="newCollectionDescription"
            rows="3"
            placeholder="Optional description"
            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          ></textarea>
        </div>
        <div class="flex items-center">
          <input
            v-model="newCollectionPublic"
            type="checkbox"
            id="public-collection"
            class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
          />
          <label for="public-collection" class="ml-2 text-sm text-slate-600">
            Make this collection public (others can view but not edit)
          </label>
        </div>
        <div class="flex justify-end space-x-3 pt-4">
          <button
            @click="showCreateCollection = false"
            class="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="createCollection"
            :disabled="!newCollectionName.trim()"
            class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            Create Collection
          </button>
        </div>
      </div>
    </Modal>

    <!-- Share Collection Modal -->
    <Modal v-model="showShareModal" title="Share Collection">
      <div v-if="shareableCollection" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Share Link
          </label>
          <div class="flex">
            <input
              :value="shareableCollection.shareUrl"
              readonly
              class="flex-1 px-3 py-2 border border-slate-300 rounded-l-lg bg-slate-50 text-slate-600"
            />
            <button
              @click="copyShareLink"
              class="px-4 py-2 bg-slate-600 text-white rounded-r-lg hover:bg-slate-700 transition-colors"
            >
              <CopyIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div class="flex items-center">
          <input
            v-model="shareableCollection.isPublic"
            type="checkbox"
            id="public-share"
            class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
          />
          <label for="public-share" class="ml-2 text-sm text-slate-600">
            Allow public access to this collection
          </label>
        </div>
        <div class="text-xs text-slate-500">
          <p>
            Anyone with this link can view your collection but cannot make
            changes.
          </p>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useWishlistStore } from "@/stores/wishlist";
import { HeartIcon, PlusIcon, ShareIcon, CopyIcon } from "lucide-vue-next";
import WishlistGrid from "./WishlistGrid.vue";
import WishlistActions from "./WishlistActions.vue";
import Modal from "../UI/Modal.vue";
import type { WishlistItem, WishlistCollection } from "@/types";

const wishlistStore = useWishlistStore();

const isLoading = ref(true);
const selectedItems = ref<string[]>([]);
const selectedCollectionId = ref("");
const viewMode = ref<"grid" | "list">("grid");

// Create collection modal
const showCreateCollection = ref(false);
const newCollectionName = ref("");
const newCollectionDescription = ref("");
const newCollectionPublic = ref(false);

// Share modal
const showShareModal = ref(false);
const shareableCollection = ref<WishlistCollection | null>(null);

const items = computed(() => wishlistStore.items);
const collections = computed(() => wishlistStore.collections);

const selectedCollection = computed(() =>
  selectedCollectionId.value
    ? collections.value.find((c) => c.id === selectedCollectionId.value)
    : null
);

const filteredItems = computed(() => {
  if (!selectedCollectionId.value) return items.value;
  return items.value.filter(
    (item) => item.collectionId === selectedCollectionId.value
  );
});

const getCollectionItemCount = (collectionId: string) => {
  return items.value.filter((item) => item.collectionId === collectionId)
    .length;
};

const toggleItemSelection = (itemId: string) => {
  const index = selectedItems.value.indexOf(itemId);
  if (index > -1) {
    selectedItems.value.splice(index, 1);
  } else {
    selectedItems.value.push(itemId);
  }
};

const clearSelection = () => {
  selectedItems.value = [];
};

const handleAddToCart = async (itemIds: string[]) => {
  // Add selected items to cart
  console.log("Adding items to cart:", itemIds);
  // In real app, would call cart API
  clearSelection();
};

const handleRemoveItem = async (itemId: string) => {
  await wishlistStore.removeFromWishlist(itemId);
  // Remove from selection if selected
  const index = selectedItems.value.indexOf(itemId);
  if (index > -1) {
    selectedItems.value.splice(index, 1);
  }
};

const handleTogglePriceAlert = async (itemId: string) => {
  await wishlistStore.togglePriceAlert(itemId);
};

const handleMoveToCollection = async (itemId: string, collectionId: string) => {
  await wishlistStore.addItemToCollection(itemId, collectionId);
};

const createCollection = async () => {
  if (!newCollectionName.value.trim()) return;

  await wishlistStore.createCollection(
    newCollectionName.value.trim(),
    newCollectionDescription.value.trim() || undefined
  );

  // Reset form
  newCollectionName.value = "";
  newCollectionDescription.value = "";
  newCollectionPublic.value = false;
  showCreateCollection.value = false;
};

const toggleCollectionShare = (collection: WishlistCollection) => {
  shareableCollection.value = {
    ...collection,
    shareUrl: `${window.location.origin}/wishlist/shared/${collection.id}`,
  };
  showShareModal.value = true;
};

const handleShareWishlist = () => {
  // Create shareable link for entire wishlist
  const shareUrl = `${window.location.origin}/wishlist/shared/all`;
  navigator.clipboard.writeText(shareUrl);
  // Show toast notification
};

const copyShareLink = async () => {
  if (shareableCollection.value?.shareUrl) {
    await navigator.clipboard.writeText(shareableCollection.value.shareUrl);
    // Show success toast
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const goToBrowse = () => {
  window.location.href = "/products";
};

onMounted(async () => {
  // Simulate loading
  await new Promise((resolve) => setTimeout(resolve, 1000));
  isLoading.value = false;
});
</script>
