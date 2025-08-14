/**
 * ColorExtractor - Extracts dominant colors from images for theme generation
 * Supports multiple extraction methods and color format outputs
 */

export interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  frequency: number;
  luminance: number;
}

export interface ColorPalette {
  dominant: ColorInfo;
  palette: ColorInfo[];
  averageColor: ColorInfo;
  contrastColor: ColorInfo;
}

export interface ExtractionOptions {
  colorCount?: number;
  quality?: number;
  ignoreWhite?: boolean;
  ignoreBlack?: boolean;
  minLuminance?: number;
  maxLuminance?: number;
}

class ColorExtractor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * Extract color palette from image URL or File
   */
  async extractFromImage(
    source: string | File,
    options: ExtractionOptions = {}
  ): Promise<ColorPalette> {
    const img = await this.loadImage(source);
    return this.extractFromImageElement(img, options);
  }

  /**
   * Extract colors from HTMLImageElement
   */
  extractFromImageElement(
    img: HTMLImageElement,
    options: ExtractionOptions = {}
  ): ColorPalette {
    const {
      colorCount = 5,
      quality = 10,
      ignoreWhite = true,
      ignoreBlack = true,
      minLuminance = 0.1,
      maxLuminance = 0.9
    } = options;

    // Set canvas size (limit for performance)
    const maxSize = 150;
    const ratio = Math.min(maxSize / img.width, maxSize / img.height);
    const width = Math.floor(img.width * ratio);
    const height = Math.floor(img.height * ratio);

    this.canvas.width = width;
    this.canvas.height = height;

    // Draw image on canvas
    this.ctx.drawImage(img, 0, 0, width, height);

    // Get image data
    const imageData = this.ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    // Extract colors using quantization
    const colorMap = this.quantizeColors(pixels, quality);
    const filteredColors = this.filterColors(
      colorMap,
      ignoreWhite,
      ignoreBlack,
      minLuminance,
      maxLuminance
    );

    // Sort by frequency and get top colors
    const sortedColors = Array.from(filteredColors.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, colorCount);

    const palette = sortedColors.map(([color, frequency]) => {
      const rgb = this.hexToRgb(color);
      return {
        hex: color,
        rgb,
        hsl: this.rgbToHsl(rgb.r, rgb.g, rgb.b),
        frequency: frequency / pixels.length * 4, // Normalize frequency
        luminance: this.calculateLuminance(rgb.r, rgb.g, rgb.b)
      };
    });

    const dominant = palette[0] || this.createDefaultColor();
    const averageColor = this.calculateAverageColor(palette);
    const contrastColor = this.getContrastColor(dominant);

    return {
      dominant,
      palette,
      averageColor,
      contrastColor
    };
  }

  /**
   * Get complementary color scheme
   */
  getComplementaryColors(baseColor: string): string[] {
    const hsl = this.hexToHsl(baseColor);
    return [
      this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l), // Complementary
      this.hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l), // Triadic 1
      this.hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l), // Triadic 2
      this.hslToHex(hsl.h, Math.max(0, hsl.s - 20), Math.min(100, hsl.l + 20)), // Lighter
      this.hslToHex(hsl.h, Math.min(100, hsl.s + 20), Math.max(0, hsl.l - 20))  // Darker
    ];
  }

  /**
   * Generate CSS custom properties from palette
   */
  generateCSSVariables(palette: ColorPalette, prefix = 'extracted'): string {
    let css = `:root {\n`;
    css += `  --${prefix}-dominant: ${palette.dominant.hex};\n`;
    css += `  --${prefix}-contrast: ${palette.contrastColor.hex};\n`;
    css += `  --${prefix}-average: ${palette.averageColor.hex};\n`;
    
    palette.palette.forEach((color, index) => {
      css += `  --${prefix}-${index + 1}: ${color.hex};\n`;
    });
    
    css += `}`;
    return css;
  }

  /**
   * Apply extracted colors to Tailwind config
   */
  generateTailwindColors(palette: ColorPalette): Record<string, string> {
    const colors: Record<string, string> = {
      'extracted-dominant': palette.dominant.hex,
      'extracted-contrast': palette.contrastColor.hex,
      'extracted-average': palette.averageColor.hex
    };

    palette.palette.forEach((color, index) => {
      colors[`extracted-${index + 1}`] = color.hex;
    });

    return colors;
  }

  private async loadImage(source: string | File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => resolve(img);
      img.onerror = reject;
      
      if (typeof source === 'string') {
        img.src = source;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(source);
      }
    });
  }

  private quantizeColors(pixels: Uint8ClampedArray, quality: number): Map<string, number> {
    const colorMap = new Map<string, number>();
    
    for (let i = 0; i < pixels.length; i += 4 * quality) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];
      
      // Skip transparent pixels
      if (a < 125) continue;
      
      // Reduce color precision for better grouping
      const reducedR = Math.floor(r / 8) * 8;
      const reducedG = Math.floor(g / 8) * 8;
      const reducedB = Math.floor(b / 8) * 8;
      
      const color = this.rgbToHex(reducedR, reducedG, reducedB);
      colorMap.set(color, (colorMap.get(color) || 0) + 1);
    }
    
    return colorMap;
  }

  private filterColors(
    colorMap: Map<string, number>,
    ignoreWhite: boolean,
    ignoreBlack: boolean,
    minLuminance: number,
    maxLuminance: number
  ): Map<string, number> {
    const filtered = new Map<string, number>();
    
    for (const [color, count] of colorMap.entries()) {
      const rgb = this.hexToRgb(color);
      const luminance = this.calculateLuminance(rgb.r, rgb.g, rgb.b);
      
      // Filter out colors based on criteria
      if (ignoreWhite && luminance > 0.95) continue;
      if (ignoreBlack && luminance < 0.05) continue;
      if (luminance < minLuminance || luminance > maxLuminance) continue;
      
      filtered.set(color, count);
    }
    
    return filtered;
  }

  private calculateAverageColor(palette: ColorInfo[]): ColorInfo {
    if (palette.length === 0) return this.createDefaultColor();
    
    let totalR = 0, totalG = 0, totalB = 0, totalWeight = 0;
    
    palette.forEach(color => {
      const weight = color.frequency;
      totalR += color.rgb.r * weight;
      totalG += color.rgb.g * weight;
      totalB += color.rgb.b * weight;
      totalWeight += weight;
    });
    
    const avgR = Math.round(totalR / totalWeight);
    const avgG = Math.round(totalG / totalWeight);
    const avgB = Math.round(totalB / totalWeight);
    
    return {
      hex: this.rgbToHex(avgR, avgG, avgB),
      rgb: { r: avgR, g: avgG, b: avgB },
      hsl: this.rgbToHsl(avgR, avgG, avgB),
      frequency: 1,
      luminance: this.calculateLuminance(avgR, avgG, avgB)
    };
  }

  private getContrastColor(color: ColorInfo): ColorInfo {
    const luminance = color.luminance;
    const contrastColor = luminance > 0.5 ? '#000000' : '#ffffff';
    const rgb = this.hexToRgb(contrastColor);
    
    return {
      hex: contrastColor,
      rgb,
      hsl: this.rgbToHsl(rgb.r, rgb.g, rgb.b),
      frequency: 1,
      luminance: this.calculateLuminance(rgb.r, rgb.g, rgb.b)
    };
  }

  private createDefaultColor(): ColorInfo {
    return {
      hex: '#6b7280',
      rgb: { r: 107, g: 114, b: 128 },
      hsl: { h: 220, s: 9, l: 46 },
      frequency: 1,
      luminance: 0.46
    };
  }

  // Color conversion utilities
  private rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const sum = max + min;
    const l = sum / 2;

    if (diff === 0) {
      return { h: 0, s: 0, l: Math.round(l * 100) };
    }

    const s = l > 0.5 ? diff / (2 - sum) : diff / sum;

    let h: number;
    switch (max) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
      default:
        h = 0;
    }

    return {
      h: Math.round(h * 60),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  private hexToHsl(hex: string): { h: number; s: number; l: number } {
    const rgb = this.hexToRgb(hex);
    return this.rgbToHsl(rgb.r, rgb.g, rgb.b);
  }

  private hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return this.rgbToHex(r, g, b);
  }

  private calculateLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }
}

// Export singleton instance
export const colorExtractor = new ColorExtractor();

// Export class for custom instances
export { ColorExtractor };