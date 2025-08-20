import { ref, onMounted, onUnmounted } from "vue";

export function useIntersectionObserver() {
  const isIntersecting = ref(false);
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    // stub: noop observer for type-checking
    observer = new IntersectionObserver(() => {});
  });

  onUnmounted(() => {
    observer?.disconnect();
  });

  return { isIntersecting };
}
