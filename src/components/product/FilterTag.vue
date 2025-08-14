<template>
    <div
      class="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-sm rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors group"
      :class="{ 'animate-pulse': isRemoving }"
    >
      <span class="font-medium">{{ label }}</span>
      <button
        @click="handleRemove"
        class="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-200 hover:bg-emerald-300 flex items-center justify-center transition-colors group-hover:bg-emerald-300"
        :disabled="isRemoving"
        :aria-label="`Remove filter: ${label}`"
      >
        <svg 
          class="w-3 h-3" 
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
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  // Props
  interface Props {
    label: string
  }
  
  const props = defineProps<Props>()
  
  // Emits
  interface Emits {
    remove: []
  }
  
  const emit = defineEmits<Emits>()
  
  // Local state
  const isRemoving = ref(false)
  
  // Methods
  const handleRemove = async () => {
    if (isRemoving.value) return
    
    isRemoving.value = true
    
    // Small delay for visual feedback
    setTimeout(() => {
      emit('remove')
      isRemoving.value = false
    }, 150)
  }
  </script>
  
  <style scoped>
  /* Smooth removal animation */
  .animate-pulse {
    animation: pulse 0.15s ease-in-out;
  }
  
  @keyframes pulse {
    0% { 
      transform: scale(1); 
    }
    50% { 
      transform: scale(0.95); 
    }
    100% { 
      transform: scale(1); 
    }
  }
  
  /* Hover effects */
  .group:hover .w-4 {
    transform: scale(1.1);
  }
  
  /* Focus styles for accessibility */
  button:focus {
    outline: 2px solid #10b981;
    outline-offset: 1px;
  }
  </style>