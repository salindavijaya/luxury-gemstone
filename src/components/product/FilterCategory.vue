<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h4 class="font-medium text-slate-800">Category</h4>
      <button
        v-if="selectedCategories.length > 0"
        @click="clearCategories"
        class="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
      >
        Clear
      </button>
    </div>

    <!-- Search categories -->
    <div class="relative" v-if="categories.length > 6">
      <input
        type="text"
        v-model="searchTerm"
        placeholder="Search categories..."
        class="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
      />
      <svg
        class="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400"
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

    <!-- Category list -->
    <div class="space-y-2 max-h-64 overflow-y-auto">
      <label
        v-for="category in filteredCategories"
        :key="category.value"
        class="flex items-center cursor-pointer group"
      >
        <input
          type="checkbox"
          :value="category.value"
          v-model="selectedCategories"
          class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 transition-colors"
        />
        <div class="ml-3 flex-1 flex items-center justify-between">
          <div class="flex items-center">
            <span
              class="text-sm text-gray-700 group-hover:text-gray-900 transition-colors"
            >
              {{ category.label }}
            </span>
            <span
              v-if="category.description"
              class="ml-2 text-xs text-gray-500"
              :title="category.description"
            >
              ℹ️
            </span>
          </div>
          <span class="text-xs text-gray-500 ml-2">({{ category.count }})</span>
        </div>
      </label>
    </div>

    <!-- Show more/less toggle -->
    <button
      v-if="categories.length > 6 && !searchTerm"
      @click="showAllCategories = !showAllCategories"
      class="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
    >
      {{ showAllCategories ? "Show Less" : `Show All (${categories.length})` }}
    </button>

    <!-- Selected categories summary -->
    <div
      v-if="selectedCategories.length > 0"
      class="pt-2 border-t border-gray-100"
    >
      <div class="text-xs text-gray-600 mb-2">
        Selected ({{ selectedCategories.length }}):
      </div>
      <div class="flex flex-wrap gap-1">
        <span
          v-for="categoryValue in selectedCategories"
          :key="categoryValue"
          class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-800"
        >
          {{ getCategoryLabel(categoryValue) }}
          <button
            @click="removeCategory(categoryValue)"
            class="ml-1 hover:text-emerald-900 transition-colors"
            :aria-label="`Remove ${getCategoryLabel(categoryValue)} category`"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useFilters } from "@/composables/useFilters";

// Composables
const { filters, updateFilter, toggleArrayFilter } = useFilters();

// Component state
const searchTerm = ref("");
const showAllCategories = ref(false);
const selectedCategories = ref([...filters.value.categories]);

// Category data with descriptions and counts
const categories = [
  {
    value: "rings",
    label: "Rings",
    count: 1245,
    description: "Engagement rings, wedding bands, and fashion rings",
  },
  {
    value: "necklaces",
    label: "Necklaces",
    count: 856,
    description: "Pendants, chains, and statement necklaces",
  },
  {
    value: "earrings",
    label: "Earrings",
    count: 923,
    description: "Studs, hoops, drops, and chandelier earrings",
  },
  {
    value: "bracelets",
    label: "Bracelets",
    count: 478,
    description: "Tennis bracelets, bangles, and charm bracelets",
  },
  {
    value: "brooches",
    label: "Brooches",
    count: 234,
    description: "Vintage and contemporary decorative pins",
  },
  {
    value: "loose-stones",
    label: "Loose Stones",
    count: 2156,
    description: "Certified loose gemstones for custom jewelry",
  },
  {
    value: "cufflinks",
    label: "Cufflinks",
    count: 189,
    description: "Formal and casual cufflinks for men",
  },
  {
    value: "tiaras",
    label: "Tiaras",
    count: 67,
    description: "Bridal and special occasion headpieces",
  },
  {
    value: "watches",
    label: "Watches",
    count: 345,
    description: "Luxury timepieces with gemstone accents",
  },
  {
    value: "sets",
    label: "Jewelry Sets",
    count: 298,
    description: "Matching collections of complementary pieces",
  },
];

// Watch for external filter changes
/*  watch(
    () => filters.value.categories,
    (newCategories) => {
      selectedCategories.value = [...newCategories]
    },
    { deep: true }
  )
  
  // Watch for local changes
  watch(
    selectedCategories,
    (newCategories) => {
      updateFilter('categories', [...newCategories])
    },
    { deep: true }
  ) */

// Computed properties
const filteredCategories = computed(() => {
  let filtered = categories;

  // Apply search filter
  if (searchTerm.value.trim()) {
    const search = searchTerm.value.toLowerCase();
    filtered = filtered.filter(
      (category) =>
        category.label.toLowerCase().includes(search) ||
        category.description?.toLowerCase().includes(search)
    );
  }

  // Apply show more/less logic (only when not searching)
  if (!searchTerm.value.trim() && !showAllCategories.value) {
    filtered = filtered.slice(0, 6);
  }

  return filtered;
});

// Methods
const clearCategories = () => {
  selectedCategories.value = [];
};

const removeCategory = (categoryValue) => {
  const index = selectedCategories.value.indexOf(categoryValue);
  if (index > -1) {
    selectedCategories.value.splice(index, 1);
  }
};

const getCategoryLabel = (categoryValue) => {
  const category = categories.find((c) => c.value === categoryValue);
  return category ? category.label : categoryValue;
};
</script>

<style scoped>
/* Custom scrollbar for category list */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Focus styles for accessibility */
input[type="checkbox"]:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

label:hover input[type="checkbox"] {
  border-color: #10b981;
}

/* Smooth transitions */
.transition-colors {
  transition-property: color, border-color, background-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
