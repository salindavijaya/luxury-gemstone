<template>
  <section class="mt-8 border-t pt-8">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-semibold">Related Products</h2>
      <router-link
        to="/products"
        class="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center"
      >
        View All
        <ChevronRightIcon class="h-5 w-5 ml-1" />
      </router-link>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard
        v-for="product in relatedProducts"
        :key="product.id"
        :product="product"
        class="w-full"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ChevronRightIcon } from "lucide-vue-next";
import type { Product } from "@/types/product";
import ProductCard from "./ProductCard.vue";

const props = defineProps<{
  product?: Product;
  category?: string;
}>();

const relatedProducts = ref<Product[]>([]);

onMounted(async () => {
  // TODO: Implement API call to fetch related products based on category or similar characteristics
  // For now, using mock data
  relatedProducts.value = [
    {
      id: "1",
      name: "Sapphire Ring",
      description: "Beautiful sapphire ring",
      price: 2999,
      images: [
        {
          id: "1",
          url: "https://picsum.photos/400/400?random=1",
          thumbnailUrl: "https://picsum.photos/100/100?random=1",
        },
      ],
      category: "Rings",
      rating: 4.5,
      reviewCount: 12,
      carat: 1.5,
      clarity: "VS1",
      color: "Blue",
      cut: "Excellent",
      shape: "Round",
      certified: true,
      inStock: true,
      stockQuantity: 1,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      has360View: false,
      pricePerCarat: 1999,
    },
    // Add more mock products here
  ];
});
</script>
