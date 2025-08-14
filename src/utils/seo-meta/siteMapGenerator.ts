export interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

export interface SitemapConfig {
  baseUrl: string
  routes: string[]
  excludeRoutes?: string[]
  dynamicRoutes?: {
    pattern: string
    generator: () => Promise<string[]>
  }[]
}

export class SitemapGenerator {
  private config: SitemapConfig

  constructor(config: SitemapConfig) {
    this.config = config
  }

  /**
   * Generate complete sitemap XML
   */
  async generateSitemap(): Promise<string> {
    const urls = await this.collectAllUrls()
    return this.buildXml(urls)
  }

  /**
   * Collect all URLs for sitemap
   */
  private async collectAllUrls(): Promise<SitemapUrl[]> {
    const urls: SitemapUrl[] = []
    const { baseUrl, routes, excludeRoutes = [], dynamicRoutes = [] } = this.config

    // Add static routes
    routes
      .filter(route => !excludeRoutes.includes(route))
      .forEach(route => {
        urls.push({
          loc: `${baseUrl}${route}`,
          lastmod: new Date().toISOString().split('T')[0],
          changefreq: this.getChangeFreq(route),
          priority: this.getPriority(route)
        })
      })

    // Add dynamic routes
    for (const dynamicRoute of dynamicRoutes) {
      try {
        const dynamicUrls = await dynamicRoute.generator()
        dynamicUrls.forEach(url => {
          urls.push({
            loc: `${baseUrl}${url}`,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: this.getChangeFreq(url),
            priority: this.getPriority(url)
          })
        })
      } catch (error) {
        console.error(`Error generating dynamic routes for ${dynamicRoute.pattern}:`, error)
      }
    }

    return urls
  }

  /**
   * Build XML sitemap string
   */
  private buildXml(urls: SitemapUrl[]): string {
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    const urlEntries = urls.map(url => {
      let entry = `  <url>
    <loc>${this.escapeXml(url.loc)}</loc>`
      
      if (url.lastmod) {
        entry += `
    <lastmod>${url.lastmod}</lastmod>`
      }
      
      if (url.changefreq) {
        entry += `
    <changefreq>${url.changefreq}</changefreq>`
      }
      
      if (url.priority !== undefined) {
        entry += `
    <priority>${url.priority}</priority>`
      }
      
      entry += `
  </url>`
      
      return entry
    }).join('\n')

    const footer = `
</urlset>`

    return header + '\n' + urlEntries + footer
  }

  /**
   * Determine change frequency based on route
   */
  private getChangeFreq(route: string): SitemapUrl['changefreq'] {
    if (route === '/' || route === '/home') return 'daily'
    if (route.includes('/products/') || route.includes('/gemstone/')) return 'weekly'
    if (route.includes('/collection') || route.includes('/category')) return 'weekly'
    if (route.includes('/blog') || route.includes('/news')) return 'weekly'
    if (route.includes('/about') || route.includes('/contact')) return 'monthly'
    return 'monthly'
  }

  /**
   * Determine priority based on route
   */
  private getPriority(route: string): number {
    if (route === '/' || route === '/home') return 1.0
    if (route.includes('/products/') || route.includes('/gemstone/')) return 0.8
    if (route.includes('/collection') || route.includes('/category')) return 0.7
    if (route.includes('/blog') || route.includes('/news')) return 0.6
    if (route.includes('/about') || route.includes('/contact')) return 0.5
    return 0.5
  }

  /**
   * Escape XML special characters
   */
  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  /**
   * Generate sitemap index for multiple sitemaps
   */
  generateSitemapIndex(sitemaps: { loc: string; lastmod?: string }[]): string {
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    const sitemapEntries = sitemaps.map(sitemap => {
      let entry = `  <sitemap>
    <loc>${this.escapeXml(sitemap.loc)}</loc>`
      
      if (sitemap.lastmod) {
        entry += `
    <lastmod>${sitemap.lastmod}</lastmod>`
      }
      
      entry += `
  </sitemap>`
      
      return entry
    }).join('\n')

    const footer = `
</sitemapindex>`

    return header + '\n' + sitemapEntries + footer
  }

  /**
   * Save sitemap to file (for Node.js environments)
   */
  async saveSitemap(filename: string = 'sitemap.xml'): Promise<void> {
    try {
      const sitemap = await this.generateSitemap()
      
      // For browser environment, trigger download
      if (typeof window !== 'undefined') {
        const blob = new Blob([sitemap], { type: 'application/xml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
      // For Node.js environment
      else if (typeof require !== 'undefined') {
        const fs = require('fs').promises
        await fs.writeFile(filename, sitemap, 'utf8')
        console.log(`Sitemap saved to ${filename}`)
      }
    } catch (error) {
      console.error('Error saving sitemap:', error)
      throw error
    }
  }
}

/**
 * Create sitemap generator with default configuration for gemstone e-commerce
 */
export function createGemstoneCommerceSitemapGenerator(baseUrl: string) {
  return new SitemapGenerator({
    baseUrl,
    routes: [
      '/',
      '/products',
      '/collections',
      '/about',
      '/contact',
      '/blog',
      '/privacy-policy',
      '/terms-of-service',
      '/shipping-info',
      '/size-guide',
      '/care-instructions'
    ],
    excludeRoutes: [
      '/admin',
      '/checkout',
      '/account',
      '/cart'
    ],
    dynamicRoutes: [
      {
        pattern: '/products/:id',
        generator: async () => {
          try {
            // Mock product IDs - replace with actual API call
            const productIds = await fetchProductIds()
            return productIds.map(id => `/products/${id}`)
          } catch {
            return []
          }
        }
      },
      {
        pattern: '/collections/:slug',
        generator: async () => {
          try {
            // Mock collection slugs - replace with actual API call
            const collections = await fetchCollectionSlugs()
            return collections.map(slug => `/collections/${slug}`)
          } catch {
            return []
          }
        }
      },
      {
        pattern: '/blog/:slug',
        generator: async () => {
          try {
            // Mock blog post slugs - replace with actual API call
            const posts = await fetchBlogPostSlugs()
            return posts.map(slug => `/blog/${slug}`)
          } catch {
            return []
          }
        }
      }
    ]
  })
}

// Mock functions - replace with actual API calls
async function fetchProductIds(): Promise<string[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return [
    'emerald-princess-cut-001',
    'diamond-solitaire-002',
    'ruby-vintage-ring-003',
    'sapphire-halo-earrings-004',
    'aquamarine-pendant-005',
    'amethyst-cluster-006',
    'opal-fire-ring-007',
    'topaz-blue-necklace-008',
    'garnet-antique-brooch-009',
    'peridot-stud-earrings-010'
  ]
}

async function fetchCollectionSlugs(): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return [
    'bridal-collection',
    'vintage-classics',
    'modern-minimalist',
    'colored-gemstones',
    'diamond-essentials',
    'statement-pieces',
    'everyday-elegance',
    'rare-finds'
  ]
}

async function fetchBlogPostSlugs(): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return [
    'choosing-perfect-engagement-ring',
    'gemstone-care-guide',
    'history-of-emeralds',
    'diamond-cut-comparison',
    'jewelry-trends-2024',
    'birthstone-meanings',
    'investment-grade-gemstones',
    'jewelry-photography-tips'
  ]
}