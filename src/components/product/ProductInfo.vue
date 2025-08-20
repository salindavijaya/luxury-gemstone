### components/product/ProductInfo.vue ```vue
<template>
  <div class="space-y-6">
    <!-- Product Header -->
    <div>
      <div class="flex items-center space-x-2 mb-2">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
        >
          {{ product.category }}
        </span>
        <span
          v-if="product.certified"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
        >
          Certified
        </span>
      </div>

      <h1 class="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
        {{ product.name }}
      </h1>

      <div class="flex items-center space-x-4">
        <!-- Rating -->
        <div class="flex items-center space-x-1">
          <div class="flex items-center">
            <StarIcon
              v-for="star in 5"
              :key="star"
              class="w-5 h-5"
              :class="
                star <= product.rating
                  ? 'text-amber-500 fill-current'
                  : 'text-slate-300'
              "
            />
          </div>
          <span class="text-sm text-slate-600 ml-2">
            ({{ product.reviewCount }}
            {{ product.reviewCount === 1 ? "review" : "reviews" }})
          </span>
        </div>

        <!-- Share Button -->
        <button
          @click="shareProduct"
          class="flex items-center space-x-1 text-slate-600 hover:text-emerald-600 transition-colors"
        >
          <ShareIcon class="w-5 h-5" />
          <span class="text-sm">Share</span>
        </button>
      </div>
    </div>

    <!-- Pricing -->
    <div class="bg-slate-50 rounded-lg p-6">
      <div class="flex items-baseline space-x-4">
        <span class="text-4xl font-bold text-slate-900">
          {{ formatPrice(product.price) }}
        </span>
        <span
          v-if="product.originalPrice && product.originalPrice > product.price"
          class="text-xl text-slate-500 line-through"
        >
          {{ formatPrice(product.originalPrice) }}
        </span>
        <span
          v-if="product.discount"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800"
        >
          Save {{ product.discount }}%
        </span>
      </div>

      <p class="text-slate-600 mt-2">
        {{ formatPrice(product.pricePerCarat) }} per carat
      </p>

      <!-- Payment Options -->
      <div class="mt-4 space-y-2">
        <div class="flex items-center space-x-2 text-sm text-slate-600">
          <CreditCardIcon class="w-4 h-4" />
          <span
            >Starting at {{ formatPrice(product.price / 12) }}/month with
            financing</span
          >
        </div>
        <div class="flex items-center space-x-2 text-sm text-slate-600">
          <ShieldCheckIcon class="w-4 h-4" />
          <span>30-day money-back guarantee</span>
        </div>
        <div class="flex items-center space-x-2 text-sm text-slate-600">
          <TruckIcon class="w-4 h-4" />
          <span>Free shipping on orders over $1,000</span>
        </div>
      </div>
    </div>

    <!-- Key Features -->
    <div class="grid grid-cols-2 gap-4">
      <div class="text-center p-4 bg-white rounded-lg shadow-sm">
        <div class="text-2xl font-bold text-emerald-600">
          {{ product.carat }}
        </div>
        <div class="text-sm text-slate-600">Carats</div>
      </div>
      <div class="text-center p-4 bg-white rounded-lg shadow-sm">
        <div class="text-2xl font-bold text-emerald-600">
          {{ product.clarity }}
        </div>
        <div class="text-sm text-slate-600">Clarity</div>
      </div>
      <div class="text-center p-4 bg-white rounded-lg shadow-sm">
        <div class="text-2xl font-bold text-emerald-600">
          {{ product.color }}
        </div>
        <div class="text-sm text-slate-600">Color</div>
      </div>
      <div class="text-center p-4 bg-white rounded-lg shadow-sm">
        <div class="text-2xl font-bold text-emerald-600">{{ product.cut }}</div>
        <div class="text-sm text-slate-600">Cut</div>
      </div>
    </div>

    <!-- Description -->
    <div>
      <h3 class="text-lg font-semibold text-slate-900 mb-3">Description</h3>
      <div class="prose prose-slate max-w-none">
        <p class="text-slate-700 leading-relaxed">
          {{ product.description }}
        </p>
      </div>
    </div>

    <!-- Key Details -->
    <div>
      <h3 class="text-lg font-semibold text-slate-900 mb-3">Key Details</h3>
      <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <dt class="text-sm font-medium text-slate-500">Shape</dt>
          <dd class="mt-1 text-sm text-slate-900">{{ product.shape }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-slate-500">Origin</dt>
          <dd class="mt-1 text-sm text-slate-900">{{ product.origin }}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-slate-500">Treatment</dt>
          <dd class="mt-1 text-sm text-slate-900">
            {{ product.treatment || "Natural" }}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-slate-500">Fluorescence</dt>
          <dd class="mt-1 text-sm text-slate-900">
            {{ product.fluorescence || "None" }}
          </dd>
        </div>
      </dl>
    </div>

    <!-- Trust Indicators -->
    <div class="border-t border-slate-200 pt-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <ShieldCheckIcon class="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-900">
              Authentic Guarantee
            </p>
            <p class="text-xs text-slate-600">100% genuine gemstones</p>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <CertificateIcon class="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-900">Certified Quality</p>
            <p class="text-xs text-slate-600">GIA & independent labs</p>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <ArrowPathIcon class="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-900">Easy Returns</p>
            <p class="text-xs text-slate-600">30-day return policy</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  StarIcon,
  ShareIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowPathIcon,
} from "@heroicons/vue/24/outline";
import { CertificateIcon } from "@heroicons/vue/24/solid";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  pricePerCarat: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  description: string;
  carat: number;
  clarity: string;
  color: string;
  cut: string;
  shape: string;
  origin: string;
  treatment?: string;
  fluorescence?: string;
  certified: boolean;
  inStock: boolean;
}

interface Props {
  product: Product;
}

defineProps<Props>();

// Format price utility
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

// Share product
const shareProduct = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: props.product.name,
        text: props.product.description,
        url: window.location.href,
      });
    } catch (error) {
      console.log("Share canceled");
    }
  } else {
    // Fallback: copy URL to clipboard
    await navigator.clipboard.writeText(window.location.href);
    // Show toast notification
  }
};
</script>
