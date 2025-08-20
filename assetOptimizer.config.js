// assetOptimization.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'

// Asset optimization configuration
export const assetOptimizationConfig = {
  // Asset processing options
  assetsInclude: ['**/*.woff2', '**/*.woff', '**/*.ttf', '**/*.svg', '**/*.ico'],
  
  // Public directory for static assets
  publicDir: 'public',
  
  // Build configuration
  build: {
    // Asset handling
    assetsDir: 'assets',
    assetsInlineLimit: 4096, // 4KB - inline small assets as base64
    
    // CSS optimization
    cssCodeSplit: true,
    cssMinify: 'esbuild',
    
    // JS minification
    minify: 'esbuild',
    
    // Target modern browsers for smaller bundles
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    
    // Rollup options for asset optimization
    rollupOptions: {
      output: {
        // Asset naming patterns
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const extType = info[info.length - 1]
          
          // Organize assets by type
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `images/[name]-[hash][extname]`
          }
          if (/\.(woff2?|ttf|otf|eot)$/i.test(assetInfo.name)) {
            return `fonts/[name]-[hash][extname]`
          }
          if (/\.(css)$/i.test(assetInfo.name)) {
            return `css/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        
        // Chunk naming for cache optimization
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        
        // Manual chunk splitting for optimal caching
        manualChunks: (id) => {
          // Vendor libraries
          if (id.includes('node_modules')) {
            if (id.includes('vue')) return 'vue'
            if (id.includes('pinia')) return 'pinia'
            if (id.includes('vue-router')) return 'vue-router'
            if (id.includes('lodash')) return 'lodash'
            if (id.includes('date-fns')) return 'date-fns'
            if (id.includes('@headlessui')) return 'headlessui'
            return 'vendor'
          }
          
          // Route-based chunks
          if (id.includes('/views/')) return 'views'
          if (id.includes('/components/')) return 'components'
          if (id.includes('/composables/')) return 'composables'
          if (id.includes('/stores/')) return 'stores'
        }
      }
    }
  },
  
  // Experimental features for optimization
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        // Use CDN for JS imports in production
        return process.env.NODE_ENV === 'production' 
          ? `https://cdn.example.com/assets/${filename}`
          : `/${filename}`
      }
    }
  }
}

// Image optimization utilities
export class ImageOptimizer {
  constructor() {
    this.compressionSettings = {
      jpeg: { quality: 85, progressive: true },
      png: { quality: 90, compressionLevel: 9 },
      webp: { quality: 80, lossless: false },
      avif: { quality: 75, speed: 6 }
    }
  }

  // Get optimized image URL with transformations
  getOptimizedUrl(src, options = {}) {
    const {
      width,
      height,
      quality = 85,
      format = 'auto',
      fit = 'cover'
    } = options

    // For production, use image CDN with transformations
    if (process.env.NODE_ENV === 'production') {
      const params = new URLSearchParams()
      if (width) params.set('w', width.toString())
      if (height) params.set('h', height.toString())
      params.set('q', quality.toString())
      params.set('f', format)
      params.set('fit', fit)
      
      return `https://images.example.com/${src}?${params.toString()}`
    }
    
    return src
  }

  // Generate responsive image srcset
  generateSrcSet(src, sizes = [400, 800, 1200, 1600]) {
    return sizes
      .map(size => `${this.getOptimizedUrl(src, { width: size })} ${size}w`)
      .join(', ')
  }

  // Generate sizes attribute for responsive images
  generateSizes(breakpoints = {
    mobile: '100vw',
    tablet: '50vw',
    desktop: '33vw'
  }) {
    const mediaQueries = []
    
    if (breakpoints.desktop) {
      mediaQueries.push(`(min-width: 1024px) ${breakpoints.desktop}`)
    }
    if (breakpoints.tablet) {
      mediaQueries.push(`(min-width: 768px) ${breakpoints.tablet}`)
    }
    if (breakpoints.mobile) {
      mediaQueries.push(breakpoints.mobile)
    }
    
    return mediaQueries.join(', ')
  }
}

// Font optimization utilities
export class FontOptimizer {
  constructor() {
    this.fontDisplay = 'swap' // Default font-display strategy
    this.preloadFonts = [
      { family: 'Inter', weight: '400', style: 'normal' },
      { family: 'Inter', weight: '500', style: 'normal' },
      { family: 'Inter', weight: '600', style: 'normal' }
    ]
  }

