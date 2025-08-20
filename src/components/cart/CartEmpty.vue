<template>
  <div
    class="flex flex-col items-center justify-center p-8 md:p-12 text-center"
  >
    <!-- Empty Cart Icon -->
    <div class="w-24 h-24 md:w-32 md:h-32 mb-6 relative">
      <div
        class="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center"
      >
        <ShoppingBagIcon class="w-12 h-12 md:w-16 md:h-16 text-slate-400" />
      </div>
      <!-- Floating sparkles animation -->
      <div
        class="absolute -top-2 -right-2 w-4 h-4 bg-amber-500 rounded-full opacity-60 animate-pulse"
      ></div>
      <div
        class="absolute top-2 -left-2 w-2 h-2 bg-emerald-500 rounded-full opacity-60 animate-pulse animation-delay-300"
      ></div>
      <div
        class="absolute -bottom-1 left-4 w-3 h-3 bg-slate-400 rounded-full opacity-40 animate-pulse animation-delay-600"
      ></div>
    </div>

    <!-- Empty State Content -->
    <h2 class="text-xl md:text-2xl font-bold text-slate-800 mb-2">
      Your cart is empty
    </h2>

    <p class="text-slate-600 mb-6 max-w-md">
      Discover our collection of exquisite gemstones and fine jewelry. Each
      piece is carefully selected for its exceptional quality and beauty.
    </p>

    <!-- Featured Categories -->
    <div v-if="showFeaturedCategories" class="w-full max-w-md mb-6">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">
        Browse by Category
      </h3>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="category in featuredCategories"
          :key="category.id"
          @click="navigateToCategory(category.slug)"
          class="p-3 bg-white border border-slate-200 rounded-lg hover:border-emerald-300 hover:shadow-md transition-all duration-200 group"
        >
          <div class="text-2xl mb-1">{{ category.icon }}</div>
          <div
            class="text-xs font-medium text-slate-700 group-hover:text-emerald-700"
          >
            {{ category.name }}
          </div>
        </button>
      </div>
    </div>

    <!-- Popular Items Suggestion -->
    <div
      v-if="showPopularItems && popularItems.length > 0"
      class="w-full max-w-md mb-6"
    >
      <h3 class="text-sm font-semibold text-slate-700 mb-3">Popular Items</h3>
      <div class="space-y-3">
        <div
          v-for="item in popularItems.slice(0, 2)"
          :key="item.id"
          class="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
          @click="navigateToProduct(item.slug)"
        >
          <img
            :src="item.image"
            :alt="item.name"
            class="w-12 h-12 object-cover rounded-lg flex-shrink-0"
            loading="lazy"
          />
          <div class="flex-1 text-left">
            <h4
              class="text-sm font-medium text-slate-800 group-hover:text-emerald-700 line-clamp-1"
            >
              {{ item.name }}
            </h4>
            <p class="text-xs text-slate-500">{{ item.category }}</p>
            <p class="text-sm font-semibold text-slate-800 mt-1">
              ${{ item.price.toLocaleString() }}
            </p>
          </div>
          <ChevronRightIcon
            class="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors"
          />
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
      <button
        v-if="showContinueShopping"
        @click="continueShopping"
        class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <MagnifyingGlassIcon class="w-4 h-4" />
        Browse Collection
      </button>

      <button
        @click="viewFeatured"
        class="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-6 rounded-lg border border-slate-300 transition-colors"
      >
        Featured Items
      </button>
    </div>

    <!-- Trust Indicators -->
    <div
      class="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-slate-200 w-full max-w-md"
    >
      <div class="flex flex-col items-center">
        <ShieldCheckIcon class="w-6 h-6 text-emerald-600 mb-1" />
        <span class="text-xs text-slate-600 text-center"
          >Certified<br />Authentic</span
        >
      </div>
      <div class="flex flex-col items-center">
        <TruckIcon class="w-6 h-6 text-emerald-600 mb-1" />
        <span class="text-xs text-slate-600 text-center"
          >Secure<br />Shipping</span
        >
      </div>
      <div class="flex flex-col items-center">
        <ArrowPathIcon class="w-6 h-6 text-emerald-600 mb-1" />
        <span class="text-xs text-slate-600 text-center"
          >30-Day<br />Returns</span
        >
      </div>
    </div>

    <!-- Newsletter Signup -->
    <div
      v-if="showNewsletter"
      class="w-full max-w-md mt-6 p-4 bg-gradient-to-r from-emerald-50 to-amber-50 rounded-lg border border-emerald-100"
    >
      <h3 class="text-sm font-semibold text-slate-800 mb-2">Stay Updated</h3>
      <p class="text-xs text-slate-600 mb-3">
        Get notified about new arrivals, exclusive deals, and gemstone insights.
      </p>
      <div class="flex gap-2">
        <input
          v-model="newsletterEmail"
          type="email"
          placeholder="Enter your email"
          class="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        <button
          @click="subscribeNewsletter"
          :disabled="!isValidEmail || isSubscribing"
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-medium rounded-md transition-colors"
        >
          <template v-if="isSubscribing">
            <div
              class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            ></div>
          </template>
          <template v-else> Join </template>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowPathIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/outline";

