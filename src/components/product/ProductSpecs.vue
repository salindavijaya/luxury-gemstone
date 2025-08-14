### components/product/ProductSpecs.vue
```vue
<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h2 class="text-2xl font-bold text-slate-900 mb-6">Detailed Specifications</h2>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- The 4 Cs -->
      <div>
        <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center">
          <DiamondIcon class="w-5 h-5 text-emerald-600 mr-2" />
          The 4 Cs
        </h3>
        
        <div class="space-y-6">
          <!-- Carat -->
          <div class="bg-slate-50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium text-slate-900">Carat Weight</span>
              <span class="text-2xl font-bold text-emerald-600">{{ product.carat }} ct</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2">
              <div 
                class="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                :style="{ width: `${(product.carat / 5) * 100}%` }"
              ></div>
            </div>
            <p class="text-sm text-slate-600 mt-2">
              Weight measurement of the gemstone. Larger carats are rarer and more valuable.
            </p>
          </div>

          <!-- Clarity -->
          <div class="bg-slate-50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium text-slate-900">Clarity</span>
              <span class="text-2xl font-bold text-emerald-600">{{ product.clarity }}</span>
            </div>
            <div class="flex items-center space-x-1 mb-2">
              <div 
                v-for="grade in clarityGrades"
                :key="grade"
                class="flex-1 h-2 rounded-full"
                :class="getClarityGradeColor(grade, product.clarity)"
              ></div>
            </div>
            <p class="text-sm text-slate-600">
              {{ getClarityDescription(product.clarity) }}
            </p>
          </div>

          <!-- Color -->
          <div class="bg-slate-50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium text-slate-900">Color Grade</span>
              <span class="text-2xl font-bold text-emerald-600">{{ product.color }}</span>
            </div>
            <div class="flex items-center space-x-1 mb-2">
              <div 
                v-for="grade in colorGrades"
                :key="grade"
                class="flex-1 h-2 rounded-full"
                :class="getColorGradeColor(grade, product.color)"
              ></div>
            </div>
            <p class="text-sm text-slate-600">
              {{ getColorDescription(product.color) }}
            </p>
          </div>

          <!-- Cut -->
          <div class="bg-slate-50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium text-slate-900">Cut Quality</span>
              <span class="text-2xl font-bold text-emerald-600">{{ product.cut }}</span>
            </div>
            <div class="flex items-center space-x-1 mb-2">
              <StarIcon 
                v-for="star in 5"
                :key="star"
                class="w-4 h-4"
                :class="star <= getCutRating(product.cut) ? 'text-emerald-500 fill-current' : 'text-slate-300'"
              />
            </div>
            <p class="text-sm text-slate-600">
              {{ getCutDescription(product.cut) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Physical Properties -->
      <div>
        <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center">
          <CubeIcon class="w-5 h-5 text-emerald-600 mr-2" />
          Physical Properties
        </h3>
        
        <div class="space-y-4">
          <dl class="grid grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-slate-500">Shape</dt>
              <dd class="text-lg font-semibold text-slate-900">{{ product.shape }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-slate-500">Dimensions</dt>
              <dd class="text-lg font-semibold text-slate-900">{{ product.dimensions || 'N/A' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-slate-500">Origin</dt>
              <dd class="text-lg font-semibold text-slate-900">{{ product.origin }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-slate-500">Treatment</dt>
              <dd class="text-lg font-semibold text-slate-900">{{ product.treatment || 'Natural' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-slate-500">Fluorescence</dt>
              <dd class="text-lg font-semibold text-slate-900">{{ product.fluorescence || 'None' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-slate-500">Polish</dt>
              <dd class="text-lg font-semibold text-slate-900">{{ product.polish || 'Excellent' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-slate-500">Symmetry</dt>
              <dd class="text-lg font-semibold text-slate-900">{{ product.symmetry || 'Excellent' }}</dd>
            </div>
          </dl>

          <!-- Investment Information -->
          <div class="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
            <h4 class="font-medium text-amber-900 mb-2 flex items-center">
              <TrendingUpIcon class="w-4 h-4 mr-2" />
              Investment Value
            </h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-amber-700">Rarity Score:</span>
                <span class="font-bold text-amber-900 ml-2">{{ getRarityScore() }}/10</span>
              </div>
              <div>
                <span class="text-amber-700">Market Trend:</span>
                <span class="font-bold text-green-600 ml-2">+12% YoY</span>
              </div>
            </div>
          </div>

          <!-- Care Instructions -->
          <div class="bg-blue-50 rounded-lg p-4">
            <h4 class="font-medium text-blue-900 mb-2 flex items-center">
              <HeartIcon class="w-4 h-4 mr-2" />
              Care Instructions
            </h4>
            <ul class="text-sm text-blue-800 space-y-1">
              <li>• Clean with warm soapy water and soft brush</li>
              <li>• Avoid harsh chemicals and ultrasonic cleaners</li>
              <li>• Store separately to prevent scratching</li>
              <li>• Professional cleaning recommended annually</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Size Comparison Tool -->
    <div class="mt-8 border-t border-slate-200 pt-8">
      <h3 class="text-lg font-semibold text-slate-900 mb-4">Size Comparison</h3>
      <div class="bg-slate-50 rounded-lg p-6">
        <div class="flex items-center justify-center space-x-8">
          <!-- Reference Objects -->
          <div class="text-center">
            <div class="w-16 h-16 bg-slate-300 rounded-full flex items-center justify-center mb-2">
              <span class="text-xs text-slate-600">Penny</span>
            </div>
            <p class="text-sm text-slate-600">19.05mm</p>
          </div>
          
          <!-- Product Size Visualization -->
          <div class="text-center">
            <div 
              class="bg-emerald-600 rounded-full flex items-center justify-center mb-2 mx-auto"
              :style="{ width: `${getSizeVisualization()}px`, height: `${getSizeVisualization()}px` }"
            >
              <span class="text-xs text-white font-bold">{{ product.carat }}ct</span>
            </div>
            <p class="text-sm text-slate-600">{{ product.name }}</p>
          </div>
          
          <div class="text-center">
            <div class="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center mb-2">
              <span class="text-xs text-slate-600">Dime</span>
            </div>
            <p class="text-sm text-slate-600">17.91mm</p>
          </div>
        </div>
        
        <div class="mt-4 text-center">
          <p class="text-sm text-slate-600">
            Approximate size: {{ getApproximateSize() }}mm diameter
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  CubeIcon,
  StarIcon,
  TrendingUpIcon,
  HeartIcon
} from '@heroicons/vue/24/outline'
import { DiamondIcon } from '@heroicons/vue/24/solid'

interface Product {
  id: string
  name: string
  carat: number
  clarity: string
  color: string
  cut: string
  shape: string
  origin: string
  treatment?: string
  fluorescence?: string
  polish?: string
  symmetry?: string
  dimensions?: string
}

interface Props {
  product: Product
}

const props = defineProps<Props>()

// Grading scales
const clarityGrades = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3']
const colorGrades = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']

// Helper functions
const getClarityGradeColor = (grade: string, productClarity: string) => {
  const currentIndex = clarityGrades.indexOf(productClarity)
  const gradeIndex = clarityGrades.indexOf(grade)
  
  if (gradeIndex <= currentIndex) {
    return 'bg-emerald-500'
  }
  return 'bg-slate-200'
}

const getColorGradeColor = (grade: string, productColor: string) => {
  const currentIndex = colorGrades.indexOf(productColor)
  const gradeIndex = colorGrades.indexOf(grade)
  
  if (gradeIndex <= currentIndex) {
    return 'bg-emerald-500'
  }
  return 'bg-slate-200'
}

const getClarityDescription = (clarity: string) => {
  const descriptions: Record<string, string> = {
    'FL': 'Flawless - No inclusions or blemishes visible under 10x magnification',
    'IF': 'Internally Flawless - No inclusions visible under 10x magnification',
    'VVS1': 'Very Very Slightly Included - Inclusions extremely difficult to see',
    'VVS2': 'Very Very Slightly Included - Inclusions very difficult to see',
    'VS1': 'Very Slightly Included - Inclusions difficult to see',
    'VS2': 'Very Slightly Included - Inclusions somewhat easy to see',
    'SI1': 'Slightly Included - Inclusions easy to see under magnification',
    'SI2': 'Slightly Included - Inclusions very easy to see under magnification'
  }
  return descriptions[clarity] || 'Premium clarity grade'
}

const getColorDescription = (color: string) => {
  const descriptions: Record<string, string> = {
    'D': 'Absolutely colorless - Highest color grade',
    'E': 'Colorless - Only slight traces of color',
    'F': 'Colorless - Slight color detected by expert',
    'G': 'Near Colorless - Color noticeable when compared to higher grades',
    'H': 'Near Colorless - Slight color visible to naked eye',
    'I': 'Near Colorless - Slightly detectable color',
    'J': 'Near Colorless - Light color visible'
  }
  return descriptions[color] || 'Beautiful color grade'
}

const getCutDescription = (cut: string) => {
  const descriptions: Record<string, string> = {
    'Excellent': 'Maximum brilliance and fire - reflects nearly all light',
    'Very Good': 'Superior light performance with excellent brilliance',
    'Good': 'Good light performance and sparkle for the value',
    'Fair': 'Reasonable light performance with some dark areas',
    'Poor': 'Light leakage reduces brilliance significantly'
  }
  return descriptions[cut] || 'Quality cut grade'
}

const getCutRating = (cut: string) => {
  const ratings: Record<string, number> = {
    'Excellent': 5,
    'Very Good': 4,
    'Good': 3,
    'Fair': 2,
    'Poor': 1
  }
  return ratings[cut] || 3
}

const getRarityScore = () => {
  // Calculate rarity based on 4Cs
  let score = 0
  
  // Carat weight (higher = rarer)
  if (props.product.carat >= 2) score += 3
  else if (props.product.carat >= 1) score += 2
  else if (props.product.carat >= 0.5) score += 1
  
  // Clarity
  const clarityIndex = clarityGrades.indexOf(props.product.clarity)
  if (clarityIndex >= 0 && clarityIndex <= 3) score += 3
  else if (clarityIndex <= 5) score += 2
  else score += 1
  
  // Color
  const colorIndex = colorGrades.indexOf(props.product.color)
  if (colorIndex >= 0 && colorIndex <= 2) score += 3
  else if (colorIndex <= 4) score += 2
  else score += 1
  
  // Cut
  if (props.product.cut === 'Excellent') score += 1
  
  return Math.min(score, 10)
}

const getSizeVisualization = () => {
  // Convert carat to approximate pixel size for visualization
  // This is a rough approximation for round diamonds
  const baseSize = 20 // Base size in pixels
  return Math.max(baseSize, baseSize + (props.product.carat * 15))
}

const getApproximateSize = () => {
  // Approximate diameter in mm based on carat weight (for round diamonds)
  // This is a simplified calculation
  return (6.5 * Math.pow(props.product.carat, 1/3)).toFixed(1)
}
</script>