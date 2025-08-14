<template>
  <div class="bg-white rounded-lg shadow-lg">
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b border-slate-200">
      <div class="flex items-center space-x-3">
        <h2 class="text-xl font-semibold text-slate-800">Notifications</h2>
        <span
          v-if="unreadCount > 0"
          class="bg-emerald-600 text-white text-xs font-medium px-2 py-1 rounded-full"
        >
          {{ unreadCount }}
        </span>
      </div>
      <div class="flex items-center space-x-2">
        <!-- Filter Dropdown -->
        <div class="relative">
          <button
            @click="showFilterDropdown = !showFilterDropdown"
            class="flex items-center space-x-1 px-3 py-2 text-sm text-slate-600 hover:text-slate-800 rounded-md hover:bg-slate-50"
          >
            <span>{{ selectedFilter.label }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <div
            v-if="showFilterDropdown"
            v-click-outside="() => showFilterDropdown = false"
            class="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10"
          >
            <button
              v-for="filter in filters"
              :key="filter.value"
              @click="selectFilter(filter)"
              class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg"
              :class="{ 'bg-emerald-50 text-emerald-700': selectedFilter.value === filter.value }"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>
        
        <!-- Mark All Read -->
        <button
          v-if="unreadCount > 0"
          @click="markAllAsRead"
          class="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Mark All Read
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="p-6">
      <div v-for="n in 3" :key="n" class="animate-pulse mb-4 last:mb-0">
        <div class="flex space-x-3">
          <div class="w-10 h-10 bg-slate-200 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-slate-200 rounded w-3/4"></div>
            <div class="h-3 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredNotifications.length === 0" class="text-center py-12">
      <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5zm0 0V3"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-slate-800 mb-2">No Notifications</h3>
      <p class="text-slate-600">
        {{ selectedFilter.value === 'all' ? "You're all caught up!" : `No ${selectedFilter.label.toLowerCase()} found.` }}
      </p>
    </div>

    <!-- Notifications List -->
    <div v-else class="divide-y divide-slate-200">
      <div
        v-for="notification in paginatedNotifications"
        :key="notification.id"
        class="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
        :class="{ 'bg-blue-50/50': !notification.read }"
        @click="handleNotificationClick(notification)"
      >
        <div class="flex items-start space-x-3">
          <!-- Icon -->
          <div
            class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            :class="getNotificationIconClass(notification.type)"
          >
            <component :is="getNotificationIcon(notification.type)" class="w-5 h-5" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4
                  class="text-sm font-medium text-slate-800 mb-1"
                  :class="{ 'font-semibold': !notification.read }"
                >
                  {{ notification.title }}
                </h4>
                <p class="text-sm text-slate-600 mb-2">{{ notification.message }}</p>
                
                <!-- Action Buttons -->
                <div v-if="notification.actions && notification.actions.length > 0" class="flex flex-wrap gap-2 mb-2">
                  <button
                    v-for="action in notification.actions"
                    :key="action.label"
                    @click.stop="handleAction(notification, action)"
                    class="text-xs px-3 py-1 rounded-full transition-colors"
                    :class="action.primary 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'"
                  >
                    {{ action.label }}
                  </button>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-xs text-slate-500">{{ formatDate(notification.createdAt) }}</span>
                  <div class="flex items-center space-x-2">
                    <span
                      v-if="notification.priority === 'high'"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                    >
                      High Priority
                    </span>
                    <button
                      @click.stop="toggleRead(notification)"
                      class="text-xs text-slate-500 hover:text-slate-700"
                    >
                      {{ notification.read ? 'Mark Unread' : 'Mark Read' }}
                    </button>
                    <button
                      @click.stop="deleteNotification(notification.id)"
                      class="text-xs text-slate-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <!-- Unread Indicator -->
              <div v-if="!notification.read" class="flex-shrink-0 w-2 h-2 bg-emerald-600 rounded-full mt-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="p-4 border-t border-slate-200">
      <div class="flex items-center justify-between">
        <span class="text-sm text-slate-600">
          Showing {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, filteredNotifications.length) }}
          of {{ filteredNotifications.length }} notifications
        </span>
        <div class="flex items-center space-x-2">
          <button
            @click="currentPage--"
            :disabled="currentPage <= 1"
            class="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="currentPage++"
            :disabled="currentPage >= totalPages"
            class="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNotificationsStore } from '@/stores/notifications'
import type { Notification, NotificationAction } from '@/types'

// Stores
const notificationsStore = useNotificationsStore()

// State
const isLoading = ref(true)
const showFilterDropdown = ref(false)
const currentPage = ref(1)
const pageSize = 10

// Filters
const filters = [
  { value: 'all', label: 'All Notifications' },
  { value: 'unread', label: 'Unread' },
  { value: 'order', label: 'Orders' },
  { value: 'wishlist', label: 'Wishlist' },
  { value: 'security', label: 'Security' },
  { value: 'marketing', label: 'Marketing' }
]

const selectedFilter = ref(filters[0])

