<template>
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h4 class="font-medium text-slate-800">Gemstone Type</h4>
        <button
          v-if="selectedGemstoneTypes.length > 0"
          @click="clearGemstoneTypes"
          class="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
        >
          Clear
        </button>
      </div>
      
      <!-- Search gemstone types -->
      <div class="relative" v-if="gemstoneTypes.length > 8">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Search gemstones..."
          class="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
        />
        <svg class="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <!-- Popular gemstones (grid view) -->
      <div v-if="!searchTerm" class="space-y-3">
        <h5 class="text-sm font-medium text-gray-700">Popular</h5>
        <div class="grid grid-cols-2 gap-2">
          <label
            v-for="gemstone in popularGemstones"
            :key="gemstone.value"
            class="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md"
            :class="[
              selectedGemstoneTypes.includes(gemstone.value)
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <input
              type="checkbox"
              :value="gemstone.value"
              v-model="selectedGemstoneTypes"
              class="sr-only"
            />
            <div class="flex items-center flex-1">
              <div 
                class="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                :style="{ backgroundColor: gemstone.color }"
              ></div>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-gray-900 truncate">
                  {{ gemstone.label }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ gemstone.count }} items
                </div>
              </div>
            </div>
            <div
              v-if="selectedGemstoneTypes.includes(gemstone.value)"
              class="ml-2 text-emerald-600"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </label>
        </div>
      </div>
      
      <!-- All gemstones list -->
      <div class="space-y-2">
        <div v-if="!searchTerm" class="flex items-center justify-between">
          <h5 class="text-sm font-medium text-gray-700">All Gemstones</h5>
          <button
            @click="showAll = !showAll"
            class="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            {{ showAll ? 'Show Less' : `Show All (${allGemstones.length})` }}
          </button>
        </div>
        
        <div class="space-y-1 max-h-48 overflow-y-auto">
          <label
            v-for="gemstone in displayedGemstones"
            :key="gemstone.value"
            class="flex items-center cursor-pointer group py-1 px-2 rounded hover:bg-gray-50 transition-colors"
          >
            <input
              type="checkbox"
              :value="gemstone.value"
              v-model="selectedGemstoneTypes"
              class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <div class="ml-3 flex-1 flex items-center justify-between">
              <div class="flex items-center">
                <div 
                  class="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                  :style="{ backgroundColor: gemstone.color }"
                ></div>
                <span class="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  {{ gemstone.label }}
                </span>
                <span 
                  v-if="gemstone.rarity"
                  class="ml-2 px-1.5 py-0.5 text-xs font-medium rounded"
                  :class="getRarityClass(gemstone.rarity)"
                >
                  {{ gemstone.rarity }}
                </span>
              </div>
              <span class="text-xs text-gray-500 ml-2">({{ gemstone.count }})</span>
            </div>
          </label>
        </div>
      </div>
      
      <!-- Selected gemstones summary -->
      <div v-if="selectedGemstoneTypes.length > 0" class="pt-2 border-t border-gray-100">
        <div class="text-xs text-gray-600 mb-2">
          Selected ({{ selectedGemstoneTypes.length }}):
        </div>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="gemstoneValue in selectedGemstoneTypes"
            :key="gemstoneValue"
            class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-800"
          >
            <div 
              class="w-2 h-2 rounded-full mr-1.5"
              :style="{ backgroundColor: getGemstoneColor(gemstoneValue) }"
            ></div>
            {{ getGemstoneLabel(gemstoneValue) }}
            <button
              @click="removeGemstoneType(gemstoneValue)"
              class="ml-1 hover:text-emerald-900 transition-colors"
              :aria-label="`Remove ${getGemstoneLabel(gemstoneValue)} filter`"
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
  import { ref, computed, watch } from 'vue'
  import { useFilters } from '@/composables/useFilters'
  
  // Composables
  const { filters, updateFilter } = useFilters()
  
  // Component state
  const searchTerm = ref('')
  const showAll = ref(false)
  const selectedGemstoneTypes = ref([...filters.value.gemstoneTypes])
  
  // Gemstone data with colors, rarity, and counts
  const gemstoneTypes = [
    // Popular/Precious
    { value: 'diamond', label: 'Diamond', color: '#E8E8E8', count: 1245, rarity: 'Precious' },
    { value: 'ruby', label: 'Ruby', color: '#E0115F', count: 456, rarity: 'Precious' },
    { value: 'sapphire', label: 'Sapphire', color: '#0F52BA', count: 523, rarity: 'Precious' },
    { value: 'emerald', label: 'Emerald', color: '#50C878', count: 389, rarity: 'Precious' },
    
    // Semi-precious popular
    { value: 'amethyst', label: 'Amethyst', color: '#9966CC', count: 234, rarity: 'Semi-precious' },
    { value: 'aquamarine', label: 'Aquamarine', color: '#7FFFD4', count: 187, rarity: 'Semi-precious' },
    { value: 'citrine', label: 'Citrine', color: '#E4D00A', count: 156, rarity: 'Semi-precious' },
    { value: 'garnet', label: 'Garnet', color: '#722F37', count: 198, rarity: 'Semi-precious' },
    { value: 'opal', label: 'Opal', color: '#A8C3BC', count: 143, rarity: 'Semi-precious' },
    { value: 'peridot', label: 'Peridot', color: '#E6E200', count: 89, rarity: 'Semi-precious' },
    { value: 'tanzanite', label: 'Tanzanite', color: '#4B0082', count: 67, rarity: 'Rare' },
    { value: 'topaz', label: 'Topaz', color: '#FFC87C', count: 145, rarity: 'Semi-precious' },
    { value: 'turquoise', label: 'Turquoise', color: '#40E0D0', count: 112, rarity: 'Semi-precious' },
    
    // Rarer gemstones
    { value: 'alexandrite', label: 'Alexandrite', color: '#4B0082', count: 23, rarity: 'Very Rare' },
    { value: 'bixbite', label: 'Bixbite', color: '#FF69B4', count: 8, rarity: 'Extremely Rare' },
    { value: 'jade', label: 'Jade', color: '#00A86B', count: 78, rarity: 'Semi-precious' },
    { value: 'jadeite', label: 'Jadeite', color: '#00A86B', count: 12, rarity: 'Very Rare' },
    { value: 'jeremejevite', label: 'Jeremejevite', color: '#B0E0E6', count: 5, rarity: 'Extremely Rare' },
    { value: 'kunzite', label: 'Kunzite', color: '#FFB6C1', count: 34, rarity: 'Rare' },
    { value: 'lapis-lazuli', label: 'Lapis Lazuli', color: '#191970', count: 87, rarity: 'Semi-precious' },
    { value: 'morganite', label: 'Morganite', color: '#FFB6C1', count: 45, rarity: 'Semi-precious' },
    { value: 'painite', label: 'Painite', color: '#8B0000', count: 2, rarity: 'Extremely Rare' },
    { value: 'paraiba-tourmaline', label: 'Paraiba Tourmaline', color: '#00CED1', count: 15, rarity: 'Very Rare' },
    { value: 'pearl', label: 'Pearl', color: '#F0EAD6', count: 234, rarity: 'Organic' },
    { value: 'spinel', label: 'Spinel', color: '#FF1493', count: 56, rarity: 'Semi-precious' },
    { value: 'tsavorite', label: 'Tsavorite', color: '#50C878', count: 28, rarity: 'Rare' }
  ]
  
  // Popular gemstones (most common/requested)
  const popularGemstones = computed(() => 
    gemstoneTypes.filter(g => ['diamond', 'ruby', 'sapphire', 'emerald', 'amethyst', 'aquamarine'].includes(g.value))
  )
  
  // All other gemstones
  const allGemstones = computed(() => 
    gemstoneTypes.filter(g => !popularGemstones.value.some(p => p.value === g.value))
  )
  
  // Watch for external filter changes
  watch(
    () => filters.value.gemstoneTypes,
    (newTypes) => {
      selectedGemstoneTypes.value = [...newTypes]
    },
    { deep: true }
  )
  
  // Watch for local changes
  watch(
    selectedGemstoneTypes,
    (newTypes) => {
      updateFilter('gemstoneTypes', [...newTypes])
    },
    { deep: true }
  )
  
  // Computed properties
  const displayedGemstones = computed(() => {
    let gemstones = allGemstones.value
  
    // Apply search filter
    if (searchTerm.value.trim()) {
      const search = searchTerm.value.toLowerCase()
      gemstones = gemstoneTypes.filter(gemstone =>
        gemstone.label.toLowerCase().includes(search) ||
        gemstone.rarity?.toLowerCase().includes(search)
      )
    } else if (!showAll.value) {
      // Show limited items when not searching and not showing all
      gemstones = gemstones.slice(0, 8)
    }
  
    return gemstones.sort((a, b) => {
      // Sort by count (popularity) when searching
      if (searchTerm.value.trim()) {
        return b.count - a.count
      }
      // Default alphabetical sort
      return a.label.localeCompare(b.label)
    })
  })
  
  // Methods
  const clearGemstoneTypes = () => {
    selectedGemstoneTypes.value = []
  }
  
  const removeGemstoneType = (gemstoneValue) => {
    const index = selectedGemstoneTypes.value.indexOf(gemstoneValue)
    if (index > -1) {
      selectedGemstoneTypes.value.splice(index, 1)
    }
  }
  
  const getGemstoneLabel = (gemstoneValue) => {
    const gemstone = gemstoneTypes.find(g => g.value === gemstoneValue)
    return gemstone ? gemstone.label : gemstoneValue
  }
  
  const getGemstoneColor = (gemstoneValue) => {
    const gemstone = gemstoneTypes.find(g => g.value === gemstoneValue)
    return gemstone ? gemstone.color : '#9CA3AF'
  }
  
  const getRarityClass = (rarity) => {
    switch (rarity) {
      case 'Precious':
        return 'bg-yellow-100 text-yellow-800'
      case 'Very Rare':
        return 'bg-purple-100 text-purple-800'
      case 'Extremely Rare':
        return 'bg-red-100 text-red-800'
      case 'Rare':
        return 'bg-blue-100 text-blue-800'
      case 'Organic':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  </script>
  
  <style scoped>
  /* Custom scrollbar */
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
  
  /* Focus styles */
  input[type="checkbox"]:focus {
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  /* Hover effects */
  .group:hover input[type="checkbox"] {
    border-color: #10b981;
  }
  
  /* Smooth transitions */
  .transition-colors {
    transition-property: color, border-color, background-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }
  
  .transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
  }
  </style>