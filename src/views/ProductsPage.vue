<template>
  <div class="products-page">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar -->
        <aside class="w-full lg:w-1/4">
          <ProductFilter @filter-change="handleFilterChange" />
          <ActiveFilters
            :active-filters="activeFilters"
            @remove-filter="removeFilter"
          />
        </aside>

        <!-- Products Grid -->
        <main class="w-full lg:w-3/4">
          <div class="mb-6 flex justify-between items-center">
            <h1 class="text-3xl font-semibold">Our Gemstones</h1>
            <div class="flex items-center gap-4">
              <!-- Sort Options -->
              <select
                v-model="sortOption"
                class="border rounded-md px-3 py-2"
                @change="handleSort"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard
              v-for="product in filteredProducts"
              :key="product.id"
              :product="product"
            />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ProductCard from "@/components/product/ProductCard.vue";
import ProductFilter from "@/components/product/ProductFilter.vue";
import ActiveFilters from "@/components/product/ActiveFilters.vue";
import { useProducts } from "@/composables/useProducts";
import type { Product } from "@/types";

const { filteredProducts, fetchProducts } = useProducts();

const products = ref<Product[]>(filteredProducts.value);
const sortOption = ref<string>("price-asc");
const activeFilters = ref([]);

const handleFilterChange = async (newFilters: any) => {
  activeFilters.value = newFilters;
  await loadProducts();
};

const removeFilter = async (filterKey: number) => {
  delete activeFilters.value[filterKey];
  await loadProducts();
};

const handleSort = async () => {
  await loadProducts();
};

const loadProducts = async () => {
  /* products.value = await getProducts({
    ...activeFilters.value,
    sort: sortOption.value
  }) */
  products.value = filteredProducts.value;
};

onMounted(async () => {
  console.log("Mounted ProductsPage.vue", products.value);
  if (products.value.length === 0) {
    await fetchProducts();
    //await loadProducts();
    console.log("Loading products in ProductsPage.vue", products.value);
  } else {
    console.log("Products already loaded");
  }
  //
});
</script>
