<template>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-slate-900">Color</h3>
        <button
          v-if="selectedColors.length > 0"
          @click="clearColors"
          class="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Clear
        </button>
      </div>
  
      <!-- Color Swatches -->
      <div class="grid grid-cols-6 gap-2">
        <button
          v-for="color in colorOptions"
          :key="color.value"
          @click="toggleColor(color.value)"
          :class="[
            'relative w-8 h-8 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
            selectedColors.includes(color.value)
              ? 'border-slate-900 ring-2 ring-slate-900 ring-offset-2'
              : 'border-slate-300 hover:border-slate-400'
          ]"
          :style="{ backgroundColor: color.hex }"
          :title="color.label"
          :aria-label="`Filter by ${color.label} color`"
          :aria-pressed="selectedColors.includes(color.value)"
        >
          <!-- Checkmark for selected colors -->
          <div
            v-if="selectedColors.includes(color.value)"
            class="absolute inset-0 flex items-center justify-center"
          >
            <svg
              class="w-4 h-4 text-white drop-shadow-sm"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </button>
      </div>
  
      <!-- Color Grade Options (for diamonds) -->
      <div v-if="showGradeOptions" class="space-y-3">
        <h4 class="text-xs font-medium text-slate-700 uppercase tracking-wide">
          Diamond Color Grade
        </h4>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="grade in colorGrades"
            :key="grade"
            @click="toggleColorGrade(grade)"
            :class="[
              'px-3 py-1.5 text-xs font-medium rounded-md border transition-colors duration-200',
              selectedColorGrades.includes(grade)
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            ]"
            :aria-pressed="selectedColorGrades.includes(grade)"
          >
            {{ grade }}
          </button>
        </div>
      </div>
  
      <!-- Fancy Color Options (for colored diamonds) -->
      <div v-if="showFancyColors" class="space-y-3">
        <h4 class="text-xs font-medium text-slate-700 uppercase tracking-wide">
          Fancy Colors
        </h4>
        <div class="space-y-2">
          <label
            v-for="fancyColor in fancyColorOptions"
            :key="fancyColor.value"
            class="flex items-center space-x-3 cursor-pointer group"
          >
            <div class="relative">
              <input
                type="checkbox"
                :value="fancyColor.value"
                v-model="selectedFancyColors"
                class="sr-only"
                @change="updateFancyColors"
              />
              <div
                :class="[
                  'w-4 h-4 rounded border-2 transition-colors duration-200',
                  selectedFancyColors.includes(fancyColor.value)
                    ? 'bg-emerald-600 border-emerald-600'
                    : 'border-slate-300 group-hover:border-slate-400'
                ]"
              >
                <svg
                  v-if="selectedFancyColors.includes(fancyColor.value)"
                  class="w-3 h-3 text-white absolute top-0.5 left-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <span class="text-sm text-slate-700 group-hover:text-slate-900">
              {{ fancyColor.label }}
            </span>
            <span
              v-if="fancyColor.count"
              class="text-xs text-slate-500 ml-auto"
            >
              ({{ fancyColor.count }})
            </span>
          </label>
        </div>
      </div>
  
      <!-- Selected Colors Summary -->
      <div v-if="totalSelectedColors > 0" class="pt-2 border-t border-slate-200">
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-600">
            {{ totalSelectedColors }} color{{ totalSelectedColors === 1 ? '' : 's' }} selected
          </span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  
  interface ColorOption {
    value: string
    label: string
    hex: string
  }
  
  interface FancyColorOption {
    value: string
    label: string
    count?: number
  }
  
  interface Props {
    modelValue?: string[]
    showGradeOptions?: boolean
    showFancyColors?: boolean
    gemstoneType?: string
  }
  
  interface Emits {
    (e: 'update:modelValue', value: string[]): void
    (e: 'change', filters: { colors: string[], colorGrades: string[], fancyColors: string[] }): void
  }
  
  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    showGradeOptions: false,
    showFancyColors: false,
    gemstoneType: 'diamond'
  })
  
  const emit = defineEmits<Emits>()
  
  // Color options for different gemstone types
  const colorOptions = ref<ColorOption[]>([
    { value: 'colorless', label: 'Colorless', hex: '#FFFFFF' },
    { value: 'yellow', label: 'Yellow', hex: '#FFD700' },
    { value: 'brown', label: 'Brown', hex: '#8B4513' },
    { value: 'blue', label: 'Blue', hex: '#0066CC' },
    { value: 'green', label: 'Green', hex: '#228B22' },
    { value: 'pink', label: 'Pink', hex: '#FFB6C1' },
    { value: 'red', label: 'Red', hex: '#DC143C' },
    { value: 'orange', label: 'Orange', hex: '#FF8C00' },
    { value: 'purple', label: 'Purple', hex: '#8A2BE2' },
    { value: 'black', label: 'Black', hex: '#2F2F2F' },
    { value: 'gray', label: 'Gray', hex: '#808080' },
    { value: 'white', label: 'White', hex: '#F8F8FF' }
  ])
  
  // Diamond color grades (D-Z scale)
  const colorGrades = ref<string[]>([
    'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ])
  
  // Fancy color options for colored diamonds
  const fancyColorOptions = ref<FancyColorOption[]>([
    { value: 'fancy_yellow', label: 'Fancy Yellow', count: 45 },
    { value: 'fancy_brown', label: 'Fancy Brown', count: 23 },
    { value: 'fancy_pink', label: 'Fancy Pink', count: 12 },
    { value: 'fancy_blue', label: 'Fancy Blue', count: 8 },
    { value: 'fancy_green', label: 'Fancy Green', count: 6 },
    { value: 'fancy_orange', label: 'Fancy Orange', count: 4 },
    { value: 'fancy_red', label: 'Fancy Red', count: 2 },
    { value: 'fancy_purple', label: 'Fancy Purple', count: 3 },
    { value: 'fancy_gray', label: 'Fancy Gray', count: 7 },
    { value: 'fancy_black', label: 'Fancy Black', count: 15 }
  ])
  
  // Local state
  const selectedColors = ref<string[]>([...props.modelValue])
  const selectedColorGrades = ref<string[]>([])
  const selectedFancyColors = ref<string[]>([])
  
  // Computed properties
  const totalSelectedColors = computed(() => {
    return selectedColors.value.length + selectedColorGrades.value.length + selectedFancyColors.value.length
  })
  
  // Methods
  const toggleColor = (color: string) => {
    const index = selectedColors.value.indexOf(color)
    if (index > -1) {
      selectedColors.value.splice(index, 1)
    } else {
      selectedColors.value.push(color)
    }
    emitChanges()
  }
  
  const toggleColorGrade = (grade: string) => {
    const index = selectedColorGrades.value.indexOf(grade)
    if (index > -1) {
      selectedColorGrades.value.splice(index, 1)
    } else {
      selectedColorGrades.value.push(grade)
    }
    emitChanges()
  }
  
  const updateFancyColors = () => {
    emitChanges()
  }
  
  const clearColors = () => {
    selectedColors.value = []
    selectedColorGrades.value = []
    selectedFancyColors.value = []
    emitChanges()
  }
  
  const emitChanges = () => {
    const allColors = [
      ...selectedColors.value,
      ...selectedColorGrades.value,
      ...selectedFancyColors.value
    ]
    
    emit('update:modelValue', allColors)
    emit('change', {
      colors: selectedColors.value,
      colorGrades: selectedColorGrades.value,
      fancyColors: selectedFancyColors.value
    })
  }
  
  // Watch for external changes
  watch(() => props.modelValue, (newValue) => {
    if (newValue && Array.isArray(newValue)) {
      // Parse the incoming values and distribute them appropriately
      selectedColors.value = newValue.filter(color => 
        colorOptions.value.some(option => option.value === color)
      )
      selectedColorGrades.value = newValue.filter(grade => 
        colorGrades.value.includes(grade)
      )
      selectedFancyColors.value = newValue.filter(fancy => 
        fancyColorOptions.value.some(option => option.value === fancy)
      )
    }
  }, { immediate: true })
  
  // Update color options based on gemstone type
  watch(() => props.gemstoneType, (newType) => {
    if (newType === 'ruby') {
      colorOptions.value = [
        { value: 'red', label: 'Red', hex: '#DC143C' },
        { value: 'pink', label: 'Pink', hex: '#FFB6C1' },
        { value: 'purplish_red', label: 'Purplish Red', hex: '#B22222' }
      ]
    } else if (newType === 'sapphire') {
      colorOptions.value = [
        { value: 'blue', label: 'Blue', hex: '#0066CC' },
        { value: 'yellow', label: 'Yellow', hex: '#FFD700' },
        { value: 'pink', label: 'Pink', hex: '#FFB6C1' },
        { value: 'white', label: 'White', hex: '#F8F8FF' },
        { value: 'orange', label: 'Orange', hex: '#FF8C00' },
        { value: 'green', label: 'Green', hex: '#228B22' }
      ]
    } else if (newType === 'emerald') {
      colorOptions.value = [
        { value: 'green', label: 'Green', hex: '#228B22' },
        { value: 'bluish_green', label: 'Bluish Green', hex: '#008B8B' },
        { value: 'yellowish_green', label: 'Yellowish Green', hex: '#9ACD32' }
      ]
    }
  }, { immediate: true })
  </script>
  
  <style scoped>
  /* Custom focus styles for better accessibility */
  .color-swatch:focus {
    @apply ring-2 ring-emerald-500 ring-offset-2;
  }
  
  /* Hover effect for color swatches */
  .color-swatch:hover {
    transform: scale(1.05);
  }
  
  /* Smooth transitions for all interactive elements */
  * {
    transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }
  </style>