import type { RouteLocationNormalized, NavigationGuardNext } from "vue-router";
import { useAuthStore } from "@/features/auth/store";

/**
 * Authentication guard types
 */
export interface RouteMetaAuth {
  requiresAuth?: boolean;
  requiresGuest?: boolean;
  roles?: string[];
  permissions?: string[];
  redirectTo?: string;
}

/**
 * Enhanced route meta interface
 */
declare module "vue-router" {
  interface RouteMeta extends RouteMetaAuth {
    title?: string;
    description?: string;
    layout?: string;
  }
}

/**
 * Authentication guard - requires user to be logged in
 * Redirects to login page if not authenticated
 */
export const requiresAuth = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore();

  try {
    // Check if user is authenticated
    await authStore.checkAuth();

    if (!authStore.isAuthenticated) {
      // Store the intended destination for redirect after login
      const redirectPath = to.fullPath !== "/login" ? to.fullPath : "/";

      next({
        name: "login",
        query: {
          redirect: redirectPath,
          message: "Please log in to access this page",
        },
      });
      return;
    }

    // Check role-based access if roles are specified
    if (to.meta.roles && to.meta.roles.length > 0) {
      const userRoles = authStore.user?.roles || [];
      const hasRequiredRole = to.meta.roles.some((role) =>
        userRoles.includes(role)
      );

      if (!hasRequiredRole) {
        next({
          name: "unauthorized",
          query: {
            message: "You do not have permission to access this page",
          },
        });
        return;
      }
    }

    // Check permission-based access if permissions are specified
    if (to.meta.permissions && to.meta.permissions.length > 0) {
      const userPermissions = authStore.user?.permissions || [];
      const hasRequiredPermission = to.meta.permissions.some((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasRequiredPermission) {
        next({
          name: "unauthorized",
          query: {
            message: "You do not have permission to access this page",
          },
        });
        return;
      }
    }

    next();
  } catch (error) {
    console.error("Auth guard error:", error);

    // If there's an error checking auth, redirect to login
    next({
      name: "login",
      query: {
        redirect: to.fullPath,
        message: "Session expired. Please log in again.",
      },
    });
  }
};

/**
 * Guest guard - requires user to be logged out
 * Redirects authenticated users to dashboard or specified route
 */
export const requiresGuest = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore();

  try {
    await authStore.checkAuth();

    if (authStore.isAuthenticated) {
      // Check if there's a redirect query parameter
      const redirectTo =
        (to.query.redirect as string) || to.meta.redirectTo || "/dashboard";

      next(redirectTo);
      return;
    }

    next();
  } catch (error) {
    console.error("Guest guard error:", error);
    // If there's an error, allow access (assume user is guest)
    next();
  }
};

/**
 * Role-based guard - requires specific roles
 */
export const requiresRole = (roles: string[]) => {
  return async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore();

    try {
      await authStore.checkAuth();

      if (!authStore.isAuthenticated) {
        next({
          name: "login",
          query: {
            redirect: to.fullPath,
            message: "Please log in to access this page",
          },
        });
        return;
      }

      const userRoles = authStore.user?.roles || [];
      const hasRequiredRole = roles.some((role) => userRoles.includes(role));

      if (!hasRequiredRole) {
        next({
          name: "unauthorized",
          query: {
            message: `This page requires one of the following roles: ${roles.join(", ")}`,
          },
        });
        return;
      }

      next();
    } catch (error) {
      console.error("Role guard error:", error);
      next({
        name: "login",
        query: {
          redirect: to.fullPath,
          message: "Session expired. Please log in again.",
        },
      });
    }
  };
};

/**
 * Permission-based guard - requires specific permissions
 */
export const requiresPermission = (permissions: string[]) => {
  return async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore();

    try {
      await authStore.checkAuth();

      if (!authStore.isAuthenticated) {
        next({
          name: "login",
          query: {
            redirect: to.fullPath,
            message: "Please log in to access this page",
          },
        });
        return;
      }

      const userPermissions = authStore.user?.permissions || [];
      const hasRequiredPermission = permissions.some((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasRequiredPermission) {
        next({
          name: "unauthorized",
          query: {
            message: `This page requires one of the following permissions: ${permissions.join(", ")}`,
          },
        });
        return;
      }

      next();
    } catch (error) {
      console.error("Permission guard error:", error);
      next({
        name: "login",
        query: {
          redirect: to.fullPath,
          message: "Session expired. Please log in again.",
        },
      });
    }
  };
};