interface Props {
  showContinueShopping?: boolean;
  showFeaturedCategories?: boolean;
  showPopularItems?: boolean;
  showNewsletter?: boolean;
}

interface Emits {
  (e: "continue-shopping"): void;
  (e: "view-featured"): void;
}

const props = withDefaults(defineProps<Props>(), {
  showContinueShopping: true,
  showFeaturedCategories: true,
  showPopularItems: true,
  showNewsletter: true,
});

const emit = defineEmits<Emits>();
const router = useRouter();

// Newsletter state
const newsletterEmail = ref("");
const isSubscribing = ref(false);

// Mock data for featured categories
const featuredCategories = ref([
  { id: 1, name: "Diamonds", slug: "diamonds", icon: "💎" },
  { id: 2, name: "Emeralds", slug: "emeralds", icon: "💚" },
  { id: 3, name: "Rubies", slug: "rubies", icon: "❤️" },
  { id: 4, name: "Sapphires", slug: "sapphires", icon: "💙" },
]);

// Mock data for popular items
const popularItems = ref([
  {
    id: 1,
    name: "2.5ct Round Brilliant Diamond",
    category: "Diamonds",
    price: 18500,
    slug: "round-brilliant-diamond-25ct",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center",
  },
  {
    id: 2,
    name: "Colombian Emerald Ring",
    category: "Emeralds",
    price: 12800,
    slug: "colombian-emerald-ring",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center",
  },
]);

// Computed properties
const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(newsletterEmail.value);
});

// Methods
const continueShopping = () => {
  emit("continue-shopping");
  router.push("/products");
};

const viewFeatured = () => {
  emit("view-featured");
  router.push("/featured");
};

const navigateToCategory = (categorySlug: string) => {
  router.push(`/products?category=${categorySlug}`);
};

const navigateToProduct = (productSlug: string) => {
  router.push(`/products/${productSlug}`);
};

const subscribeNewsletter = async () => {
  if (!isValidEmail.value) return;

  isSubscribing.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Show success state
    newsletterEmail.value = "";
    // In a real app, you'd show a toast notification or success message
    console.log("Newsletter subscription successful!");
  } catch (error) {
    console.error("Newsletter subscription failed:", error);
  } finally {
    isSubscribing.value = false;
  }
};

// Load popular items on mount (simulate API call)
onMounted(async () => {
  // Simulate loading popular items
  // In a real app, this would fetch from your API
});
</script>

<style scoped>
/* Animation delays for sparkles */
.animation-delay-300 {
  animation-delay: 0.3s;
}

.animation-delay-600 {
  animation-delay: 0.6s;
}

/* Line clamp utility */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom gradient backgrounds */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Enhanced hover effects */
.group:hover {
  transform: translateY(-1px);
}

/* Focus styles for accessibility */
button:focus,
input:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Smooth transitions */
* {
  transition-property:
    color, background-color, border-color, text-decoration-color, fill, stroke,
    opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>
