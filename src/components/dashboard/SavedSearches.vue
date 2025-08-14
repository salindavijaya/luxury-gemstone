<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-slate-800">Saved Searches</h2>
      <button
        @click="showCreateModal = true"
        class="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors flex items-center space-x-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        <span>Save Current Search</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="n in 3" :key="n" class="animate-pulse">
        <div class="border border-slate-200 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="h-5 bg-slate-200 rounded w-1/3"></div>
            <div class="h-4 bg-slate-200 rounded w-16"></div>
          </div>
          <div class="h-4 bg-slate-200 rounded w-2/3 mb-2"></div>
          <div class="h-3 bg-slate-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="savedSearches.length === 0" class="text-center py-12">
      <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-slate-800 mb-2">No Saved Searches</h3>
      <p class="text-slate-600 mb-4">Save your frequently used searches for quick access later.</p>
    </div>

    <!-- Saved Searches List -->
    <div v-else class="space-y-4">
      <div
        v-for="search in savedSearches"
        :key="search.id"
        class="border border-slate-200 rounded-lg p-4 hover:border-emerald-300 transition-colors"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <h3 class="font-semibold text-slate-800 mb-1">{{ search.name }}</h3>
            <p class="text-sm text-slate-600 mb-2">{{ search.description || 'No description' }}</p>
            
            <!-- Search Criteria -->
            <div class="flex flex-wrap gap-2 mb-3">
              <span
                v-for="(value, key) in search.criteria"
                :key="key"
                class="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md"
              >
                <span class="font-medium">{{ formatCriteriaKey(key) }}:</span>
                <span class="ml-1">{{ formatCriteriaValue(value) }}</span>
              </span>
            </div>

            <!-- Meta Information -->
            <div class="flex items-center space-x-4 text-xs text-slate-500">
              <span>Created {{ formatDate(search.createdAt) }}</span>
              <span>{{ search.resultCount }} results</span>
              <span v-if="search.lastUsed">Last used {{ formatDate(search.lastUsed) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-2 ml-4">
            <button
              @click="executeSearch(search)"
              class="p-2 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              title="Run Search"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
            
            <button
              @click="editSearch(search)"
              class="p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              title="Edit Search"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>

            <div class="relative">
              <button
                @click="toggleDropdown(search.id)"
                class="p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                </svg>
              </button>
              
              <!-- Dropdown Menu -->
              <div
                v-if="activeDropdown === search.id"
                v-click-outside="() => activeDropdown = null"
                class="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10"
              >
                <button
                  @click="createAlert(search)"
                  class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 first:rounded-t-lg"
                >
                  Create Alert
                </button>
                <button
                  @click="duplicateSearch(search)"
                  class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Duplicate
                </button>
                <button
                  @click="shareSearch(search)"
                  class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Share
                </button>
                <hr class="border-slate-200">
                <button
                  @click="deleteSearch(search.id)"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Price Alert Badge -->
        <div v-if="search.hasAlert" class="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-md">
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5zm0 0V3"></path>
          </svg>
          Price Alert Active
        </div>
      </div>
    </div>

    <!-- Create/Edit Search Modal -->
    <Modal
      v-if="showCreateModal || showEditModal"
      @close="closeModal"
      :title="showEditModal ? 'Edit Saved Search' : 'Save Current Search'"
    >
      <form @submit.prevent="saveSearch" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Search Name</label>
          <input
            v-model="searchForm.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g., Blue Sapphires under $10k"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Description (optional)</label>
          <textarea
            v-model="searchForm.description"
            rows="3"
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Brief description of this search..."
          />
        </div>

        <!-- Search Criteria Preview -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Search Criteria</label>
          <div class="bg-slate-50 rounded-md p-3">
            <div v-if="Object.keys(searchForm.criteria).length === 0" class="text-sm text-slate-500 italic">
              No search criteria detected. Please run a search first.
            </div>
            <div v-else class="flex flex-wrap gap-2">
              <span
                v-for="(value, key) in searchForm.criteria"
                :key="key"
                class="inline-flex items-center px-2 py-1 bg-white border border-slate-200 text-slate-700 text-sm rounded-md"
              >
                <span class="font-medium">{{ formatCriteriaKey(key) }}:</span>
                <span class="ml-1">{{ formatCriteriaValue(value) }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Enable Price Alert -->
        <div class="flex items-center space-x-2">
          <input
            v-model="searchForm.enableAlert"
            type="checkbox"
            id="enableAlert"
            class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <label for="enableAlert" class="text-sm font-medium text-slate-700">
            Enable price alerts for this search
          </label>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!searchForm.name.trim()"
            class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ showEditModal ? 'Update Search' : 'Save Search' }}
          </button>
        </div>
      </form>
    </Modal>

    <!-- Share Modal -->
    <Modal
      v-if="showShareModal"
      @close="showShareModal = false"
      title="Share Saved Search"
    >
      <div class="space-y-4">
        <p class="text-sm text-slate-600">Share this search with others via link:</p>
        
        <div class="flex items-center space-x-2">
          <input
            v-model="shareUrl"
            type="text"
            readonly
            class="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-sm"
          />
          <button
            @click="copyToClipboard"
            class="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>

        <div class="flex justify-center space-x-4 pt-4">
          <button
            @click="shareViaEmail"
            class="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.2a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span>Email</span>
          </button>
          <button
            @click="shareViaSMS"
            class="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <span>SMS</span>
          </button>
        </div>
      </div>
    </Modal>

    <!-- Alert Creation Modal -->
    <Modal
      v-if="showAlertModal"
      @close="showAlertModal = false"
      title="Create Price Alert"
    >
      <form @submit.prevent="createPriceAlert" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Alert Name</label>
          <input
            v-model="alertForm.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            :placeholder="selectedSearch?.name + ' Alert'"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Alert Type</label>
            <select
              v-model="alertForm.type"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="price_drop">Price Drop</option>
              <option value="new_arrival">New Arrival</option>
              <option value="back_in_stock">Back in Stock</option>
            </select>
          </div>

          <div v-if="alertForm.type === 'price_drop'">
            <label class="block text-sm font-medium text-slate-700 mb-2">Threshold (%)</label>
            <input
              v-model.number="alertForm.threshold"
              type="number"
              min="5"
              max="50"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="10"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Notification Method</label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                v-model="alertForm.notifications.email"
                type="checkbox"
                class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span class="ml-2 text-sm text-slate-700">Email notifications</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="alertForm.notifications.browser"
                type="checkbox"
                class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span class="ml-2 text-sm text-slate-700">Browser notifications</span>
            </label>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="showAlertModal = false"
            class="px-4 py-2 text-slate-600 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            Create Alert
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Modal from './Modal.vue'

interface SearchCriteria {
  query?: string
  category?: string
  priceMin?: number
  priceMax?: number
  carat?: string
  cut?: string
  color?: string
  clarity?: string
}

interface SavedSearch {
  id: string
  name: string
  description?: string
  criteria: SearchCriteria
  resultCount: number
  createdAt: Date
  lastUsed?: Date
  hasAlert: boolean
}

interface AlertForm {
  name: string
  type: 'price_drop' | 'new_arrival' | 'back_in_stock'
  threshold: number
  notifications: {
    email: boolean
    browser: boolean
  }
}

// State
const isLoading = ref(true)
const savedSearches = ref<SavedSearch[]>([])
const activeDropdown = ref<string | null>(null)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showShareModal = ref(false)
const showAlertModal = ref(false)
const shareUrl = ref('')
const copied = ref(false)
const selectedSearch = ref<SavedSearch | null>(null)

const router = useRouter()

// Forms
const searchForm = reactive({
  id: '',
  name: '',
  description: '',
  criteria: {} as SearchCriteria,
  enableAlert: false
})

const alertForm = reactive<AlertForm>({
  name: '',
  type: 'price_drop',
  threshold: 10,
  notifications: {
    email: true,
    browser: false
  }
})

// Mock data
const mockSavedSearches: SavedSearch[] = [
  {
    id: '1',
    name: 'Blue Sapphires Under $15k',
    description: 'High-quality blue sapphires within my budget range',
    criteria: {
      query: 'sapphire',
      category: 'Sapphire',
      priceMax: 15000,
      color: 'Blue',
      clarity: 'VVS1'
    },
    resultCount: 24,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    hasAlert: true
  },
  {
    id: '2',
    name: 'Emerald Cut Diamonds',
    criteria: {
      cut: 'Emerald',
      category: 'Diamond',
      priceMin: 5000,
      priceMax: 25000
    },
    resultCount: 18,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    hasAlert: false
  },
  {
    id: '3',
    name: 'Vintage Ruby Collection',
    description: 'Antique and vintage ruby pieces for investment',
    criteria: {
      query: 'vintage ruby',
      category: 'Ruby',
      color: 'Pigeon Blood Red'
    },
    resultCount: 12,
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    hasAlert: false
  }
]

// Methods
const loadSavedSearches = async () => {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    savedSearches.value = mockSavedSearches
  } catch (error) {
    console.error('Error loading saved searches:', error)
  } finally {
    isLoading.value = false
  }
}

