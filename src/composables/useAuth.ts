import { computed, readonly } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginCredentials, RegisterData, ResetPasswordData } from '@/stores/auth'

export const useAuth = () => {
  const authStore = useAuthStore()
  const router = useRouter()

  // Computed properties from store
  const user = computed(() => authStore.user)
  const token = computed(() => authStore.token)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isLoading = computed(() => authStore.isLoading)
  const error = computed(() => authStore.error)
  const userFullName = computed(() => authStore.userFullName)

  // Authentication methods
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      await authStore.login(credentials)
      // Redirect to intended page or dashboard after successful login
      const redirect = router.currentRoute.value.query.redirect as string
      await router.push(redirect || '/dashboard')
    } catch (error) {
      // Error is handled by the store
      throw error
    }
  }

  const register = async (data: RegisterData): Promise<void> => {
    try {
      await authStore.register(data)
      // Redirect to dashboard after successful registration
      await router.push('/dashboard')
    } catch (error) {
      // Error is handled by the store
      throw error
    }
  }

  const forgotPassword = async (data: ResetPasswordData): Promise<string> => {
    return await authStore.forgotPassword(data)
  }

  const logout = async (): Promise<void> => {
    try {
      await authStore.logout()
      // Redirect to home page after logout
      await router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      // Force redirect even if logout fails
      await router.push('/')
    }
  }

  const updateProfile = async (data: Partial<typeof user.value>): Promise<void> => {
    if (!data) return
    await authStore.updateProfile(data)
  }

  const clearError = (): void => {
    authStore.clearError()
  }

  // Route guards helpers
  const requireAuth = (): boolean => {
    if (!isAuthenticated.value) {
      router.push({
        name: 'login',
        query: { redirect: router.currentRoute.value.fullPath }
      })
      return false
    }
    return true
  }

  const requireGuest = (): boolean => {
    if (isAuthenticated.value) {
      router.push('/dashboard')
      return false
    }
    return true
  }

  // User role and permission helpers (for future use)
  const hasRole = (role: string): boolean => {
    // Placeholder for role-based access control
    // In a real app, user roles would be part of the user object
    return true
  }

  const hasPermission = (permission: string): boolean => {
    // Placeholder for permission-based access control
    return true
  }

  return {
    // State (readonly)
    user: readonly(user),
    token: readonly(token),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    error: readonly(error),
    userFullName: readonly(userFullName),

    // Methods
    login,
    register,
    forgotPassword,
    logout,
    updateProfile,
    clearError,

    // Guards
    requireAuth,
    requireGuest,

    // Permissions (for future use)
    hasRole,
    hasPermission
  }
}