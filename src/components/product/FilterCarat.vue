<template>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-slate-900">Carat Weight</h3>
        <button
          v-if="hasActiveRange"
          @click="clearRange"
          class="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Clear
        </button>
      </div>
  
      <!-- Quick Carat Presets -->
      <div class="space-y-3">
        <h4 class="text-xs font-medium text-slate-700 uppercase tracking-wide">
          Popular Ranges
        </h4>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="preset in caratPresets"
            :key="preset.label"
            @click="selectPreset(preset)"
            :class="[
              'p-3 text-left border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500',
              isPresetActive(preset)
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            ]"
          >
            <div class="font-medium text-sm">{{ preset.label }}</div>
            <div class="text-xs text-slate-500 mt-1">{{ preset.min }} - {{ preset.max }} ct</div>
            <div class="text-xs text-slate-400 mt-1">{{ preset.description }}</div>
          </button>
        </div>
      </div>
  
      <!-- Custom Range Slider -->
      <div class="space-y-4">
        <h4 class="text-xs font-medium text-slate-700 uppercase tracking-wide">
          Custom Range
        </h4>
        
        <!-- Range Input Controls -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">
              Min Carat
            </label>
            <input
              v-model.number="localMinCarat"
              type="number"
              :min="absoluteMin"
              :max="localMaxCarat"
              step="0.01"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              @input="updateRange"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">
              Max Carat
            </label>
            <input
              v-model.number="localMaxCarat"
              type="number"
              :min="localMinCarat"
              :max="absoluteMax"
              step="0.01"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              @input="updateRange"
            />
          </div>
        </div>
  
        <!-- Dual Range Slider -->
        <div class="relative px-2">
          <div class="relative h-2 bg-slate-200 rounded-full">
            <!-- Active range track -->
            <div
              class="absolute h-2 bg-emerald-500 rounded-full"
              :style="{
                left: `${minPercentage}%`,
                width: `${maxPercentage - minPercentage}%`
              }"
            ></div>
            
            <!-- Min thumb -->
            <input
              v-model.number="localMinCarat"
              type="range"
              :min="absoluteMin"
              :max="absoluteMax"
              :step="0.01"
              class="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
              @input="updateRange"
            />
            
            <!-- Max thumb -->
            <input
              v-model.number="localMaxCarat"
              type="range"
              :min="absoluteMin"
              :max="absoluteMax"
              :step="0.01"
              class="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
              @input="updateRange"
            />
          </div>
  
          <!-- Range labels -->
          <div class="flex justify-between text-xs text-slate-500 mt-2">
            <span>{{ absoluteMin }} ct</span>
            <span>{{ absoluteMax }} ct</span>
          </div>
        </div>
  
        <!-- Current selection display -->
        <div class="bg-slate-50 rounded-lg p-3">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-slate-700">Selected Range:</span>
            <span class="text-sm text-slate-900 font-medium">
              {{ formatCarat(localMinCarat) }} - {{ formatCarat(localMaxCarat) }} ct
            </span>
          </div>
          <div class="flex items-center justify-between mt-1">
            <span class="text-xs text-slate-500">Estimated Price Impact:</span>
            <span class="text-xs text-slate-600">
              {{ getPriceImpactText() }}
            </span>
          </div>
        </div>
      </div>
  
      <!-- Carat Weight Information -->
      <div class="border-t border-slate-200 pt-4">
        <button
          @click="showInfo = !showInfo"
          class="flex items-center justify-between w-full text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
        >
          <span class="font-medium">Carat Weight Guide</span>
          <svg
            :class="[
              'w-4 h-4 transition-transform duration-200',
              showInfo ? 'rotate-180' : ''
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
  
        <div
          v-if="showInfo"
          class="mt-3 space-y-3 text-xs text-slate-600 bg-slate-50 rounded-lg p-3"
        >
          <div>
            <h5 class="font-medium text-slate-700 mb-2">Understanding Carat Weight:</h5>
            <ul class="space-y-1">
              <li>• 1 carat = 200 milligrams = 0.2 grams</li>
              <li>• Carat weight significantly affects price (exponentially)</li>
              <li>• "Magic sizes" (0.50, 1.00, 2.00 ct) command premium prices</li>
              <li>• Slightly below magic sizes offers better value</li>
            </ul>
          </div>
          <div>
            <h5 class="font-medium text-slate-700 mb-2">Popular Size Categories:</h5>
            <ul class="space-y-1">
              <li>• <strong>Under 0.50 ct:</strong> Delicate, everyday wear</li>
              <li>• <strong>0.50-0.99 ct:</strong> Classic engagement ring size</li>
              <li>• <strong>1.00-1.99 ct:</strong> Statement pieces, luxury range</li>
              <li>• <strong>2.00+ ct:</strong> Exceptional, investment quality</li>
            </ul>
          </div>
        </div>
      </div>
  
      <!-- Size Visualization -->
      <div v-if="showVisualization" class="space-y-3">
        <h4 class="text-xs font-medium text-slate-700 uppercase tracking-wide">
          Size Visualization
        </h4>
        <div class="flex items-center justify-center space-x-4 p-4 bg-slate-50 rounded-lg">
          <div class="text-center">
            <div class="mx-auto mb-2 bg-slate-300 rounded-full flex items-center justify-center"
                 :style="{ 
                   width: `${getVisualizationSize(localMinCarat)}px`, 
                   height: `${getVisualizationSize(localMinCarat)}px` 
                 }">
              <div class="w-full h-full bg-gradient-to-br from-white to-slate-200 rounded-full shadow-inner"></div>
            </div>
            <span class="text-xs text-slate-600">{{ formatCarat(localMinCarat) }} ct</span>
          </div>
          <div class="text-slate-400">to</div>
          <div class="text-center">
            <div class="mx-auto mb-2 bg-slate-300 rounded-full flex items-center justify-center"
                 :style="{ 
                   width: `${getVisualizationSize(localMaxCarat)}px`, 
                   height: `${getVisualizationSize(localMaxCarat)}px` 
                 }">
              <div class="w-full h-full bg-gradient-to-br from-white to-slate-200 rounded-full shadow-inner"></div>
            </div>
            <span class="text-xs text-slate-600">{{ formatCarat(localMaxCarat) }} ct</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  
  interface CaratPreset {
    label: string
    min: number
    max: number
    description: string
  }
  
  interface CaratRange {
    min: number
    max: number
  }
  
  interface Props {
    modelValue?: CaratRange
    showVisualization?: boolean
    absoluteMin?: number
    absoluteMax?: number
  }
  
  interface Emits {
    (e: 'update:modelValue', value: CaratRange): void
    (e: 'change', range: CaratRange): void
  }
  
  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => ({ min: 0.25, max: 5.0 }),
    showVisualization: true,
    absoluteMin: 0.25,
    absoluteMax: 10.0
  })
  
  const emit = defineEmits<Emits>()
  
  // Carat weight presets
  const caratPresets = ref<CaratPreset[]>([
    { label: 'Delicate', min: 0.25, max: 0.49, description: 'Subtle elegance' },
    { label: 'Classic', min: 0.50, max: 0.99, description: 'Traditional choice' },
    { label: 'Statement', min: 1.00, max: 1.99, description: 'Eye-catching' },
    { label: 'Exceptional', min: 2.00, max: 5.00, description: 'Luxury range' },
    { label: 'Rare Finds', min: 0.90, max: 1.10, description: 'Near 1-carat' },
    { label: 'Investment', min: 3.00, max: 10.00, description: 'Premium gems' }
  ])
  
  // Local state
  const localMinCarat = ref(props.modelValue.min)
  const localMaxCarat = ref(props.modelValue.max)
  const showInfo = ref(false)
  
  // Computed properties
  const hasActiveRange = computed(() => {
    return localMinCarat.value !== props.absoluteMin || localMaxCarat.value !== props.absoluteMax
  })
  
  const minPercentage = computed(() => {
    return ((localMinCarat.value - props.absoluteMin) / (props.absoluteMax - props.absoluteMin)) * 100
  })
  
  const maxPercentage = computed(() => {
    return ((localMaxCarat.value - props.absoluteMin) / (props.absoluteMax - props.absoluteMin)) * 100
  })
  
  // Methods
  const formatCarat = (value: number): string => {
    return value.toFixed(2)
  }
  
  const selectPreset = (preset: CaratPreset) => {
    localMinCarat.value = preset.min
    localMaxCarat.value = preset.max
    updateRange()
  }
  
  const isPresetActive = (preset: CaratPreset): boolean => {
    return localMinCarat.value === preset.min && localMaxCarat.value === preset.max
  }
  
  const clearRange = () => {
    localMinCarat.value = props.absoluteMin
    localMaxCarat.value = props.absoluteMax
    updateRange()
  }
  
  const updateRange = () => {
    // Ensure min doesn't exceed max
    if (localMinCarat.value > localMaxCarat.value) {
      localMinCarat.value = localMaxCarat.value
    }
    
    // Ensure values are within absolute bounds
    localMinCarat.value = Math.max(props.absoluteMin, Math.min(props.absoluteMax, localMinCarat.value))
    localMaxCarat.value = Math.max(props.absoluteMin, Math.min(props.absoluteMax, localMaxCarat.value))
    
    const range = { min: localMinCarat.value, max: localMaxCarat.value }
    emit('update:modelValue', range)
    emit('change', range)
  }
  
  const getPriceImpactText = (): string => {
    const avgCarat = (localMinCarat.value + localMaxCarat.value) / 2
    
    if (avgCarat < 0.5) return 'Budget friendly'
    if (avgCarat < 1.0) return 'Moderate premium'
    if (avgCarat < 2.0) return 'Significant premium'
    if (avgCarat < 3.0) return 'High premium'
    return 'Exceptional premium'
  }
  
  const getVisualizationSize = (carat: number): number => {
    // Convert carat to visual size (pixels) with reasonable scaling
    // Base size of 20px for 0.25ct, scaling up to 80px for 5ct
    const minSize = 20
    const maxSize = 80
    const normalizedCarat = Math.min(carat, 5.0) / 5.0
    return minSize + (normalizedCarat * (maxSize - minSize))
  }
  
  // Watch for external changes
  watch(() => props.modelValue, (newValue) => {
    if (newValue) {
      localMinCarat.value = newValue.min
      localMaxCarat.value = newValue.max
    }
  }, { immediate: true, deep: true })
  </script>
  
  <style scoped>
  /* Custom range slider styles */
  .slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    pointer-events: none;
  }
  
  .slider-thumb::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #059669;
    cursor: pointer;
    pointer-events: all;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }
  
  .slider-thumb::-webkit-slider-thumb:hover {
    background: #047857;
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .slider-thumb::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #059669;
    cursor: pointer;
    pointer-events: all;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }
  
  .slider-thumb::-moz-range-thumb:hover {
    background: #047857;
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  /* Focus styles for accessibility */
  .slider-thumb:focus::-webkit-slider-thumb {
    outline: 2px solid #059669;
    outline-offset: 2px;
  }
  
  .slider-thumb:focus::-moz-range-thumb {
    outline: 2px solid #059669;
    outline-offset: 2px;
  }
  
  /* Smooth transitions */
  * {
    transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
  }
  
  /* Custom number input styling */
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  input[type="number"] {
    -moz-appearance: textfield;
  }
  </style>