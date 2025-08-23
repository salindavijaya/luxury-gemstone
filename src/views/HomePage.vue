<template>
  <div class="home-page">
    <!-- Hero Section with Image Gallery -->
    <section class="relative h-[600px] w-full">
      <HeroCarousel
        :images="heroImages"
        :autoplay="true"
        :interval="5000"
        class="w-full h-full"
      />
      <div
        class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
      >
        <div class="text-center text-white">
          <h1 class="text-5xl font-bold mb-4">Discover Exquisite Gemstones</h1>
          <p class="text-xl mb-8">
            Explore our collection of rare and precious stones
          </p>
          <router-link
            to="/products"
            class="bg-primary-600 text-white px-8 py-3 rounded-md hover:bg-primary-700 transition-colors"
          >
            Shop Collection
          </router-link>
        </div>
      </div>
    </section>

    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Featured Products Section -->
      <section class="mb-16">
        <div
          class="flex flex-col sm:flex-row justify-between items-center mb-6"
        >
          <h2 class="text-3xl font-semibold">Featured Gemstones</h2>
          <router-link
            to="/products"
            class="text-primary-600 hover:text-primary-700"
          >
            View All →
          </router-link>
        </div>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </section>

      <!-- Categories Section -->
      <section class="mb-16">
        <h2 class="text-3xl font-semibold mb-6">Browse by Category</h2>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          <FilterCategory />
          <FilterGemstoneType />
          <FilterClarity />
        </div>
      </section>

      <!-- Recently Viewed -->
      <section class="mb-16">
        <h2 class="text-3xl font-semibold mb-6">Recently Viewed</h2>
        <RecentlyViewed />
      </section>

      <!-- Wishlist Preview -->
      <section class="mb-16">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-semibold">Your Wishlist</h2>
          <router-link
            to="/dashboard/wishlist"
            class="text-primary-600 hover:text-primary-700"
          >
            View All →
          </router-link>
        </div>
        <WishlistGrid :limit="4" />
      </section>

      <!-- Product Comparison Preview -->
      <section class="mb-16">
        <h2 class="text-3xl font-semibold mb-6">Compare Gemstones</h2>
        <ProductComparition :limit="3" />
      </section>

      <!-- Quick Search -->
      <section class="mb-16 bg-gray-50 p-8 rounded-lg">
        <h2 class="text-3xl font-semibold mb-6">Find Your Perfect Gemstone</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FilterPrice />
          <FilterColor />
          <FilterCarat />
        </div>
      </section>
    </main>

    <!-- Cart Drawer -->
    <CartDrawer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ProductCard from "@/components/product/ProductCard.vue";
import FilterCategory from "@/components/product/FilterCategory.vue";
import FilterGemstoneType from "@/components/product/FilterGemstoneType.vue";
import FilterClarity from "@/components/product/FilterClarity.vue";
import FilterPrice from "@/components/product/FilterPrice.vue";
import FilterColor from "@/components/product/FilterColor.vue";
import FilterCarat from "@/components/product/FilterCarat.vue";
import HeroCarousel from "@/components/home/HeroCarousel.vue";
import RecentlyViewed from "@/components/dashboard/RecentlyViewed.vue";
import WishlistGrid from "@/components/dashboard/WishlistGrid.vue";
import ProductComparition from "@/components/dashboard/ProductComparition.vue";
import CartDrawer from "@/components/cart/CartDrawer.vue";
import { useProducts } from "@/composables/useProducts";

const { getFeaturedProducts } = useProducts();
const featuredProducts = ref([]);

// Sample images - replace with actual images once available
const heroImages = ref([
  {
    url: "/images/carosel/banner_1.jpg",
    alt: "Exquisite Diamond Collection",
  },
  {
    url: "/images/carosel/banner_2.jpg",
    alt: "Rare Ruby Collection",
  },
  {
    url: "/images/carosel/banner_3.jpg",
    alt: "Premium Sapphire Collection",
  },
  {
    url: "/images/carosel/banner_4.jpg",
    alt: "Premium Sapphire Collection",
  },
  {
    url: "/images/carosel/banner_5.jpg",
    alt: "Premium Sapphire Collection",
  },
]);

onMounted(async () => {
  featuredProducts.value = await getFeaturedProducts();
});
</script>
