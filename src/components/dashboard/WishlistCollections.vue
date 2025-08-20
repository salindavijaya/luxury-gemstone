<template>
  <div class="wishlist-collections">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6"
    >
      <h2 class="text-2xl font-bold text-slate-800 mb-4 sm:mb-0">
        My Collections
      </h2>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
      >
        <PlusIcon class="w-4 h-4 mr-2" />
        Create Collection
      </button>
    </div>

    <!-- Collections Grid -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      v-if="collections.length > 0"
    >
      <div
        v-for="collection in collections"
        :key="collection.id"
        class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
      >
        <!-- Collection Cover -->
        <div
          class="relative h-48 bg-gradient-to-br from-emerald-50 to-emerald-100"
        >
          <div
            v-if="collection.items.length > 0"
            class="absolute inset-0 grid grid-cols-2 gap-1 p-2"
          >
            <img
              v-for="(item, index) in collection.items.slice(0, 4)"
              :key="item.id"
              :src="item.image"
              :alt="item.name"
              class="w-full h-full object-cover rounded"
              :class="{ 'col-span-2': collection.items.length === 1 }"
            />
          </div>
          <div
            v-else
            class="absolute inset-0 flex items-center justify-center text-emerald-600"
          >
            <HeartIcon class="w-16 h-16 opacity-50" />
          </div>

          <!-- Collection Actions -->
          <div class="absolute top-2 right-2 flex space-x-1">
            <button
              @click="editCollection(collection)"
              class="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
            >
              <PencilIcon class="w-4 h-4 text-slate-600" />
            </button>
            <button
              @click="deleteCollection(collection.id)"
              class="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
            >
              <TrashIcon class="w-4 h-4 text-red-600" />
            </button>
          </div>

          <!-- Item Count Badge -->
          <div class="absolute bottom-2 left-2">
            <span
              class="px-2 py-1 bg-white/90 text-slate-800 text-sm rounded-full font-medium"
            >
              {{ collection.items.length }} items
            </span>
          </div>
        </div>

        <!-- Collection Info -->
        <div class="p-4">
          <h3 class="font-semibold text-slate-800 mb-1">
            {{ collection.name }}
          </h3>
          <p class="text-slate-600 text-sm mb-3" v-if="collection.description">
            {{ collection.description }}
          </p>

          <!-- Collection Stats -->
          <div
            class="flex items-center justify-between text-sm text-slate-500 mb-3"
          >
            <span>Created {{ formatDate(collection.createdAt) }}</span>
            <span
              v-if="collection.isPublic"
              class="text-emerald-600 font-medium"
              >Public</span
            >
          </div>

          <!-- Actions -->
          <div class="flex space-x-2">
            <button
              @click="viewCollection(collection)"
              class="flex-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors text-sm font-medium"
            >
              View Items
            </button>
            <button
              v-if="collection.isPublic"
              @click="shareCollection(collection)"
              class="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-md hover:bg-emerald-200 transition-colors"
            >
              <ShareIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <HeartIcon class="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-slate-800 mb-2">
        No Collections Yet
      </h3>
      <p class="text-slate-600 mb-6 max-w-md mx-auto">
        Create collections to organize your wishlist items by occasion, style,
        or any way you prefer.
      </p>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
      >
        <PlusIcon class="w-5 h-5 mr-2" />
        Create Your First Collection
      </button>
    </div>

    <!-- Create/Edit Collection Modal -->
    <Modal
      :show="showCreateModal || showEditModal"
      @close="closeModals"
      :title="editingCollection ? 'Edit Collection' : 'Create Collection'"
    >
      <form @submit.prevent="submitCollection" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Collection Name *
          </label>
          <input
            v-model="collectionForm.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g., Anniversary Collection"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            v-model="collectionForm.description"
            rows="3"
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
            placeholder="Describe your collection..."
          ></textarea>
        </div>

        <div class="flex items-center">
          <input
            v-model="collectionForm.isPublic"
            type="checkbox"
            id="isPublic"
            class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
          />
          <label for="isPublic" class="ml-2 text-sm text-slate-700">
            Make this collection public
          </label>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="closeModals"
            class="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!collectionForm.name.trim()"
            class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ editingCollection ? "Update" : "Create" }} Collection
          </button>
        </div>
      </form>
    </Modal>

    <!-- Share Modal -->
    <Modal
      :show="showShareModal"
      @close="showShareModal = false"
      title="Share Collection"
    >
      <div class="space-y-4" v-if="sharingCollection">
        <p class="text-slate-600">
          Share "{{ sharingCollection.name }}" with others:
        </p>

        <div class="flex space-x-2">
          <input
            :value="getShareUrl(sharingCollection.id)"
            readonly
            class="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm"
          />
          <button
            @click="copyShareUrl(sharingCollection.id)"
            class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            Copy
          </button>
        </div>

        <div class="flex justify-center space-x-4 pt-4">
          <button
            @click="shareVia('facebook')"
            class="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
          </button>
          <button
            @click="shareVia('twitter')"
            class="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
              />
            </svg>
          </button>
          <button
            @click="shareVia('pinterest')"
            class="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.093.112.107.211.079.327-.085.354-.402 1.672-.402 1.672-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"
              />
            </svg>
          </button>
        </div>
      </div>
    </Modal>

    <!-- Collection Items Modal -->
    <Modal
      :show="showItemsModal"
      @close="showItemsModal = false"
      :title="viewingCollection?.name || 'Collection Items'"
      size="large"
    >
      <div v-if="viewingCollection">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="item in viewingCollection.items"
            :key="item.id"
            class="bg-white border border-slate-200 rounded-lg p-4"
          >
            <img
              :src="item.image"
              :alt="item.name"
              class="w-full h-32 object-cover rounded-md mb-3"
            />
            <h4 class="font-medium text-slate-800 mb-1">{{ item.name }}</h4>
            <p class="text-emerald-600 font-semibold mb-2">
              ${{ item.price.toLocaleString() }}
            </p>
            <div class="flex space-x-2">
              <button
                @click="removeFromCollection(viewingCollection.id, item.id)"
                class="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
              >
                Remove
              </button>
              <button
                @click="moveToCart(item)"
                class="flex-1 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-md hover:bg-emerald-200 transition-colors text-sm"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useWishlistStore } from "@/stores/wishlist";
