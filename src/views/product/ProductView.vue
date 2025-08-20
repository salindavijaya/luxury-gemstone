<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div
          class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 class="text-3xl font-bold text-slate-800">Luxury Gemstones</h1>
            <p class="text-gray-600 mt-1">
              {{ totalProducts }} premium gemstones available
            </p>
          </div>

          <!-- Mobile Filter Toggle -->
          <button
            @click="toggleMobileFilters"
            class="lg:hidden flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Mobile Filter Overlay -->
        <div
          v-if="showMobileFilters"
          class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          @click="closeMobileFilters"
        />

        <!-- Filter Sidebar -->
        <div
          :class="[
            'lg:w-80 lg:flex-shrink-0',
            'fixed inset-y-0 left-0 w-80 bg-white z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-auto',
            showMobileFilters
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0',
          ]"
        >
          <div class="h-full flex flex-col">
            <!-- Mobile Filter Header -->
            <div
              class="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden"
            >
              <h2 class="text-lg font-semibold text-slate-800">Filters</h2>
              <button
                @click="closeMobileFilters"
                class="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Filters Content -->
            <div class="flex-1 overflow-y-auto p-4 lg:p-0">
              <ProductFilters />
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 min-w-0">
          <!-- Search and Sort Bar -->
          <div
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
          >
            <div
              class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
            >
              <div class="flex-1 w-full sm:max-w-md">
                <ProductSearch />
              </div>
              <div class="flex items-center gap-4 w-full sm:w-auto">
                <ProductSort />
                <ViewToggle :view="currentView" @change="setView" />
              </div>
            </div>
          </div>

          <!-- Active Filters -->
          <ActiveFilters v-if="hasActiveFilters" class="mb-6" />

          <!-- Loading State -->
          <div v-if="isLoading" class="space-y-6">
            <ProductGridSkeleton />
          </div>

          <!-- Error State -->
          <div
            v-else-if="error"
            class="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
          >
            <div class="text-red-600 mb-2">
              <svg
                class="w-12 h-12 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-red-900 mb-2">
              Error Loading Products
            </h3>
            <p class="text-red-700 mb-4">{{ error }}</p>
            <button
              @click="refetchProducts"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="!hasProducts"
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
          >
            <div class="text-gray-400 mb-4">
              <svg
                class="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-800 mb-2">
              No Products Found
            </h3>
            <p class="text-gray-600 mb-6">
              Try adjusting your filters or search criteria to find more
              products.
            </p>
            <button
              @click="clearAllFilters"
              class="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>

          <!-- Products Display -->
          <div v-else>
            <ProductGrid v-if="currentView === 'grid'" />
            <ProductList v-else />
          </div>

          <!-- Pagination -->
          <Pagination
            v-if="hasProducts && totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            :total-items="totalProducts"
            @page-change="handlePageChange"
            class="mt-8"
          />
        </div>
      </div>
    </div>

    <!-- Recently Viewed Products -->
    <RecentlyViewed v-if="hasRecentlyViewed" class="mt-16" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useProducts, useFilters } from "@/features/products/composables";
import ProductFilters from "@/components/product/ProductFilters.vue";
import ProductSearch from "@/components/product/ProductSearch.vue";
import ProductSort from "@/components/product/ProductSort.vue";
import ProductGrid from "@/components/product/ProductGrid.vue";
import ProductList from "@/components/product/ProductList.vue";
import ViewToggle from "@/components/product/ViewToggle.vue";
import ActiveFilters from "@/components/product/ActiveFilters.vue";
import ProductGridSkeleton from "@/components/product/ProductGridSkeleton.vue";
import Pagination from "@/components/product/Pagination.vue";
import RecentlyViewed from "@/components/product/RecentlyViewed.vue";

// Composables
const router = useRouter();
const route = useRoute();
const {
  products,
  loading: isLoading,
  error,
  totalProducts,
  currentPage,
  totalPages,
  fetchProducts,
  setPage,
} = useProducts();
const { filters, hasActiveFilters, clearAllFilters } = useFilters();

// Local state
const showMobileFilters = ref(false);
const currentView = ref<"grid" | "list">("grid");

// Computed properties
const hasProducts = computed(() => products.value.length > 0);
const hasRecentlyViewed = computed(() => {
  // This would check for recently viewed products from localStorage or store
  return false; // Placeholder
});

// Methods
const toggleMobileFilters = () => {
  showMobileFilters.value = !showMobileFilters.value;
};

const closeMobileFilters = () => {
  showMobileFilters.value = false;
};

const setView = (view: "grid" | "list") => {
  currentView.value = view;
  // Persist view preference
  localStorage.setItem("productView", view);
};

const handlePageChange = (page: number) => {
  setPage(page);
  // Scroll to top when page changes
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const refetchProducts = () => {
  fetchProducts();
};

// Load saved view preference
onMounted(() => {
  const savedView = localStorage.getItem("productView") as "grid" | "list";
  if (savedView) {
    currentView.value = savedView;
  }

  // Load products based on route parameters
  fetchProducts();
});

// Watch for filter changes
watch(
  () => filters.value,
  () => {
    // Reset to first page when filters change
    setPage(1);
    fetchProducts();
  },
  { deep: true }
);

// Watch for route changes
watch(
  () => route.query,
  () => {
    fetchProducts();
  }
);

// Close mobile filters when screen size changes
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    showMobileFilters.value = false;
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
/* Custom scrollbar for filter sidebar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded-full;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full hover:bg-gray-400;
}

/* Ensure proper mobile filter transition */
@media (max-width: 1023px) {
  .transform {
    will-change: transform;
  }
}
</style>
