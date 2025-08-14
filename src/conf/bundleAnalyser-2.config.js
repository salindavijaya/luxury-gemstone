// bundleAnalyzer.config.js
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export const bundleAnalyzerConfig = {
  // Bundle analysis plugins
  plugins: [
    // Visualizer for bundle analysis
    visualizer({
      filename: 'dist/bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap', // 'treemap', 'sunburst', 'network'
      title: 'Gemstone E-commerce Bundle Analysis'
    }),
    
    // Size analysis plugin
    {
      name: 'bundle-size-analyzer',
      generateBundle(options, bundle) {
        const analysis = {
          totalSize: 0,
          chunks: {},
          assets: {},
          dependencies: {}
        }

        // Analyze chunks
        Object.entries(bundle).forEach(([fileName, chunk]) => {
          if (chunk.type === 'chunk') {
            const size = Buffer.byteLength(chunk.code, 'utf8')
            analysis.totalSize += size
            analysis.chunks[fileName] = {
              size,
              modules: chunk.modules ? Object.keys(chunk.modules).length : 0,
              imports: chunk.imports || [],
              exports: chunk.exports || []
            }
          } else if (chunk.type === 'asset') {
            const size = Buffer.byteLength(chunk.source, 'utf8')
            analysis.assets[fileName] = { size }
          }
        })

        // Write analysis report
        this.emitFile({
          type: 'asset',
          fileName: 'bundle-report.json',
          source: JSON.stringify(analysis, null, 2)
        })

        console.log('\n📊 Bundle Analysis Summary:')
        console.log(`Total Bundle Size: ${(analysis.totalSize / 1024).toFixed(2)} KB`)
        console.log(`Chunks: ${Object.keys(analysis.chunks).length}`)
        console.log(`Assets: ${Object.keys(analysis.assets).length}`)
      }
    }
  ],

  // Build configuration for analysis
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk splitting for better analysis
          vue: ['vue', 'vue-router', 'pinia'],
          ui: ['@headlessui/vue', 'lucide-vue-next'],
          utils: ['lodash-es', 'date-fns'],
          
          // Dynamic imports for route-based splitting
          ...getRouteChunks()
        }
      }
    },
    
    // Generate source maps for debugging
    sourcemap: true,
    
    // Report compressed size
    reportCompressedSize: true,
    
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000
  }
}

// Helper function to create route-based chunks
function getRouteChunks() {
  const routes = [
    'home',
    'products', 
    'product-detail',
    'cart',
    'checkout',
    'account',
    'admin'
  ]
  
  const chunks = {}
  routes.forEach(route => {
    chunks[route] = [`./src/views/${route.charAt(0).toUpperCase() + route.slice(1).replace('-', '')}View.vue`]
  })
  
  return chunks
}

// Bundle size thresholds
export const sizeThresholds = {
  // Warning thresholds in KB
  chunk: {
    warning: 500,
    error: 1000
  },
  asset: {
    warning: 1000,
    error: 2000
  },
  total: {
    warning: 3000,
    error: 5000
  }
}

// Dependency analysis
export function analyzeDependencies(bundle) {
  const dependencies = new Map()
  
  Object.values(bundle).forEach(chunk => {
    if (chunk.type === 'chunk' && chunk.modules) {
      Object.keys(chunk.modules).forEach(moduleId => {
        if (moduleId.includes('node_modules')) {
          const packageName = extractPackageName(moduleId)
          if (packageName) {
            const current = dependencies.get(packageName) || { size: 0, chunks: [] }
            current.size += chunk.modules[moduleId].renderedLength || 0
            current.chunks.push(chunk.fileName)
            dependencies.set(packageName, current)
          }
        }
      })
    }
  })
  
  return Array.from(dependencies.entries())
    .map(([name, info]) => ({ name, ...info }))
    .sort((a, b) => b.size - a.size)
}

// Extract package name from module path
function extractPackageName(moduleId) {
  const match = moduleId.match(/node_modules\/(?:@([^/]+)\/)?([^/]+)/)
  if (match) {
    return match[1] ? `@${match[1]}/${match[2]}` : match[2]
  }
  return null
}

// Performance budget checker
export function checkPerformanceBudget(analysis) {
  const warnings = []
  const errors = []
  
  // Check total bundle size
  if (analysis.totalSize > sizeThresholds.total.error * 1024) {
    errors.push(`Total bundle size exceeds ${sizeThresholds.total.error}KB`)
  } else if (analysis.totalSize > sizeThresholds.total.warning * 1024) {
    warnings.push(`Total bundle size exceeds ${sizeThresholds.total.warning}KB`)
  }
  
  // Check individual chunks
  Object.entries(analysis.chunks).forEach(([fileName, chunk]) => {
    if (chunk.size > sizeThresholds.chunk.error * 1024) {
      errors.push(`Chunk ${fileName} exceeds ${sizeThresholds.chunk.error}KB`)
    } else if (chunk.size > sizeThresholds.chunk.warning * 1024) {
      warnings.push(`Chunk ${fileName} exceeds ${sizeThresholds.chunk.warning}KB`)
    }
  })
  
  return { warnings, errors }
}

// Usage example for package.json scripts:
/*
{
  "scripts": {
    "analyze": "vite build --config vite.config.analyzer.js",
    "analyze:size": "npm run build && npx bundlesize",
    "analyze:deps": "npm run build && node scripts/analyze-deps.js"
  },
  "bundlesize": [
    {
      "path": "./dist/assets/*.js",
      "maxSize": "500kb"
    },
    {
      "path": "./dist/assets/*.css",
      "maxSize": "50kb"
    }
  ]
}
*/