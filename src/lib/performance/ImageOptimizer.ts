export interface ImageOptimizationOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: "webp" | "jpeg" | "png" | "auto";
  progressive?: boolean;
  preserveMetadata?: boolean;
  targetSizeKB?: number;
  enableSharpening?: boolean;
  enableNoiseReduction?: boolean;
}

export interface ImageAnalysis {
  width: number;
  height: number;
  aspectRatio: number;
  format: string;
  sizeKB: number;
  colorDepth: number;
  hasTransparency: boolean;
  dominantColors: string[];
  quality: "low" | "medium" | "high" | "excellent";
  recommendations: OptimizationRecommendation[];
}

export interface OptimizationRecommendation {
  type: "format" | "compression" | "resize" | "quality";
  suggestion: string;
  potentialSavings: number;
  priority: "low" | "medium" | "high";
}

export interface OptimizationResult {
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  blob: Blob;
  url: string;
  format: string;
  quality: number;
}

interface WorkerResult {
  data: Uint8ClampedArray;
  width: number;
  height: number;
  colorSpace?: PredefinedColorSpace;
}

interface WorkerMessage {
  success: boolean;
  result: WorkerResult;
  error?: string;
}

export class ImageOptimizer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private worker: Worker | null = null;
  private isInitialized = false;

  private pendingOperations = new Map<string, Function>();
  private operationCounter = 0;

  constructor() {
    if (typeof window !== "undefined") {
      this.initialize();
    }
  }

  private initialize(): void {
    if (this.isInitialized) return;

    try {
      // Create canvas and context
      this.canvas = document.createElement("canvas");
      const ctx = this.canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Failed to get 2D context");
      }
      this.ctx = ctx;

      // Initialize worker
      if (typeof Worker !== "undefined") {
        const workerCode = this.getWorkerScript();
        const workerBlob = new Blob([workerCode], { type: "application/javascript" });
        this.worker = new Worker(URL.createObjectURL(workerBlob));
        
        // Set up worker event listeners
        this.worker.addEventListener("error", (event) => {
          console.error("Worker error:", event);
        });

        this.worker.addEventListener("message", this.handleWorkerMessage.bind(this));
      } else {
        console.warn("Web Workers not supported. Using fallback methods.");
      }

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize ImageOptimizer:", error);
      this.cleanup();
    }
  }

  private cleanup(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.canvas = null;
    this.ctx = null;
    this.isInitialized = false;
    this.pendingOperations.clear();
  }

  public async optimizeImage(
    image: File | Blob | HTMLImageElement,
    options: ImageOptimizationOptions = {}
  ): Promise<OptimizationResult> {
    if (!this.isInitialized || !this.worker) {
      throw new Error("ImageOptimizer not properly initialized");
    }

    return new Promise(async (resolve, reject) => {
      try {
        const operationId = this.generateOperationId();
        this.pendingOperations.set(operationId, resolve);

        let imageData: ImageData | null = null;
        if (image instanceof File || image instanceof Blob) {
          const loadedImage = await this.loadImage(image);
          imageData = await this.getImageData(loadedImage);
        } else {
          imageData = await this.getImageData(image);
        }

        if (!imageData) {
          throw new Error("Failed to get image data");
        }

        if (this.worker) {
          this.worker.postMessage({
            operationId,
            type: "optimize",
            imageData,
            options
          }, [imageData.data.buffer]);
        } else {
          throw new Error("Worker not available");
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleWorkerMessage(event: MessageEvent): void {
    const { operationId, result, error } = event.data;
    const resolver = this.pendingOperations.get(operationId);
    
    if (resolver) {
      if (error) {
        console.error("Worker operation failed:", error);
      } else {
        resolver(result);
      }
      this.pendingOperations.delete(operationId);
    }
  }

  private generateOperationId(): string {
    return `op_${++this.operationCounter}`;
  }

  private async loadImage(blob: Blob | File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  }

  private async getImageData(image: HTMLImageElement): Promise<ImageData | null> {
    if (!this.canvas || !this.ctx) return null;

    this.canvas.width = image.width;
    this.canvas.height = image.height;
    this.ctx.clearRect(0, 0, image.width, image.height);
    this.ctx.drawImage(image, 0, 0);

    return this.ctx.getImageData(0, 0, image.width, image.height);
  }

  public async analyzeImage(image: File | Blob | HTMLImageElement): Promise<ImageAnalysis> {
    if (!this.isInitialized || !this.worker) {
      throw new Error("ImageOptimizer not properly initialized");
    }

    return new Promise(async (resolve, reject) => {
      try {
        const operationId = this.generateOperationId();
        this.pendingOperations.set(operationId, resolve);

        let imageData: ImageData | null = null;
        if (image instanceof File || image instanceof Blob) {
          const loadedImage = await this.loadImage(image);
          imageData = await this.getImageData(loadedImage);
        } else {
          imageData = await this.getImageData(image);
        }

        if (!imageData) {
          throw new Error("Failed to get image data");
        }

        if (this.worker) {
          this.worker.postMessage({
            operationId,
            type: "analyze",
            imageData
          }, [imageData.data.buffer]);
        } else {
          throw new Error("Worker not available");
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  public destroy(): void {
    this.cleanup();
  }

  private getWorkerScript(): string {
    return `
      self.addEventListener('message', async (e) => {
        const { operationId, type, imageData, options = {} } = e.data;

        try {
          let result;
          
          switch (type) {
            case 'optimize':
              result = await optimizeImage(imageData, options);
              break;
            case 'analyze':
              result = await analyzeImage(imageData);
              break;
            default:
              throw new Error(\`Unknown operation type: \${type}\`);
          }

          self.postMessage({ operationId, result });
        } catch (error) {
          self.postMessage({ 
            operationId, 
            error: error instanceof Error ? error.message : String(error)
          });
        }
      });

      async function optimizeImage(imageData, options) {
        // Implement optimization logic here
        return imageData;
      }

      async function analyzeImage(imageData) {
        // Implement analysis logic here
        return {
          width: imageData.width,
          height: imageData.height,
          aspectRatio: imageData.width / imageData.height,
          format: 'unknown',
          sizeKB: imageData.data.length / 1024,
          colorDepth: 24,
          hasTransparency: false,
          dominantColors: [],
          quality: 'high',
          recommendations: []
        };
      }
    `;
  }

  public static async checkFormatSupport(): Promise<{
    webp: boolean;
    avif: boolean;
    heic: boolean;
    jpeg2000: boolean;
  }> {
    return Promise.all([
      ImageOptimizer.canDisplayFormat("webp"),
      ImageOptimizer.canDisplayFormat("avif"),
      ImageOptimizer.canDisplayFormat("heic"),
      ImageOptimizer.canDisplayFormat("jpeg2000"),
    ]).then(([webp, avif, heic, jpeg2000]) => ({
      webp,
      avif,
      heic,
      jpeg2000,
    }));
  }

  private static async canDisplayFormat(
    format: "webp" | "avif" | "heic" | "jpeg2000"
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(true);
      };
      img.onerror = () => {
        resolve(false);
      };
      img.src = `data:image/${format};base64,`;
    });
  }
}
