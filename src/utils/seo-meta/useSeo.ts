import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

// Types
interface MetaTag {
  name?: string
  property?: string
  content: string
  key?: string
}

interface LinkTag {
  rel: string
  href: string
  type?: string
  sizes?: string
  key?: string
}

interface SEOConfig {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: string
  siteName?: string
  locale?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  noindex?: boolean
  nofollow?: boolean
  canonical?: string
}

interface StructuredData {
  '@context': string
  '@type': string
  [key: string]: any
}

// Default SEO configuration
const DEFAULT_CONFIG: Required<Omit<SEOConfig, 'keywords' | 'tags' | 'publishedTime' | 'modifiedTime' | 'section'>> = {
  title: 'Luxury Gemstone Store - Premium Gemstones & Jewelry',
  description: 'Discover our exquisite collection of premium gemstones and luxury jewelry. Ethically sourced, expertly crafted, and perfectly authentic.',
  image: '/images/og-default.jpg',
  url: 'https://gemstonestore.com',
  type: 'website',
  siteName: 'Luxury Gemstone Store',
  locale: 'en_US',
  author: 'Luxury Gemstone Store',
  noindex: false,
  nofollow: false,
  canonical: ''
}

// State
const currentSEO = ref<SEOConfig>({})
const appliedTags = ref<Set<string>>(new Set())
const appliedLinks = ref<Set<string>>(new Set())