/**
 * Global navigation guard that handles route meta-based authentication
 */
export const globalAuthGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore();

  try {
    // Always try to restore authentication state on navigation
    if (!authStore.isInitialized) {
      await authStore.initialize();
    }

    // Handle guest-only routes
    if (to.meta.requiresGuest) {
      return requiresGuest(to, from, next);
    }

    // Handle authenticated routes
    if (to.meta.requiresAuth) {
      return requiresAuth(to, from, next);
    }

    // Handle role-based routes
    if (to.meta.roles && to.meta.roles.length > 0) {
      return requiresRole(to.meta.roles)(to, from, next);
    }

    // Handle permission-based routes
    if (to.meta.permissions && to.meta.permissions.length > 0) {
      return requiresPermission(to.meta.permissions)(to, from, next);
    }

    // No auth requirements, proceed
    next();
  } catch (error) {
    console.error("Global auth guard error:", error);

    // On error, allow navigation but clear any invalid auth state
    authStore.logout();
    next();
  }
};

/**
 * Setup navigation guards for the router
 */
export const setupGuards = (router: any) => {
  // Global before guard
  router.beforeEach(globalAuthGuard);

  // Global after guard for cleanup and tracking
  router.afterEach(
    (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
      // Update document title if route has title
      if (to.meta.title) {
        document.title = `${to.meta.title} - Gemstone Store`;
      }

      // Track page views (for analytics)
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("config", "GA_MEASUREMENT_ID", {
          page_title: to.meta.title,
          page_location: window.location.href,
          page_path: to.path,
        });
      }

      // Clear any auth-related query parameters after successful navigation
      if (to.query.message && from.name) {
        router.replace({ ...to, query: { ...to.query, message: undefined } });
      }
    }
  );

  // Global error handler
  router.onError((error: Error) => {
    console.error("Router error:", error);

    // Handle authentication errors specifically
    if (error.message.includes("auth") || error.message.includes("token")) {
      const authStore = useAuthStore();
      authStore.logout();

      router.push({
        name: "login",
        query: {
          message: "Session expired. Please log in again.",
        },
      });
    }
  });
};

/**
 * Utility function to check if a route requires authentication
 */
export const routeRequiresAuth = (route: RouteLocationNormalized): boolean => {
  return !!(
    route.meta.requiresAuth ||
    route.meta.roles?.length ||
    route.meta.permissions?.length
  );
};

/**
 * Utility function to check if a route is guest-only
 */
export const routeRequiresGuest = (route: RouteLocationNormalized): boolean => {
  return !!route.meta.requiresGuest;
};

/**
 * Get redirect path for successful authentication
 */
export const getAuthRedirectPath = (
  query: Record<string, any>,
  defaultPath: string = "/dashboard"
): string => {
  const redirect = query.redirect as string;

  // Validate redirect path to prevent open redirects
  if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
    return redirect;
  }

  return defaultPath;
};

/**
 * Admin role guard helper
 */
export const requiresAdmin = requiresRole(["admin", "super_admin"]);

/**
 * Manager role guard helper
 */
export const requiresManager = requiresRole([
  "manager",
  "admin",
  "super_admin",
]);

/**
 * Common permission guards
 */
export const canManageProducts = requiresPermission([
  "manage_products",
  "admin",
]);
export const canManageOrders = requiresPermission(["manage_orders", "admin"]);
export const canManageUsers = requiresPermission(["manage_users", "admin"]);
export const canViewReports = requiresPermission([
  "view_reports",
  "admin",
  "manager",
]);

/**
 * Example usage in router configuration:
 *
 * {
 *   path: '/dashboard',
 *   name: 'dashboard',
 *   component: Dashboard,
 *   meta: {
 *     requiresAuth: true,
 *     title: 'Dashboard'
 *   }
 * },
 * {
 *   path: '/admin',
 *   name: 'admin',
 *   component: AdminPanel,
 *   meta: {
 *     requiresAuth: true,
 *     roles: ['admin'],
 *     title: 'Admin Panel'
 *   }
 * },
 * {
 *   path: '/login',
 *   name: 'login',
 *   component: Login,
 *   meta: {
 *     requiresGuest: true,
 *     title: 'Login'
 *   }
 * }
 */
