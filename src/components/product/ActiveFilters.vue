<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div class="flex flex-wrap items-center gap-3">
      <h3 class="text-sm font-medium text-slate-800 flex-shrink-0">
        Active Filters:
      </h3>

      <!-- Filter Tags -->
      <div class="flex flex-wrap gap-2 flex-1">
        <!-- Category Filter -->
        <FilterTag
          v-if="activeFilters.category"
          :label="`Category: ${formatCategoryName(activeFilters.category)}`"
          @remove="removeFilter('category')"
        />

        <!-- Gemstone Type Filter -->
        <FilterTag
          v-if="activeFilters.gemstoneType?.length"
          :label="`Type: ${activeFilters.gemstoneType.join(', ')}`"
          @remove="removeFilter('gemstoneType')"
        />

        <!-- Price Range Filter -->
        <FilterTag
          v-if="
            activeFilters.priceRange &&
            (activeFilters.priceRange.min > 0 ||
              activeFilters.priceRange.max < 100000)
          "
          :label="`Price: $${formatPrice(activeFilters.priceRange.min)} - $${formatPrice(activeFilters.priceRange.max)}`"
          @remove="removeFilter('priceRange')"
        />

        <!-- Carat Weight Filter -->
        <FilterTag
          v-if="
            activeFilters.caratRange &&
            (activeFilters.caratRange.min > 0 ||
              activeFilters.caratRange.max < 10)
          "
          :label="`Carat: ${activeFilters.caratRange.min} - ${activeFilters.caratRange.max} ct`"
          @remove="removeFilter('caratRange')"
        />

        <!-- Color Filter -->
        <FilterTag
          v-if="activeFilters.color?.length"
          :label="`Color: ${activeFilters.color.join(', ')}`"
          @remove="removeFilter('color')"
        />

        <!-- Clarity Filter -->
        <FilterTag
          v-if="activeFilters.clarity?.length"
          :label="`Clarity: ${activeFilters.clarity.join(', ')}`"
          @remove="removeFilter('clarity')"
        />

        <!-- Cut Filter -->
        <FilterTag
          v-if="activeFilters.cut?.length"
          :label="`Cut: ${activeFilters.cut.join(', ')}`"
          @remove="removeFilter('cut')"
        />

        <!-- Certification Filter -->
        <FilterTag
          v-if="activeFilters.certification?.length"
          :label="`Certified: ${activeFilters.certification.join(', ')}`"
          @remove="removeFilter('certification')"
        />

        <!-- Origin Filter -->
        <FilterTag
          v-if="activeFilters.origin?.length"
          :label="`Origin: ${activeFilters.origin.join(', ')}`"
          @remove="removeFilter('origin')"
        />

        <!-- Availability Filter -->
        <FilterTag
          v-if="activeFilters.availability?.length"
          :label="`Stock: ${activeFilters.availability.join(', ')}`"
          @remove="removeFilter('availability')"
        />

        <!-- Search Query -->
        <FilterTag
          v-if="activeFilters.searchQuery"
          :label="`Search: '${activeFilters.searchQuery}'`"
          @remove="removeFilter('searchQuery')"
        />

        <!-- Sort Filter (if not default) -->
        <FilterTag
          v-if="activeFilters.sortBy && activeFilters.sortBy !== 'featured'"
          :label="`Sort: ${formatSortName(activeFilters.sortBy)}`"
          @remove="removeFilter('sortBy')"
        />
      </div>

      <!-- Clear All Button -->
      <button
        @click="clearAllFilters"
        class="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors flex-shrink-0"
        :disabled="isClearing"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          :class="{ 'animate-spin': isClearing }"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        Clear All
      </button>
    </div>

    <!-- Results Count -->
    <div class="mt-3 pt-3 border-t border-gray-100">
      <p class="text-sm text-gray-600">
        Showing {{ resultsCount }}
        {{ resultsCount === 1 ? "result" : "results" }}
        <span v-if="totalCount !== resultsCount" class="text-gray-500">
          of {{ totalCount.toLocaleString() }} total
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useFilters } from "@/features/products/composables";
import FilterTag from "./FilterTag.vue";

// Props
interface Props {
  resultsCount?: number;
  totalCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  resultsCount: 0,
  totalCount: 0,
});

// Composables
const { filters: activeFilters, removeFilter, clearAllFilters } = useFilters();

// Local state
const isClearing = ref(false);

// Methods
const formatCategoryName = (category: string): string => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const formatPrice = (price: number): string => {
  if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}k`;
  }
  return price.toLocaleString();
};

const formatSortName = (sortBy: string): string => {
  const sortNames: Record<string, string> = {
    "price-asc": "Price: Low to High",
    "price-desc": "Price: High to Low",
    "name-asc": "Name: A to Z",
    "name-desc": "Name: Z to A",
    "rating-desc": "Highest Rated",
    newest: "Newest First",
    "carat-asc": "Carat: Low to High",
    "carat-desc": "Carat: High to Low",
    featured: "Featured",
  };
  return sortNames[sortBy] || sortBy;
};

// Enhanced clear all with loading state
const handleClearAll = async () => {
  isClearing.value = true;
  try {
    await clearAllFilters();
    // Small delay for better UX
    setTimeout(() => {
      isClearing.value = false;
    }, 300);
  } catch (error) {
    console.error("Error clearing filters:", error);
    isClearing.value = false;
  }
};
</script>

<style scoped>
/* Smooth transitions for filter tags */
.filter-tag-enter-active,
.filter-tag-leave-active {
  transition: all 0.3s ease;
}

.filter-tag-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.filter-tag-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* Responsive text wrapping */
@media (max-width: 640px) {
  .flex-wrap {
    gap: 0.5rem;
  }
}
</style>