export function useSEO(initialConfig?: SEOConfig) {
  const seoConfig = ref<SEOConfig>({ ...DEFAULT_CONFIG, ...initialConfig })

  // Update page title
  const updateTitle = (title?: string) => {
    if (!title) return
    
    const fullTitle = title === DEFAULT_CONFIG.title 
      ? title 
      : `${title} | ${DEFAULT_CONFIG.siteName}`
    
    document.title = fullTitle
    updateMetaTag('og:title', fullTitle)
    updateMetaTag('twitter:title', fullTitle)
  }

  // Update meta tag
  const updateMetaTag = (nameOrProperty: string, content: string, key?: string) => {
    if (!content) return

    const isProperty = nameOrProperty.startsWith('og:') || nameOrProperty.startsWith('fb:') || nameOrProperty.startsWith('article:')
    const tagKey = key || nameOrProperty
    
    // Remove existing tag
    const existingTag = document.querySelector(
      isProperty 
        ? `meta[property="${nameOrProperty}"]`
        : `meta[name="${nameOrProperty}"]`
    )
    
    if (existingTag) {
      existingTag.remove()
      appliedTags.value.delete(tagKey)
    }

    // Create new tag
    const metaTag = document.createElement('meta')
    if (isProperty) {
      metaTag.setAttribute('property', nameOrProperty)
    } else {
      metaTag.setAttribute('name', nameOrProperty)
    }
    metaTag.setAttribute('content', content)
    
    // Add to head
    document.head.appendChild(metaTag)
    appliedTags.value.add(tagKey)
  }

  // Update link tag
  const updateLinkTag = (rel: string, href: string, options: Partial<LinkTag> = {}) => {
    if (!href) return

    const key = options.key || `${rel}-${href}`
    
    // Remove existing link
    const existingLink = document.querySelector(`link[rel="${rel}"][href="${href}"]`)
    if (existingLink) {
      existingLink.remove()
      appliedLinks.value.delete(key)
    }

    // Create new link
    const linkTag = document.createElement('link')
    linkTag.setAttribute('rel', rel)
    linkTag.setAttribute('href', href)
    
    if (options.type) linkTag.setAttribute('type', options.type)
    if (options.sizes) linkTag.setAttribute('sizes', options.sizes)
    
    // Add to head
    document.head.appendChild(linkTag)
    appliedLinks.value.add(key)
  }

  // Update all meta tags based on config
  const updateMeta = (config: SEOConfig) => {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config }

    // Title
    if (mergedConfig.title) {
      updateTitle(mergedConfig.title)
    }

    // Description
    if (mergedConfig.description) {
      updateMetaTag('description', mergedConfig.description)
      updateMetaTag('og:description', mergedConfig.description)
      updateMetaTag('twitter:description', mergedConfig.description)
    }

    // Keywords
    if (config.keywords && config.keywords.length > 0) {
      updateMetaTag('keywords', config.keywords.join(', '))
    }

    // Open Graph
    updateMetaTag('og:type', mergedConfig.type)
    updateMetaTag('og:site_name', mergedConfig.siteName)
    updateMetaTag('og:locale', mergedConfig.locale)
    
    if (mergedConfig.url) {
      updateMetaTag('og:url', mergedConfig.url)
    }

    if (mergedConfig.image) {
      updateMetaTag('og:image', mergedConfig.image)
      updateMetaTag('og:image:alt', mergedConfig.title)
      updateMetaTag('twitter:card', 'summary_large_image')
      updateMetaTag('twitter:image', mergedConfig.image)
      updateMetaTag('twitter:image:alt', mergedConfig.title)
    }

    // Article meta (for blog posts, product pages)
    if (config.author) {
      updateMetaTag('article:author', config.author)
    }

    if (config.publishedTime) {
      updateMetaTag('article:published_time', config.publishedTime)
    }

    if (config.modifiedTime) {
      updateMetaTag('article:modified_time', config.modifiedTime)
    }

    if (config.section) {
      updateMetaTag('article:section', config.section)
    }

    if (config.tags && config.tags.length > 0) {
      config.tags.forEach(tag => {
        updateMetaTag('article:tag', tag, `article:tag:${tag}`)
      })
    }

    // Robots meta
    const robotsDirectives: string[] = []
    if (mergedConfig.noindex) robotsDirectives.push('noindex')
    if (mergedConfig.nofollow) robotsDirectives.push('nofollow')
    
    if (robotsDirectives.length > 0) {
      updateMetaTag('robots', robotsDirectives.join(', '))
    }

    // Canonical URL
    if (config.canonical) {
      updateLinkTag('canonical', config.canonical)
    } else if (mergedConfig.url) {
      updateLinkTag('canonical', mergedConfig.url)
    }

    currentSEO.value = mergedConfig
  }

  // Set structured data
  const setStructuredData = (data: StructuredData | StructuredData[], key = 'default') => {
    // Remove existing structured data
    const existingScript = document.querySelector(`script[data-structured-data="${key}"]`)
    if (existingScript) {
      existingScript.remove()
    }

    // Add new structured data
    const script = document.createElement('script')
    script.setAttribute('type', 'application/ld+json')
    script.setAttribute('data-structured-data', key)
    script.textContent = JSON.stringify(data)
    
    document.head.appendChild(script)
  }

  // Generate product structured data
  const setProductStructuredData = (product: {
    name: string
    description: string
    image: string[]
    price: number
    currency: string
    availability: string
    condition: string
    brand?: string
    sku?: string
    gtin?: string
    mpn?: string
    category?: string
    rating?: {
      ratingValue: number
      reviewCount: number
    }
  }) => {
    const structuredData: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.image,
      offers: {
        '@type': 'Offer',
        price: product.price.toString(),
        priceCurrency: product.currency,
        availability: `https://schema.org/${product.availability}`,
        itemCondition: `https://schema.org/${product.condition}`,
        url: window.location.href
      }
    }

    if (product.brand) {
      structuredData.brand = {
        '@type': 'Brand',
        name: product.brand
      }
    }

    if (product.sku) structuredData.sku = product.sku
    if (product.gtin) structuredData.gtin = product.gtin
    if (product.mpn) structuredData.mpn = product.mpn
    if (product.category) structuredData.category = product.category

    if (product.rating) {
      structuredData.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: product.rating.ratingValue,
        reviewCount: product.rating.reviewCount
      }
    }

    setStructuredData(structuredData, 'product')
  }

  // Generate breadcrumb structured data
  const setBreadcrumbStructuredData = (breadcrumbs: { name: string; url: string }[]) => {
    const structuredData: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url
      }))
    }

    setStructuredData(structuredData, 'breadcrumb')
  }

  // Clean up applied tags and links
  const cleanup = () => {
    appliedTags.value.forEach(tagKey => {
      const tag = document.querySelector(`meta[name="${tagKey}"], meta[property="${tagKey}"]`)
      if (tag) tag.remove()
    })
    
    appliedLinks.value.forEach(linkKey => {
      const link = document.querySelector(`link[data-key="${linkKey}"]`)
      if (link) link.remove()
    })

    // Clean up structured data
    const structuredDataScripts = document.querySelectorAll('script[data-structured-data]')
    structuredDataScripts.forEach(script => script.remove())

    appliedTags.value.clear()
    appliedLinks.value.clear()
  }

  // Watch for config changes
  watch(seoConfig, (newConfig) => {
    updateMeta(newConfig)
  }, { deep: true, immediate: true })

  // Initialize
  onMounted(() => {
    updateMeta(seoConfig.value)
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    seoConfig: seoConfig as Ref<SEOConfig>,
    updateSEO: (config: Partial<SEOConfig>) => {
      seoConfig.value = { ...seoConfig.value, ...config }
    },
    setTitle: (title: string) => {
      seoConfig.value.title = title
    },
    setDescription: (description: string) => {
      seoConfig.value.description = description
    },
    setKeywords: (keywords: string[]) => {
      seoConfig.value.keywords = keywords
    },
    setImage: (image: string) => {
      seoConfig.value.image = image
    },
    setURL: (url: string) => {
      seoConfig.value.url = url
    },
    setCanonical: (canonical: string) => {
      seoConfig.value.canonical = canonical
    },
    setNoIndex: (noindex: boolean) => {
      seoConfig.value.noindex = noindex
    },
    setStructuredData,
    setProductStructuredData,
    setBreadcrumbStructuredData,
    cleanup
  }
}