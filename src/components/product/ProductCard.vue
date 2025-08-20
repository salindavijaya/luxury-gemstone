// components/ProductCard.vue
<template>
  <div
    class="group relative bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-slate-200 hover:border-emerald-300"
    @click="viewProduct"
    role="button"
    tabindex="0"
    @keydown.enter="viewProduct"
    @keydown.space.prevent="viewProduct"
    :aria-label="`View ${product.name} details`"
  >
    <!-- Image Container -->
    <div class="relative aspect-square overflow-hidden bg-slate-50">
      <img
        :src="product.images?.[0]?.url || ''"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />

      <!-- Badges -->
      <div class="absolute top-3 left-3 flex flex-col gap-1">
        <span
          v-if="product.isNew"
          class="px-2 py-1 bg-emerald-600 text-white text-xs font-medium rounded-md"
        >
          NEW
        </span>
        <span
          v-if="product.onSale"
          class="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-md"
        >
          SALE
        </span>
        <span
          v-if="product.featured"
          class="px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-md"
        >
          FEATURED
        </span>
      </div>

      <!-- Stock Status -->
      <div
        v-if="product.stockStatus !== 'in-stock'"
        class="absolute top-3 right-3"
      >
        <span
          :class="stockStatusClasses"
          class="px-2 py-1 text-xs font-medium rounded-md"
        >
          {{ stockStatusText }}
        </span>
      </div>

      <!-- Quick Actions -->
      <div
        class="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div class="flex gap-2">
          <button
            @click.stop="toggleWishlist"
            :class="[
              'flex-1 bg-white/90 backdrop-blur-sm text-slate-700 py-2 px-3 rounded-md text-sm font-medium transition-colors hover:bg-white',
              { 'text-red-600': isInWishlist },
            ]"
            :aria-label="
              isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'
            "
          >
            <svg
              class="w-4 h-4 mx-auto"
              :fill="isInWishlist ? 'currentColor' : 'none'"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <button
            @click.stop="quickView"
            class="flex-1 bg-emerald-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors"
            aria-label="Quick view product"
          >
            Quick View
          </button>
        </div>
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <!-- Title and Category -->
      <div class="mb-2">
        <p
          class="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1"
        >
          {{ product.gemstoneType }}
        </p>
        <h3
          class="font-semibold text-slate-900 text-sm leading-tight line-clamp-2"
        >
          {{ product.name }}
        </h3>
      </div>

      <!-- Specifications -->
      <div class="mb-3 space-y-1">
        <div class="flex items-center gap-2 text-xs text-slate-600">
          <span class="font-medium"
            >{{ product.specifications?.carat ?? "—" }}ct</span
          >
          <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>{{ product.specifications?.cut ?? "—" }}</span>
          <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>{{ product.specifications?.color ?? "—" }}</span>
          <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>{{ product.specifications?.clarity ?? "—" }}</span>
        </div>
        <div
          v-if="product.specifications?.origin"
          class="text-xs text-slate-500"
        >
          Origin: {{ product.specifications.origin }}
        </div>
      </div>

      <!-- Certification -->
      <div v-if="product.certification" class="mb-3">
        <div
          class="flex items-center gap-1 text-xs text-emerald-600 font-medium"
        >
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <span>{{ product.certification.agency }} Certified</span>
        </div>
      </div>

      <!-- Rating -->
      <div class="mb-3 flex items-center gap-1">
        <div class="flex items-center">
          <template v-for="i in 5" :key="i">
            <svg
              :class="[
                'w-3 h-3',
                i <= Math.floor(product.rating || 0)
                  ? 'text-amber-400'
                  : 'text-slate-300',
              ]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          </template>
        </div>
        <span class="text-xs text-slate-500 ml-1">
          {{ product.rating }} ({{ product.reviewCount }})
        </span>
      </div>

      <!-- Price -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-lg font-bold text-slate-900">
            ${{ formatPrice(product.price) }}
          </span>
          <span
            v-if="product.originalPrice"
            class="text-sm text-slate-500 line-through"
          >
            ${{ formatPrice(product.originalPrice) }}
          </span>
        </div>
        <div class="text-xs text-slate-500">
          ${{
            formatPrice(
              Math.round(
                product.price /
                  (product.specifications?.carat || product.carat || 1)
              )
            )
          }}/ct
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Product } from "@/features/products/store";

interface Props {
  product: Product;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  view: [product: Product];
  quickView: [product: Product];
  toggleWishlist: [product: Product];
}>();

// Mock wishlist state - in real app, this would come from a store
const isInWishlist = computed(() => false);

const stockStatusClasses = computed(() => {
  switch (props.product.stockStatus) {
    case "low-stock":
      return "bg-amber-100 text-amber-800";
    case "out-of-stock":
      return "bg-red-100 text-red-800";
    case "pre-order":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-green-100 text-green-800";
  }
});

const stockStatusText = computed(() => {
  switch (props.product.stockStatus) {
    case "low-stock":
      return "Low Stock";
    case "out-of-stock":
      return "Out of Stock";
    case "pre-order":
      return "Pre-Order";
    default:
      return "In Stock";
  }
});

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US").format(price);
};

const viewProduct = () => {
  emit("view", props.product);
};

const quickView = () => {
  emit("quickView", props.product);
};

const toggleWishlist = () => {
  emit("toggleWishlist", props.product);
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
