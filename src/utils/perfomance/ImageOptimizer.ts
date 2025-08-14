/**
 * Advanced Image Optimizer for luxury e-commerce platform
 * Provides image compression, format detection, and optimization utilities
 */

export interface ImageOptimizationOptions {
  quality?: number
  maxWidth?: number
  maxHeight?: number
  format?: 'webp' | 'jpeg' | 'png' | 'auto'
  progressive?: boolean
  preserveMetadata?: boolean
  targetSizeKB?: number
  enableSharpening?: boolean
  enableNoiseReduction?: boolean
}

export interface ImageAnalysis {
  width: number
  height: number
  aspectRatio: number
  format: string
  sizeKB: number
  colorDepth: number
  hasTransparency: boolean
  dominantColors: string[]
  quality: 'low' | 'medium' | 'high' | 'excellent'
  recommendations: OptimizationRecommendation[]
}

export interface OptimizationRecommendation {
  type: 'format' | 'compression' | 'resize' | 'quality'
  suggestion: string
  potentialSavings: number
  priority: 'low' | 'medium' | 'high'
}

export interface OptimizationResult {
  originalSize: number
  optimizedSize: number
  compressionRatio: number
  blob: Blob
  url: string
  format: string
  quality: number
}

export class ImageOptimizer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private worker: Worker | null = null

  constructor() {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')!
    this.initializeWorker()
  }

  /**
   * Initialize web worker for heavy processing tasks
   */
  private initializeWorker(): void {
    if (typeof Worker !== 'undefined') {
      const workerBlob = new Blob([this.getWorkerScript()], {
        type: 'application/javascript'
      })
      this.worker = new Worker(URL.createObjectURL(workerBlob))
    }
  }

  /**
   * Web worker script for image processing
   */
  private getWorkerScript(): string {
    return `
      self.onmessage = function(e) {
        const { imageData, operation, options } = e.data
        
        try {
          let result
          switch (operation) {
            case 'analyze':
              result = analyzeImageData(imageData)
              break
            case 'sharpen':
              result = sharpenImage(imageData, options.strength || 0.5)
              break
            case 'denoise':
              result = denoiseImage(imageData, options.strength || 0.3)
              break
            default:
              throw new Error('Unknown operation: ' + operation)
          }
          
          self.postMessage({ success: true, result })
        } catch (error) {
          self.postMessage({ success: false, error: error.message })
        }
      }

      function analyzeImageData(imageData) {
        const { data, width, height } = imageData
        const pixelCount = width * height
        let totalR = 0, totalG = 0, totalB = 0
        let minBrightness = 255, maxBrightness = 0
        const colorHistogram = new Map()
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const brightness = (r + g + b) / 3
          
          totalR += r
          totalG += g
          totalB += b
          
          minBrightness = Math.min(minBrightness, brightness)
          maxBrightness = Math.max(maxBrightness, brightness)
          
          const colorKey = \`\${Math.floor(r/32)}-\${Math.floor(g/32)}-\${Math.floor(b/32)}\`
          colorHistogram.set(colorKey, (colorHistogram.get(colorKey) || 0) + 1)
        }
        
        const avgR = Math.round(totalR / pixelCount)
        const avgG = Math.round(totalG / pixelCount)
        const avgB = Math.round(totalB / pixelCount)
        
        const contrast = maxBrightness - minBrightness
        const uniqueColors = colorHistogram.size
        
        return {
          averageColor: [avgR, avgG, avgB],
          contrast,
          uniqueColors,
          brightness: (minBrightness + maxBrightness) / 2
        }
      }

      function sharpenImage(imageData, strength) {
        const { data, width, height } = imageData
        const output = new Uint8ClampedArray(data)
        
        const kernel = [
          0, -strength, 0,
          -strength, 1 + 4 * strength, -strength,
          0, -strength, 0
        ]
        
        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            for (let c = 0; c < 3; c++) {
              let sum = 0
              for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                  const idx = ((y + ky) * width + (x + kx)) * 4 + c
                  sum += data[idx] * kernel[(ky + 1) * 3 + (kx + 1)]
                }
              }
              const idx = (y * width + x) * 4 + c
              output[idx] = Math.max(0, Math.min(255, sum))
            }
          }
        }
        
        return { data: output, width, height }
      }

      function denoiseImage(imageData, strength) {
        const { data, width, height } = imageData
        const output = new Uint8ClampedArray(data)
        const radius = Math.ceil(strength * 3)
        
        for (let y = radius; y < height - radius; y++) {
          for (let x = radius; x < width - radius; x++) {
            for (let c = 0; c < 3; c++) {
              let sum = 0
              let count = 0
              
              for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                  const idx = ((y + dy) * width + (x + dx)) * 4 + c
                  sum += data[idx]
                  count++
                }
              }
              
              const idx = (y * width + x) * 4 + c
              output[idx] = sum / count
            }
          }
        }
        
        return { data: output, width, height }
      }
    `
  }

  /**
   * Check browser support for various image formats
   */
  public static checkFormatSupport(): Promise<{
    webp: boolean
    avif: boolean
    heic: boolean
    jpeg2000: boolean
  }> {
    return Promise.all([
      this.canDisplayFormat('webp'),
      this.canDisplayFormat('avif'),
      this.canDisplayFormat('heic'),
      this.canDisplayFormat('jpeg2000')
    ]).then(([webp, avif, heic, jpeg2000]) => ({
      webp,
      avif,
      heic,
      jpeg2000
    }))
  }

  private static canDisplayFormat(format: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      
      const testImages = {
        webp: 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
        avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=',
        heic: 'data:image/heic;base64,AAAAGGZ0eXBoZWljAAAAAG1pZjFoZWljbWlmMQAAAOptZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA==',
        jpeg2000: 'data:image/jp2;base64,/0//UQAyAAAAAAABAAAAAgAAAAAAAAAAAAAABAAAAAQAAAAAAAAAAAAEBwEBBwEBBwEBBwEB/1IADQAAAQAAAA4RBwEB/1IAH0AAAQBrbGJjZGVmZ2hpams='
      }
      
      img.src = testImages[format] || ''
    })
  }

  /**
   * Load and analyze an image file
   */
  public async analyzeImage(file: File | string): Promise<ImageAnalysis> {
    const img = await this.loadImage(file)
    const imageData = this.getImageData(img)
    
    const analysis = await this.performAnalysis(imageData, img)
    const recommendations = this.generateRecommendations(analysis)
    
    return {
      ...analysis,
      recommendations
    }
  }

  private async performAnalysis(imageData: ImageData, img: HTMLImageElement): Promise<Omit<ImageAnalysis, 'recommendations'>> {
    const { width, height } = imageData
    const sizeKB = this.estimateSize(imageData)
    
    let workerResult: any = null
    if (this.worker) {
      try {
        workerResult = await this.runWorkerTask('analyze', imageData)
      } catch (error) {
        console.warn('Worker analysis failed, using fallback:', error)
      }
    }
    
    const dominantColors = this.extractDominantColors(imageData, workerResult?.averageColor)
    const quality = this.assessQuality(imageData, workerResult)
    
    return {
      width,
      height,
      aspectRatio: width / height,
      format: this.detectFormat(img.src),
      sizeKB,
      colorDepth: this.estimateColorDepth(imageData),
      hasTransparency: this.hasTransparency(imageData),
      dominantColors,
      quality
    }
  }

  private estimateSize(imageData: ImageData): number {
    // Rough estimation based on pixel count and compression ratio
    const pixelCount = imageData.width * imageData.height
    const bytesPerPixel = this.hasTransparency(imageData) ? 4 : 3
    const uncompressedSize = pixelCount * bytesPerPixel
    // Assume average 85% compression for JPEG
    return Math.round(uncompressedSize * 0.15 / 1024)
  }

  private detectFormat(src: string): string {
    if (src.includes('data:image/')) {
      return src.split('data:image/')[1].split(';')[0]
    }
    const extension = src.split('.').pop()?.toLowerCase()
    return extension || 'unknown'
  }

  private estimateColorDepth(imageData: ImageData): number {
    const { data } = imageData
    const uniqueColors = new Set()
    
    for (let i = 0; i < data.length; i += 4) {
      const color = `${data[i]}-${data[i + 1]}-${data[i + 2]}`
      uniqueColors.add(color)
      if (uniqueColors.size > 65536) return 24 // Early exit for high color depth
    }
    
    if (uniqueColors.size <= 256) return 8
    if (uniqueColors.size <= 65536) return 16
    return 24
  }

  private hasTransparency(imageData: ImageData): boolean {
    const { data } = imageData
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 255) return true
    }
    return false
  }

  private extractDominantColors(imageData: ImageData, averageColor?: number[]): string[] {
    if (averageColor) {
      return [`rgb(${averageColor.join(',')})`]
    }
    
    // Fallback color extraction
    const { data, width, height } = imageData
    const colorMap = new Map<string, number>()
    const sampleRate = Math.max(1, Math.floor(width * height / 1000)) // Sample ~1000 pixels
    
    for (let i = 0; i < data.length; i += 4 * sampleRate) {
      const r = Math.floor(data[i] / 32) * 32
      const g = Math.floor(data[i + 1] / 32) * 32
      const b = Math.floor(data[i + 2] / 32) * 32
      const color = `rgb(${r},${g},${b})`
      colorMap.set(color, (colorMap.get(color) || 0) + 1)
    }
    
    return Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([color]) => color)
  }

  private assessQuality(imageData: ImageData, workerResult?: any): 'low' | 'medium' | 'high' | 'excellent' {
    const { width, height } = imageData
    const pixelCount = width * height
    const contrast = workerResult?.contrast || this.calculateContrast(imageData)
    
    let score = 0
    
    // Resolution score
    if (pixelCount > 2000000) score += 3 // > 2MP
    else if (pixelCount > 500000) score += 2 // > 0.5MP
    else if (pixelCount > 100000) score += 1 // > 0.1MP
    
    // Contrast score
    if (contrast > 200) score += 2
    else if (contrast > 100) score += 1
    
    // Sharpness estimation (simplified)
    const sharpness = this.estimateSharpness(imageData)
    if (sharpness > 0.8) score += 2
    else if (sharpness > 0.5) score += 1
    
    if (score >= 6) return 'excellent'
    if (score >= 4) return 'high'
    if (score >= 2) return 'medium'
    return 'low'
  }

  private calculateContrast(imageData: ImageData): number {
    const { data } = imageData
    let min = 255, max = 0
    
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
      min = Math.min(min, brightness)
      max = Math.max(max, brightness)
    }
    
    return max - min
  }

  private estimateSharpness(imageData: ImageData): number {
    // Simplified edge detection for sharpness estimation
    const { data, width, height } = imageData
    let edgeStrength = 0
    let edgeCount = 0
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          const center = data[(y * width + x) * 4 + c]
          const right = data[(y * width + x + 1) * 4 + c]
          const bottom = data[((y + 1) * width + x) * 4 + c]
          
          const gradientX = Math.abs(center - right)
          const gradientY = Math.abs(center - bottom)
          const gradient = Math.sqrt(gradientX * gradientX + gradientY * gradientY)
          
          if (gradient > 10) { // Threshold for edge detection
            edgeStrength += gradient
            edgeCount++
          }
        }
      }
    }
    
    return edgeCount > 0 ? Math.min(1, edgeStrength / edgeCount / 100) : 0
  }

  private generateRecommendations(analysis: Omit<ImageAnalysis, 'recommendations'>): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = []
    
    // Format recommendations
    if (analysis.format === 'png' && !analysis.hasTransparency) {
      recommendations.push({
        type: 'format',
        suggestion: 'Convert PNG to JPEG or WebP for better compression',
        potentialSavings: 60,
        priority: 'high'
      })
    }
    
    if (analysis.format !== 'webp' && analysis.sizeKB > 100) {
      recommendations.push({
        type: 'format',
        suggestion: 'Convert to WebP format for better compression',
        potentialSavings: 35,
        priority: 'medium'
      })
    }
    
    // Size recommendations
    if (analysis.width > 2048 || analysis.height > 2048) {
      recommendations.push({
        type: 'resize',
        suggestion: 'Consider resizing for web display (max 2048px)',
        potentialSavings: 75,
        priority: 'high'
      })
    }
    
    // Quality recommendations
    if (analysis.sizeKB > 500) {
      recommendations.push({
        type: 'compression',
        suggestion: 'Increase compression to reduce file size',
        potentialSavings: 40,
        priority: 'medium'
      })
    }
    
    if (analysis.quality === 'low') {
      recommendations.push({
        type: 'quality',
        suggestion: 'Image quality is low, consider using higher resolution source',
        potentialSavings: 0,
        priority: 'low'
      })
    }
    
    return recommendations
  }

  /**
   * Optimize an image with specified options
   */
  public async optimizeImage(
    file: File | string,
    options: ImageOptimizationOptions = {}
  ): Promise<OptimizationResult> {
    const img = await this.loadImage(file)
    const originalBlob = file instanceof File ? file : await this.urlToBlob(file)
    
    const opts = {
      quality: 0.85,
      maxWidth: 2048,
      maxHeight: 2048,
      format: 'auto' as const,
      progressive: true,
      preserveMetadata: false,
      enableSharpening: false,
      enableNoiseReduction: false,
      ...options
    }
    
    // Calculate optimal dimensions
    const { width: newWidth, height: newHeight } = this.calculateOptimalDimensions(
      img.width,
      img.height,
      opts.maxWidth!,
      opts.maxHeight!
    )
    
    // Set canvas size
    this.canvas.width = newWidth
    this.canvas.height = newHeight
    
    // Draw and potentially enhance image
    this.ctx.drawImage(img, 0, 0, newWidth, newHeight)
    
    let imageData = this.ctx.getImageData(0, 0, newWidth, newHeight)
    
    // Apply enhancements if requested
    if (opts.enableSharpening && this.worker) {
      try {
        const result = await this.runWorkerTask('sharpen', imageData, { strength: 0.5 })
        if (result) {
          imageData = new ImageData(result.data, result.width, result.height)
          this.ctx.putImageData(imageData, 0, 0)
        }
      } catch (error) {
        console.warn('Sharpening failed:', error)
      }
    }
    
    if (opts.enableNoiseReduction && this.worker) {
      try {
        const result = await this.runWorkerTask('denoise', imageData, { strength: 0.3 })
        if (result) {
          imageData = new ImageData(result.data, result.width, result.height)
          this.ctx.putImageData(imageData, 0, 0)
        }
      } catch (error) {
        console.warn('Noise reduction failed:', error)
      }
    }
    
    // Determine output format
    const outputFormat = await this.determineOptimalFormat(opts.format, imageData)
    
    // Generate optimized blob
    const optimizedBlob = await this.canvasToBlob(outputFormat, opts.quality!)
    
    // If target size is specified, iteratively adjust quality
    if (opts.targetSizeKB && optimizedBlob.size / 1024 > opts.targetSizeKB) {
      const targetBlob = await this.optimizeToTargetSize(
        outputFormat,
        opts.targetSizeKB,
        opts.quality!
      )
      return this.createOptimizationResult(originalBlob, targetBlob, outputFormat, opts.quality!)
    }
    
    return this.createOptimizationResult(originalBlob, optimizedBlob, outputFormat, opts.quality!)
  }

  private calculateOptimalDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    const aspectRatio = originalWidth / originalHeight
    
    let width = originalWidth
    let height = originalHeight
    
    if (width > maxWidth) {
      width = maxWidth
      height = width / aspectRatio
    }
    
    if (height > maxHeight) {
      height = maxHeight
      width = height * aspectRatio
    }
    
    return {
      width: Math.round(width),
      height: Math.round(height)
    }
  }

  private async determineOptimalFormat(
    preferredFormat: string,
    imageData: ImageData
  ): Promise<string> {
    if (preferredFormat !== 'auto') {
      return preferredFormat === 'jpeg' ? 'image/jpeg' : `image/${preferredFormat}`
    }
    
    const hasTransparency = this.hasTransparency(imageData)
    const supportedFormats = await ImageOptimizer.checkFormatSupport()
    
    if (hasTransparency) {
      if (supportedFormats.webp) return 'image/webp'
      return 'image/png'
    }
    
    if (supportedFormats.avif) return 'image/avif'
    if (supportedFormats.webp) return 'image/webp'
    return 'image/jpeg'
  }

  private async optimizeToTargetSize(
    format: string,
    targetSizeKB: number,
    initialQuality: number
  ): Promise<Blob> {
    let quality = initialQuality
    let blob = await this.canvasToBlob(format, quality)
    let iterations = 0
    const maxIterations = 10
    
    while (blob.size / 1024 > targetSizeKB && quality > 0.1 && iterations < maxIterations) {
      quality *= 0.8 // Reduce quality by 20% each iteration
      blob = await this.canvasToBlob(format, quality)
      iterations++
    }
    
    return blob
  }

  private createOptimizationResult(
    originalBlob: Blob,
    optimizedBlob: Blob,
    format: string,
    quality: number
  ): OptimizationResult {
    return {
      originalSize: originalBlob.size,
      optimizedSize: optimizedBlob.size,
      compressionRatio: (originalBlob.size - optimizedBlob.size) / originalBlob.size,
      blob: optimizedBlob,
      url: URL.createObjectURL(optimizedBlob),
      format: format.replace('image/', ''),
      quality
    }
  }

  /**
   * Batch optimize multiple images
   */
  public async optimizeImages(
    files: (File | string)[],
    options: ImageOptimizationOptions = {},
    onProgress?: (completed: number, total: number) => void
  ): Promise<OptimizationResult[]> {
    const results: OptimizationResult[] = []
    
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.optimizeImage(files[i], options)
        results.push(result)
        onProgress?.(i + 1, files.length)
      } catch (error) {
        console.error(`Failed to optimize image ${i}:`, error)
        // Continue with other images
      }
    }
    
    return results
  }

  /**
   * Generate progressive JPEG with multiple quality levels
   */
  public async generateProgressiveVersions(
    file: File | string,
    qualities: number[] = [0.3, 0.6, 0.85]
  ): Promise<OptimizationResult[]> {
    const img = await this.loadImage(file)
    const originalBlob = file instanceof File ? file : await this.urlToBlob(file)
    const results: OptimizationResult[] = []
    
    for (const quality of qualities) {
      const result = await this.optimizeImage(file, {
        quality,
        format: 'jpeg',
        progressive: true
      })
      results.push(result)
    }
    
    return results
  }

  /**
   * Create responsive image set
   */
  public async createResponsiveSet(
    file: File | string,
    breakpoints: number[] = [480, 768, 1024, 1280, 1920]
  ): Promise<{ [key: number]: OptimizationResult }> {
    const img = await this.loadImage(file)
    const results: { [key: number]: OptimizationResult } = {}
    
    for (const breakpoint of breakpoints) {
      if (breakpoint <= img.width) {
        const result = await this.optimizeImage(file, {
          maxWidth: breakpoint,
          maxHeight: breakpoint,
          quality: 0.85,
          format: 'auto'
        })
        results[breakpoint] = result
      }
    }
    
    return results
  }

  // Utility methods
  private async loadImage(source: File | string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      
      if (source instanceof File) {
        img.src = URL.createObjectURL(source)
      } else {
        img.src = source
      }
    })
  }

  private getImageData(img: HTMLImageElement): ImageData {
    this.canvas.width = img.width
    this.canvas.height = img.height
    this.ctx.drawImage(img, 0, 0)
    return this.ctx.getImageData(0, 0, img.width, img.height)
  }

  private async canvasToBlob(format: string, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Failed to create blob'))
        },
        format,
        quality
      )
    })
  }

  private async urlToBlob(url: string): Promise<Blob> {
    const response = await fetch(url)
    return response.blob()
  }

  private async runWorkerTask(
    operation: string,
    imageData: ImageData,
    options: any = {}
  ): Promise<any> {
    if (!this.worker) throw new Error('Worker not available')
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Worker timeout'))
      }, 10000)
      
      const handler = (e: MessageEvent) => {
        clearTimeout(timeout)
        this.worker!.removeEventListener('message', handler)
        
        if (e.data.success) {
          resolve(e.data.result)
        } else {
          reject(new Error(e.data.error))
        }
      }
      
      this.worker.addEventListener('message', handler)
      this.worker.postMessage({ imageData, operation, options })
    })
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
  }
}

