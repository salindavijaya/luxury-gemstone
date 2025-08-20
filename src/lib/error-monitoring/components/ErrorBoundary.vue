<template>
  <div class="error-boundary">
    <slot v-if="!hasError" />

    <!-- Error Display -->
    <div
      v-else
      class="error-container bg// Error logging service injection interface ErrorLogger { log(data: { message: string; stack?: string; name: string; timestamp: string; url: string; userAgent: string; componentInfo: ErrorInfo; retryCount: number; }): void; } const errorLogger = inject<ErrorLogger>('errorLogger', undefined)ed-50 border border-red-200 rounded-lg p-6 m-4"
    >
      <!-- Production Error Display -->
      <div v-if="!isDevelopment" class="text-center">
        <div class="mb-4">
          <svg
            class="mx-auto h-16 w-16 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-red-800 mb-2">
          {{ errorTitle }}
        </h2>
        <p class="text-red-600 mb-4">{{ errorMessage }}</p>
        <div
          class="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex sm:justify-center"
        >
          <button
            @click="retry"
            class="w-full sm:w-auto bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
          <button
            @click="goHome"
            class="w-full sm:w-auto bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
          >
            Go to Homepage
          </button>
          <button
            @click="reportError"
            class="w-full sm:w-auto border border-red-300 text-red-700 px-4 py-2 rounded-md hover:bg-red-50 transition-colors"
          >
            Report Issue
          </button>
        </div>
      </div>

      <!-- Development Error Display -->
      <div v-else class="space-y-4">
        <div class="flex items-center space-x-2">
          <svg
            class="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 class="text-lg font-semibold text-red-800">Development Error</h2>
        </div>

        <div class="bg-red-100 border-l-4 border-red-400 p-4 rounded">
          <h3 class="font-medium text-red-800">{{ error?.name || "Error" }}</h3>
          <p class="text-red-700 mt-1">{{ error?.message }}</p>
        </div>

        <div v-if="error?.stack" class="bg-gray-100 border rounded-lg p-4">
          <h4 class="font-medium text-gray-800 mb-2">Stack Trace:</h4>
          <pre
            class="text-sm text-gray-700 overflow-x-auto whitespace-pre-wrap"
            >{{ error.stack }}</pre
          >
        </div>

        <div class="space-x-3">
          <button
            @click="retry"
            class="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
          >
            Retry
          </button>
          <button
            @click="clearError"
            class="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
          >
            Clear Error
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onErrorCaptured,
  provide,
  inject,
  computed,
  onMounted,
} from "vue";
import { useRouter } from "vue-router";

interface ErrorInfo {
  componentName?: string;
  propsData?: any;
  lifecycle?: string;
  errorBoundary?: boolean;
}

interface Props {
  fallback?: "default" | "minimal" | "custom";
  errorTitle?: string;
  errorMessage?: string;
  showReportButton?: boolean;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onRetry?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  fallback: "default",
  errorTitle: "Something went wrong",
  errorMessage:
    "We apologize for the inconvenience. Please try refreshing the page.",
  showReportButton: true,
});

const router = useRouter();

const hasError = ref(false);
const error = ref<Error | null>(null);
const errorInfo = ref<ErrorInfo>({});
const retryCount = ref(0);
const maxRetries = 3;

// Environment detection
const isDevelopment = computed(() => {
  return import.meta.env?.DEV || import.meta.env?.MODE === "development";
});

// Error logging service injection
interface ErrorLogger {
  log(data: {
    message: string;
    stack?: string;
    name: string;
    timestamp: string;
    url: string;
    userAgent: string;
    componentInfo: ErrorInfo;
    retryCount: number;
  }): void;
}

const errorLogger = inject<ErrorLogger | undefined>("errorLogger");

/**
 * Capture and handle errors from child components
 */
onErrorCaptured((err: Error, instance, info: string) => {
  console.error("ErrorBoundary caught error:", err);

  hasError.value = true;
  error.value = err;
  errorInfo.value = {
    componentName:
      instance?.$options.name || instance?.$options.__name || "Unknown",
    propsData: instance?.$props,
    lifecycle: info,
    errorBoundary: true,
  };

  // Log error to external service
  logError(err, errorInfo.value);

  // Call custom error handler
  if (props.onError) {
    props.onError(err, errorInfo.value);
  }

  // Prevent error from propagating further
  return false;
});

