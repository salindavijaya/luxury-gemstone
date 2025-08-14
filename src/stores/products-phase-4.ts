### stores/products.ts
```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '@/composables/useProductDetail'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Search and filter state
  const searchQuery = ref('')
  const selectedCategory = ref('')
  const priceRange = ref<[number, number]>([0, 50000])
  const selectedSort = ref('featured')

  const fetchProducts = async (params?: {
    category?: string
    search?: string
    priceMin?: number
    priceMax?: number
    sort?: string
  }) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock products data
      const mockProducts: Product[] = generateMockProducts(20)
      products.value = mockProducts
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch products'
    } finally {
      loading.value = false
    }
  }

  const fetchProductById = async (id: string): Promise<Product | null> => {
    loading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Check if product exists in current products
      let product = products.value.find(p => p.id === id)
      
      if (!product) {
        // Generate mock product if not found
        product = generateMockProduct(id)
      }
      
      currentProduct.value = product
      return product
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch product'
      return null
    } finally {
      loading.value = false
    }
  }

  const getRelatedProducts = (productId: string, limit: number = 4): Product[] => {
    return products.value
      .filter(p => p.id !== productId)
      .slice(0, limit)
  }

  const searchProducts = (query: string) => {
    searchQuery.value = query
    return products.value.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    )
  }

  const filterByCategory = (category: string) => {
    selectedCategory.value = category
    return products.value.filter(product =>
      category === '' || product.category === category
    )
  }

  const filterByPriceRange = (min: number, max: number) => {
    priceRange.value = [min, max]
    return products.value.filter(product =>
      product.price >= min && product.price <= max
    )
  }

  const sortProducts = (sortBy: string) => {
    selectedSort.value = sortBy
    
    const sorted = [...products.value]
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price)
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price)
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating)
      case 'newest':
        return sorted.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      default: // 'featured'
        return sorted
    }
  }

  return {
    // State
    products: readonly(products),
    currentProduct: readonly(currentProduct),
    loading: readonly(loading),
    error: readonly(error),
    searchQuery: readonly(searchQuery),
    selectedCategory: readonly(selectedCategory),
    priceRange: readonly(priceRange),
    selectedSort: readonly(selectedSort),
    
    // Actions
    fetchProducts,
    fetchProductById,
    getRelatedProducts,
    searchProducts,
    filterByCategory,
    filterByPriceRange,
    sortProducts
  }
})

// Helper function to generate mock products
const generateMockProducts = (count: number): Product[] => {
  const gemstoneTypes = ['Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Tanzanite']
  const shapes = ['Round', 'Princess', 'Emerald', 'Oval', 'Marquise', 'Pear']
  const origins = ['Botswana', 'Myanmar', 'Sri Lanka', 'Colombia', 'Tanzania']
  
  return Array.from({ length: count }, (_, i) => {
    const type = gemstoneTypes[Math.floor(Math.random() * gemstoneTypes.length)]
    const shape = shapes[Math.floor(Math.random() * shapes.length)]
    const origin = origins[Math.floor(Math.random() * origins.length)]
    const carat = parseFloat((Math.random() * 4 + 0.5).toFixed(2))
    
    return generateMockProduct(`${i + 1}`, type, shape, origin, carat)
  })
}

const generateMockProduct = (
  id: string, 
  type: string = 'Diamond', 
  shape: string = 'Round', 
  origin: string = 'Botswana',
  carat: number = 1.5
): Product => {
  const clarityGrades = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2']
  const colorGrades = ['D', 'E', 'F', 'G', 'H', 'I', 'J']
  const cutGrades = ['Excellent', 'Very Good', 'Good']
  
  const clarity = clarityGrades[Math.floor(Math.random() * clarityGrades.length)]
  const color = colorGrades[Math.floor(Math.random() * colorGrades.length)]
  const cut = cutGrades[Math.floor(Math.random() * cutGrades.length)]
  
  const basePrice = carat * (type === 'Diamond' ? 5000 : 2000)
  const price = Math.round(basePrice * (Math.random() * 0.5 + 0.75))
  
  return {
    id,
    name: `Premium ${shape} ${type}`,
    category: type,
    price,
    pricePerCarat: Math.round(price / carat),
    rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
    reviewCount: Math.floor(Math.random() * 200 + 10),
    description: `Exquisite ${shape.toLowerCase()}-cut ${type.toLowerCase()} featuring exceptional brilliance and fire. This stunning gemstone represents the perfect harmony of nature's beauty and human craftsmanship.`,
    carat,
    clarity,
    color,
    cut,
    shape,
    origin,
    certified: Math.random() > 0.2,
    inStock: Math.random() > 0.1,
    stockQuantity: Math.floor(Math.random() * 5 + 1),
    images: Array.from({ length: 4 }, (_, i) => ({
      id: `${id}-img-${i + 1}`,
      url: `https://picsum.photos/800/800?random=${id}-${i + 1}`,
      thumbnailUrl: `https://picsum.photos/150/150?random=${id}-${i + 1}`,
      alt: `${type} image ${i + 1}`
    })),
    has360View: Math.random() > 0.6,
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
}