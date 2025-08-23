<template>
  <div class="bg-white rounded-lg shadow-lg p-6 space-y-6">
    <!-- Filter Header -->
    <div
      class="flex items-center justify-between border-b border-gray-200 pb-4"
    >
      <h3 class="text-lg font-semibold text-slate-800">Filters</h3>
      <button
        v-if="hasActiveFilters"
        @click="clearAllFilters"
        class="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
      >
        Clear All
      </button>
    </div>

    <!-- Active Filters Breadcrumbs -->
    <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
      <span
        v-for="filter in activeFilterBreadcrumbs"
        :key="filter.key"
        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
      >
        {{ filter.label }}
        <button
          @click="removeFilter(filter.key, filter.value)"
          class="ml-2 hover:text-emerald-900 transition-colors"
          :aria-label="`Remove ${filter.label} filter`"
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

    <!-- Filter Categories -->
    <div class="space-y-6">
      <!-- Price Range Filter -->
      <FilterPrice />

      <!-- Category Filter -->
      <FilterCategory />

      <!-- Gemstone Type Filter -->
      <FilterGemstoneType />

      <!-- Color Filter -->
      <FilterColor />

      <!-- Clarity Filter -->
      <FilterClarity />

      <!-- Carat Weight Filter -->
      <FilterCarat />

      <!-- Shape/Cut Filter -->
      <div class="space-y-3">
        <h4 class="font-medium text-slate-800">Shape</h4>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="shape in shapes"
            :key="shape.value"
            @click="toggleArrayFilter('shapes', shape.value)"
            :class="[
              'flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200',
              filters.shapes.includes(shape.value)
                ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-700',
            ]"
            :aria-pressed="filters.shapes.includes(shape.value)"
          >
            <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path :d="shape.icon" />
            </svg>
            <span class="text-xs font-medium">{{ shape.label }}</span>
          </button>
        </div>
      </div>

      <!-- Certification Filter -->
      <div class="space-y-3">
        <h4 class="font-medium text-slate-800">Certification</h4>
        <div class="space-y-2">
          <label
            v-for="cert in certifications"
            :key="cert.value"
            class="flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              :value="cert.value"
              v-model="filters.certifications"
              class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <span class="ml-3 text-sm text-gray-700">{{ cert.label }}</span>
            <span class="ml-auto text-xs text-gray-500"
              >({{ cert.count }})</span
            >
          </label>
        </div>
      </div>

      <!-- Origin Filter -->
      <div class="space-y-3">
        <h4 class="font-medium text-slate-800">Origin</h4>
        <div class="space-y-2">
          <label
            v-for="origin in origins"
            :key="origin.value"
            class="flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              :value="origin.value"
              v-model="filters.origins"
              class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <span class="ml-3 text-sm text-gray-700">{{ origin.label }}</span>
            <span class="ml-auto text-xs text-gray-500"
              >({{ origin.count }})</span
            >
          </label>
        </div>
      </div>

      <!-- Stock Status Filter -->
      <div class="space-y-3">
        <h4 class="font-medium text-slate-800">Availability</h4>
        <div class="space-y-2">
          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="filters.inStock"
              class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <span class="ml-3 text-sm text-gray-700">In Stock Only</span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="filters.onSale"
              class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <span class="ml-3 text-sm text-gray-700">On Sale</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Apply Filters Button (Mobile) -->
    <div class="md:hidden pt-4 border-t border-gray-200">
      <button
        @click="applyFilters"
        class="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
      >
        Apply Filters ({{ filteredProductsCount }})
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useFilters } from "@/composables/useFilters";
import { useProducts } from "@/composables/useProducts";
import FilterPrice from "./FilterPrice.vue";
import FilterCategory from "./FilterCategory.vue";
import FilterGemstoneType from "./FilterGemstoneType.vue";
import FilterColor from "./FilterColor.vue";
import FilterClarity from "./FilterClarity.vue";
import FilterCarat from "./FilterCarat.vue";

// Composables
const { filters, clearAllFilters, toggleArrayFilter, removeFilter } =
  useFilters();
const { filteredProducts } = useProducts();

// Filter options data
const shapes = [
  {
    value: "round",
    label: "Round",
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z",
  },
  {
    value: "princess",
    label: "Princess",
    icon: "M3 3h18v18H3z",
  },
  {
    value: "emerald",
    label: "Emerald",
    icon: "M4 4h16v16H4z",
  },
  {
    value: "oval",
    label: "Oval",
    icon: "M12 2C7.58 2 4 5.58 4 10c0 2.21.9 4.21 2.34 5.66C7.79 17.1 9.79 18 12 18s4.21-.9 5.66-2.34C19.1 14.21 20 12.21 20 10c0-4.42-3.58-8-8-8z",
  },
  {
    value: "marquise",
    label: "Marquise",
    icon: "M12 2l6 8-6 12L6 10z",
  },
  {
    value: "pear",
    label: "Pear",
    icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
  },
];