const toggleDropdown = (searchId: string) => {
  activeDropdown.value = activeDropdown.value === searchId ? null : searchId
}

const executeSearch = (search: SavedSearch) => {
  // Update last used date
  search.lastUsed = new Date()
  
  // Navigate to search results with criteria
  const queryParams = new URLSearchParams()
  Object.entries(search.criteria).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      queryParams.set(key, value.toString())
    }
  })
  
  router.push(`/products?${queryParams.toString()}`)
  activeDropdown.value = null
}

const editSearch = (search: SavedSearch) => {
  selectedSearch.value = search
  searchForm.id = search.id
  searchForm.name = search.name
  searchForm.description = search.description || ''
  searchForm.criteria = { ...search.criteria }
  searchForm.enableAlert = search.hasAlert
  showEditModal.value = true
  activeDropdown.value = null
}

const createAlert = (search: SavedSearch) => {
  selectedSearch.value = search
  alertForm.name = search.name + ' Alert'
  showAlertModal.value = true
  activeDropdown.value = null
}

const duplicateSearch = (search: SavedSearch) => {
  const newSearch: SavedSearch = {
    ...search,
    id: Date.now().toString(),
    name: search.name + ' (Copy)',
    createdAt: new Date(),
    lastUsed: undefined,
    hasAlert: false
  }
  savedSearches.value.unshift(newSearch)
  activeDropdown.value = null
}