// Mock notifications data
const notifications = ref<Notification[]>([
  {
    id: '1',
    type: 'order',
    title: 'Order Shipped',
    message: 'Your Royal Blue Sapphire Ring has been shipped and is on its way!',
    read: false,
    priority: 'high',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    actions: [
      { label: 'Track Package', action: 'track', primary: true },
      { label: 'View Order', action: 'view_order', primary: false }
    ]
  },
  {
    id: '2',
    type: 'wishlist',
    title: 'Price Drop Alert',
    message: 'The Emerald Cut Diamond Necklace in your wishlist is now 15% off!',
    read: false,
    priority: 'medium',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    actions: [
      { label: 'View Item', action: 'view_item', primary: true },
      { label: 'Add to Cart', action: 'add_to_cart', primary: false }
    ]
  },
  {
    id: '3',
    type: 'security',
    title: 'New Login Detected',
    message: 'We detected a new login to your account from Chrome on Windows.',
    read: true,
    priority: 'medium',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    actions: [
      { label: 'Review Activity', action: 'review_security', primary: true }
    ]
  },
  {
    id: '4',
    type: 'order',
    title: 'Order Delivered',
    message: 'Your Vintage Ruby Earrings have been delivered to your address.',
    read: true,
    priority: 'low',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    actions: [
      { label: 'Leave Review', action: 'leave_review', primary: true },
      { label: 'View Order', action: 'view_order', primary: false }
    ]
  },
  {
    id: '5',
    type: 'marketing',
    title: 'New Arrivals',
    message: 'Check out our latest collection of rare gemstones and exclusive pieces.',
    read: true,
    priority: 'low',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    actions: [
      { label: 'Browse Collection', action: 'browse', primary: true }
    ]
  }
])

// Computed properties
const unreadCount = computed(() => 
  notifications.value.filter(n => !n.read).length
)

const filteredNotifications = computed(() => {
  if (selectedFilter.value.value === 'all') {
    return notifications.value
  } else if (selectedFilter.value.value === 'unread') {
    return notifications.value.filter(n => !n.read)
  } else {
    return notifications.value.filter(n => n.type === selectedFilter.value.value)
  }
})

const paginatedNotifications = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredNotifications.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(filteredNotifications.value.length / pageSize)
)

// Methods
const loadNotifications = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
  } catch (error) {
    console.error('Error loading notifications:', error)
  } finally {
    isLoading.value = false
  }
}

const selectFilter = (filter: typeof filters[0]) => {
  selectedFilter.value = filter
  currentPage.value = 1
  showFilterDropdown.value = false
}

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    if (!notification.read) {
      notification.read = true
    }
  })
}

const toggleRead = (notification: Notification) => {
  notification.read = !notification.read
}

const deleteNotification = (notificationId: string) => {
  const index = notifications.value.findIndex(n => n.id === notificationId)
  if (index !== -1) {
    notifications.value.splice(index, 1)
  }
}

const handleNotificationClick = (notification: Notification) => {
  if (!notification.read) {
    notification.read = true
  }
  
  // Handle navigation based on notification type
  switch (notification.type) {
    case 'order':
      // Navigate to order details
      break
    case 'wishlist':
      // Navigate to wishlist or product
      break
    case 'security':
      // Navigate to security settings
      break
    case 'marketing':
      // Navigate to products or collections
      break
  }
}

const handleAction = (notification: Notification, action: NotificationAction) => {
  // Handle different actions
  switch (action.action) {
    case 'track':
      // Navigate to tracking page
      break
    case 'view_order':
      // Navigate to order details
      break
    case 'view_item':
      // Navigate to product page
      break
    case 'add_to_cart':
      // Add item to cart
      break
    case 'review_security':
      // Navigate to security settings
      break
    case 'leave_review':
      // Open review modal
      break
    case 'browse':
      // Navigate to products
      break
  }
  
  // Mark notification as read after action
  if (!notification.read) {
    notification.read = true
  }
}

const getNotificationIcon = (type: string) => {
  const icons = {
    order: 'ShoppingBagIcon',
    wishlist: 'HeartIcon',
    security: 'ShieldCheckIcon',
    marketing: 'SpeakerphoneIcon'
  }
  return icons[type as keyof typeof icons] || 'BellIcon'
}

const getNotificationIconClass = (type: string) => {
  const classes = {
    order: 'bg-blue-100 text-blue-600',
    wishlist: 'bg-red-100 text-red-600',
    security: 'bg-yellow-100 text-yellow-600',
    marketing: 'bg-purple-100 text-purple-600'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-600'
}

const formatDate = (date: Date): string => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return `${hours}h ago`
  } else if (diffInMinutes < 10080) {
    const days = Math.floor(diffInMinutes / 1440)
    return `${days}d ago`
  } else {
    return date.toLocaleDateString()
  }
}

// Custom directive for click outside
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
  loadNotifications()
})
</script>

<style scoped>
/* Custom scrollbar for notification list */
.divide-y::-webkit-scrollbar {
  width: 6px;
}

.divide-y::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.divide-y::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.divide-y::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>