// Export utility functions
export const imageOptimizer = new ImageOptimizer()

export const optimizeImageForWeb = async (
  file: File,
  maxSizeKB: number = 300
): Promise<OptimizationResult> => {
  return imageOptimizer.optimizeImage(file, {
    quality: 0.85,
    maxWidth: 1920,
    maxHeight: 1920,
    format: 'auto',
    targetSizeKB: maxSizeKB,
    progressive: true
  })
}

export const createThumbnail = async (
  file: File | string,
  size: number = 200
): Promise<OptimizationResult> => {
  return imageOptimizer.optimizeImage(file, {
    maxWidth: size,
    maxHeight: size,
    quality: 0.8,
    format: 'webp'
  })
}

export const generateProductImageSet = async (
  file: File
): Promise<{
  thumbnail: OptimizationResult
  medium: OptimizationResult
  large: OptimizationResult
  original: OptimizationResult
}> => {
  const [thumbnail, medium, large, original] = await Promise.all([
    createThumbnail(file, 300),
    imageOptimizer.optimizeImage(file, { maxWidth: 800, quality: 0.85 }),
    imageOptimizer.optimizeImage(file, { maxWidth: 1400, quality: 0.9 }),
    imageOptimizer.optimizeImage(file, { maxWidth: 2400, quality: 0.95 })
  ])
  
  return { thumbnail, medium, large, original }
}