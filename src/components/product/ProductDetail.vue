### components/product/ProductDetail.vue
```vue
<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-screen p-4">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-slate-800 mb-4">Product Not Found</h1>
        <p class="text-slate-600 mb-6">{{ error }}</p>
        <button 
          @click="$router.push('/products')"
          class="bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition-colors"
        >
          Browse Products
        </button>
      </div>
    </div>

    <!-- Product Content -->
    <div v-else-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumb -->
      <nav class="flex mb-8" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <router-link to="/" class="text-slate-600 hover:text-emerald-600 transition-colors">
              Home
            </router-link>
          </li>
          <li>
            <span class="mx-2 text-slate-500">/</span>
            <router-link to="/products" class="text-slate-600 hover:text-emerald-600 transition-colors">
              Products
            </router-link>
          </li>
          <li>
            <span class="mx-2 text-slate-500">/</span>
            <span class="text-slate-800 font-medium">{{ product.name }}</span>
          </li>
        </ol>
      </nav>

      <!-- Main Product Layout -->
      <div class="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
        <!-- Image Gallery -->
        <div class="lg:sticky lg:top-8">
          <ProductImageGallery 
            :images="product.images" 
            :alt="product.name"
            :has360View="product.has360View"
            @image-error="handleImageError"
          />
        </div>

        <!-- Product Information -->
        <div class="mt-8 lg:mt-0">
          <ProductInfo :product="product" />
          <ProductActions 
            :product="product" 
            class="mt-8"
            @add-to-cart="handleAddToCart"
            @add-to-wishlist="handleAddToWishlist"
          />
        </div>
      </div>

      <!-- Additional Sections -->
      <div class="mt-16 space-y-16">
        <!-- Product Specifications -->
        <ProductSpecs :product="product" />
        
        <!-- Certifications -->
        <ProductCertification 
          v-if="product.certifications?.length" 
          :certifications="product.certifications" 
        />
        
        <!-- Reviews -->
        <ProductReviews :product-id="product.id" />
        
        <!-- Related Products -->
        <ProductRelated :current-product="product" />
      </div>
    </div>

    <!-- Sticky Mobile Actions -->
    <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-50">
      <div class="flex items-center space-x-4">
        <div class="flex-1">
          <p class="text-2xl font-bold text-slate-900">
            {{ formatPrice(product?.price || 0) }}
          </p>
          <p class="text-sm text-slate-600">{{ product?.pricePerCarat }} per carat</p>
        </div>
        <button 
          @click="handleAddToCart"
          :disabled="!product?.inStock"
          class="bg-emerald-600 text-white px-8 py-3 rounded-md font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ product?.inStock ? 'Add to Cart' : 'Out of Stock' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductDetail } from '@/composables/useProductDetail'
import { useCart } from '@/composables/useCart'
import ProductImageGallery from './ProductImageGallery.vue'
import ProductInfo from './ProductInfo.vue'
import ProductSpecs from './ProductSpecs.vue'
import ProductCertification from './ProductCertification.vue'
import ProductReviews from './ProductReviews.vue'
import ProductRelated from './ProductRelated.vue'
import ProductActions from './ProductActions.vue'

const route = useRoute()
const router = useRouter()
const { addToCart } = useCart()

const productId = computed(() => route.params.id as string)
const { product, loading, error, fetchProduct } = useProductDetail()

// Format price utility
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

// Event handlers
const handleAddToCart = () => {
  if (product.value) {
    addToCart({
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      image: product.value.images[0].url,
      quantity: 1
    })
  }
}

const handleAddToWishlist = () => {
  // Implement wishlist logic
  console.log('Added to wishlist:', product.value?.id)
}

const handleImageError = (imageUrl: string) => {
  console.error('Failed to load image:', imageUrl)
}

// Lifecycle
onMounted(() => {
  if (productId.value) {
    fetchProduct(productId.value)
  }
})

watch(productId, (newId) => {
  if (newId) {
    fetchProduct(newId)
  }
}, { immediate: true })

// SEO Meta tags
watch(product, (newProduct) => {
  if (newProduct) {
    document.title = `${newProduct.name} - Luxury Gemstones`
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', newProduct.description.substring(0, 160))
    }
  }
}, { immediate: true })
</script>