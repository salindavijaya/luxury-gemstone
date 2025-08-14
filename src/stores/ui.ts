import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Modal {
  id: string
  component: string
  props?: Record<string, any>
  persistent?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  persistent?: boolean
  actions?: Array<{
    label: string
    action: () => void
    variant?: 'primary' | 'secondary'
  }>
}

export interface LoadingState {
  id: string
  message: string
  progress?: number
}

export const useUIStore = defineStore('ui', () => {
  // State
  const isMobileMenuOpen = ref(false)
  const isSearchOpen = ref(false)
  const isDarkMode = ref(false)
  const modals = ref<Modal[]>([])
  const toasts = ref<Toast[]>([])
  const loadingStates = ref<LoadingState[]>([])
  const pageLoading = ref(false)
  const sidebarCollapsed = ref(false)
  const currentBreakpoint = ref<'sm' | 'md' | 'lg' | 'xl'>('lg')

  // Getters
  const hasActiveModals = computed(() => modals.value.length > 0)
  const hasActiveToasts = computed(() => toasts.value.length > 0)
  const isLoading = computed(() => loadingStates.value.length > 0 || pageLoading.value)
  const primaryLoadingState = computed(() => loadingStates.value[0] || null)

  // Mobile menu actions
  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  const openMobileMenu = () => {
    isMobileMenuOpen.value = true
  }

  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
  }

  // Search actions
  const toggleSearch = () => {
    isSearchOpen.value = !isSearchOpen.value
  }

  const openSearch = () => {
    isSearchOpen.value = true
  }

  const closeSearch = () => {
    isSearchOpen.value = false
  }

  // Dark mode actions
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    updateDarkModeClass()
    saveDarkModePreference()
  }

  const setDarkMode = (enabled: boolean) => {
    isDarkMode.value = enabled
    updateDarkModeClass()
    saveDarkModePreference()
  }

  const updateDarkModeClass = () => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const saveDarkModePreference = () => {
    try {
      localStorage.setItem('luxury-gems-dark-mode', JSON.stringify(isDarkMode.value))
    } catch (err) {
      console.warn('Failed to save dark mode preference:', err)
    }
  }

  const initializeDarkMode = () => {
    try {
      const saved = localStorage.getItem('luxury-gems-dark-mode')
      if (saved !== null) {
        isDarkMode.value = JSON.parse(saved)
      } else {
        // Default to system preference
        isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      updateDarkModeClass()
    } catch (err) {
      console.warn('Failed to initialize dark mode:', err)
      isDarkMode.value = false
    }
  }

  // Modal actions
  const openModal = (modal: Omit<Modal, 'id'>) => {
    const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    modals.value.push({ ...modal, id })
    document.body.style.overflow = 'hidden'
    return id
  }

  const closeModal = (modalId?: string) => {
    if (modalId) {
      const index = modals.value.findIndex(modal => modal.id === modalId)
      if (index > -1) {
        modals.value.splice(index, 1)
      }
    } else {
      // Close the topmost modal
      modals.value.pop()
    }

    if (modals.value.length === 0) {
      document.body.style.overflow = ''
    }
  }

  const closeAllModals = () => {
    modals.value = []
    document.body.style.overflow = ''
  }

  // Toast actions
  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000
    }
    
    toasts.value.push(newToast)

    // Auto-remove toast after duration (if not persistent)
    if (!newToast.persistent && newToast.duration > 0) {
      setTimeout(() => {
        dismissToast(id)
      }, newToast.duration)
    }

    return id
  }

  const dismissToast = (toastId: string) => {
    const index = toasts.value.findIndex(toast => toast.id === toastId)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const dismissAllToasts = () => {
    toasts.value = []
  }

  // Convenience toast methods
  const showSuccessToast = (title: string, message?: string, duration?: number) => {
    return showToast({ type: 'success', title, message, duration })
  }

  const showErrorToast = (title: string, message?: string, persistent = false) => {
    return showToast({ type: 'error', title, message, persistent, duration: persistent ? 0 : 8000 })
  }

  const showWarningToast = (title: string, message?: string, duration?: number) => {
    return showToast({ type: 'warning', title, message, duration })
  }

  const showInfoToast = (title: string, message?: string, duration?: number) => {
    return showToast({ type: 'info', title, message, duration })
  }

  // Loading actions
  const startLoading = (message: string, progress?: number) => {
    const id = `loading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    loadingStates.value.push({ id, message, progress })
    return id
  }

  const updateLoading = (loadingId: string, message?: string, progress?: number) => {
    const loading = loadingStates.value.find(state => state.id === loadingId)
    if (loading) {
      if (message !== undefined) loading.message = message
      if (progress !== undefined) loading.progress = progress
    }
  }

  const stopLoading = (loadingId: string) => {
    const index = loadingStates.value.findIndex(state => state.id === loadingId)
    if (index > -1) {
      loadingStates.value.splice(index, 1)
    }
  }

  const stopAllLoading = () => {
    loadingStates.value = []
  }

  const setPageLoading = (loading: boolean) => {
    pageLoading.value = loading
  }

  // Sidebar actions
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    saveSidebarState()
  }

  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebarCollapsed.value = collapsed
    saveSidebarState()
  }

  const saveSidebarState = () => {
    try {
      localStorage.setItem('luxury-gems-sidebar-collapsed', JSON.stringify(sidebarCollapsed.value))
    } catch (err) {
      console.warn('Failed to save sidebar state:', err)
    }
  }

  const initializeSidebar = () => {
    try {
      const saved = localStorage.getItem('luxury-gems-sidebar-collapsed')
      if (saved !== null) {
        sidebarCollapsed.value = JSON.parse(saved)
      }
    } catch (err) {
      console.warn('Failed to initialize sidebar state:', err)
    }
  }

  // Breakpoint management
  const setBreakpoint = (breakpoint: typeof currentBreakpoint.value) => {
    currentBreakpoint.value = breakpoint
  }

  const initializeBreakpoint = () => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      if (width < 768) {
        currentBreakpoint.value = 'sm'
      } else if (width < 1024) {
        currentBreakpoint.value = 'md'
      } else if (width < 1280) {
        currentBreakpoint.value = 'lg'
      } else {
        currentBreakpoint.value = 'xl'
      }
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
  }

  // Utility actions
  const closeAllOverlays = () => {
    closeMobileMenu()
    closeSearch()
    closeAllModals()
  }

  const resetUI = () => {
    closeAllOverlays()
    dismissAllToasts()
    stopAllLoading()
    setPageLoading(false)
  }

  // Keyboard shortcuts
  const initializeKeyboardShortcuts = () => {
    const handleKeydown = (event: KeyboardEvent) => {
      // Escape key - close topmost overlay
      if (event.key === 'Escape') {
        if (hasActiveModals.value) {
          closeModal()
        } else if (isMobileMenuOpen.value) {
          closeMobileMenu()
        } else if (isSearchOpen.value) {
          closeSearch()
        }
      }

      // Cmd/Ctrl + K - open search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        toggleSearch()
      }

      // Cmd/Ctrl + D - toggle dark mode
      if ((event.metaKey || event.ctrlKey) && event.key === 'd') {
        event.preventDefault()
        toggleDarkMode()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    
    // Return cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }

  return {
    // State
    isMobileMenuOpen,
    isSearchOpen,
    isDarkMode,
    modals,
    toasts,
    loadingStates,
    pageLoading,
    sidebarCollapsed,
    currentBreakpoint,

    // Getters
    hasActiveModals,
    hasActiveToasts,
    isLoading,
    primaryLoadingState,

    // Mobile menu
    toggleMobileMenu,
    openMobileMenu,
    closeMobileMenu,

    // Search
    toggleSearch,
    openSearch,
    closeSearch,

    // Dark mode
    toggleDarkMode,
    setDarkMode,
    initializeDarkMode,

    // Modals
    openModal,
    closeModal,
    closeAllModals,

    // Toasts
    showToast,
    dismissToast,
    dismissAllToasts,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,

    // Loading
    startLoading,
    updateLoading,
    stopLoading,
    stopAllLoading,
    setPageLoading,

    // Sidebar
    toggleSidebar,
    setSidebarCollapsed,
    initializeSidebar,

    // Breakpoints
    setBreakpoint,
    initializeBreakpoint,

    // Utilities
    closeAllOverlays,
    resetUI,
    initializeKeyboardShortcuts
  }
})