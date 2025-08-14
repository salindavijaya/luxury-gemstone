<template>
  <Transition
    name="slide-down"
    enter-active-class="transition-transform duration-300 ease-out"
    enter-from-class="-translate-y-full"
    enter-to-class="translate-y-0"
    leave-active-class="transition-transform duration-300 ease-in"
    leave-from-class="translate-y-0"
    leave-to-class="-translate-y-full"
  >
    <div
      v-if="!isOnline"
      class="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2 shadow-lg"
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <div class="flex items-center space-x-3">
          <!-- Offline Icon -->
          <svg
            class="h-5 w-5 text-white animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21.192 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m2.829 2.829L17.364 17M9.879 9.879a3 3 0 104.243 4.243M9.879 9.879L8.464 8.464M9.879 9.879l2.122 2.122m0 0a3 3 0 104.243 4.243M12 12l2.122 2.122M12 12L9.879 9.879M12 21a9 9 0 01-9-9m9 9c2.455 0 4.694-.643 6.664-1.772M12 21a9 9 0 009-9m-9 9c-2.455 0-4.694-.643-6.664-1.772M12 3a9 9 0 019 9m-9-9a9 9 0 00-9 9m9-9c2.455 0 4.694.643 6.664 1.772M12 3c-2.455 0-4.694.643-6.664 1.772"
            />
          </svg>
          
          <div>
            <p class="text-sm font-medium">
              You're currently offline
            </p>
            <p class="text-xs opacity-90">
              Some features may be limited. We'll sync your data when you're back online.
            </p>
          </div>
        </div>

        <!-- Retry Button -->
        <button
          @click="checkConnection"
          :disabled="isChecking"
          class="ml-4 flex items-center space-x-2 px-3 py-1 bg-white bg-opacity-20 rounded-md text-sm font-medium hover:bg-opacity-30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          :aria-label="isChecking ? 'Checking connection...' : 'Retry connection'"
        >
          <svg
            :class="[
              'h-4 w-4',
              isChecking ? 'animate-spin' : ''
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>{{ isChecking ? 'Checking...' : 'Retry' }}</span>
        </button>
      </div>
    </div>
  </Transition>

  <!-- Connection Restored Toast -->
  <Transition
    name="fade"
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="showReconnectedToast"
      class="fixed top-16 right-4 z-50 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm"
      role="alert"
      aria-live="polite"
    >
      <div class="flex items-center space-x-3">
        <svg
          class="h-5 w-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <p class="text-sm font-medium">Connection restored!</p>
          <p class="text-xs opacity-90">Syncing your data...</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useOnlineStatus } from '../composables/useOnlineStatus'

// Composables
const { isOnline, checkConnection: checkNetworkConnection } = useOnlineStatus()

// State
const isChecking = ref(false)
const showReconnectedToast = ref(false)
const reconnectedTimer = ref<NodeJS.Timeout | null>(null)

// Watch for connection changes
let previousOnlineStatus = isOnline.value

const handleConnectionChange = () => {
  if (!previousOnlineStatus && isOnline.value) {
    // Connection restored
    showReconnectedToast.value = true
    
    // Hide toast after 3 seconds
    if (reconnectedTimer.value) {
      clearTimeout(reconnectedTimer.value)
    }
    
    reconnectedTimer.value = setTimeout(() => {
      showReconnectedToast.value = false
    }, 3000)
    
    // Trigger data sync if needed
    syncOfflineData()
  }
  
  previousOnlineStatus = isOnline.value
}

// Manual connection check
const checkConnection = async () => {
  if (isChecking.value) return
  
  isChecking.value = true
  
  try {
    await checkNetworkConnection()
  } catch (error) {
    console.error('Connection check failed:', error)
  } finally {
    isChecking.value = false
  }
}

// Sync offline data when connection is restored
const syncOfflineData = async () => {
  try {
    // Check if service worker is available
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready
      await registration.sync.register('cart-sync')
    }
    
    // Emit event for other components to handle sync
    window.dispatchEvent(new CustomEvent('connection-restored'))
  } catch (error) {
    console.error('Sync failed:', error)
  }
}

onMounted(() => {
  // Watch for connection changes
  const unwatchOnline = () => {
    window.addEventListener('online', handleConnectionChange)
    window.addEventListener('offline', handleConnectionChange)
  }
  
  unwatchOnline()
  
  onUnmounted(() => {
    window.removeEventListener('online', handleConnectionChange)
    window.removeEventListener('offline', handleConnectionChange)
    
    if (reconnectedTimer.value) {
      clearTimeout(reconnectedTimer.value)
    }
  })
})
</script>

<style scoped>
/* Additional animations for better UX */
@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

.slide-down-enter-active {
  animation: slideDown 0.3s ease-out;
}

.slide-down-leave-active {
  animation: slideDown 0.3s ease-in reverse;
}
</style>