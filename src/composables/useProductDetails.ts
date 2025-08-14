### composables/useProductDetail.ts
```typescript
import { ref, reactive } from 'vue'

export interface ProductImage {
  id: string
  url: string
  thumbnailUrl: string
  alt?: string
}

export interface ProductCertification {
  id: string
  type: 'GIA' | 'AGS' | 'SSEF' | 'Gübelin'
  number: string
  date: string
  documentUrl: string
  verified: boolean
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  pricePerCarat: number
  discount?: number
  rating: number
  reviewCount: number
  description: string
  carat: number
  clarity: string
  color: string
  cut: string
  shape: string
  origin: string
  treatment?: string
  fluorescence?: string
  polish?: string
  symmetry?: string
  dimensions?: string
  certified: boolean
  inStock: boolean
  stockQuantity: number
  images: ProductImage[]
  certifications?: ProductCertification[]
  has360View: boolean
  createdAt: string
  updatedAt: string
}

export const useProductDetail = () => {
  const product = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProduct = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock product data
      const mockProduct: Product = {
        id,
        name: "Exceptional Emerald Cut Diamond",
        category: "Diamond",
        price: 12500,
        originalPrice: 15000,
        pricePerCarat: 6250,
        discount: 17,
        rating: 4.8,
        reviewCount: 127,
        description: "This exceptional emerald cut diamond showcases the perfect balance of elegance and brilliance. With its superior clarity and color grade, this gemstone represents the pinnacle of luxury and craftsmanship. Each facet has been precisely cut to maximize light return and create stunning visual appeal.",
        carat: 2.05,
        clarity: "VVS1",
        color: "F",
        cut: "Excellent",
        shape: "Emerald",
        origin: "Botswana",
        treatment: "None",
        fluorescence: "None",
        polish: "Excellent",
        symmetry: "Excellent",
        dimensions: "8.15 × 6.12 × 3.75 mm",
        certified: true,
        inStock: true,
        stockQuantity: 1,
        images: [
          {
            id: "1",
            url: `https://picsum.photos/800/800?random=${id}-1`,
            thumbnailUrl: `https://picsum.photos/150/150?random=${id}-1`,
            alt: "Main product image"
          },
          {
            id: "2",
            url: `https://picsum.photos/800/800?random=${id}-2`,
            thumbnailUrl: `https://picsum.photos/150/150?random=${id}-2`,
            alt: "Side view"
          },
          {
            id: "3",
            url: `https://picsum.photos/800/800?random=${id}-3`,
            thumbnailUrl: `https://picsum.photos/150/150?random=${id}-3`,
            alt: "Close-up detail"
          },
          {
            id: "4",
            url: `https://picsum.photos/800/800?random=${id}-4`,
            thumbnailUrl: `https://picsum.photos/150/150?random=${id}-4`,
            alt: "Under different lighting"
          }
        ],
        certifications: [
          {
            id: "cert-1",
            type: "GIA",
            number: "2185749395",
            date: "2024-01-15",
            documentUrl: "#",
            verified: true
          }
        ],
        has360View: true,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-20T15:30:00Z"
      }

      product.value = mockProduct
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load product'
    } finally {
      loading.value = false
    }
  }

  const resetProduct = () => {
    product.value = null
    error.value = null
    loading.value = false
  }

  return {
    product: readonly(product),
    loading: readonly(loading),
    error: readonly(error),
    fetchProduct,
    resetProduct
  }
}