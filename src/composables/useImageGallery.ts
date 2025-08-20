// src/composables/useImageGallery.ts
import { ref, computed, reactive } from "vue";

export interface GalleryImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt?: string;
}

export const useImageGallery = (images: GalleryImage[]) => {
  const currentImageIndex = ref(0);
  const lightboxOpen = ref(false);
  const zoomLevel = ref(1);
  const panX = ref(0);
  const panY = ref(0);
  const isZoomed = ref(false);
  const showZoomLens = ref(false);

  // Mouse position for zoom lens
  const mousePosition = reactive({
    x: 0,
    y: 0,
    containerX: 0,
    containerY: 0,
  });

  // Computed values
  const currentImage = computed(
    () => images[currentImageIndex.value] || images[0]
  );

  const zoomStyle = computed(() => {
    if (!isZoomed.value) return {};

    const translateX =
      (mousePosition.containerX - mousePosition.x) * zoomLevel.value;
    const translateY =
      (mousePosition.containerY - mousePosition.y) * zoomLevel.value;

    return {
      transform: `scale(${zoomLevel.value}) translate(${translateX}px, ${translateY}px)`,
      transformOrigin: `${mousePosition.x}px ${mousePosition.y}px`,
    };
  });

  const lensStyle = computed(() => {
    if (!showZoomLens.value) return { display: "none" };

    const lensSize = 100;
    return {
      left: `${mousePosition.x - lensSize / 2}px`,
      top: `${mousePosition.y - lensSize / 2}px`,
      width: `${lensSize}px`,
      height: `${lensSize}px`,
    };
  });

  // Methods
  const selectImage = (index: number) => {
    if (index >= 0 && index < images.length) {
      currentImageIndex.value = index;
      resetZoom();
    }
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex.value + 1) % images.length;
    selectImage(nextIndex);
  };

  const previousImage = () => {
    const prevIndex =
      currentImageIndex.value === 0
        ? images.length - 1
        : currentImageIndex.value - 1;
    selectImage(prevIndex);
  };

  const openLightbox = () => {
    lightboxOpen.value = true;
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightboxOpen.value = false;
    document.body.style.overflow = "";
    resetZoom();
  };

  const resetZoom = () => {
    isZoomed.value = false;
    zoomLevel.value = 1;
    panX.value = 0;
    panY.value = 0;
    showZoomLens.value = false;
  };

  // Mouse event handlers
  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) {
      // Desktop only
      isZoomed.value = true;
      showZoomLens.value = true;
      zoomLevel.value = 2.5;
    }
  };

  const handleMouseLeave = () => {
    resetZoom();
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (window.innerWidth < 1024) return; // Desktop only

    const container = event.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();

    mousePosition.x = event.clientX - rect.left;
    mousePosition.y = event.clientY - rect.top;
    mousePosition.containerX = rect.width / 2;
    mousePosition.containerY = rect.height / 2;
  };

  // Touch event handlers for mobile
  const handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 2) {
      // Handle pinch-to-zoom
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      // Store initial distance for pinch calculation
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (event.touches.length === 2) {
      event.preventDefault();
      // Handle pinch-to-zoom
    } else if (event.touches.length === 1 && isZoomed.value) {
      event.preventDefault();
      // Handle pan when zoomed
    }
  };

  return {
    // State
    currentImageIndex: readonly(currentImageIndex),
    currentImage,
    lightboxOpen: readonly(lightboxOpen),
    isZoomed: readonly(isZoomed),
    showZoomLens: readonly(showZoomLens),

    // Styles
    zoomStyle,
    lensStyle,

    // Methods
    selectImage,
    nextImage,
    previousImage,
    openLightbox,
    closeLightbox,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
    handleTouchStart,
    handleTouchMove,
  };
};
