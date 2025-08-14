<template>
  <nav :aria-label="ariaLabel" class="flex" aria-label="Breadcrumb">
    <ol :class="containerClasses" role="list">
      <li 
        v-for="(item, index) in items" 
        :key="item.path || index"
        class="flex items-center"
      >
        <!-- Separator -->
        <ChevronRightIcon
          v-if="index > 0"
          class="flex-shrink-0 h-4 w-4 text-slate-400 mx-2"
          aria-hidden="true"
        />

        <!-- Breadcrumb Item -->
        <div class="flex items-center">
          <!-- Icon -->
          <component
            v-if="item.icon"
            :is="item.icon"
            :class="[
              'flex-shrink-0 mr-2',
              iconSizeClasses,
              isLast(index) ? 'text-slate-500' : 'text-slate-400'
            ]"
            aria-hidden="true"
          />

          <!-- Link or Text -->
          <router-link
            v-if="!isLast(index) && item.path"
            :to="item.path"
            :class="linkClasses"
            @click="handleItemClick(item, index)"
          >
            {{ item.label }}
          </router-link>

          <button
            v-else-if="!isLast(index) && item.onClick"
            @click="handleItemClick(item, index)"
            :class="linkClasses"
            type="button"
          >
            {{ item.label }}
          </button>

          <span
            v-else
            :class="[
              'text-sm font-medium',
              isLast(index) ? 'text-slate-700' : 'text-slate-500'
            ]"
            :aria-current="isLast(index) ? 'page' : undefined"
          >
            {{ item.label }}
          </span>
        </div>
      </li>

      <!-- Dropdown for overflow items on mobile -->
      <li v-if="showDropdown && overflowItems.length > 0" class="md:hidden">
        <div class="relative">
          <button
            @click="toggleDropdown"
            class="flex items-center text-sm text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-md px-2 py-1"
            :aria-expanded="dropdownOpen"
          >
            <EllipsisHorizontalIcon class="h-4 w-4" />
            <span class="sr-only">Show more breadcrumbs</span>
          </button>

          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="dropdownOpen"
              class="absolute left-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              role="menu"
            >
              <div class="py-1">
                <template v-for="(item, index) in overflowItems" :key="item.path || index">
                  <router-link
                    v-if="item.path"
                    :to="item.path"
                    class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    role="menuitem"
                    @click="handleItemClick(item, index)"
                  >
                    {{ item.label }}
                  </router-link>
                  <button
                    v-else-if="item.onClick"
                    @click="handleItemClick(item, index)"
                    class="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    role="menuitem"
                  >
                    {{ item.label }}
                  </button>
                </template>
              </div>
            </div>
          </Transition>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronRightIcon, EllipsisHorizontalIcon } from '@heroicons/vue/24/outline'

// Types
interface BreadcrumbItem {
  label: string
  path?: string
  icon?: any
  onClick?: () => void
  meta?: Record<string, any>
}

interface Props {
  items: BreadcrumbItem[]
  size?: 'sm' | 'md' | 'lg'
  separator?: 'chevron' | 'slash' | 'dot'
  maxItems?: number
  showHome?: boolean
  homeLabel?: string
  homePath?: string
  ariaLabel?: string
}

// Props with defaults
const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  separator: 'chevron',
  maxItems: 0,
  showHome: false,
  homeLabel: 'Home',
  homePath: '/',
  ariaLabel: 'Breadcrumb navigation'
})

// Emits
const emit = defineEmits<{
  'item-click': [item: BreadcrumbItem, index: number]
}>()

// Reactive state
const dropdownOpen = ref(false)

// Computed properties
const containerClasses = computed(() => {
  const sizeClasses = {
    sm: 'flex items-center space-x-1 text-xs',
    md: 'flex items-center space-x-2 text-sm',
    lg: 'flex items-center space-x-3 text-base'
  }
  return sizeClasses[props.size]
})

const iconSizeClasses = computed(() => {
  const sizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }
  return sizes[props.size]
})

const linkClasses = computed(() => {
  const baseClasses = 'font-medium text-slate-500 hover:text-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-md px-1 py-0.5'
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }
  
  return `${baseClasses} ${sizeClasses[props.size]}`
})

const processedItems = computed(() => {
  let allItems = [...props.items]
  
  // Add home item if requested
  if (props.showHome) {
    allItems.unshift({
      label: props.homeLabel,
      path: props.homePath
    })
  }
  
  return allItems
})

const visibleItems = computed(() => {
  if (props.maxItems <= 0 || processedItems.value.length <= props.maxItems) {
    return processedItems.value
  }
  
  // Show first item, ellipsis, and last few items
  const firstItem = processedItems.value[0]
  const lastItems = processedItems.value.slice(-(props.maxItems - 1))
  
  return [firstItem, ...lastItems]
})

const overflowItems = computed(() => {
  if (props.maxItems <= 0 || processedItems.value.length <= props.maxItems) {
    return []
  }
  
  // Items that are hidden behind the ellipsis
  return processedItems.value.slice(1, -(props.maxItems - 1))
})

const showDropdown = computed(() => {
  return props.maxItems > 0 && processedItems.value.length > props.maxItems
})

// Methods
const isLast = (index: number): boolean => {
  return index === visibleItems.value.length - 1
}

const handleItemClick = (item: BreadcrumbItem, index: number) => {
  if (item.onClick) {
    item.onClick()
  }
  emit('item-click', item, index)
  dropdownOpen.value = false
}

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const handleOutsideClick = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    closeDropdown()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<style scoped>
/* Custom separator styles */
.separator-slash::before {
  content: '/';
  @apply text-slate-400 mx-2;
}

.separator-dot::before {
  content: '•';
  @apply text-slate-400 mx-2;
}

/* Focus styles for better accessibility */
.breadcrumb-link:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Hover animations */
.breadcrumb-link {
  position: relative;
  transition: all 0.2s ease;
}

.breadcrumb-link:hover {
  transform: translateY(-1px);
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .breadcrumb-item {
    max-width: 120px;
  }
  
  .breadcrumb-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .breadcrumb-link {
    @apply text-slate-300 hover:text-white;
  }
  
  .breadcrumb-current {
    @apply text-slate-100;
  }
  
  .breadcrumb-separator {
    @apply text-slate-500;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .breadcrumb-link {
    transition: none;
  }
  
  .breadcrumb-link:hover {
    transform: none;
  }
}