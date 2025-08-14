<template>
  <div
    ref="scrollerRef"
    class="relative overflow-auto"
    :class="containerClass"
    :style="containerStyle"
    @scroll="onScroll"
    @keydown="onKeyDown"
    tabindex="0"
    role="grid"
    :aria-rowcount="totalItems"
    :aria-label="ariaLabel"
  >
    <!-- Virtual spacer before visible items -->
    <div
      v-if="offsetBefore > 0"
      :style="{ height: `${offsetBefore}px` }"
      class="pointer-events-none"
      aria-hidden="true"
    />

    <!-- Rendered items -->
    <div
      v-for="(item, index) in visibleItems"
      :key="getItemKey(item, index)"
      :style="getItemStyle(index)"
      :class="getItemClass(item, index)"
      :aria-rowindex="startIndex + index + 1"
      role="gridcell"
      :tabindex="focusedIndex === startIndex + index ? 0 : -1"
      @focus="onItemFocus(startIndex + index)"
      @click="onItemClick(item, startIndex + index)"
    >
      <slot
        :item="item"
        :index="startIndex + index"
        :isVisible="true"
        :isFocused="focusedIndex === startIndex + index"
      >
        <!-- Default item rendering -->
        <div class="p-4 border-b border-slate-200">
          {{ item }}
        </div>
      </slot>
    </div>

    <!-- Virtual spacer after visible items -->
    <div
      v-if="offsetAfter > 0"
      :style="{ height: `${offsetAfter}px` }"
      class="pointer-events-none"
      aria-hidden="true"
    />

    <!-- Loading indicator -->
    <div
      v-if="loading && visibleItems.length === 0"
      class="flex items-center justify-center py-12"
      role="status"
      :aria-label="loadingText"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      <span class="ml-3 text-slate-600">{{ loadingText }}</span>
    </div>

    <!-- Empty state -->
    <div
      v-if="!loading && totalItems === 0"
      class="flex flex-col items-center justify-center py-12 text-slate-500"
      role="status"
      :aria-label="emptyText"
    >
      <svg class="w-16 h-16 mb-4 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-lg font-medium">{{ emptyText }}</p>
      <p class="text-sm mt-2">{{ emptySubtext }}</p>
    </div>

    <!-- Scroll to top button -->
    <button
      v-if="showScrollToTop && scrollTop > scrollTopThreshold"
      @click="scrollToTop"
      class="fixed bottom-6 right-6 bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      :class="scrollToTopClass"
      aria-label="Scroll to top"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { debounce } from 'lodash-es'

interface Props {
  items: any[]
  itemHeight?: number | ((item: any, index: number) => number)
  itemKey?: string | ((item: any, index: number) => string | number)
  buffer?: number
  containerClass?: string
  containerStyle?: Record<string, any>
  itemClass?: string | ((item: any, index: number) => string)
  loading?: boolean
  loadingText?: string
  emptyText?: string
  emptySubtext?: string
  ariaLabel?: string
  showScrollToTop?: boolean
  scrollTopThreshold?: number
  scrollToTopClass?: string
  overscan?: number
  estimatedItemHeight?: number
  minHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  itemHeight: 64,
  itemKey: 'id',
  buffer: 5,
  containerClass: '',
  containerStyle: () => ({}),
  itemClass: '',
  loading: false,
  loadingText: 'Loading...',
  emptyText: 'No items found',
  emptySubtext: 'Try adjusting your search or filters',
  ariaLabel: 'Virtual scrolled list',
  showScrollToTop: true,
  scrollTopThreshold: 500,
  scrollToTopClass: '',
  overscan: 5,
  estimatedItemHeight: 64,
  minHeight: 400
})

const emit = defineEmits<{
  scroll: [{ scrollTop: number; scrollLeft: number }]
  itemClick: [{ item: any; index: number }]
  visibleRangeChange: [{ startIndex: number; endIndex: number }]
  scrollToTop: []
}>()

