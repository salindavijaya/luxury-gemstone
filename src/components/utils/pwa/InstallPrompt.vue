<template>
  <Transition name="slide-up">
    <div
      v-if="showPrompt"
      class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow"
    >
      <div class="max-w-md mx-auto p-4">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div
              class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-emerald-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold">Add to Home Screen</h3>
              <p class="text-sm text-gray-600">
                Get quick access to our gemstone store
              </p>
            </div>
          </div>
          <button @click="dismiss" class="text-gray-400">Close</button>
        </div>

        <div class="space-y-3 mb-6">
          <div class="flex items-center space-x-3 text-sm">
            <span>Fast access</span>
          </div>
          <div class="flex items-center space-x-3 text-sm">
            <span>Works offline</span>
          </div>
          <div class="flex items-center space-x-3 text-sm">
            <span>Get notifications</span>
          </div>
        </div>

        <div class="flex space-x-3">
          <button
            @click="install"
            :disabled="installing"
            class="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-lg"
          >
            {{ installing ? "Installing..." : "Install" }}
          </button>
          <button @click="dismiss" class="px-4 py-3">Later</button>
        </div>

        <div v-if="showIOSInstructions" class="mt-4 p-4 bg-blue-50 rounded-lg">
          <p class="font-medium">
            To install on iOS: Use the Share menu and "Add to Home Screen"
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

interface Props {
  delay?: number;
  maxShowCount?: number;
  minVisits?: number;
}
const props = withDefaults(defineProps<Props>(), {
  delay: 3000,
  maxShowCount: 3,
  minVisits: 2,
});

const showPrompt = ref(false);
const installing = ref(false);
const deferredPrompt = ref<any>(null);

const isIOS = computed(
  () =>
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
);
const showIOSInstructions = computed(
  () => isIOS.value && !deferredPrompt.value
);

const STORAGE_KEYS = {
  SHOW_COUNT: "pwa-install-show-count",
  DISMISSED_AT: "pwa-install-dismissed",
  INSTALLED: "pwa-installed",
  VISIT_COUNT: "pwa-visit-count",
};

const shouldShowPrompt = () => {
  if (localStorage.getItem(STORAGE_KEYS.INSTALLED) === "true") return false;
  const showCount = parseInt(
    localStorage.getItem(STORAGE_KEYS.SHOW_COUNT) || "0"
  );
  if (showCount >= props.maxShowCount) return false;
  const visitCount = parseInt(
    localStorage.getItem(STORAGE_KEYS.VISIT_COUNT) || "0"
  );
  if (visitCount < props.minVisits) return false;
  const dismissedAt = localStorage.getItem(STORAGE_KEYS.DISMISSED_AT);
  if (dismissedAt) {
    const dismissedDate = new Date(dismissedAt);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    if (dismissedDate > weekAgo) return false;
  }
  return true;
};

const trackVisit = () => {
  const v = parseInt(localStorage.getItem(STORAGE_KEYS.VISIT_COUNT) || "0");
  localStorage.setItem(STORAGE_KEYS.VISIT_COUNT, String(v + 1));
};

const install = async () => {
  if (!deferredPrompt.value) return;
  installing.value = true;
  try {
    await deferredPrompt.value.prompt();
    const choice = await deferredPrompt.value.userChoice;
    if (choice.outcome === "accepted")
      localStorage.setItem(STORAGE_KEYS.INSTALLED, "true");
  } catch (e) {
    console.error(e);
  } finally {
    installing.value = false;
    deferredPrompt.value = null;
  }
};

const dismiss = () => {
  showPrompt.value = false;
  const sc = parseInt(localStorage.getItem(STORAGE_KEYS.SHOW_COUNT) || "0");
  localStorage.setItem(STORAGE_KEYS.SHOW_COUNT, String(sc + 1));
  localStorage.setItem(STORAGE_KEYS.DISMISSED_AT, new Date().toISOString());
};

onMounted(() => {
  trackVisit();
  if (localStorage.getItem(STORAGE_KEYS.INSTALLED) === "true") return;
  window.addEventListener("beforeinstallprompt", (e: Event) => {
    e.preventDefault();
    deferredPrompt.value = e;
    if (shouldShowPrompt())
      setTimeout(() => (showPrompt.value = true), props.delay);
  });
  window.addEventListener("appinstalled", () => {
    localStorage.setItem(STORAGE_KEYS.INSTALLED, "true");
    showPrompt.value = false;
  });
});
</script>
