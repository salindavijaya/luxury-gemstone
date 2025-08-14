import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import { resolve } from 'path'

// Bundle analyzer specific configuration
export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      filename: 'bundle-report.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('vue')) {
              return 'vue-vendor'
            }
            if (id.includes('@headlessui') || id.includes('@heroicons')) {
              return 'ui-vendor'
            }
            if (id.includes('chart.js') || id.includes('vue-chartjs')) {
              return 'chart-vendor'
            }
            if (id.includes('lodash') || id.includes('date-fns')) {
              return 'utils-vendor'
            }
            return 'vendor'
          }
          
          // Feature-based chunks
          if (id.includes('/components/Product')) {
            return 'product-components'
          }
          if (id.includes('/components/Cart')) {
            return 'cart-components'
          }
          if (id.includes('/components/User')) {
            return 'user-components'
          }
          if (id.includes('/views/')) {
            const viewName = id.split('/views/')[1].split('/')[0].toLowerCase()
            return `view-${viewName}`
          }
        }
      }
    }
  }
})

// Performance budget configuration
export const performanceBudget = {
  // Maximum bundle sizes (in KB)
  maxBundleSize: 500, // 500KB
  maxChunkSize: 200,  // 200KB per chunk
  maxAssetSize: 100,  // 100KB per asset
  
  // Core Web Vitals targets
  coreWebVitals: {
    LCP: 2500,  // Largest Contentful Paint (ms)
    FID: 100,   // First Input Delay (ms)
    CLS: 0.1,   // Cumulative Layout Shift
    FCP: 1800,  // First Contentful Paint (ms)
    TTI: 3800   // Time to Interactive (ms)
  },
  
  // Lighthouse targets
  lighthouse: {
    performance: 90,
    accessibility: 95,
    bestPractices: 95,
    seo: 95,
    pwa: 90
  }
}

// Bundle analysis utilities
export class BundleAnalyzer {
  static analyzeChunks(buildOutput) {
    const chunks = []
    const assets = []
    
    for (const [filename, info] of Object.entries(buildOutput)) {
      if (filename.endsWith('.js')) {
        chunks.push({
          name: filename,
          size: info.size,
          gzipSize: info.gzipSize || 0,
          modules: info.modules || []
        })
      } else {
        assets.push({
          name: filename,
          size: info.size,
          type: this.getAssetType(filename)
        })
      }
    }
    
    return { chunks, assets }
  }
  
  static getAssetType(filename) {
    const ext = filename.split('.').pop().toLowerCase()
    const typeMap = {
      'js': 'javascript',
      'css': 'stylesheet',
      'png': 'image',
      'jpg': 'image',
      'jpeg': 'image',
      'webp': 'image',
      'svg': 'image',
      'woff': 'font',
      'woff2': 'font',
      'ttf': 'font',
      'eot': 'font'
    }
    return typeMap[ext] || 'other'
  }
  
  static checkPerformanceBudget(chunks, assets) {
    const warnings = []
    const errors = []
    
    // Check total bundle size
    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0)
    if (totalSize > performanceBudget.maxBundleSize * 1024) {
      errors.push(`Total bundle size (${Math.round(totalSize / 1024)}KB) exceeds budget (${performanceBudget.maxBundleSize}KB)`)
    }
    
    // Check individual chunk sizes
    chunks.forEach(chunk => {
      if (chunk.size > performanceBudget.maxChunkSize * 1024) {
        warnings.push(`Chunk ${chunk.name} (${Math.round(chunk.size / 1024)}KB) exceeds recommended size (${performanceBudget.maxChunkSize}KB)`)
      }
    })
    
    // Check asset sizes
    assets.forEach(asset => {
      if (asset.size > performanceBudget.maxAssetSize * 1024) {
        warnings.push(`Asset ${asset.name} (${Math.round(asset.size / 1024)}KB) exceeds recommended size (${performanceBudget.maxAssetSize}KB)`)
      }
    })
    
    return { warnings, errors }
  }
  
  static generateReport(buildOutput) {
    const { chunks, assets } = this.analyzeChunks(buildOutput)
    const { warnings, errors } = this.checkPerformanceBudget(chunks, assets)
    
    const report = {
      summary: {
        totalChunks: chunks.length,
        totalAssets: assets.length,
        totalSize: chunks.reduce((sum, chunk) => sum + chunk.size, 0) + 
                  assets.reduce((sum, asset) => sum + asset.size, 0),
        gzipSize: chunks.reduce((sum, chunk) => sum + (chunk.gzipSize || 0), 0)
      },
      chunks: chunks.sort((a, b) => b.size - a.size),
      assets: assets.sort((a, b) => b.size - a.size),
      issues: {
        warnings,
        errors
      },
      recommendations: this.generateRecommendations(chunks, assets)
    }
    
    return report
  }
  
  static generateRecommendations(chunks, assets) {
    const recommendations = []
    
    // Large chunk recommendations
    const largeChunks = chunks.filter(chunk => chunk.size > 150 * 1024)
    if (largeChunks.length > 0) {
      recommendations.push({
        type: 'chunk-splitting',
        message: 'Consider splitting large chunks for better caching and loading performance',
        affectedChunks: largeChunks.map(chunk => chunk.name)
      })
    }
    
    // Image optimization recommendations
    const largeImages = assets.filter(asset => 
      asset.type === 'image' && asset.size > 50 * 1024
    )
    if (largeImages.length > 0) {
      recommendations.push({
        type: 'image-optimization',
        message: 'Consider compressing or converting large images to WebP format',
        affectedAssets: largeImages.map(asset => asset.name)
      })
    }
    
    // Unused dependency recommendations
    const vendorChunks = chunks.filter(chunk => chunk.name.includes('vendor'))
    if (vendorChunks.length > 3) {
      recommendations.push({
        type: 'dependency-optimization',
        message: 'Consider tree-shaking or removing unused dependencies',
        affectedChunks: vendorChunks.map(chunk => chunk.name)
      })
    }
    
    return recommendations
  }
}

// CLI usage example
export function runBundleAnalysis() {
  console.log('🔍 Running bundle analysis...')
  
  // This would typically be called after build
  // const buildOutput = getBuildOutput()
  // const report = BundleAnalyzer.generateReport(buildOutput)
  
  console.log('📊 Bundle analysis complete!')
  console.log('📈 View detailed report at: bundle-report.html')
}