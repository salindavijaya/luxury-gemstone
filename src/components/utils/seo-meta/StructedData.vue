<template>
  <!-- This component injects JSON-LD structured data into the document head -->
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

interface ProductStructuredData {
  name: string
  description: string
  image: string[]
  brand?: string
  sku?: string
  price: number
  currency: string
  availability: 'InStock' | 'OutOfStock' | 'PreOrder'
  condition?: 'New' | 'Used' | 'Refurbished'
  category?: string
  rating?: {
    value: number
    count: number
  }
  offers?: {
    price: number
    currency: string
    availability: string
    validUntil?: string
  }[]
}

interface OrganizationStructuredData {
  name: string
  url: string
  logo: string
  contactPoint?: {
    telephone: string
    email: string
    contactType: string
  }
  address?: {
    streetAddress: string
    addressLocality: string
    postalCode: string
    addressCountry: string
  }
  sameAs?: string[]
}

interface WebsiteStructuredData {
  name: string
  url: string
  potentialAction?: {
    target: string
    queryInput: string
  }
}

interface BreadcrumbStructuredData {
  items: {
    name: string
    url: string
    position: number
  }[]
}

interface Props {
  type: 'product' | 'organization' | 'website' | 'breadcrumb'
  data: ProductStructuredData | OrganizationStructuredData | WebsiteStructuredData | BreadcrumbStructuredData
}

const props = defineProps<Props>()

let scriptElement: HTMLScriptElement | null = null

/**
 * Generate JSON-LD for Product schema
 */
const generateProductSchema = (data: ProductStructuredData) => {
  const schema: any = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: data.name,
    description: data.description,
    image: data.image,
    offers: {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.currency,
      availability: `https://schema.org/${data.availability}`,
      seller: {
        '@type': 'Organization',
        name: data.brand || 'Gemstone Luxury'
      }
    }
  }

  if (data.brand) {
    schema.brand = {
      '@type': 'Brand',
      name: data.brand
    }
  }

  if (data.sku) {
    schema.sku = data.sku
  }

  if (data.condition) {
    schema.offers.itemCondition = `https://schema.org/${data.condition}Condition`
  }

  if (data.category) {
    schema.category = data.category
  }

  if (data.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.rating.value,
      reviewCount: data.rating.count
    }
  }

  if (data.offers) {
    schema.offers = data.offers.map(offer => ({
      '@type': 'Offer',
      price: offer.price,
      priceCurrency: offer.currency,
      availability: offer.availability,
      validUntil: offer.validUntil
    }))
  }

  return schema
}

/**
 * Generate JSON-LD for Organization schema
 */
const generateOrganizationSchema = (data: OrganizationStructuredData) => {
  const schema: any = {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: data.logo
  }

  if (data.contactPoint) {
    schema.contactPoint = {
      '@type': 'ContactPoint',
      telephone: data.contactPoint.telephone,
      email: data.contactPoint.email,
      contactType: data.contactPoint.contactType
    }
  }

  if (data.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: data.address.streetAddress,
      addressLocality: data.address.addressLocality,
      postalCode: data.address.postalCode,
      addressCountry: data.address.addressCountry
    }
  }

  if (data.sameAs) {
    schema.sameAs = data.sameAs
  }

  return schema
}

/**
 * Generate JSON-LD for Website schema
 */
const generateWebsiteSchema = (data: WebsiteStructuredData) => {
  const schema: any = {
    '@context': 'https://schema.org/',
    '@type': 'WebSite',
    name: data.name,
    url: data.url
  }

  if (data.potentialAction) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: data.potentialAction.target,
      'query-input': data.potentialAction.queryInput
    }
  }

  return schema
}

/**
 * Generate JSON-LD for Breadcrumb schema
 */
const generateBreadcrumbSchema = (data: BreadcrumbStructuredData) => {
  return {
    '@context': 'https://schema.org/',
    '@type': 'BreadcrumbList',
    itemListElement: data.items.map(item => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.url
    }))
  }
}

/**
 * Generate appropriate schema based on type
 */
const generateSchema = () => {
  switch (props.type) {
    case 'product':
      return generateProductSchema(props.data as ProductStructuredData)
    case 'organization':
      return generateOrganizationSchema(props.data as OrganizationStructuredData)
    case 'website':
      return generateWebsiteSchema(props.data as WebsiteStructuredData)
    case 'breadcrumb':
      return generateBreadcrumbSchema(props.data as BreadcrumbStructuredData)
    default:
      throw new Error(`Unsupported schema type: ${props.type}`)
  }
}

/**
 * Inject structured data into document head
 */
const injectStructuredData = () => {
  try {
    // Remove existing script element if it exists
    if (scriptElement) {
      document.head.removeChild(scriptElement)
    }

    // Create new script element
    scriptElement = document.createElement('script')
    scriptElement.type = 'application/ld+json'
    scriptElement.innerHTML = JSON.stringify(generateSchema(), null, 2)
    
    // Add to document head
    document.head.appendChild(scriptElement)
  } catch (error) {
    console.error('Error injecting structured data:', error)
  }
}

/**
 * Remove structured data from document head
 */
const removeStructuredData = () => {
  if (scriptElement && document.head.contains(scriptElement)) {
    document.head.removeChild(scriptElement)
    scriptElement = null
  }
}

// Watch for prop changes and reinject structured data
watch(
  () => [props.type, props.data],
  () => {
    injectStructuredData()
  },
  { deep: true, immediate: false }
)

onMounted(() => {
  injectStructuredData()
})

onUnmounted(() => {
  removeStructuredData()
})
</script>

<style scoped>
/* This component has no visual output */
</style>