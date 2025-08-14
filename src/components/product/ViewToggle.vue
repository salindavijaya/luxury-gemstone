<template>
    <div 
      class="flex items-center bg-gray-100 rounded-lg p-1"
      role="tablist" 
      aria-label="View options"
    >
      <button
        @click="$emit('change', 'grid')"
        :class="[
          'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
          view === 'grid'
            ? 'bg-white text-slate-800 shadow-sm'
            : 'text-gray-600 hover:text-slate-800 hover:bg-gray-50'
        ]"
        :aria-pressed="view === 'grid'"
        role="tab"
        aria-label="Grid view"
      >
        <svg 
          class="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
        <span class="hidden sm:inline">Grid</span>
      </button>
      
      <button
        @click="$emit('change', 'list')"
        :class="[
          'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
          view === 'list'
            ? 'bg-white text-slate-800 shadow-sm'
            : 'text-gray-600 hover:text-slate-800 hover:bg-gray-50'
        ]"
        :aria-pressed="view === 'list'"
        role="tab"
        aria-label="List view"
      >
        <svg 
          class="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
        <span class="hidden sm:inline">List</span>
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  // Props
  interface Props {
    view: 'grid' | 'list'
  }
  
  const props = defineProps<Props>()
  
  // Emits
  interface Emits {
    change: [view: 'grid' | 'list']
  }
  
  const emit = defineEmits<Emits>()
  </script>