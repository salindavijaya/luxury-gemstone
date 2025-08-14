import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * Authentication guard - requires user to be logged in
 * Redirects to login page if not authenticated
 */
export const requireAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    // Store the intended destination for redirect after login
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

/**
 * Guest guard - requires user to be logged out
 * Redirects to dashboard if already authenticated
 */
export const requireGuest = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated) {
    // Redirect to dashboard or home page
    next({ name: 'dashboard' })
  } else {
    next()
  }
}

/**
 * Admin guard - requires user to be logged in and have admin role
 * In a real app, this would check user roles from the user object
 */
export const requireAdmin = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  } else {
    // In a real app, check user roles here
    // For now, we'll assume all authenticated users have access
    // const hasAdminRole = authStore.user?.roles?.includes('admin')
    const hasAdminRole = true // Placeholder

    if (hasAdminRole) {
      next()
    } else {
      // Redirect to unauthorized page or dashboard
      next({ name: 'dashboard' })
    }
  }
}

/**
 * Email verification guard - requires user to have verified email
 * Redirects to email verification page if email not verified
 */
export const requireEmailVerification = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  } else if (!authStore.user?.emailVerified) {
    next({ name: 'verify-email' })
  } else {
    next()
  }
}

/**
 * Permission guard factory - creates a guard that checks for specific permissions
 * @param permission - The permission to check for
 * @returns Navigation guard function
 */
export const requirePermission = (permission: string) => {
  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ): void => {
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated) {
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
    } else {
      // In a real app, check user roles here
      // const userRoles = authStore.user?.roles || []
      // const hasRequiredRole = roleArray.some(role => userRoles.includes(role))
      const hasRequiredRole = true // Placeholder

      if (hasRequiredRole) {
        next()
      } else {
        // Redirect to unauthorized page
        next({ name: 'unauthorized' })
      }
    }
  }
}

/**
 * Setup route guards for Vue Router
 * Call this function when setting up your router
 */
export const setupRouteGuards = (router: any) => {
  // Global before guard - runs before every route navigation
  router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authStore = useAuthStore()

    // Check authentication state from storage on app startup
    if (!authStore.isAuthenticated && !authStore.isLoading) {
      await authStore.checkAuth()
    }

    // Continue with navigation
    next()
  })

  // Global after guard - runs after every route navigation
  router.afterEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    // Clear any auth errors when navigating
    const authStore = useAuthStore()
    if (authStore.error) {
      authStore.clearError()
    }

    // Update document title based on route meta
    if (to.meta?.title) {
      document.title = `${to.meta.title} - Gemstone Store`
    }
  })
}.fullPath }
      })
    } else {
      // In a real app, check user permissions here
      // For now, we'll assume all authenticated users have all permissions
      // const hasPermission = authStore.user?.permissions?.includes(permission)
      const hasPermission = true // Placeholder

      if (hasPermission) {
        next()
      } else {
        // Redirect to unauthorized page
        next({ name: 'unauthorized' })
      }
    }
  }
}

/**
 * Role guard factory - creates a guard that checks for specific roles
 * @param roles - The role(s) to check for
 * @returns Navigation guard function
 */
export const requireRole = (roles: string | string[]) => {
  const roleArray = Array.isArray(roles) ? roles : [roles]

  return (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ): void => {
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated) {
      next({
        name: 'login',
        query: { redirect: to