/**
 * Handle global unhandled errors
 */
const handleGlobalError = (event: ErrorEvent) => {
  console.error("Global error caught by ErrorBoundary:", event.error);

  if (!hasError.value) {
    hasError.value = true;
    error.value = event.error || new Error(event.message);
    errorInfo.value = {
      componentName: "Global",
      lifecycle: "runtime",
      errorBoundary: true,
    };

    logError(error.value, errorInfo.value);
  }
};

/**
 * Handle unhandled promise rejections
 */
const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  console.error(
    "Unhandled promise rejection caught by ErrorBoundary:",
    event.reason
  );

  if (!hasError.value) {
    hasError.value = true;
    error.value =
      event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason));
    errorInfo.value = {
      componentName: "Promise",
      lifecycle: "async",
      errorBoundary: true,
    };

    logError(error.value, errorInfo.value);
  }
};

/**
 * Log error to external service or console
 */
const logError = (error: Error | null, info: ErrorInfo) => {
  if (!error) return;

  const errorData = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    componentInfo: info,
    retryCount: retryCount.value,
  };

  // Log to console in development
  if (isDevelopment.value) {
    console.group("🚨 Error Boundary");
    console.error("Error:", error);
    console.log("Error Info:", info);
  }

  // Log to external service if available
  const logger = errorLogger as
    | { log?: (data: typeof errorData) => void }
    | undefined;
  if (logger?.log) {
    logger.log(errorData);
  }
  if (isDevelopment.value) {
    console.group("🚨 Error Boundary");
    console.error("Error:", error);
    console.log("Error Info:", info);
    console.log("Full Error Data:", errorData);
    console.groupEnd();
  }

  // Send to analytics or monitoring service
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "exception", {
      description: error.message,
      fatal: false,
    });
  }
};

/**
 * Retry the failed component
 */
const retry = () => {
  if (retryCount.value < maxRetries) {
    retryCount.value++;
    hasError.value = false;
    error.value = null;
    errorInfo.value = {};

    if (props.onRetry) {
      props.onRetry();
    }
  } else {
    // Max retries reached, redirect to home
    goHome();
  }
};

/**
 * Clear error state (for development)
 */
const clearError = () => {
  hasError.value = false;
  error.value = null;
  errorInfo.value = {};
  retryCount.value = 0;
};

/**
 * Navigate to homepage
 */
const goHome = () => {
  router.push("/").catch(() => {
    // Fallback if router fails
    window.location.href = "/";
  });
};

/**
 * Report error to support
 */
const reportError = () => {
  const errorReport = {
    error: error.value?.message,
    stack: error.value?.stack,
    component: errorInfo.value.componentName,
    url: window.location.href,
    timestamp: new Date().toISOString(),
  };

  // Create mailto link with error details
  const subject = encodeURIComponent("Error Report - Gemstone Luxury");
  const body = encodeURIComponent(`
Error Report

Error Message: ${errorReport.error}
Component: ${errorReport.component}
URL: ${errorReport.url}
Timestamp: ${errorReport.timestamp}

Stack Trace:
${errorReport.stack}

Please describe what you were doing when this error occurred:


  `);

  window.open(
    `mailto:support@gemstoneluxury.com?subject=${subject}&body=${body}`
  );
};

// Provide error boundary context to child components
provide("errorBoundary", {
  hasError: hasError.value,
  reportError: (err: Error) => {
    if (!hasError.value) {
      hasError.value = true;
      error.value = err;
      logError(err, { componentName: "Manual Report" });
    }
  },
});

onMounted(() => {
  // Listen for global errors
  window.addEventListener("error", handleGlobalError);
  window.addEventListener("unhandledrejection", handleUnhandledRejection);
});

// Cleanup event listeners
const cleanup = () => {
  window.removeEventListener("error", handleGlobalError);
  window.removeEventListener("unhandledrejection", handleUnhandledRejection);
};

// Vue 3 doesn't have beforeDestroy, use onBeforeUnmount
import { onBeforeUnmount } from "vue";
onBeforeUnmount(cleanup);
</script>

<style scoped>
.error-boundary {
  min-height: 100%;
}

.error-container {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

pre {
  max-height: 300px;
  overflow-y: auto;
}

@media (max-width: 640px) {
  .error-container {
    margin: 1rem;
    padding: 1rem;
  }
}
</style>