// Refs
const scrollerRef = ref<HTMLElement>()

// State
const scrollTop = ref(0)
const containerHeight = ref(props.minHeight)
const focusedIndex = ref(-1)
const itemHeights = ref<Map<number, number>>(new Map())
const measuredItems = ref<Set<number>>(new Set())

// Computed properties
const totalItems = computed(() => props.items.length)

const getItemHeight = (index: number): number => {
  if (typeof props.itemHeight === 'function') {
    return props.itemHeight(props.items[index], index)
  }
  return itemHeights.value.get(index) || props.itemHeight || props.estimatedItemHeight
}

const totalHeight = computed(() => {
  if (totalItems.value === 0) return 0
  
  let height = 0
  for (let i = 0; i < totalItems.value; i++) {
    height += getItemHeight(i)
  }
  return height
})

const visibleRange = computed(() => {
  if (totalItems.value === 0) {
    return { start: 0, end: 0 }
  }

  const scrollPosition = scrollTop.value
  const viewportHeight = containerHeight.value
  
  let start = 0
  let currentHeight = 0
  
  // Find start index
  for (let i = 0; i < totalItems.value; i++) {
    const itemHeight = getItemHeight(i)
    if (currentHeight + itemHeight > scrollPosition) {
      start = Math.max(0, i - props.buffer)
      break
    }
    currentHeight += itemHeight
  }
  
  // Find end index
  let end = start
  currentHeight = getOffsetBefore(start)
  
  while (end < totalItems.value && currentHeight < scrollPosition + viewportHeight + props.overscan * props.estimatedItemHeight) {
    currentHeight += getItemHeight(end)
    end++
  }
  
  end = Math.min(totalItems.value - 1, end + props.buffer)
  
  return { start, end }
})

const startIndex = computed(() => visibleRange.value.start)
const endIndex = computed(() => visibleRange.value.end)

const visibleItems = computed(() => {
  return props.items.slice(startIndex.value, endIndex.value + 1)
})

const getOffsetBefore = (index: number): number => {
  let offset = 0
  for (let i = 0; i < index; i++) {
    offset += getItemHeight(i)
  }
  return offset
}

const offsetBefore = computed(() => getOffsetBefore(startIndex.value))

const offsetAfter = computed(() => {
  return Math.max(0, totalHeight.value - offsetBefore.value - visibleItems.value.reduce((sum, _, index) => {
    return sum + getItemHeight(startIndex.value + index)
  }, 0))
})

// Methods
const getItemKey = (item: any, index: number): string | number => {
  if (typeof props.itemKey === 'function') {
    return props.itemKey(item, index)
  }
  return item[props.itemKey] || index
}

const getItemStyle = (localIndex: number) => {
  const globalIndex = startIndex.value + localIndex
  return {
    minHeight: `${getItemHeight(globalIndex)}px`
  }
}

const getItemClass = (item: any, localIndex: number): string => {
  const globalIndex = startIndex.value + localIndex
  let baseClass = 'transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-inset'
  
  if (typeof props.itemClass === 'function') {
    return `${baseClass} ${props.itemClass(item, globalIndex)}`
  }
  return `${baseClass} ${props.itemClass}`
}

// Event handlers
const onScroll = debounce((event: Event) => {
  const target = event.target as HTMLElement
  scrollTop.value = target.scrollTop
  
  emit('scroll', {
    scrollTop: target.scrollTop,
    scrollLeft: target.scrollLeft
  })
}, 16) // ~60fps

const onItemClick = (item: any, index: number) => {
  emit('itemClick', { item, index })
}

const onItemFocus = (index: number) => {
  focusedIndex.value = index
}

