<template>
    <div class="relative">
      <!-- Sort Button -->
      <button
        @click="toggleDropdown"
        class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:border-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm font-medium text-slate-700"
        :class="{
          'ring-2 ring-emerald-500 border-emerald-500': isOpen
        }"
        :aria-expanded="isOpen"
        aria-haspopup="listbox"
        aria-label="Sort products"
      >
        <!-- Sort Icon -->
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
          />
        </svg>
        
        <!-- Current Sort Label -->
        <span class="hidden sm:inline">Sort by:</span>
        <span class="font-semibold">{{ currentSortOption.label }}</span>
        
        <!-- Dropdown Icon -->
        <svg
          class="w-4 h-4 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
  
      <!-- Dropdown Menu -->
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-2"
        role="listbox"
        :aria-activedescendant="selectedOptionId"
      >
        <!-- Sort Options -->
        <div
          v-for="(option, index) in sortOptions"
          :key="option.value"
          :id="`sort-option-${index}`"
          class="px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
          :class="{
            'bg-emerald-50 text-emerald-700': currentSort === option.value,
            'text-slate-700': currentSort !== option.value
          }"
          @click="selectSort(option.value)"
          role="option"
          :aria-selected="currentSort === option.value"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium">{{ option.label }}</div>
              <div class="text-xs text-slate-500 mt-0.5">{{ option.description }}</div>
            </div>
            
            <!-- Check Icon -->
            <svg
              v-if="currentSort === option.value"
              class="w-4 h-4 text-emerald-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
        </div>
        
        <!-- Divider -->
        <div class="border-t border-slate-100 my-2"></div>
        
        <!-- Additional Options -->
        <div class="px-4 py-2">
          <label class="flex items-center gap-2 text-sm text-slate-600">
            <input
              v-model="showOutOfStock"
              type="checkbox"
              class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              @change="updateShowOutOfStock"
            />
            <span>Show out of stock items</span>
          </label>
        </div>
        
        <div class="px-4 py-2">
          <label class="flex items-center gap-2 text-sm text-slate-600">
            <input
              v-model="showSaleOnly"
              type="checkbox"
              class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              @change="updateShowSaleOnly"
            />
            <span>Show sale items only</span>
          </label>
        </div>
      </div>
  
      <!-- Backdrop -->
      <div
        v-if="isOpen"
        class="fixed inset-0 z-40"
        @click="closeDropdown"
      ></div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
  
  const props = defineProps({
    currentSort: {
      type: String,
      default: 'featured'
    },
    showOutOfStock: {
      type: Boolean,
      default: true
    },
    showSaleOnly: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['sort-change', 'filter-change'])
  
  // Refs
  const isOpen = ref(false)
  const showOutOfStock = ref(props.showOutOfStock)
  const showSaleOnly = ref(props.showSaleOnly)
  
  // Sort options configuration
  const sortOptions = ref([
    {
      value: 'featured',
      label: 'Featured',
      description: 'Our recommended products'
    },
    {
      value: 'newest',
      label: 'Newest First',
      description: 'Recently added products'
    },
    {
      value: 'price-low-high',
      label: 'Price: Low to High',
      description: 'Least to most expensive'
    },
    {
      value: 'price-high-low',
      label: 'Price: High to Low',
      description: 'Most to least expensive'
    },
    {
      value: 'rating',
      label: 'Customer Rating',
      description: 'Highest rated first'
    },
    {
      value: 'popularity',
      label: 'Most Popular',
      description: 'Based on sales and views'
    },
    {
      value: 'carat-high-low',
      label: 'Carat: High to Low',
      description: 'Largest to smallest stones'
    },
    {
      value: 'carat-low-high',
      label: 'Carat: Low to High',
      description: 'Smallest to largest stones'
    },
    {
      value: 'alphabetical',
      label: 'Alphabetical',
      description: 'A to Z by product name'
    }
  ])
  
  // Computed properties
  const currentSortOption = computed(() => {
    return sortOptions.value.find(option => option.value === props.currentSort) || sortOptions.value[0]
  })
  
  const selectedOptionId = computed(() => {
    const index = sortOptions.value.findIndex(option => option.value === props.currentSort)
    return index >= 0 ? `sort-option-${index}` : null
  })
  
  // Watchers
  watch(() => props.showOutOfStock, (newValue) => {
    showOutOfStock.value = newValue
  })
  
  watch(() => props.showSaleOnly, (newValue) => {
    showSaleOnly.value = newValue
  })
  
  // Methods
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value
  }
  
  const closeDropdown = () => {
    isOpen.value = false
  }
  
  const selectSort = (sortValue) => {
    emit('sort-change', sortValue)
    closeDropdown()
  }
  
  const updateShowOutOfStock = () => {
    emit('filter-change', {
      type: 'showOutOfStock',
      value: showOutOfStock.value
    })
  }
  
  const updateShowSaleOnly = () => {
    emit('filter-change', {
      type: 'showSaleOnly',
      value: showSaleOnly.value
    })
  }
  
  // Keyboard navigation
  const handleKeydown = (event) => {
    if (!isOpen.value) return
  
    switch (event.key) {
      case 'Escape':
        closeDropdown()
        break
      case 'ArrowDown':
        event.preventDefault()
        // Focus next option logic can be added here
        break
      case 'ArrowUp':
        event.preventDefault()
        // Focus previous option logic can be added here
        break
    }
  }
  
  // Lifecycle
  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
  </script>
  
  <style scoped>
  /* Ensure smooth transitions */
  .transition-colors {
    transition-property: color, background-color, border-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }
  
  .transition-transform {
    transition-property: transform;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
  }
  
  /* Custom checkbox styling */
  input[type="checkbox"] {
    appearance: none;
    background-color: #fff;
    margin: 0;
    font: inherit;
    color: currentColor;
    width: 1rem;
    height: 1rem;
    border: 1px solid #cbd5e1;
    border-radius: 0.25rem;
    transform: translateY(-0.075em);
    display: grid;
    place-content: center;
  }
  
  input[type="checkbox"]:checked {
    background-color: #059669;
    border-color: #059669;
  }
  
  input[type="checkbox"]:checked::before {
    content: "";
    width: 0.375rem;
    height: 0.375rem;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    transform: scale(1);
    transform-origin: bottom left;
    background-color: white;
  }
  
  input[type="checkbox"]:focus {
    outline: 2px solid #10b981;
    outline-offset: 2px;
  }
  </style>