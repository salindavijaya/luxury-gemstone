<template>
  <nav
    class="flex items-center justify-between"
    :aria-label="ariaLabel"
    role="navigation"
  >
    <!-- Mobile View -->
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="goToPrevious"
        :disabled="isFirstPage"
        :class="[
          'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border',
          isFirstPage
            ? 'text-slate-300 bg-white border-slate-200 cursor-not-allowed'
            : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2'
        ]"
        :aria-label="$t?.('pagination.previous') || 'Previous page'"
      >
        <ChevronLeftIcon class="h-5 w-5 mr-1" aria-hidden="true" />
        Previous
      </button>

      <!-- Page Info -->
      <div class="flex items-center px-4 py-2 text-sm text-slate-700">
        Page {{ currentPage }} of {{ totalPages }}
      </div>

      <button
        @click="goToNext"
        :disabled="isLastPage"
        :class="[
          'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border',
          isLastPage
            ? 'text-slate-300 bg-white border-slate-200 cursor-not-allowed'
            : 'text-slate-700 bg-white border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2'
        ]"
        :aria-label="$t?.('pagination.next') || 'Next page'"
      >
        Next
        <ChevronRightIcon class="h-5 w-5 ml-1" aria-hidden="true" />
      </button>
    </div>

    <!-- Desktop View -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <!-- Results Info -->
      <div>
        <p class="text-sm text-slate-700">
          Showing
          <span class="font-medium">{{ startItem }}</span>
          to
          <span class="font-medium">{{ endItem }}</span>
          of
          <span class="font-medium">{{ total }}</span>
          {{ resultText }}
        </p>
      </div>

      <!-- Pagination Controls -->
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <!-- Previous Button -->
          <button
            @click="goToPrevious"
            :disabled="isFirstPage"
            :class="[
              'relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0',
              isFirstPage
                ? 'cursor-not-allowed opacity-50'
                : 'hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500'
            ]"
            :aria-label="$t?.('pagination.previous') || 'Previous page'"
          >
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
          </button>

          <!-- Page Numbers -->
          <template v-for="page in displayedPages" :key="page">
            <!-- Current Page -->
            <button
              v-if="page === currentPage"
              :aria-current="'page'"
              :class="[
                'relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold text-white',
                'bg-emerald-600 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
              ]"
            >
              {{ page }}
            </button>

            <!-- Other Pages -->
            <button
              v-else-if="typeof page === 'number'"
              @click="goToPage(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300',
                'hover:bg-slate-50 focus:z-20 focus:outline-offset-0 focus:outline-none focus:ring-2 focus:ring-emerald-500'
              ]"
              :aria-label="`Go to page ${page}`"
            >
              {{ page }}
            </button>

            <!-- Ellipsis -->
            <span
              v-else
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 focus:outline-offset-0"
            >
              ...
            </span>
          </template>

          <!-- Next Button -->
          <button
            @click="goToNext"
            :disabled="isLastPage"
            :class="[
              'relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0',
              isLastPage
                ? 'cursor-not-allowed opacity-50'
                : 'hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500'
            ]"
            :aria-label="$t?.('pagination.next') || 'Next page'"
          >
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>

    <!-- Page Size Selector -->
    <div v-if="showPageSizeSelector" class="hidden lg:flex lg:items-center lg:ml-4">
      <label for="page-size" class="text-sm text-slate-700 mr-2">Show:</label>
      <select
        id="page-size"
        v-model="selectedPageSize"
        @change="handlePageSizeChange"
        class="rounded-md border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
      >
        <option v-for="size in pageSizeOptions" :key="size" :value="size">
          {{ size }}
        </option>
      </select>
      <span class="text-sm text-slate-700 ml-2">per page</span>
    </div>

    <!-- Jump to Page (for large datasets) -->
    <div v-if="showJumpToPage && totalPages > 10" class="hidden xl:flex xl:items-center xl:ml-4">
      <label for="jump-to-page" class="text-sm text-slate-700 mr-2">Go to:</label>
      <input
        id="jump-to-page"
        v-model="jumpToPageValue"
        @keydown.enter="handleJumpToPage"
        type="number"
        :min="1"
        :max="totalPages"
        class="w-16 rounded-md border-slate-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
        placeholder="1"
      />
      <button
        @click="handleJumpToPage"
        class="ml-2 px-3 py-1 text-sm font-medium text-emerald-700 bg-emerald-100 rounded-md hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        Go
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

