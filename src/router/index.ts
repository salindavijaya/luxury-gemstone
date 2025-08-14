import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";

// Lazy load components for better performance
const HomePage = () => import("@/views/HomePage.vue");
const ProductsPage = () => import("@/views/ProductsPage.vue");
const ProductDetailPage = () => import("@/views/ProductDetailPage.vue");
const CartPage = () => import("@/views/CartPage.vue");
const CheckoutPage = () => import("@/views/CheckoutPage.vue");
const LoginPage = () => import("@/views/auth/LoginPage.vue");
const RegisterPage = () => import("@/views/auth/RegisterPage.vue");
const ProfilePage = () => import("@/views/auth/ProfilePage.vue");
const DashboardPage = () => import("@/views/dashboard/DashboardPage.vue");
const OrdersPage = () => import("@/views/dashboard/OrdersPage.vue");
const WishlistPage = () => import("@/views/dashboard/WishlistPage.vue");
const AboutPage = () => import("@/views/AboutPage.vue");
const ContactPage = () => import("@/views/ContactPage.vue");
const NotFoundPage = () => import("@/views/NotFoundPage.vue");

// Define routes with proper typing
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: HomePage,
    meta: {
      title: "Home - Luxury Gemstone Platform",
      description: "Discover the world's finest gemstones and luxury jewelry",
      requiresAuth: false,
    },
  },
  {
    path: "/products",
    name: "products",
    component: ProductsPage,
    meta: {
      title: "Products - Luxury Gemstones",
      description:
        "Browse our collection of certified precious stones and fine jewelry",
      requiresAuth: false,
    },
  },
  {
    path: "/products/:slug",
    name: "product-detail",
    component: ProductDetailPage,
    props: true,
    meta: {
      title: "Product Details - Luxury Gemstone Platform",
      description: "View detailed information about this exquisite gemstone",
      requiresAuth: false,
    },
  },
  {
    path: "/cart",
    name: "cart",
    component: CartPage,
    meta: {
      title: "Shopping Cart - Luxury Gemstone Platform",
      description: "Review your selected gemstones and jewelry",
      requiresAuth: false,
    },
  },
  {
    path: "/checkout",
    name: "checkout",
    component: CheckoutPage,
    meta: {
      title: "Checkout - Luxury Gemstone Platform",
      description: "Complete your purchase securely",
      requiresAuth: true,
    },
  },
  {
    path: "/auth",
    children: [
      {
        path: "login",
        name: "login",
        component: LoginPage,
        meta: {
          title: "Login - Luxury Gemstone Platform",
          description: "Sign in to your account",
          requiresAuth: false,
          requiresGuest: true,
        },
      },
      {
        path: "register",
        name: "register",
        component: RegisterPage,
        meta: {
          title: "Register - Luxury Gemstone Platform",
          description: "Create your account",
          requiresAuth: false,
          requiresGuest: true,
        },
      },
    ],
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfilePage,
    meta: {
      title: "Profile - Luxury Gemstone Platform",
      description: "Manage your account settings",
      requiresAuth: true,
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardPage,
    meta: {
      title: "Dashboard - Luxury Gemstone Platform",
      description: "Your personal dashboard",
      requiresAuth: true,
    },
    children: [
      {
        path: "orders",
        name: "dashboard-orders",
        component: OrdersPage,
        meta: {
          title: "Orders - Dashboard",
          description: "View your order history",
          requiresAuth: true,
        },
      },
      {
        path: "wishlist",
        name: "dashboard-wishlist",
        component: WishlistPage,
        meta: {
          title: "Wishlist - Dashboard",
          description: "Your saved gemstones and jewelry",
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: "/about",
    name: "about",
    component: AboutPage,
    meta: {
      title: "About Us - Luxury Gemstone Platform",
      description: "Learn about our commitment to excellence and authenticity",
      requiresAuth: false,
    },
  },
  {
    path: "/contact",
    name: "contact",
    component: ContactPage,
    meta: {
      title: "Contact Us - Luxury Gemstone Platform",
      description: "Get in touch with our gemstone experts",
      requiresAuth: false,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundPage,
    meta: {
      title: "Page Not Found - Luxury Gemstone Platform",
      description: "The page you are looking for does not exist",
      requiresAuth: false,
    },
  },
];

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Smooth scroll behavior
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
        top: 80, // Account for fixed header
      };
    } else {
      return {
        top: 0,
        behavior: "smooth",
      };
    }
  },
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const uiStore = useUIStore();

  // Start loading
  uiStore.setLoading(true);

  // Close mobile menu if open
  uiStore.closeMobileMenu();

  // Check authentication requirements
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login with return URL
    next({
      name: "login",
      query: { redirect: to.fullPath },
    });
    return;
  }

  // Check guest requirements (redirect authenticated users away from login/register)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: "dashboard" });
    return;
  }

  // Update document title and meta tags
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }

  if (to.meta.description) {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", to.meta.description as string);
    }
  }

  next();
});

router.afterEach((to, from) => {
  const uiStore = useUIStore();

  // Stop loading
  uiStore.setLoading(false);

  // Track page view (analytics)
  if (typeof gtag !== "undefined") {
    gtag("config", "GA_TRACKING_ID", {
      page_title: to.meta.title,
      page_location: window.location.href,
    });
  }
});

// Handle navigation errors
router.onError((error) => {
  console.error("Router navigation error:", error);
  const uiStore = useUIStore();
  uiStore.setLoading(false);
  uiStore.showNotification({
    type: "error",
    title: "Navigation Error",
    message: "Failed to load page. Please try again.",
  });
});

export default router;

// Type declarations for route meta
declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    description?: string;
    requiresAuth?: boolean;
    requiresGuest?: boolean;
    hideFromSitemap?: boolean;
    canonical?: string;
  }
}
