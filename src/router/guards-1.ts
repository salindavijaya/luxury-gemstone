import type {
  Router,
  NavigationGuardNext,
  RouteLocationNormalized,
} from "vue-router";
import { useAuthStore } from "@/features/auth/store";

export const requireAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  const auth = useAuthStore();
  if (!auth.isAuthenticated)
    next({ name: "login", query: { redirect: to.fullPath } });
  else next();
};

export const requireGuest = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  const auth = useAuthStore();
  if (auth.isAuthenticated) next({ name: "dashboard" });
  else next();
};

export const requireAdmin = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  const auth = useAuthStore();
  const hasAdmin = !!auth.user?.roles?.includes("admin");
  if (!auth.isAuthenticated)
    next({ name: "login", query: { redirect: to.fullPath } });
  else if (!hasAdmin) next({ name: "unauthorized" });
  else next();
};

export function setupRouteGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore();
    if (!auth.isAuthenticated && !auth.isLoading) await auth.checkAuth?.();
    next();
  });

  router.afterEach((to) => {
    if (to.meta?.title) document.title = `${to.meta.title} - Gemstone Store`;
  });
}
