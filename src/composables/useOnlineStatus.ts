import { ref, onMounted, onUnmounted, readonly } from "vue";

export function useOnlineStatus() {
  const online = ref<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const isChecking = ref(false);

  const update = () => {
    online.value = typeof navigator !== "undefined" ? navigator.onLine : true;
  };

  const checkConnection = async () => {
    if (isChecking.value) return;

    isChecking.value = true;
    try {
      // Try to fetch a small resource to confirm connectivity
      await fetch("/ping", {
        method: "HEAD",
        cache: "no-cache",
      });
      online.value = true;
    } catch (err) {
      online.value = false;
    } finally {
      isChecking.value = false;
    }
  };

  onMounted(() => {
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
  });

  onUnmounted(() => {
    window.removeEventListener("online", update);
    window.removeEventListener("offline", update);
  });

  return {
    isOnline: online,
    checkConnection,
    isChecking: readonly(isChecking),
  };
}
