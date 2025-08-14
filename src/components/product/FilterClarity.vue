<template>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-slate-900">Clarity</h3>
        <button
          v-if="selectedClarities.length > 0"
          @click="clearClarities"
          class="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Clear
        </button>
      </div>
  
      <!-- Clarity Grade Buttons -->
      <div class="space-y-3">
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="clarity in clarityGrades"
            :key="clarity.grade"
            @click="toggleClarity(clarity.grade)"
            :class="[
              'relative p-3 text-left border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500',
              selectedClarities.includes(clarity.grade)
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            ]"
            :aria-pressed="selectedClarities.includes(clarity.grade)"
          >
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium text-sm">{{ clarity.grade }}</div>
                <div class="text-xs text-slate-500 mt-1">{{ clarity.description }}</div>
              </div>
              <div
                v-if="selectedClarities.includes(clarity.grade)"
                class="flex-shrink-0 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center"
              >
                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
            
            <!-- Visual clarity indicator -->
            <div class="mt-2">
              <div class="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                <div
                  :class="[
                    'h-full rounded-full transition-all duration-300',
                    clarity.grade === 'FL' || clarity.grade === 'IF' ? 'bg-green-500' :
                    clarity.grade === 'VVS1' || clarity.grade === 'VVS2' ? 'bg-green-400' :
                    clarity.grade === 'VS1' || clarity.grade === 'VS2' ? 'bg-yellow-400' :
                    clarity.grade === 'SI1' || clarity.grade === 'SI2' ? 'bg-orange-400' :
                    'bg-red-400'
                  ]"
                  :style="{ width: `${clarity.qualityPercentage}%` }"
                ></div>
              </div>
            </div>
          </button>
        </div>
      </div>
  
      <!-- Clarity Range Selector -->
      <div class="space-y-3">
        <h4 class="text-xs font-medium text-slate-700 uppercase tracking-wide">
          Quick Range Selection
        </h4>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="range in clarityRanges"
            :key="range.label"
            @click="selectRange(range.grades)"
            class="px-3 py-1.5 text-xs font-medium rounded-md border bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors duration-200"
          >
            {{ range.label }}
          </button>
        </div>
      </div>
  
      <!-- Clarity Information Toggle -->
      <div class="border-t border-slate-200 pt-4">
        <button
          @click="showInfo = !showInfo"
          class="flex items-center justify-between w-full text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
        >
          <span class="font-medium">Clarity Information</span>
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
            <h5 class="font-medium text-slate-700 mb-1">Clarity Scale Explanation:</h5>
            <ul class="space-y-1">
              <li><strong>FL/IF:</strong> Flawless to Internally Flawless - No visible inclusions</li>
              <li><strong>VVS1/VVS2:</strong> Very Very Slightly Included - Minute inclusions</li>
              <li><strong>VS1/VS2:</strong> Very Slightly Included - Minor inclusions</li>
              <li><strong>SI1/SI2:</strong> Slightly Included - Noticeable inclusions</li>
              <li><strong>I1/I2/I3:</strong> Imperfect - Obvious inclusions affecting brilliance</li>
            </ul>
          </div>
          <div>
            <p class="text-slate-600">
              Higher clarity grades (FL, IF, VVS) command premium prices due to their rarity and exceptional appearance.
            </p>
          </div>
        </div>
      </div>
  
      <!-- Selected Clarities Summary -->
      <div v-if="selectedClarities.length > 0" class="pt-2 border-t border-slate-200">
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-600">
            {{ selectedClarities.length }} clarity grade{{ selectedClarities.length === 1 ? '' : 's' }} selected
          </span>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="clarity in selectedClarities"
              :key="clarity"
              class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-700"
            >
              {{ clarity }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  
  interface ClarityGrade {
    grade: string
    description: string
    qualityPercentage: number
    priceMultiplier: number
  }
  
  interface ClarityRange {
    label: string
    grades: string[]
  }
  
  interface Props {
    modelValue?: string[]
    gemstoneType?: string
  }
  
  interface Emits {
    (e: 'update:modelValue', value: string[]): void
    (e: 'change', clarities: string[]): void
  }
  
  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    gemstoneType: 'diamond'
  })
  
  const emit = defineEmits<Emits>()
  
  // Diamond clarity grades (standard GIA scale)
  const diamondClarityGrades = ref<ClarityGrade[]>([
    {
      grade: 'FL',
      description: 'Flawless',
      qualityPercentage: 100,
      priceMultiplier: 3.5
    },
    {
      grade: 'IF',
      description: 'Internally Flawless',
      qualityPercentage: 95,
      priceMultiplier: 3.2
    },
    {
      grade: 'VVS1',
      description: 'Very Very Slightly Included 1',
      qualityPercentage: 90,
      priceMultiplier: 2.8
    },
    {
      grade: 'VVS2',
      description: 'Very Very Slightly Included 2',
      qualityPercentage: 85,
      priceMultiplier: 2.5
    },
    {
      grade: 'VS1',
      description: 'Very Slightly Included 1',
      qualityPercentage: 80,
      priceMultiplier: 2.0
    },
    {
      grade: 'VS2',
      description: 'Very Slightly Included 2',
      qualityPercentage: 75,
      priceMultiplier: 1.8
    },
    {
      grade: 'SI1',
      description: 'Slightly Included 1',
      qualityPercentage: 65,
      priceMultiplier: 1.3
    },
    {
      grade: 'SI2',
      description: 'Slightly Included 2',
      qualityPercentage: 55,
      priceMultiplier: 1.0
    },
    {
      grade: 'I1',
      description: 'Imperfect 1',
      qualityPercentage: 40,
      priceMultiplier: 0.7
    },
    {
      grade: 'I2',
      description: 'Imperfect 2',
      qualityPercentage: 25,
      priceMultiplier: 0.5
    },
    {
      grade: 'I3',
      description: 'Imperfect 3',
      qualityPercentage: 10,
      priceMultiplier: 0.3
    }
  ])
  
  // Colored gemstone clarity grades (simplified)
  const coloredGemstoneClarity = ref<ClarityGrade[]>([
    {
      grade: 'Eye Clean',
      description: 'No visible inclusions to naked eye',
      qualityPercentage: 100,
      priceMultiplier: 2.5
    },
    {
      grade: 'Slightly Included',
      description: 'Minor inclusions visible',
      qualityPercentage: 75,
      priceMultiplier: 1.5
    },
    {
      grade: 'Moderately Included',
      description: 'Noticeable inclusions',
      qualityPercentage: 50,
      priceMultiplier: 1.0
    },
    {
      grade: 'Heavily Included',
      description: 'Obvious inclusions affecting beauty',
      qualityPercentage: 25,
      priceMultiplier: 0.6
    }
  ])
  
  // Quick range selections
  const clarityRanges = ref<ClarityRange[]>([
    { label: 'Premium (FL-VVS2)', grades: ['FL', 'IF', 'VVS1', 'VVS2'] },
    { label: 'Excellent (VS1-VS2)', grades: ['VS1', 'VS2'] },
    { label: 'Good Value (SI1-SI2)', grades: ['SI1', 'SI2'] },
    { label: 'Budget (I1-I3)', grades: ['I1', 'I2', 'I3'] }
  ])
  
  // Local state
  const selectedClarities = ref<string[]>([...props.modelValue])
  const showInfo = ref(false)
  
  // Computed properties
  const clarityGrades = computed(() => {
    return props.gemstoneType === 'diamond' 
      ? diamondClarityGrades.value 
      : coloredGemstoneClarity.value
  })
  
  // Methods
  const toggleClarity = (clarity: string) => {
    const index = selectedClarities.value.indexOf(clarity)
    if (index > -1) {
      selectedClarities.value.splice(index, 1)
    } else {
      selectedClarities.value.push(clarity)
    }
    emitChanges()
  }
  
  const selectRange = (grades: string[]) => {
    // Check if all grades in the range are already selected
    const allSelected = grades.every(grade => selectedClarities.value.includes(grade))
    
    if (allSelected) {
      // Deselect the range
      selectedClarities.value = selectedClarities.value.filter(clarity => !grades.includes(clarity))
    } else {
      // Select the range (merge with existing selections)
      const newSelections = grades.filter(grade => !selectedClarities.value.includes(grade))
      selectedClarities.value.push(...newSelections)
    }
    
    emitChanges()
  }
  
  const clearClarities = () => {
    selectedClarities.value = []
    emitChanges()
  }
  
  const emitChanges = () => {
    emit('update:modelValue', selectedClarities.value)
    emit('change', selectedClarities.value)
  }
  
  // Watch for external changes
  watch(() => props.modelValue, (newValue) => {
    if (newValue && Array.isArray(newValue)) {
      selectedClarities.value = [...newValue]
    }
  }, { immediate: true })
  
  // Update clarity ranges when gemstone type changes
  watch(() => props.gemstoneType, (newType) => {
    if (newType !== 'diamond') {
      clarityRanges.value = [
        { label: 'Eye Clean', grades: ['Eye Clean'] },
        { label: 'Slightly Included', grades: ['Slightly Included'] },
        { label: 'Moderately Included', grades: ['Moderately Included'] },
        { label: 'All Grades', grades: ['Eye Clean', 'Slightly Included', 'Moderately Included', 'Heavily Included'] }
      ]
    } else {
      clarityRanges.value = [
        { label: 'Premium (FL-VVS2)', grades: ['FL', 'IF', 'VVS1', 'VVS2'] },
        { label: 'Excellent (VS1-VS2)', grades: ['VS1', 'VS2'] },
        { label: 'Good Value (SI1-SI2)', grades: ['SI1', 'SI2'] },
        { label: 'Budget (I1-I3)', grades: ['I1', 'I2', 'I3'] }
      ]
    }
    
    // Clear selections when gemstone type changes
    selectedClarities.value = []
    emitChanges()
  }, { immediate: true })
  </script>
  
  <style scoped>
  /* Custom hover effects */
  .clarity-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  /* Smooth transitions */
  * {
    transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
  }
  
  /* Quality indicator animation */
  .quality-bar {
    transition: width 0.5s ease-in-out;
  }
  
  /* Information panel slide animation */
  .info-panel-enter-active,
  .info-panel-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
  }
  
  .info-panel-enter-from,
  .info-panel-leave-to {
    opacity: 0;
    max-height: 0;
  }
  
  .info-panel-enter-to,
  .info-panel-leave-from {
    opacity: 1;
    max-height: 200px;
  }
  </style>