// Types
interface Props {
  currentPage: number
  total: number
  pageSize?: number
  maxDisplayedPages?: number
  showPageSizeSelector?: boolean
  pageSizeOptions?: number[]
  showJumpToPage?: boolean
  resultText?: string
  ariaLabel?: string
}

// Props with defaults
const props = withDefaults(defineProps<Props>(), {
  pageSize: 20,
  maxDisplayedPages: 7,
  showPageSizeSelector: false,
  pageSizeOptions: () => [10, 20, 50, 100],
  showJumpToPage: false,
  resultText: 'results',
  ariaLabel: 'Pagination navigation'
})

// Emits
const emit = defineEmits<{
  'page-change': [page: number]
  'page-size-change': [pageSize: number]
}>()

// Reactive state
const selectedPageSize = ref(props.pageSize)
const jumpToPageValue = ref<number | null>(null)

// Computed properties
const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

const isFirstPage = computed(() => props.currentPage <= 1)
const isLastPage = computed(() => props.currentPage >= totalPages.value)

const startItem = computed(() => {
  if (props.total === 0) return 0
  return (props.currentPage - 1) * props.pageSize + 1
})

const endItem = computed(() => {
  const end = props.currentPage * props.pageSize
  return Math.min(end, props.total)
})

const displayedPages = computed(() => {
  const current = props.currentPage
  const total = totalPages.value
  const maxDisplayed = props.maxDisplayedPages
  
  if (total <= maxDisplayed) {
    // Show all pages if total is small
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  const pages: (number | string)[] = []
  const halfMax = Math.floor(maxDisplayed / 2)
  
  // Always show first page
  pages.push(1)
  
  let start = Math.max(2, current - halfMax + 1)
  let end = Math.min(total - 1, current + halfMax - 1)
  
  // Adjust range to maintain maxDisplayed pages
  if (end - start + 1 < maxDisplayed - 2) {
    if (start === 2) {
      end = Math.min(total - 1, start + maxDisplayed - 3)
    } else {
      start = Math.max(2, end - maxDisplayed + 3)
    }
  }
  
  // Add ellipsis if needed
  if (start > 2) {
    pages.push('...')
  }
  
  // Add middle pages
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  // Add ellipsis if needed
  if (end < total - 1) {
    pages.push('...')
  }
  
  // Always show last page (if more than 1 page)
  if (total > 1) {
    pages.push(total)
  }
  
  return pages
})

// Methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('page-change', page)
  }
}

const goToPrevious = () => {
  if (!isFirstPage.value) {
    goToPage(props.currentPage - 1)
  }
}

const goToNext = () => {
  if (!isLastPage.value) {
    goToPage(props.currentPage + 1)
  }
}

const handlePageSizeChange = () => {
  emit('page-size-change', selectedPageSize.value)
  // Reset to first page when page size changes
  if (props.currentPage > 1) {
    emit('page-change', 1)
  }
}

const handleJumpToPage = () => {
  if (jumpToPageValue.value) {
    const page = Math.max(1, Math.min(totalPages.value, jumpToPageValue.value))
    goToPage(page)
    jumpToPageValue.value = null
  }
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      goToPrevious()
      break
    case 'ArrowRight':
      event.preventDefault()
      goToNext()
      break
    case 'Home':
      event.preventDefault()
      goToPage(1)
      break
    case 'End':
      event.preventDefault()
      goToPage(totalPages.value)
      break
  }
}

// Watchers
watch(() => props.pageSize, (newPageSize) => {
  selectedPageSize.value = newPageSize
})

// Expose methods for parent component
defineExpose({
  goToPage,
  goToPrevious,
  goToNext
})
</script>

<style scoped>
/* Focus styles for better accessibility */
button:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Hover animations */
button:not(:disabled):hover {
  transform: translateY(-1px);
  transition: transform 0.1s ease;
}

button:not(:disabled):active {
  transform: translateY(0);
}

/* Page size selector styling */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  appearance: none;
}

/* Jump to page input styling */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  appearance: none;
  margin: 0;
}

input[type="number"] {
  appearance: textfield;
}

/* Loading state */
.pagination-loading {
  opacity: 0.6;
  pointer-events: none;
}

/* Disabled state improvements */
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

button:disabled:hover {
  transform: none;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .pagination-dark {
    @apply bg-slate-800 text-slate-200;
  }
  
  .pagination-dark button {
    @apply text-slate-300 hover:text-slate-100;
  }
  
  .pagination-dark .pagination-current {
    @apply bg-emerald-700 text-white;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  button:hover {
    transform: none;
    transition: none;
  }
}
</style>