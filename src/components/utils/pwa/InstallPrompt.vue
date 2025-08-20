<template>
  <Transition
    name="slide-up"
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-if="showPrompt"
      class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl"
      role="dialog"
      aria-labelledby="install-title"
      aria-describedby="install-description"
    >
      <div class="max-w-md mx-auto p-4">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg
                class="w-6 h-6 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            
            <div>
              <h3 id="install-title" class="text-lg font-semibold text-gray-900">
                Add to Home Screen
              </h3>
              <p id="install-description" class="text-sm text-gray-600">
                Get quick access to our gemstone store
              </p>
            </div>
          </div>
          
          <button
            @click="dismiss"
            class="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close install prompt"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Benefits -->
        <div class="space-y-3 mb-6">
          <div class="flex items-center space-x-3 text-sm">
            <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span class="text-gray-700">Fast access from your home screen</span>
          </div>
          
          <div class="flex items-center space-x-3 text-sm">
            <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span class="text-gray-700">Works offline for browsing</span>
          </div>
          
          <div class="flex items-center space-x-3 text-sm">
            <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span class="text-gray-700">Get notifications for new arrivals</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-3">
          <button
            @click="install"
            :disabled="installing"
            class="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :aria-label="installing ? 'Installing app...' : 'Install app'"
          >
            <span v-if="installing" class="flex items-center justify-center space-x-2">
              <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Installing...</span>
            </span>
            <span v-else>Install</span>
          </button>
          
          <button
            @click="dismiss"
            class="px-4 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Later
          </button>
        </div>

        <!-- iOS Instructions (shown when PWA prompt not available) -->
        <div v-if="showIOSInstructions" class="mt-4 p-4 bg-blue-50 rounded-lg">
          <div class="flex items-start space-x-2">
            <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <div class="text-sm">
              <p class="font-medium text-blue-900 mb-1">To install on iOS:</p>
              <ol class="text-blue-800 space-y-1 list-decimal list-inside">
                <li>Tap the Share button <span class="inline-flex items-center"><svg class="w-3 h-3 mx-1" fill="currentColor" viewBox="0 0 20 20"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg></span></li>
                <li>Select "Add to Home Screen"</li>
                <li>Tap "Add" to confirm</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Props
interface Props {
  delay?: number // Delay before showing prompt (in ms)
  maxShowCount?: number // Maximum times to show prompt
  minVisits?: number // Minimum visits before showing
}

const props = withDefaults(defineProps<Props>(), {
  delay: 3000,
  maxShowCount: 3,
  minVisits: 2
})

// State
const showPrompt = ref(false)
const installing = ref(false)
const deferredPrompt = ref<any>(null)

// Computed
const isIOS = computed(() => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
})

const showIOSInstructions = computed(() => {
  return isIOS.value && !deferredPrompt.value
})

// Storage keys
const STORAGE_KEYS = {
  SHOW_COUNT: 'pwa-install-show-count',
  DISMISSED_AT: 'pwa-install-dismissed',
  INSTALLED: 'pwa-installed',
  VISIT_COUNT: 'pwa-visit-count'
}

// Check if should show prompt
const shouldShowPrompt = (): boolean => {
  // Don't show if already installed
  if (localStorage.getItem(STORAGE_KEYS.INSTALLED) === 'true') {
    return false
  }

  // Check show count
  const showCount = parseInt(localStorage.getItem(STORAGE_KEYS.SHOW_COUNT) || '0')
  if (showCount >= props.maxShowCount) {
    return false
  }

  // Check visit count
  const visitCount = parseInt(localStorage.getItem(STORAGE_KEYS.VISIT_COUNT) || '0')
  if (visitCount < props.minVisits) {
    return false
  }

  // Check if recently dismissed (within 7 days)
  const dismissedAt = localStorage.getItem(STORAGE_KEYS.DISMISSED_AT)
  if (dismissedAt) {
    const dismissedDate = new Date(dismissedAt)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    if (dismissedDate > weekAgo) {
      return false
    }
  }

  return true
}

