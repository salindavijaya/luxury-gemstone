<template>
  <div class="product-detail-page">
    <div class="container mx-auto px-4 py-8">
      <!-- Breadcrumb Navigation -->
      <nav class="text-sm mb-6">
        <router-link to="/" class="text-gray-500 hover:text-primary-600">Home</router-link>
        <span class="mx-2">→</span>
        <router-link to="/products" class="text-gray-500 hover:text-primary-600">Products</router-link>
        <span class="mx-2">→</span>
        <span class="text-gray-900">{{ product?.name }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Image Gallery -->
        <div class="product-gallery sticky top-4">
          <ImageViewer :images="product?.images" />
          <ImageThumbnails :images="product?.images" />
          <Image360Viewer
            v-if="product?.view360Enabled"
            :image-urls="product?.view360Images"
          />
          <div class="mt-4">
            <button
              @click="startVirtualTryOn"
              class="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200"
            >
              Virtual Try On
            </button>
          </div>
        </div>

        <!-- Product Information -->
        <div class="product-info">
          <ProductDetail :product="product" />
          <ProductActions
            :product="product"
            @add-to-cart="handleAddToCart"
            @add-to-wishlist="handleAddToWishlist"
          />
          
          <!-- Authentication Modal -->
          <AuthModal v-if="showAuthModal" @close="showAuthModal = false" />
          
          <!-- Gemstone Details -->
          <div class="mt-8 border-t pt-8">
            <h2 class="text-2xl font-semibold mb-4">Gemstone Details</h2>
            <div class="grid grid-cols-2 gap-4">
              <FilterClarity :value="product?.clarity" readonly />
              <FilterColor :value="product?.color" readonly />
              <FilterCarat :value="product?.carat" readonly />
              <FilterTag :tags="product?.tags" readonly />
            </div>
          </div>

          <!-- Certification -->
          <div class="mt-8 border-t pt-8">
            <h2 class="text-2xl font-semibold mb-4">Certification</h2>
            <img 
              :src="product?.certificateImage" 
              alt="Certificate"
              class="mb-4 rounded-lg shadow-sm"
            />
            <p class="text-sm text-gray-600">
              Certificate Number: {{ product?.certificateNumber }}
            </p>
          </div>
        </div>
      </div>

      <!-- Tabs Section -->
      <div class="mt-12">
        <div class="border-b">
          <nav class="flex space-x-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <div class="py-8">
          <!-- Specifications Tab -->
          <div v-if="activeTab === 'specifications'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="(spec, index) in product?.specifications" :key="index">
              <span class="font-medium">{{ spec.label }}:</span>
              <span class="ml-2">{{ spec.value }}</span>
            </div>
          </div>

          <!-- Description Tab -->
          <div v-if="activeTab === 'description'" class="prose max-w-none">
            <p v-html="product?.description"></p>
          </div>

          <!-- Reviews Tab -->
          <div v-if="activeTab === 'reviews'">
            <div class="mb-8">
              <ProductReviews :product-id="product?.id" />
            </div>
          </div>

          <!-- Care Guide Tab -->
          <div v-if="activeTab === 'care'" class="prose max-w-none">
            <p v-html="product?.careInstructions"></p>
          </div>
        </div>
      </div>

      <!-- Related and Recently Viewed -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <!-- Related Products -->
        <div>
          <h2 class="text-2xl font-semibold mb-6">Related Products</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ProductCard
              v-for="relatedProduct in relatedProducts"
              :key="relatedProduct.id"
              :product="relatedProduct"
            />
          </div>
        </div>

        <!-- Recently Viewed -->
        <div>
          <h2 class="text-2xl font-semibold mb-6">Recently Viewed</h2>
          <RecentlyViewed />
        </div>
      </div>

      <!-- Quick Compare -->
      <div class="mt-12">
        <ProductComparition :base-product="product" :limit="3" />
      </div>
    </div>

    <!-- Cart Drawer -->
    <CartDrawer ref="cartDrawer" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ImageViewer from '@/components/gallery/ImageViewer.vue'
import ImageThumbnails from '@/components/gallery/ImageThumbnails.vue'
import Image360Viewer from '@/components/gallery/Image360Viewer.vue'
import ProductDetail from '@/components/product/ProductDetail.vue'
import ProductActions from '@/components/product/ProductActions.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import FilterClarity from '@/components/product/FilterClarity.vue'
import FilterColor from '@/components/product/FilterColor.vue'
import FilterCarat from '@/components/product/FilterCarat.vue'
import FilterTag from '@/components/product/FilterTag.vue'
import RecentlyViewed from '@/components/dashboard/RecentlyViewed.vue'
import ProductComparition from '@/components/dashboard/ProductComparition.vue'
import CartDrawer from '@/components/cart/CartDrawer.vue'
import AuthModal from '@/components/auth/AuthModal.vue'
import { useProductDetails } from '@/composables/useProductDetails'
import { useCart } from '@/composables/useCart'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const { getProductDetails, getRelatedProducts } = useProductDetails()
const { addToCart } = useCart()
const { isAuthenticated } = useAuth()

const product = ref(null)
const relatedProducts = ref([])
const showAuthModal = ref(false)
const cartDrawer = ref(null)
const activeTab = ref('specifications')

const tabs = [
  { id: 'specifications', name: 'Specifications' },
  { id: 'description', name: 'Description' },
  { id: 'reviews', name: 'Reviews' },
  { id: 'care', name: 'Care Guide' }
]

const handleAddToCart = async (quantity) => {
  await addToCart(product.value, quantity)
  cartDrawer.value?.open()
}

const handleAddToWishlist = async () => {
  if (!isAuthenticated.value) {
    showAuthModal.value = true
    return
  }
  // Implement wishlist functionality
}

const startVirtualTryOn = () => {
  // Implement virtual try-on functionality
}

onMounted(async () => {
  const slug = route.params.slug as string
  product.value = await getProductDetails(slug)
  relatedProducts.value = await getRelatedProducts(slug)
})
</script>
