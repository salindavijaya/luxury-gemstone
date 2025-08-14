<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center px-4">
    <div class="max-w-2xl w-full text-center">
      <!-- Error Icon -->
      <div class="mb-8">
        <div class="relative inline-flex">
          <div class="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-25"></div>
          <div class="relative bg-red-100 rounded-full p-6">
            <component :is="errorIcon" class="h-16 w-16 text-red-500" />
          </div>
        </div>
      </div>

      <!-- Error Content -->
      <div class="space-y-6">
        <div>
          <h1 class="text-6xl font-bold text-slate-800 mb-2">{{ errorCode }}</h1>
          <h2 class="text-2xl font-semibold text-slate-700 mb-4">{{ errorTitle }}</h2>
          <p class="text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
            {{ errorDescription }}
          </p>
        </div>

        <!-- Suggested Actions -->
        <div class="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
          <h3 class="text-lg font-medium text-slate-800 mb-4">What can you do?</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
            <div v-for="suggestion in suggestions" :key="suggestion.id" 
                 class="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
              <component :is="suggestion.icon" class="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>{{ suggestion.text }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button @click="goHome" 
                  class="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
            <HomeIcon class="h-5 w-5 inline mr-2" />
            Go to Homepage
          </button>
          
          <button @click="goBack" 
                  class="bg-white text-slate-700 px-6 py-3 rounded-lg font-medium border border-slate-300 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
            <ArrowLeftIcon class="h-5 w-5 inline mr-2" />
            Go Back
          </button>
          
          <button @click="retry" v-if="showRetry"
                  class="bg-amber-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
            <ArrowPathIcon class="h-5 w-5 inline mr-2" />
            Try Again
          </button>
        </div>

        <!-- Contact Support -->
        <div class="pt-6 border-t border-slate-200">
          <p class="text-sm text-slate-500 mb-3">
            Still having trouble? We're here to help.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:support@gemstoneluxury.com" 
               class="inline-flex items-center justify-center px-4 py-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
              <EnvelopeIcon class="h-4 w-4 mr-2" />
              Email Support
            </a>
            <a href="tel:+1-800-GEMSTONE" 
               class="inline-flex items-center justify-center px-4 py-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
              <PhoneIcon class="h-4 w-4 mr-2" />
              Call Us
            </a>
            <button @click="openChat" 
                    class="inline-flex items-center justify-center px-4 py-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
              <ChatBubbleLeftRightIcon class="h-4 w-4 mr-2" />
              Live Chat
            </button>
          </div>
        </div>
      </div>

      <!-- Error ID for support reference -->
      <div v-if="errorId" class="mt-8 p-4 bg-slate-100 rounded-lg">
        <p class="text-xs text-slate-500">
          Error ID: <span class="font-mono text-slate-700">{{ errorId }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ExclamationTriangleIcon,
  NoSymbolIcon,
  WifiIcon,
  ClockIcon,
  ShieldExclamationIcon,
  HomeIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

interface Props {
  code?: string | number
  title?: string
  description?: string
  showRetry?: boolean
  customSuggestions?: Array<{
    id: string
    icon: any
    text: string
  }>
}

const props = withDefaults(defineProps<Props>(), {
  code: '500',
  showRetry: true
})

const router = useRouter()
const route = useRoute()

// Generate unique error ID for support tracking
const errorId = computed(() => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `ERR-${timestamp}-${random}`.toUpperCase()
})

