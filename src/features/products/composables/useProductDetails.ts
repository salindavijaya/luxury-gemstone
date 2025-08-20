import { ref, readonly } from "vue";
import type { Product } from "../store";

export const useProductDetail = () => {
  const product = ref<Product | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchProduct = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock product data (aligned with canonical Product type)
      const mockProduct: Product = {
        id,
        name: "Exceptional Emerald Cut Diamond",
        category: "Diamond",
        gemstoneType: "Diamond",
        cut: "Excellent",
        color: "F",
        clarity: "VVS1",
        price: 12500,
        originalPrice: 15000,
        description:
          "This exceptional emerald cut diamond showcases the perfect balance of elegance and brilliance.",
        carat: 2.05,
        specifications: {
          carat: 2.05,
          cut: "Excellent",
          color: "F",
          clarity: "VVS1",
          origin: "Botswana",
        },
        images: [
          {
            url: `https://picsum.photos/800/800?random=${id}-1`,
            alt: "Main product image",
            width: 800,
            height: 800,
          },
        ],
        certification: { agency: "GIA", number: "12345678" },
        inStock: true,
        stockQuantity: 1,
        stockStatus: "in-stock",
      };

      product.value = mockProduct;
    } catch (e) {
      error.value =
        e instanceof Error
          ? e.message
          : "An error occurred while fetching the product";
    } finally {
      loading.value = false;
    }
  };

  return {
    product: readonly(product),
    loading: readonly(loading),
    error: readonly(error),
    fetchProduct,
  };
};