const certifications = [
  { value: "gia", label: "GIA", count: 245 },
  { value: "ags", label: "AGS", count: 156 },
  { value: "ssef", label: "SSEF", count: 89 },
  { value: "grs", label: "GRS", count: 67 },
  { value: "agl", label: "AGL", count: 45 },
];

const origins = [
  { value: "burma", label: "Burma (Myanmar)", count: 78 },
  { value: "kashmir", label: "Kashmir", count: 23 },
  { value: "colombia", label: "Colombia", count: 145 },
  { value: "madagascar", label: "Madagascar", count: 89 },
  { value: "thailand", label: "Thailand", count: 67 },
  { value: "sri-lanka", label: "Sri Lanka", count: 134 },
];

// Computed properties
const hasActiveFilters = computed(() => {
  return (
    filters.value.priceRange[0] > 0 ||
    filters.value.priceRange[1] < 100000 ||
    filters.value.categories.length > 0 ||
    filters.value.gemstoneTypes.length > 0 ||
    filters.value.colors.length > 0 ||
    filters.value.clarities.length > 0 ||
    filters.value.caratRange[0] > 0 ||
    filters.value.caratRange[1] < 10 ||
    filters.value.shapes.length > 0 ||
    filters.value.certifications.length > 0 ||
    filters.value.origins.length > 0 ||
    filters.value.inStock ||
    filters.value.onSale
  );
});

const filteredProductsCount = computed(() => filteredProducts.value.length);

const activeFilterBreadcrumbs = computed(() => {
  const breadcrumbs = [];

  // Price range breadcrumb
  if (filters.value.priceRange[0] > 0 || filters.value.priceRange[1] < 100000) {
    breadcrumbs.push({
      key: "priceRange",
      value: null,
      label: `$${filters.value.priceRange[0].toLocaleString()} - $${filters.value.priceRange[1].toLocaleString()}`,
    });
  }

  // Category breadcrumbs
  filters.value.categories.forEach((category) => {
    breadcrumbs.push({
      key: "categories",
      value: category,
      label: category.charAt(0).toUpperCase() + category.slice(1),
    });
  });

  // Gemstone type breadcrumbs
  filters.value.gemstoneTypes.forEach((type) => {
    breadcrumbs.push({
      key: "gemstoneTypes",
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    });
  });

  // Color breadcrumbs
  filters.value.colors.forEach((color) => {
    breadcrumbs.push({
      key: "colors",
      value: color,
      label: color.charAt(0).toUpperCase() + color.slice(1),
    });
  });

  // Clarity breadcrumbs
  filters.value.clarities.forEach((clarity) => {
    breadcrumbs.push({
      key: "clarities",
      value: clarity,
      label: clarity,
    });
  });

  // Carat range breadcrumb
  if (filters.value.caratRange[0] > 0 || filters.value.caratRange[1] < 10) {
    breadcrumbs.push({
      key: "caratRange",
      value: null,
      label: `${filters.value.caratRange[0]}ct - ${filters.value.caratRange[1]}ct`,
    });
  }

  // Shape breadcrumbs
  filters.value.shapes.forEach((shape) => {
    breadcrumbs.push({
      key: "shapes",
      value: shape,
      label: shape.charAt(0).toUpperCase() + shape.slice(1),
    });
  });

  // Certification breadcrumbs
  filters.value.certifications.forEach((cert) => {
    breadcrumbs.push({
      key: "certifications",
      value: cert,
      label: cert.toUpperCase(),
    });
  });

  // Origin breadcrumbs
  filters.value.origins.forEach((origin) => {
    const originLabel =
      origins.find((o) => o.value === origin)?.label || origin;
    breadcrumbs.push({
      key: "origins",
      value: origin,
      label: originLabel,
    });
  });

  // Stock status breadcrumbs
  if (filters.value.inStock) {
    breadcrumbs.push({
      key: "inStock",
      value: null,
      label: "In Stock",
    });
  }

  if (filters.value.onSale) {
    breadcrumbs.push({
      key: "onSale",
      value: null,
      label: "On Sale",
    });
  }

  return breadcrumbs;
});

// Methods
const applyFilters = () => {
  // Emit event to close mobile filter drawer
  // This would be handled by the parent component
};
</script>

<style scoped>
/* Custom scrollbar for filter content */
.filter-content::-webkit-scrollbar {
  width: 6px;
}

.filter-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.filter-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.filter-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Focus styles for accessibility */
input[type="checkbox"]:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

button:focus {
  outline: 2px solid rgba(16, 185, 129, 0.5);
  outline-offset: 2px;
}
</style>