// Get error details based on code
const errorDetails = computed(() => {
  const code = String(props.code)
  
  const errorMap: Record<string, {
    title: string
    description: string
    icon: any
    suggestions: Array<{ id: string; icon: any; text: string }>
  }> = {
    '404': {
      title: 'Page Not Found',
      description: 'The page you\'re looking for doesn\'t exist or has been moved to a new location.',
      icon: MagnifyingGlassIcon,
      suggestions: [
        { id: 'search', icon: MagnifyingGlassIcon, text: 'Search for products or collections' },
        { id: 'browse', icon: HomeIcon, text: 'Browse our featured collections' },
        { id: 'check-url', icon: InformationCircleIcon, text: 'Check the URL for typos' },
        { id: 'bookmarks', icon: CheckIcon, text: 'Update your bookmarks' }
      ]
    },
    '403': {
      title: 'Access Forbidden',
      description: 'You don\'t have permission to access this resource. Please log in or contact support.',
      icon: ShieldExclamationIcon,
      suggestions: [
        { id: 'login', icon: CheckIcon, text: 'Log in to your account' },
        { id: 'permissions', icon: InformationCircleIcon, text: 'Check your account permissions' },
        { id: 'contact', icon: EnvelopeIcon, text: 'Contact customer support' },
        { id: 'membership', icon: CheckIcon, text: 'Upgrade your membership' }
      ]
    },
    '500': {
      title: 'Server Error',
      description: 'Something went wrong on our end. Our team has been notified and is working on a fix.',
      icon: ExclamationTriangleIcon,
      suggestions: [
        { id: 'wait', icon: ClockIcon, text: 'Wait a few minutes and try again' },
        { id: 'refresh', icon: ArrowPathIcon, text: 'Refresh the page' },
        { id: 'clear-cache', icon: InformationCircleIcon, text: 'Clear your browser cache' },
        { id: 'support', icon: EnvelopeIcon, text: 'Report the issue to support' }
      ]
    },
    '502': {
      title: 'Service Unavailable',
      description: 'Our servers are temporarily unavailable. We\'re working to restore service as quickly as possible.',
      icon: NoSymbolIcon,
      suggestions: [
        { id: 'retry', icon: ArrowPathIcon, text: 'Try again in a few minutes' },
        { id: 'status', icon: InformationCircleIcon, text: 'Check our status page' },
        { id: 'social', icon: ChatBubbleLeftRightIcon, text: 'Follow us on social media for updates' },
        { id: 'offline', icon: WifiIcon, text: 'Browse our offline catalog' }
      ]
    },
    '503': {
      title: 'Maintenance Mode',
      description: 'We\'re currently performing scheduled maintenance. Service will be restored shortly.',
      icon: ClockIcon,
      suggestions: [
        { id: 'wait', icon: ClockIcon, text: 'Wait for maintenance to complete' },
        { id: 'status', icon: InformationCircleIcon, text: 'Check maintenance status' },
        { id: 'newsletter', icon: EnvelopeIcon, text: 'Subscribe for service updates' },
        { id: 'offline', icon: WifiIcon, text: 'Browse offline content' }
      ]
    }
  }

  return errorMap[code] || errorMap['500']
})

const errorCode = computed(() => props.code || '500')
const errorTitle = computed(() => props.title || errorDetails.value.title)
const errorDescription = computed(() => props.description || errorDetails.value.description)
const errorIcon = computed(() => errorDetails.value.icon)
const suggestions = computed(() => props.customSuggestions || errorDetails.value.suggestions)

/**
 * Navigate to homepage
 */
const goHome = () => {
  router.push('/').catch(() => {
    window.location.href = '/'
  })
}

/**
 * Go back to previous page
 */
const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    goHome()
  }
}

/**
 * Retry current page
 */
const retry = () => {
  window.location.reload()
}

/**
 * Open chat support
 */
const openChat = () => {
  // Implement chat widget opening logic
  if ((window as any).Intercom) {
    (window as any).Intercom('show')
  } else if ((window as any).Crisp) {
    (window as any).Crisp.chat.open()
  } else {
    // Fallback to email
    window.open('mailto:support@gemstoneluxury.com')
  }
}

/**
 * Track error page view for analytics
 */
const trackErrorView = () => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'page_view', {
      page_title: `Error ${errorCode.value}`,
      page_location: window.location.href,
      custom_parameters: {
        error_code: errorCode.value,
        error_id: errorId.value
      }
    })
  }
}

onMounted(() => {
  trackErrorView()
})
</script>

<style scoped>
/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.max-w-2xl > div {
  animation: fadeInUp 0.6s ease-out;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .text-6xl {
    font-size: 3rem;
  }
  
  .text-2xl {
    font-size: 1.5rem;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .bg-gradient-to-br {
    background: white;
  }
  
  .bg-slate-50,
  .bg-emerald-50 {
    background: white;
    border: 1px solid black;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .animate-ping {
    animation: none;
  }
  
  * {
    animation: none !important;
    transition: none !important;
  }
}
</style>