import { useNotificationStore } from "@/stores/notifications";
import Modal from "../UI/Modal.vue";
import {
  PlusIcon,
  HeartIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
} from "@heroicons/vue/24/outline";

// Types
interface Collection {
  id: string;
  name: string;
  description: string;
  items: WishlistItem[];
  isPublic: boolean;
  createdAt: string;
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CollectionForm {
  name: string;
  description: string;
  isPublic: boolean;
}

// Stores
const wishlistStore = useWishlistStore();
const notificationStore = useNotificationStore();

// Reactive state
const collections = ref<Collection[]>([]);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showShareModal = ref(false);
const showItemsModal = ref(false);
const editingCollection = ref<Collection | null>(null);
const sharingCollection = ref<Collection | null>(null);
const viewingCollection = ref<Collection | null>(null);

// Form state
const collectionForm = ref<CollectionForm>({
  name: "",
  description: "",
  isPublic: false,
});

// Methods
const loadCollections = async () => {
  try {
    // Mock data - in real app, fetch from API
    collections.value = [
      {
        id: "1",
        name: "Anniversary Collection",
        description: "Special pieces for our upcoming anniversary",
        items: [
          {
            id: "1",
            name: "Diamond Solitaire Ring",
            price: 5899,
            image:
              "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
            category: "Rings",
          },
          {
            id: "2",
            name: "Pearl Necklace",
            price: 2399,
            image:
              "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
            category: "Necklaces",
          },
        ],
        isPublic: true,
        createdAt: "2024-01-15",
      },
      {
        id: "2",
        name: "Emerald Dreams",
        description: "My favorite emerald pieces",
        items: [
          {
            id: "3",
            name: "Emerald Drop Earrings",
            price: 3299,
            image:
              "https://images.unsplash.com/photo-1635767582909-bb9a3aa87e5b?w=400",
            category: "Earrings",
          },
        ],
        isPublic: false,
        createdAt: "2024-02-01",
      },
    ];
  } catch (error) {
    notificationStore.add({
      type: "error",
      message: "Failed to load collections",
    });
  }
};

const submitCollection = async () => {
  try {
    if (editingCollection.value) {
      // Update existing collection
      const index = collections.value.findIndex(
        (c) => c.id === editingCollection.value!.id
      );
      if (index !== -1) {
        collections.value[index] = {
          ...editingCollection.value,
          ...collectionForm.value,
        };
      }
      notificationStore.add({
        type: "success",
        message: "Collection updated successfully",
      });
    } else {
      // Create new collection
      const newCollection: Collection = {
        id: Date.now().toString(),
        ...collectionForm.value,
        items: [],
        createdAt: new Date().toISOString().split("T")[0],
      };
      collections.value.unshift(newCollection);
      notificationStore.add({
        type: "success",
        message: "Collection created successfully",
      });
    }
    closeModals();
  } catch (error) {
    notificationStore.add({
      type: "error",
      message: "Failed to save collection",
    });
  }
};

const editCollection = (collection: Collection) => {
  editingCollection.value = collection;
  collectionForm.value = {
    name: collection.name,
    description: collection.description,
    isPublic: collection.isPublic,
  };
  showEditModal.value = true;
};

const deleteCollection = async (collectionId: string) => {
  if (!confirm("Are you sure you want to delete this collection?")) return;

  try {
    collections.value = collections.value.filter((c) => c.id !== collectionId);
    notificationStore.add({
      type: "success",
      message: "Collection deleted successfully",
    });
  } catch (error) {
    notificationStore.add({
      type: "error",
      message: "Failed to delete collection",
    });
  }
};

const viewCollection = (collection: Collection) => {
  viewingCollection.value = collection;
  showItemsModal.value = true;
};

const shareCollection = (collection: Collection) => {
  sharingCollection.value = collection;
  showShareModal.value = true;
};

const closeModals = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  showShareModal.value = false;
  showItemsModal.value = false;
  editingCollection.value = null;
  sharingCollection.value = null;
  viewingCollection.value = null;
  collectionForm.value = {
    name: "",
    description: "",
    isPublic: false,
  };
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getShareUrl = (collectionId: string) => {
  return `${window.location.origin}/collections/${collectionId}`;
};

const copyShareUrl = async (collectionId: string) => {
  try {
    await navigator.clipboard.writeText(getShareUrl(collectionId));
    notificationStore.add({
      type: "success",
      message: "Share URL copied to clipboard",
    });
  } catch (error) {
    notificationStore.add({
      type: "error",
      message: "Failed to copy URL",
    });
  }
};

const shareVia = (platform: string) => {
  const url = getShareUrl(sharingCollection.value!.id);
  const text = `Check out my ${sharingCollection.value!.name} collection`;

  let shareUrl = "";
  switch (platform) {
    case "facebook":
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      break;
    case "twitter":
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      break;
    case "pinterest":
      shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`;
      break;
  }

  window.open(shareUrl, "_blank", "width=600,height=400");
};

const removeFromCollection = async (collectionId: string, itemId: string) => {
  try {
    const collection = collections.value.find((c) => c.id === collectionId);
    if (collection) {
      collection.items = collection.items.filter((item) => item.id !== itemId);
      notificationStore.add({
        type: "success",
        message: "Item removed from collection",
      });
    }
  } catch (error) {
    notificationStore.add({
      type: "error",
      message: "Failed to remove item",
    });
  }
};

const moveToCart = async (item: WishlistItem) => {
  try {
    // In real app, add to cart via store
    notificationStore.add({
      type: "success",
      message: `${item.name} added to cart`,
    });
  } catch (error) {
    notificationStore.add({
      type: "error",
      message: "Failed to add item to cart",
    });
  }
};

// Lifecycle
onMounted(() => {
  loadCollections();
});
</script>

<style scoped>
.wishlist-collections {
  @apply min-h-screen;
}
</style>