const shareSearch = (search: SavedSearch) => {
  selectedSearch.value = search
  shareUrl.value = `${window.location.origin}/search/shared/${search.id}`
  showShareModal.value = true
  activeDropdown.value = null
}

const deleteSearch = (searchId: string) => {
  if (confirm('Are you sure you want to delete this saved search?')) {
    savedSearches.value = savedSearches.value.filter(s => s.id !== searchId)
  }
  activeDropdown.value = null
}

const saveSearch = () => {
  if (showEditModal.value && selectedSearch.value) {
    // Update existing search
    const index = savedSearches.value.findIndex(s => s.id === selectedSearch.value!.id)
    if (index !== -1) {
      savedSearches.value[index] = {
        ...savedSearches.value[index],
        name: searchForm.name,
        description: searchForm.description,
        hasAlert: searchForm.enableAlert
      }
    }
  } else {
    // Create new search
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchForm.name,
      description: searchForm.description,
      criteria: { ...searchForm.criteria },
      resultCount: Math.floor(Math.random() * 50) + 1,
      createdAt: new Date(),
      hasAlert: searchForm.enableAlert
    }
    savedSearches.value.unshift(newSearch)
  }
  
  closeModal()
}

const createPriceAlert = () => {
  if (selectedSearch.value) {
    selectedSearch.value.hasAlert = true
    // Here you would typically create the alert in your backend
    console.log('Creating alert:', alertForm)
  }
  showAlertModal.value = false
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedSearch.value = null
  
  // Reset form
  searchForm.id = ''
  searchForm.name = ''
  searchForm.description = ''
  searchForm.criteria = {}
  searchForm.enableAlert = false
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}

const shareViaEmail = () => {
  const subject = `Check out this gemstone search: ${selectedSearch.value?.name}`
  const body = `I found this interesting search on our gemstone platform: ${shareUrl.value}`
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

const shareViaSMS = () => {
  const message = `Check out this gemstone search: ${shareUrl.value}`
  window.location.href = `sms:?body=${encodeURIComponent(message)}`
}

const formatCriteriaKey = (key: string): string => {
  const keyMap: Record<string, string> = {
    query: 'Search',
    category: 'Category',
    priceMin: 'Min Price',
    priceMax: 'Max Price',
    carat: 'Carat',
    cut: 'Cut',
    color: 'Color',
    clarity: 'Clarity'
  }
  return keyMap[key] || key
}

const formatCriteriaValue = (value: any): string => {
  if (typeof value === 'number') {
    return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`
  }
  return String(value)
}

const formatDate = (date: Date): string => {
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  return date.toLocaleDateString()
}

// Click outside directive
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el._clickOutsideHandler = (event: Event) => {
      if (!el.contains(event.target as Node)) {
        binding.value()
      }
    }
    document.addEventListener('click', el._clickOutsideHandler)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el._clickOutsideHandler)
    delete el._clickOutsideHandler
  }
}

// Lifecycle
onMounted(() => {
  loadSavedSearches()
  
  // Mock current search criteria from URL params
  const urlParams = new URLSearchParams(window.location.search)
  searchForm.criteria = {
    query: urlParams.get('query') || '',
    category: urlParams.get('category') || '',
    priceMin: urlParams.get('priceMin') ? parseInt(urlParams.get('priceMin')!) : undefined,
    priceMax: urlParams.get('priceMax') ? parseInt(urlParams.get('priceMax')!) : undefined
  }
})
</script>

<style scoped>
/* Custom styles for better mobile experience */
@media (max-width: 640px) {
  .space-y-4 > * + * {
    margin-top: 1rem;
  }
}
</style>