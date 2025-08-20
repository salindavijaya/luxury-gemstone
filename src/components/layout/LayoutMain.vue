<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300"
  >
    <!-- Mobile Menu Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      leave-active-class="transition-opacity duration-200 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="uiStore.isMobileMenuOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        @click="uiStore.closeMobileMenu"
        aria-hidden="true"
      />
    </Transition>

    <!-- Main Layout Container -->
    <div class="flex flex-col min-h-screen">
      <!-- Header -->
      <header
        class="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <LayoutHeader />
      </header>

      <!-- Mobile Navigation -->
      <LayoutMobileNav />

      <!-- Main Content Area -->
      <main class="flex-1 relative">
        <!-- Page Loading Overlay -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
        >
          <div
            v-if="uiStore.pageLoading"
            class="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-20 flex items-center justify-center"
          >
            <div class="text-center space-y-4">
              <!-- Loading Spinner -->
              <div class="relative">
                <div
                  class="w-12 h-12 border-4 border-emerald-200 dark:border-emerald-800 rounded-full animate-spin"
                >
                  <div
                    class="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-emerald-600 rounded-full animate-spin"
                  ></div>
                </div>
              </div>

              <!-- Loading Text -->
              <div class="space-y-2">
                <p class="text-slate-600 dark:text-slate-400 font-medium">
                  {{ uiStore.primaryLoadingState?.message || "Loading..." }}
                </p>

                <!-- Progress Bar -->
                <div
                  v-if="uiStore.primaryLoadingState?.progress !== undefined"
                  class="w-48 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden"
                >
                  <div
                    class="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full transition-all duration-300 ease-out"
                    :style="{
                      width: `${uiStore.primaryLoadingState.progress}%`,
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Router View with Transitions -->
        <RouterView v-slot="{ Component, route }">
          <Transition :name="getTransitionName(route)" mode="out-in" appear>
            <Suspense>
              <component :is="Component" :key="route.path" class="w-full" />

              <!-- Loading Fallback -->
              <template #fallback>
                <div class="flex items-center justify-center min-h-[50vh]">
                  <div class="text-center space-y-4">
                    <div class="inline-flex items-center space-x-2">
                      <div
                        class="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"
                      ></div>
                      <span class="text-slate-600 dark:text-slate-400"
                        >Loading page...</span
                      >
                    </div>
                  </div>
                </div>
              </template>
            </Suspense>
          </Transition>
        </RouterView>
      </main>

      <!-- Footer -->
      <footer class="mt-auto bg-slate-900 dark:bg-slate-950 text-white">
        <LayoutFooter />
      </footer>
    </div>

    <!-- Global Modals -->
    <Teleport to="body">
      <div v-if="uiStore.hasActiveModals" class="fixed inset-0 z-50">
        <TransitionGroup
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-for="(modal, index) in uiStore.modals"
            :key="modal.id"
            class="absolute inset-0 flex items-center justify-center p-4"
            :style="{ zIndex: 50 + index }"
          >
            <!-- Modal Backdrop -->
            <div
              class="absolute inset-0 bg-black/50 backdrop-blur-sm"
              @click="!modal.persistent && uiStore.closeModal(modal.id)"
            />

            <!-- Modal Container -->
            <div
              :class="[
                'relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-auto',
                getModalSizeClass(modal.size),
              ]"
              role="dialog"
              :aria-modal="true"
              @click.stop
            >
              <!-- Modal Close Button -->
              <button
                v-if="!modal.persistent"
                @click="uiStore.closeModal(modal.id)"
                class="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label="Close modal"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <!-- Dynamic Modal Content -->
              <component
                :is="modal.component"
                v-bind="modal.props"
                @close="uiStore.closeModal(modal.id)"
              />
            </div>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>

    <!-- Toast Notifications -->
    <Teleport to="body">
      <div
        v-if="uiStore.hasActiveToasts"
        class="fixed top-4 right-4 z-50 space-y-3 max-w-sm"
        role="region"
        aria-live="polite"
        aria-label="Notifications"
      >
        <TransitionGroup
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="opacity-0 translate-x-full"
          enter-to-class="opacity-100 translate-x-0"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 translate-x-full"
        >
          <div
            v-for="toast in uiStore.toasts"
            :key="toast.id"
            :class="[
              'relative bg-white dark:bg-slate-800 rounded-lg shadow-lg border-l-4 p-4 max-w-sm',
              getToastColorClass(toast.type),
            ]"
            role="alert"
          >
            <!-- Toast Content -->
            <div class="flex items-start space-x-3">
              <!-- Toast Icon -->
              <div class="flex-shrink-0 mt-0.5">
                <component :is="getToastIcon(toast.type)" class="w-5 h-5" />
              </div>

              <!-- Toast Text -->
              <div class="flex-1 min-w-0">
                <h4
                  class="text-sm font-semibold text-slate-900 dark:text-white"
                >
                  {{ toast.title }}
                </h4>
                <p
                  v-if="toast.message"
                  class="mt-1 text-sm text-slate-600 dark:text-slate-300"
                >
                  {{ toast.message }}
                </p>

                <!-- Toast Actions -->
                <div
                  v-if="toast.actions && toast.actions.length > 0"
                  class="mt-3 flex space-x-2"
                >
                  <button
                    v-for="action in toast.actions"
                    :key="action.label"
                    @click="action.action"
                    :class="[
                      'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                      action.variant === 'primary'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600',
                    ]"
                  >
                    {{ action.label }}
                  </button>
                </div>
              </div>

              <!-- Close Button -->
              <button
                @click="uiStore.dismissToast(toast.id)"
                class="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded"
                aria-label="Dismiss notification"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Progress Bar for Timed Toasts -->
            <div
              v-if="!toast.persistent && toast.duration && toast.duration > 0"
              class="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-b-lg animate-toast-progress"
              :style="{ animationDuration: `${toast.duration}ms` }"
            />
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useUIStore } from "@/features/ui/store";
import { useCartStore } from "@/features/cart/store";
import type { RouteLocationNormalized } from "vue-router";
import LayoutHeader from "./LayoutHeader.vue";
import LayoutFooter from "./LayoutFooter.vue";
import LayoutMobileNav from "./LayoutMobileNav.vue";

