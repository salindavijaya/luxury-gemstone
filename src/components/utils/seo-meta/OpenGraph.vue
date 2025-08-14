<template>
  <!-- This component manages OpenGraph meta tags for social sharing -->
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

interface OpenGraphData {
  title: string
  description: string
  image: string
  url: string
  type?: 'website' | 'article' | 'product' | 'profile'
  siteName?: string
  locale?: string
  alternateLocale?: string[]
  author?: string
  section?: string
  tags?: string[]
  publishedTime?: string
  modifiedTime?: string
  price?: {
    amount: number
    currency: string
  }
  availability?: 'instock' | 'oos' | 'preorder'
  brand?: string
  color?: string
  condition?: 'new' | 'refurbished' | 'used'
}

interface TwitterCardData {
  card: 'summary' | 'summary_large_image' | 'app' | 'player'
  site?: string
  creator?: string
  title?: string
  description?: string
  image?: string
}

interface Props {
  og: OpenGraphData
  twitter?: TwitterCardData
}

const props = defineProps<Props>()

const metaTags: HTMLMetaElement[] = []

/**
 * Create or update meta tag
 */
const setMetaTag = (property: string, content: string, isTwitter = false) => {
  if (!content) return

  const attribute = isTwitter ? 'name' : 'property'
  let metaTag = document.querySelector(`meta[${attribute}="${property}"]`) as HTMLMetaElement

  if (metaTag) {
    metaTag.content = content
  } else {
    metaTag = document.createElement('meta')
    metaTag.setAttribute(attribute, property)
    metaTag.content = content
    document.head.appendChild(metaTag)
  }

  metaTags.push(metaTag)
}

/**
 * Set OpenGraph meta tags
 */
const setOpenGraphTags = (data: OpenGraphData) => {
  // Basic OpenGraph tags
  setMetaTag('og:title', data.title)
  setMetaTag('og:description', data.description)
  setMetaTag('og:image', data.image)
  setMetaTag('og:url', data.url)
  setMetaTag('og:type', data.type || 'website')

  // Optional OpenGraph tags
  if (data.siteName) setMetaTag('og:site_name', data.siteName)
  if (data.locale) setMetaTag('og:locale', data.locale)
  if (data.author) setMetaTag('og:author', data.author)
  if (data.section) setMetaTag('og:section', data.section)
  if (data.publishedTime) setMetaTag('og:published_time', data.publishedTime)
  if (data.modifiedTime) setMetaTag('og:modified_time', data.modifiedTime)

  // Alternate locales
  if (data.alternateLocale) {
    data.alternateLocale.forEach(locale => {
      setMetaTag('og:locale:alternate', locale)
    })
  }

  // Tags
  if (data.tags) {
    data.tags.forEach(tag => {
      setMetaTag('og:article:tag', tag)
    })
  }

  // Product-specific tags
  if (data.type === 'product') {
    if (data.price) {
      setMetaTag('og:price:amount', data.price.amount.toString())
      setMetaTag('og:price:currency', data.price.currency)
    }
    if (data.availability) setMetaTag('og:availability', data.availability)
    if (data.brand) setMetaTag('og:brand', data.brand)
    if (data.color) setMetaTag('og:color', data.color)
    if (data.condition) setMetaTag('og:condition', data.condition)
  }

  // Additional image properties
  setMetaTag('og:image:width', '1200')
  setMetaTag('og:image:height', '630')
  setMetaTag('og:image:alt', data.title)
}

/**
 * Set Twitter Card meta tags
 */
const setTwitterTags = (data: TwitterCardData) => {
  setMetaTag('twitter:card', data.card, true)
  
  if (data.site) setMetaTag('twitter:site', data.site, true)
  if (data.creator) setMetaTag('twitter:creator', data.creator, true)
  if (data.title) setMetaTag('twitter:title', data.title, true)
  if (data.description) setMetaTag('twitter:description', data.description, true)
  if (data.image) setMetaTag('twitter:image', data.image, true)
}

/**
 * Remove all managed meta tags
 */
const removeMetaTags = () => {
  metaTags.forEach(tag => {
    if (document.head.contains(tag)) {
      document.head.removeChild(tag)
    }
  })
  metaTags.length = 0
}

/**
 * Update all meta tags
 */
const updateMetaTags = () => {
  removeMetaTags()
  
  setOpenGraphTags(props.og)
  
  if (props.twitter) {
    setTwitterTags(props.twitter)
  } else {
    // Default Twitter Card using OpenGraph data
    setTwitterTags({
      card: 'summary_large_image',
      title: props.og.title,
      description: props.og.description,
      image: props.og.image
    })
  }
}

// Watch for prop changes and update meta tags
watch(
  () => [props.og, props.twitter],
  updateMetaTags,
  { deep: true, immediate: false }
)

onMounted(() => {
  updateMetaTags()
})

onUnmounted(() => {
  removeMetaTags()
})
</script>

<style scoped>
/* This component has no visual output */
</style>