  // Generate font preload links
  generatePreloadLinks() {
    return this.preloadFonts.map(font => {
      const fontFile = `fonts/Inter-${font.weight === '400' ? 'Regular' : 
                         font.weight === '500' ? 'Medium' : 'SemiBold'}.woff2`
      
      return `<link rel="preload" href="/${fontFile}" as="font" type="font/woff2" crossorigin>`
    }).join('\n')
  }

  // Generate font-face CSS
  generateFontFace() {
    return this.preloadFonts.map(font => `
      @font-face {
        font-family: '${font.family}';
        font-weight: ${font.weight};
        font-style: ${font.style};
        font-display: ${this.fontDisplay};
        src: url('/fonts/Inter-${font.weight === '400' ? 'Regular' : 
                   font.weight === '500' ? 'Medium' : 'SemiBold'}.woff2') format('woff2'),
             url('/fonts/Inter-${font.weight === '400' ? 'Regular' : 
                   font.weight === '500' ? 'Medium' : 'SemiBold'}.woff') format('woff');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }
    `).join('')
  }
}

// Critical resource preloader
export class CriticalResourceLoader {
  constructor() {
    this.criticalResources = new Set()
    this.loadedResources = new Set()
  }

  // Add critical resource
  addCritical(resource) {
    this.criticalResources.add(resource)
    this.preloadResource(resource)
  }

  // Preload resource
  preloadResource(resource) {
    if (this.loadedResources.has(resource)) return

    const link = document.createElement('link')
    link.rel = resource.type === 'font' ? 'preload' : 'prefetch'
    link.href = resource.url
    link.as = resource.type
    
    if (resource.type === 'font') {
      link.crossOrigin = 'anonymous'
    }
    
    link.onload = () => {
      this.loadedResources.add(resource)
    }
    
    document.head.appendChild(link)
  }

  // Preload critical route assets
  preloadRoute(routeName) {
    const routeAssets = this.getRouteAssets(routeName)
    routeAssets.forEach(asset => {
      this.addCritical(asset)
    })
  }

  // Get assets for specific route
  getRouteAssets(routeName) {
    const assetMap = {
      home: [
        { url: '/images/hero-gemstone.webp', type: 'image' },
        { url: '/js/home.js', type: 'script' }
      ],
      products: [
        { url: '/images/product-placeholder.webp', type: 'image' },
        { url: '/js/products.js', type: 'script' }
      ],
      'product-detail': [
        { url: '/js/product-detail.js', type: 'script' },
        { url: '/js/image-gallery.js', type: 'script' }
      ]
    }
    
    return assetMap[routeName] || []
  }
}

// CSS optimization utilities
export const cssOptimization = {
  // Critical CSS extraction
  extractCritical: true,
  
  // CSS purging for unused styles
  purgeOptions: {
    content: [
      './src/**/*.{vue,js,ts}',
      './index.html'
    ],
    safelist: [
      // Keep dynamic classes
      /^(bg|text|border)-(emerald|slate|amber)-\d{3}$/,
      /^(hover|focus|active):/,
      /^(sm|md|lg|xl):/,
      'router-link-active',
      'router-link-exact-active'
    ]
  },
  
  // CSS minification
  minifyOptions: {
    preset: ['default', {
      discardComments: { removeAll: true },
      normalizeWhitespace: true,
      mergeLonghand: true,
      mergeRules: true
    }]
  }
}

// Asset caching strategies
export const cachingStrategies = {
  // Static assets - long term cache
  static: {
    'images/**': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    },
    'fonts/**': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    },
    'css/**': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    },
    'js/**': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    }
  },
  
  // Dynamic content - short term cache
  dynamic: {
    'api/**': {
      headers: {
        'Cache-Control': 'public, max-age=300'
      }
    }
  },
  
  // No cache for HTML files
  html: {
    '**/*.html': {
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate'
      }
    }
  }
}

// CDN configuration
export const cdnConfig = {
  // Asset domains
  domains: {
    images: 'https://images.gemstoneshop.com',
    fonts: 'https://fonts.gemstoneshop.com',
    static: 'https://static.gemstoneshop.com'
  },
  
  // CDN optimization settings
  optimization: {
    // Image transformations
    images: {
      formats: ['webp', 'avif', 'jpg'],
      qualities: [60, 75, 85, 95],
      sizes: [400, 800, 1200, 1600, 2400]
    },
    
    // Font subsetting
    fonts: {
      subset: 'latin',
      display: 'swap'
    }
  }
}

// Usage example for vite.config.js
export default defineConfig({
  ...assetOptimizationConfig,
  plugins: [
    // Add asset optimization plugins here
  ]
})