const onKeyDown = (event: KeyboardEvent) => {
  if (totalItems.value === 0) return
  
  const currentFocus = focusedIndex.value
  let newFocus = currentFocus
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      newFocus = Math.min(totalItems.value - 1, currentFocus + 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      newFocus = Math.max(0, currentFocus - 1)
      break
    case 'Home':
      event.preventDefault()
      newFocus = 0
      break
    case 'End':
      event.preventDefault()
      newFocus = totalItems.value - 1
      break
    case 'PageDown':
      event.preventDefault()
      newFocus = Math.min(totalItems.value - 1, currentFocus + Math.floor(containerHeight.value / props.estimatedItemHeight))
      break
    case 'PageUp':
      event.preventDefault()
      newFocus = Math.max(0, currentFocus - Math.floor(containerHeight.value / props.estimatedItemHeight))
      break
    default:
      return
  }
  
  if (newFocus !== currentFocus) {
    focusedIndex.value = newFocus
    scrollToIndex(newFocus)
  }
}

const scrollToIndex = async (index: number) => {
  if (!scrollerRef.value || index < 0 || index >= totalItems.value) return
  
  const targetOffset = getOffsetBefore(index)
  const itemHeight = getItemHeight(index)
  const currentScroll = scrollTop.value
  const viewportHeight = containerHeight.value
  
  // Check if item is already visible
  if (targetOffset >= currentScroll && targetOffset + itemHeight <= currentScroll + viewportHeight) {
    return
  }
  
  // Scroll to make item visible
  let scrollPosition: number
  if (targetOffset < currentScroll) {
    scrollPosition = targetOffset
  } else {
    scrollPosition = targetOffset + itemHeight - viewportHeight
  }
  
  scrollerRef.value.scrollTo({
    top: Math.max(0, scrollPosition),
    behavior: 'smooth'
  })
  
  await nextTick()
  
  // Focus the item after scrolling
  setTimeout(() => {
    const itemElement = scrollerRef.value?.querySelector(`[aria-rowindex="${index + 1}"]`) as HTMLElement
    itemElement?.focus()
  }, 300)
}

const scrollToTop = () => {
  if (!scrollerRef.value) return
  
  scrollerRef.value.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
  
  emit('scrollToTop')
}

const updateContainerHeight = () => {
  if (scrollerRef.value) {
    const rect = scrollerRef.value.getBoundingClientRect()
    containerHeight.value = rect.height || props.minHeight
  }
}

const measureItem = (element: HTMLElement, index: number) => {
  if (!measuredItems.value.has(index)) {
    const height = element.getBoundingClientRect().height
    itemHeights.value.set(index, height)
    measuredItems.value.add(index)
  }
}

// Watchers
watch(visibleRange, (newRange, oldRange) => {
  if (newRange.start !== oldRange?.start || newRange.end !== oldRange?.end) {
    emit('visibleRangeChange', {
      startIndex: newRange.start,
      endIndex: newRange.end
    })
  }
})

// Lifecycle
onMounted(() => {
  updateContainerHeight()
  window.addEventListener('resize', updateContainerHeight)
  
  // Initialize focus
  if (totalItems.value > 0) {
    focusedIndex.value = 0
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateContainerHeight)
})

// Public API
const scrollTo = (options: ScrollToOptions) => {
  scrollerRef.value?.scrollTo(options)
}

const getVisibleRange = () => visibleRange.value

const refresh = () => {
  itemHeights.value.clear()
  measuredItems.value.clear()
  updateContainerHeight()
}

defineExpose({
  scrollTo,
  scrollToIndex,
  scrollToTop,
  getVisibleRange,
  refresh,
  containerHeight: () => containerHeight.value,
  totalHeight: () => totalHeight.value
})
</script>

<style scoped>
/* Smooth scrolling for better UX */
.scroll-smooth {
  scroll-behavior: smooth;
}

/* Ensure proper focus visibility */
[role="gridcell"]:focus-visible {
  outline: 2px solid theme('colors.emerald.500');
  outline-offset: -2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  [role="gridcell"]:focus-visible {
    outline: 3px solid currentColor;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
</style>