// Track visit
const trackVisit = () => {
  const visitCount = parseInt(localStorage.getItem(STORAGE_KEYS.VISIT_COUNT) || '0')
  localStorage.setItem(STORAGE_KEYS.VISIT_COUNT, String(visitCount + 1))
}

// Install PWA
const install = async () => {
  if (!deferredPrompt.value) {
    // Fallback for iOS or browsers without PWA support
    if (isIOS.value) {
      // iOS users need to add manually
      return
    }
    return
  }

  installing.value = true

  try {
    // Show the install prompt
    await deferredPrompt.value.prompt()
    
    // Wait for user choice
    const choiceResult = await deferredPrompt.value.userChoice
    
    if (choiceResult.outcome === 'accepted') {
      // Mark as installed
      localStorage.setItem(STORAGE_KEYS.INSTALLED, 'true')
      
      // Track successful install
      trackInstallEvent('accepted')
      
      // Hide prompt
      showPrompt.value = false
    } else {
      // User dismissed the install
      trackInstallEvent('dismissed')
    }
  } catch (error) {
    console.error('Install failed:', error)
  } finally {
    installing.value = false
    deferredPrompt.value = null
  }
}

// Dismiss prompt
const dismiss = () => {
  showPrompt.value = false
  
  // Track dismissal
  const showCount = parseInt(localStorage.getItem(STORAGE_KEYS.SHOW_COUNT) || '0')
  localStorage.setItem(STORAGE_KEYS.SHOW_COUNT, String(showCount + 1))
  localStorage.setItem(STORAGE_KEYS.DISMISSED_AT, new Date().toISOString())
  
  trackInstallEvent('later')
}

// Track install events
const trackInstallEvent = (action: 'accepted' | 'dismissed' | 'later') => {
  // Send analytics event
  if ((window as any).gtag) {
    (window as any).gtag('event', 'pwa_install_prompt', {
      event_category: 'PWA',
      event_label: action,
      value: 1
    })
  }
  
  // Custom event for app
  window.dispatchEvent(new CustomEvent('pwa-install-prompt', {
    detail: { action }
  }))
}

// Handle beforeinstallprompt event
const handleBeforeInstallPrompt = (e: Event) => {
  // Prevent default browser install prompt
  e.preventDefault()
  
  // Store the event for later use
  deferredPrompt.value = e
  
  // Show our custom prompt if conditions are met
  if (shouldShowPrompt()) {
    setTimeout(() => {
      showPrompt.value = true
      
      // Track show event
      const showCount = parseInt(localStorage.getItem(STORAGE_KEYS.SHOW_COUNT) || '0')
      localStorage.setItem(STORAGE_KEYS.SHOW_COUNT, String(showCount + 1))
      
      trackInstallEvent('dismissed') // Default to dismissed, will update if user acts
    }, props.delay)
  }
}

// Handle app installed event
const handleAppInstalled = () => {
  localStorage.setItem(STORAGE_KEYS.INSTALLED, 'true')
  showPrompt.value = false
  
  // Show success message
  window.dispatchEvent(new CustomEvent('pwa-installed'))
  
  trackInstallEvent('accepted')
}

// Check if running as PWA
const isPWA = (): boolean => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  )
}

onMounted(() => {
  // Track visit
  trackVisit()
  
  // Don't show if already running as PWA
  if (isPWA()) {
    localStorage.setItem(STORAGE_KEYS.INSTALLED, 'true')
    return
  }
  
  // Listen for install prompt event
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  
  // Listen for app installed event
  window.addEventListener('appinstalled', handleAppInstalled)
  
  // For iOS, show prompt based on conditions (no beforeinstallprompt event)
  if (isIOS.value && shouldShowPrompt()) {
    setTimeout(() => {
      showPrompt.value = true
      
      const showCount = parseInt(localStorage.getItem(STORAGE_KEYS.SHOW_COUNT) || '0')
      localStorage.setItem(STORAGE_KEYS.SHOW_COUNT, String(showCount + 1))
    }, props.delay)
  }
  
  // Cleanup
  return () => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.removeEventListener('appinstalled', handleAppInstalled)
  }
});