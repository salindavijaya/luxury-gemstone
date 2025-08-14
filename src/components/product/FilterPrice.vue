<template>
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h4 class="font-medium text-slate-800">Price Range</h4>
        <span class="text-sm text-gray-600">
          ${{ formatPrice(localPriceRange[0]) }} - ${{ formatPrice(localPriceRange[1]) }}
        </span>
      </div>
      
      <!-- Price Range Slider -->
      <div class="relative px-2">
        <div class="relative h-2 bg-gray-200 rounded-full">
          <!-- Track fill -->
          <div
            class="absolute h-2 bg-emerald-600 rounded-full"
            :style="{
              left: `${(localPriceRange[0] / maxPrice) * 100}%`,
              width: `${((localPriceRange[1] - localPriceRange[0]) / maxPrice) * 100}%`
            }"
          ></div>
          
          <!-- Min thumb -->
          <div
            class="absolute w-5 h-5 bg-white border-2 border-emerald-600 rounded-full shadow-md cursor-pointer transform -translate-y-1.5 -translate-x-2.5"
            :style="{ left: `${(localPriceRange[0] / maxPrice) * 100}%` }"
            @mousedown="startDrag('min', $event)"
            @touchstart="startDrag('min', $event)"
            tabindex="0"
            role="slider"
            :aria-valuenow="localPriceRange[0]"
            :aria-valuemin="0"
            :aria-valuemax="maxPrice"
            aria-label="Minimum price"
            @keydown="handleKeydown('min', $event)"
          ></div>
          
          <!-- Max thumb -->
          <div
            class="absolute w-5 h-5 bg-white border-2 border-emerald-600 rounded-full shadow-md cursor-pointer transform -translate-y-1.5 -translate-x-2.5"
            :style="{ left: `${(localPriceRange[1] / maxPrice) * 100}%` }"
            @mousedown="startDrag('max', $event)"
            @touchstart="startDrag('max', $event)"
            tabindex="0"
            role="slider"
            :aria-valuenow="localPriceRange[1]"
            :aria-valuemin="0"
            :aria-valuemax="maxPrice"
            aria-label="Maximum price"
            @keydown="handleKeydown('max', $event)"
          ></div>
        </div>
      </div>
      
      <!-- Price input fields -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Min Price</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
            <input
              type="number"
              v-model.number="minPriceInput"
              @blur="updatePriceFromInput"
              :min="0"
              :max="maxPrice"
              class="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="0"
            />
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Max Price</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
            <input
              type="number"
              v-model.number="maxPriceInput"
              @blur="updatePriceFromInput"
              :min="0"
              :max="maxPrice"
              class="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="100000"
            />
          </div>
        </div>
      </div>
      
      <!-- Quick price ranges -->
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="range in quickRanges"
          :key="`${range.min}-${range.max}`"
          @click="setQuickRange(range.min, range.max)"
          :class="[
            'px-3 py-2 text-xs font-medium rounded-md border transition-colors',
            isQuickRangeActive(range.min, range.max)
              ? 'bg-emerald-50 border-emerald-600 text-emerald-700'
              : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
          ]"
        >
          {{ range.label }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
  import { useFilters } from '@/composables/useFilters'
  
  // Composables
  const { filters, updateFilter } = useFilters()
  
  // Component state
  const localPriceRange = ref([...filters.value.priceRange])
  const minPriceInput = ref(filters.value.priceRange[0])
  const maxPriceInput = ref(filters.value.priceRange[1])
  const isDragging = ref(false)
  const dragType = ref('')
  const sliderRect = ref(null)
  
  // Constants
  const maxPrice = 100000
  const stepSize = 500
  
  // Quick price ranges
  const quickRanges = [
    { label: 'Under $1K', min: 0, max: 1000 },
    { label: '$1K - $5K', min: 1000, max: 5000 },
    { label: '$5K - $10K', min: 5000, max: 10000 },
    { label: '$10K - $25K', min: 10000, max: 25000 },
    { label: '$25K - $50K', min: 25000, max: 50000 },
    { label: '$50K+', min: 50000, max: maxPrice }
  ]
  
  // Watch for external filter changes
  watch(
    () => filters.value.priceRange,
    (newRange) => {
      localPriceRange.value = [...newRange]
      minPriceInput.value = newRange[0]
      maxPriceInput.value = newRange[1]
    },
    { deep: true }
  )
  
  // Watch for local changes and debounce updates
  let debounceTimer
  watch(
    localPriceRange,
    (newRange) => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        updateFilter('priceRange', [...newRange])
      }, 300)
    },
    { deep: true }
  )
  
  // Methods
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`
    }
    return price.toLocaleString()
  }
  
  const startDrag = (type, event) => {
    isDragging.value = true
    dragType.value = type
    
    const slider = event.target.closest('.relative')
    sliderRect.value = slider.getBoundingClientRect()
    
    // Prevent text selection during drag
    event.preventDefault()
    
    // Add event listeners for mouse/touch move and end
    if (event.type === 'mousedown') {
      document.addEventListener('mousemove', handleDrag)
      document.addEventListener('mouseup', stopDrag)
    } else {
      document.addEventListener('touchmove', handleDrag, { passive: false })
      document.addEventListener('touchend', stopDrag)
    }
  }
  
  const handleDrag = (event) => {
    if (!isDragging.value || !sliderRect.value) return
    
    event.preventDefault()
    
    const clientX = event.type === 'mousemove' ? event.clientX : event.touches[0].clientX
    const x = clientX - sliderRect.value.left
    const percentage = Math.max(0, Math.min(1, x / sliderRect.value.width))
    const newValue = Math.round((percentage * maxPrice) / stepSize) * stepSize
    
    if (dragType.value === 'min') {
      localPriceRange.value[0] = Math.min(newValue, localPriceRange.value[1] - stepSize)
      minPriceInput.value = localPriceRange.value[0]
    } else {
      localPriceRange.value[1] = Math.max(newValue, localPriceRange.value[0] + stepSize)
      maxPriceInput.value = localPriceRange.value[1]
    }
  }
  
  const stopDrag = () => {
    isDragging.value = false
    dragType.value = ''
    sliderRect.value = null
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleDrag)
    document.removeEventListener('mouseup', stopDrag)
    document.removeEventListener('touchmove', handleDrag)
    document.removeEventListener('touchend', stopDrag)
  }
  
  const handleKeydown = (type, event) => {
    const step = 1000
    let newValue
    
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault()
        if (type === 'min') {
          newValue = Math.max(0, localPriceRange.value[0] - step)
          localPriceRange.value[0] = newValue
          minPriceInput.value = newValue
        } else {
          newValue = Math.max(localPriceRange.value[0] + step, localPriceRange.value[1] - step)
          localPriceRange.value[1] = newValue
          maxPriceInput.value = newValue
        }
        break
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault()
        if (type === 'min') {
          newValue = Math.min(localPriceRange.value[1] - step, localPriceRange.value[0] + step)
          localPriceRange.value[0] = newValue
          minPriceInput.value = newValue
        } else {
          newValue = Math.min(maxPrice, localPriceRange.value[1] + step)
          localPriceRange.value[1] = newValue
          maxPriceInput.value = newValue
        }
        break
      case 'Home':
        event.preventDefault()
        if (type === 'min') {
          localPriceRange.value[0] = 0
          minPriceInput.value = 0
        } else {
          localPriceRange.value[1] = maxPrice
          maxPriceInput.value = maxPrice
        }
        break
      case 'End':
        event.preventDefault()
        if (type === 'min') {
          localPriceRange.value[0] = localPriceRange.value[1] - step
          minPriceInput.value = localPriceRange.value[0]
        } else {
          localPriceRange.value[1] = localPriceRange.value[0] + step
          maxPriceInput.value = localPriceRange.value[1]
        }
        break
    }
  }
  
  const updatePriceFromInput = () => {
    // Validate and constrain input values
    minPriceInput.value = Math.max(0, Math.min(minPriceInput.value || 0, maxPrice))
    maxPriceInput.value = Math.max(0, Math.min(maxPriceInput.value || maxPrice, maxPrice))
    
    // Ensure min is not greater than max
    if (minPriceInput.value >= maxPriceInput.value) {
      minPriceInput.value = Math.max(0, maxPriceInput.value - stepSize)
    }
    
    localPriceRange.value = [minPriceInput.value, maxPriceInput.value]
  }
  
  const setQuickRange = (min, max) => {
    localPriceRange.value = [min, max]
    minPriceInput.value = min
    maxPriceInput.value = max
  }
  
  const isQuickRangeActive = (min, max) => {
    return localPriceRange.value[0] === min && localPriceRange.value[1] === max
  }
  
  // Cleanup event listeners on unmount
  onUnmounted(() => {
    if (isDragging.value) {
      stopDrag()
    }
  })
  </script>
  
  <style scoped>
  /* Custom focus styles for slider thumbs */
  [role="slider"]:focus {
    outline: 2px solid rgba(16, 185, 129, 0.5);
    outline-offset: 2px;
  }
  
  /* Prevent text selection during drag */
  .no-select {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  
  /* Input number styling */
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  input[type="number"] {
    -moz-appearance: textfield;
  }
  </style>