// Store instances
const uiStore = useUIStore();
const cartStore = useCartStore();

// Lifecycle hooks
onMounted(() => {
  // Initialize stores
  uiStore.initializeDarkMode();
  uiStore.initializeSidebar();
  uiStore.initializeBreakpoint();
  cartStore.initializeCart();

  // Initialize keyboard shortcuts
  const cleanupKeyboardShortcuts = uiStore.initializeKeyboardShortcuts();

  // Cleanup on unmount
  onUnmounted(() => {
    cleanupKeyboardShortcuts();
  });

  // Watch for cart changes and save to localStorage
  const unwatch = uiStore.$subscribe(() => {
    cartStore.saveCart();
  });

  onUnmounted(() => {
    unwatch();
  });
});

// Transition names based on route
const getTransitionName = (route: RouteLocationNormalized) => {
  // Define transition types based on route structure
  const routeTransitions: Record<string, string> = {
    "/": "fade",
    "/products": "slide-left",
    "/cart": "slide-up",
    "/auth": "fade",
    "/dashboard": "slide-right",
  };

  return routeTransitions[route.path] || "fade";
};

// Modal size classes
const getModalSizeClass = (size?: string) => {
  const sizeClasses = {
    sm: "w-full max-w-sm",
    md: "w-full max-w-md",
    lg: "w-full max-w-lg",
    xl: "w-full max-w-xl",
    full: "w-full max-w-6xl",
  };
  return sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md;
};

// Toast styling functions
const getToastColorClass = (type: string) => {
  const colorClasses = {
    success: "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
    error: "border-red-500 bg-red-50 dark:bg-red-900/20",
    warning: "border-amber-500 bg-amber-50 dark:bg-amber-900/20",
    info: "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
  };
  return colorClasses[type as keyof typeof colorClasses] || colorClasses.info;
};

const getToastIcon = (type: string) => {
  // These would be actual icon components in a real implementation
  const iconComponents = {
    success: "CheckCircleIcon",
    error: "XCircleIcon",
    warning: "ExclamationTriangleIcon",
    info: "InformationCircleIcon",
  };
  return (
    iconComponents[type as keyof typeof iconComponents] || iconComponents.info
  );
};
</script>

<style scoped>
/* Custom transition classes */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* Toast progress animation */
@keyframes toast-progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.animate-toast-progress {
  animation: toast-progress linear forwards;
}

/* Scrollbar styling for modals */
.overflow-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-auto::-webkit-scrollbar-track {
  @apply bg-slate-100 dark:bg-slate-700;
}

.overflow-auto::-webkit-scrollbar-thumb {
  @apply bg-slate-300 dark:bg-slate-500 rounded-full;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-slate-400 dark:bg-slate-400;
}
</style>
