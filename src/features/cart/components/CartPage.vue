<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <router-link
              to="/"
              class="text-emerald-600 hover:text-emerald-700 transition-colors"
              aria-label="Return to homepage"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </router-link>
            <h1 class="ml-4 text-2xl font-bold text-slate-800">
              Shopping Cart
            </h1>
          </div>
          <div class="text-sm text-slate-600">
            {{ cartStore.itemCount }}
            {{ cartStore.itemCount === 1 ? "item" : "items" }}
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"
        ></div>
      </div>

      <!-- Empty Cart -->
      <CartEmpty v-else-if="cartStore.items.length === 0" />

      <!-- Cart Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Recently Removed Items -->
          <div
            v-if="cartStore.recentlyRemoved.length > 0"
            class="bg-amber-50 border border-amber-200 rounded-lg p-4"
          >
            <h3 class="text-sm font-medium text-amber-800 mb-2">
              Recently Removed
            </h3>
            <div class="space-y-2">
              <div
                v-for="item in cartStore.recentlyRemoved"
                :key="item.id"
                class="flex items-center justify-between text-sm"
              >
                <span class="text-amber-700">{{ item.name }}</span>
                <button
                  @click="restoreItem(item)"
                  class="text-emerald-600 hover:text-emerald-700 font-medium"
                  :disabled="restoringItems.includes(item.id)"
                >
                  <span v-if="restoringItems.includes(item.id)"
                    >Restoring...</span
                  >
                  <span v-else>Restore</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Save for Later Items -->
          <div
            v-if="cartStore.savedItems.length > 0"
            class="bg-slate-50 border border-slate-200 rounded-lg p-4"
          >
            <h3 class="text-lg font-medium text-slate-800 mb-4">
              Saved for Later
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="item in cartStore.savedItems"
                :key="item.id"
                class="flex items-center space-x-3 p-3 bg-white rounded-lg border"
              >
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="w-12 h-12 object-cover rounded-md"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-800 truncate">
                    {{ item.name }}
                  </p>
                  <p class="text-sm text-slate-500">
                    ${{ item.price.toLocaleString() }}
                  </p>
                </div>
                <button
                  @click="moveToCart(item)"
                  class="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  :disabled="movingItems.includes(item.id)"
                >
                  {{
                    movingItems.includes(item.id) ? "Moving..." : "Move to Cart"
                  }}
                </button>
              </div>
            </div>
          </div>

          <!-- Active Cart Items -->
          <div class="bg-white rounded-lg shadow-lg border">
            <div class="p-6">
              <h2 class="text-lg font-semibold text-slate-800 mb-4">
                Cart Items
              </h2>
              <div class="space-y-4">
                <CartItem
                  v-for="item in cartStore.items"
                  :key="item.id"
                  :item="item"
                  :loading="updatingItems.includes(item.id)"
                  @update-quantity="updateQuantity"
                  @remove="removeItem"
                  @save-for-later="saveForLater"
                />
              </div>
            </div>

            <!-- Bulk Actions -->
            <div class="border-t border-slate-200 p-4 bg-slate-50 rounded-b-lg">
              <div class="flex flex-wrap gap-3">
                <button
                  @click="clearCart"
                  :disabled="isClearing"
                  class="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  {{ isClearing ? "Clearing..." : "Clear Cart" }}
                </button>
                <button
                  @click="saveAllForLater"
                  :disabled="isSavingAll"
                  class="text-sm text-slate-600 hover:text-slate-700 disabled:opacity-50"
                >
                  {{ isSavingAll ? "Saving..." : "Save All for Later" }}
                </button>
              </div>
            </div>
          </div>

          <!-- Recommendations -->
          <div
            v-if="recommendations.length > 0"
            class="bg-white rounded-lg shadow-lg border p-6"
          >
            <h3 class="text-lg font-semibold text-slate-800 mb-4">
              You Might Also Like
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                v-for="product in recommendations"
                :key="product.id"
                class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="w-12 h-12 object-cover rounded-md"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-800 truncate">
                    {{ product.name }}
                  </p>
                  <p class="text-sm text-slate-500">
                    ${{ product.price.toLocaleString() }}
                  </p>
                </div>
                <button
                  @click="addRecommendation(product)"
                  class="text-xs bg-emerald-600 text-white px-3 py-1 rounded-md hover:bg-emerald-700 transition-colors"
                  :disabled="addingRecommendations.includes(product.id)"
                >
                  {{
                    addingRecommendations.includes(product.id)
                      ? "Adding..."
                      : "Add"
                  }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="sticky top-6">
            <CartSummary />

            <!-- Checkout Button -->
            <div class="mt-6">
              <router-link
                to="/checkout"
                class="w-full bg-emerald-600 text-white px-6 py-4 rounded-lg font-semibold text-center block hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Proceed to Checkout
              </router-link>
            </div>

            <!-- Trust Badges -->
            <div class="mt-6 p-4 bg-slate-50 rounded-lg">
              <div class="text-xs text-slate-600 space-y-2">
                <div class="flex items-center space-x-2">
                  <svg
                    class="w-4 h-4 text-emerald-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    />
                  </svg>
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg
                    class="w-4 h-4 text-emerald-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    />
                  </svg>
                  <span>30-day return guarantee</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg
                    class="w-4 h-4 text-emerald-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Certified authentic gemstones</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useCartStore } from "@/features/cart/store";
import CartItem from "./CartItem.vue";
import CartEmpty from "./CartEmpty.vue";
import CartSummary from "./CartSummary.vue";

// Store and reactive state
const cartStore = useCartStore();
const isLoading = ref(true);
const updatingItems = ref<string[]>([]);
const restoringItems = ref<string[]>([]);
const movingItems = ref<string[]>([]);
const addingRecommendations = ref<string[]>([]);
const isClearing = ref(false);
const isSavingAll = ref(false);

// Mock recommendations data
const recommendations = ref([
  {
    id: "rec1",
    name: "Emerald Earrings",
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop",
  },
  {
    id: "rec2",
    name: "Diamond Tennis Bracelet",
    price: 4500,
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
  },
]);

// Initialize cart data
onMounted(async () => {
  try {
    await cartStore.loadCart();
    // Simulate loading delay for better UX
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  } catch (error) {
    console.error("Failed to load cart:", error);
    isLoading.value = false;
  }
});

/**
 * Update item quantity with loading state
 */
const updateQuantity = async (itemId: string, quantity: number) => {
  updatingItems.value.push(itemId);
  try {
    await cartStore.updateQuantity(itemId, quantity);
  } catch (error) {
    console.error("Failed to update quantity:", error);
  } finally {
    updatingItems.value = updatingItems.value.filter((id) => id !== itemId);
  }
};

/**
 * Remove item with loading state
 */
const removeItem = async (itemId: string) => {
  updatingItems.value.push(itemId);
  try {
    await cartStore.removeItem(itemId);
  } catch (error) {
    console.error("Failed to remove item:", error);
  } finally {
    updatingItems.value = updatingItems.value.filter((id) => id !== itemId);
  }
};

/**
 * Save item for later with loading state
 */
const saveForLater = async (itemId: string) => {
  updatingItems.value.push(itemId);
  try {
    await cartStore.saveForLater(itemId);
  } catch (error) {
    console.error("Failed to save for later:", error);
  } finally {
    updatingItems.value = updatingItems.value.filter((id) => id !== itemId);
  }
};

/**
 * Restore recently removed item
 */
const restoreItem = async (item: any) => {
  restoringItems.value.push(item.id);
  try {
    await cartStore.restoreItem(item.id);
  } catch (error) {
    console.error("Failed to restore item:", error);
  } finally {
    restoringItems.value = restoringItems.value.filter((id) => id !== item.id);
  }
};

/**
 * Move saved item back to cart
 */
const moveToCart = async (item: any) => {
  movingItems.value.push(item.id);
  try {
    await cartStore.moveToCart(item.id);
  } catch (error) {
    console.error("Failed to move to cart:", error);
  } finally {
    movingItems.value = movingItems.value.filter((id) => id !== item.id);
  }
};

/**
 * Add recommendation to cart
 */
const addRecommendation = async (product: any) => {
  addingRecommendations.value.push(product.id);
  try {
    await cartStore.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      gemstone: "Various",
      certification: "GIA",
      insurance: false,
    } as any);
  } catch (error) {
    console.error("Failed to add recommendation:", error);
  } finally {
    addingRecommendations.value = addingRecommendations.value.filter(
      (id) => id !== product.id
    );
  }
};

/**
 * Clear entire cart
 */
const clearCart = async () => {
  if (!confirm("Are you sure you want to clear your cart?")) return;

  isClearing.value = true;
  try {
    await cartStore.clearCart();
  } catch (error) {
    console.error("Failed to clear cart:", error);
  } finally {
    isClearing.value = false;
  }
};

/**
 * Save all items for later
 */
const saveAllForLater = async () => {
  if (!confirm("Save all items for later?")) return;

  isSavingAll.value = true;
  try {
    await cartStore.saveAllForLater();
  } catch (error) {
    console.error("Failed to save all for later:", error);
  } finally {
    isSavingAll.value = false;
  }
};
</script>

<style scoped>
/* Custom animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

/* Smooth transitions for interactive elements */
.transition-all {
  transition: all 0.2s ease;
}

/* Focus styles for accessibility */
button:focus,
a:focus {
  outline: 2px solid #059669;
  outline-offset: 2px;
}

/* Loading spinner */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
