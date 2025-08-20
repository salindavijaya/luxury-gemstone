<template>
  <teleport to="body">
    <transition
      name="modal"
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="modalTitleId"
        @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        ></div>

        <!-- Modal Container -->
        <div
          class="flex min-h-full items-center justify-center p-4 text-center sm:p-0"
        >
          <transition
            name="modal-content"
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div
              v-if="isOpen"
              ref="modalRef"
              class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-md mx-auto"
              @click.stop
              @keydown.esc="closeModal"
              tabindex="-1"
            >
              <!-- Close Button -->
              <button
                type="button"
                class="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-full transition-colors duration-200"
                @click="closeModal"
                :aria-label="$t ? $t('common.close') : 'Close'"
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

              <!-- Modal Content -->
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <!-- Dynamic Component Rendering -->
                <component
                  :is="currentComponent"
                  v-bind="componentProps"
                  @switchTo="handleSwitchTo"
                  @success="handleAuthSuccess"
                  @close="closeModal"
                />
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import AuthLogin from "./AuthLogin.vue";
import AuthRegister from "./AuthRegister.vue";
import AuthForgotPassword from "./AuthForgotPassword.vue";

// Props
interface Props {
  isOpen: boolean;
  initialView?: "login" | "register" | "forgot-password";
  title?: string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  initialView: "login",
  closeOnBackdrop: true,
  closeOnEscape: true,
});

// Emits
interface Emits {
  "update:isOpen": [value: boolean];
  close: [];
  authSuccess: [data: any];
  switchView: [view: "login" | "register" | "forgot-password"];
}

const emit = defineEmits<Emits>();

// State
const currentView = ref<"login" | "register" | "forgot-password">(
  props.initialView
);
const modalRef = ref<HTMLElement>();

// Computed
const currentComponent = computed(() => {
  switch (currentView.value) {
    case "login":
      return AuthLogin;
    case "register":
      return AuthRegister;
    case "forgot-password":
      return AuthForgotPassword;
    default:
      return AuthLogin;
  }
});

const componentProps = computed(() => {
  // Pass any specific props to the auth components
  return {};
});

const modalTitleId = computed(() => {
  return `modal-title-${currentView.value}`;
});

// Methods
const closeModal = () => {
  if (props.closeOnEscape) {
    emit("update:isOpen", false);
    emit("close");
  }
};

const handleBackdropClick = (event: MouseEvent) => {
  if (props.closeOnBackdrop && event.target === event.currentTarget) {
    closeModal();
  }
};

// Accept unknown from child emits and narrow safely
const handleSwitchTo = (view: unknown) => {
  if (view !== "login" && view !== "register" && view !== "forgot-password")
    return;
  currentView.value = view;
  emit("switchView", view);

  // Focus management after view switch
  nextTick(() => {
    focusFirstInput();
  });
};

const handleAuthSuccess = (data: any) => {
  emit("authSuccess", data);
  emit("update:isOpen", false);
  emit("close");
};

const focusFirstInput = () => {
  // Focus the first input in the current auth component
  const firstInput = modalRef.value?.querySelector("input:not([disabled])");
  (firstInput as HTMLElement)?.focus();
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.isOpen) return;

  // Handle Escape key
  if (event.key === "Escape" && props.closeOnEscape) {
    event.preventDefault();
    closeModal();
    return;
  }

  // Handle Tab key for focus trapping
  if (event.key === "Tab") {
    trapFocus(event);
  }
};

const trapFocus = (event: KeyboardEvent) => {
  if (!modalRef.value) return;

  const focusableElements = modalRef.value.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[
    focusableElements.length - 1
  ] as HTMLElement;

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement?.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement?.focus();
  }
};

const preventBodyScroll = () => {
  document.body.style.overflow = "hidden";
};

const restoreBodyScroll = () => {
  document.body.style.overflow = "";
};

// Watchers
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      // Reset to initial view when modal opens
      currentView.value = props.initialView;

      nextTick(() => {
        focusFirstInput();
        preventBodyScroll();
      });
    } else {
      restoreBodyScroll();
    }
  }
);

watch(
  () => props.initialView,
  (newView) => {
    currentView.value = newView;
  }
);

// Lifecycle
onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  restoreBodyScroll();
});
</script>

<style scoped>
/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-content-enter-active {
  transition: all 0.3s ease-out;
}

.modal-content-leave-active {
  transition: all 0.2s ease-in;
}

.modal-content-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(1rem);
}

.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(1rem);
}

/* Backdrop blur effect */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Focus visible styles */
.focus-visible {
  outline: 2px solid theme("colors.emerald.500");
  outline-offset: 2px;
}

/* Smooth scrollbar hiding */
.overflow-hidden {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.overflow-hidden::-webkit-scrollbar {
  display: none;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .modal-content-enter-from,
  .modal-content-leave-to {
    transform: scale(0.95) translateY(2rem);
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .bg-black {
    @apply bg-gray-900;
  }

  .backdrop-blur-sm {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active,
  .modal-content-enter-active,
  .modal-content-leave-active {
    transition: none;
  }

  .backdrop-blur-sm {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}
</style>
