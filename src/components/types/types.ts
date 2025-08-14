// types/product.ts
export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    images: string[];
    category: string;
    subcategory?: string;
    gemstoneType: GemstoneType;
    description: string;
    specifications: GemstoneSpecifications;
    certification?: Certification;
    stockStatus: StockStatus;
    rating: number;
    reviewCount: number;
    tags: string[];
    featured: boolean;
    isNew: boolean;
    onSale: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface GemstoneSpecifications {
    carat: number;
    cut: Cut;
    color: Color;
    clarity: Clarity;
    shape: Shape;
    origin?: string;
    dimensions?: {
      length: number;
      width: number;
      depth: number;
    };
    fluorescence?: string;
    treatments?: string[];
  }
  
  export interface Certification {
    agency: CertificationAgency;
    certificateNumber: string;
    date: string;
    reportUrl?: string;
  }
  
  export type GemstoneType = 
    | 'diamond' 
    | 'ruby' 
    | 'sapphire' 
    | 'emerald' 
    | 'amethyst' 
    | 'topaz' 
    | 'garnet' 
    | 'peridot' 
    | 'tanzanite' 
    | 'aquamarine';
  
  export type Cut = 'excellent' | 'very-good' | 'good' | 'fair' | 'poor';
  export type Color = 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'fancy';
  export type Clarity = 'FL' | 'IF' | 'VVS1' | 'VVS2' | 'VS1' | 'VS2' | 'SI1' | 'SI2' | 'I1' | 'I2' | 'I3';
  export type Shape = 'round' | 'princess' | 'cushion' | 'oval' | 'emerald' | 'pear' | 'marquise' | 'asscher' | 'radiant' | 'heart';
  export type CertificationAgency = 'GIA' | 'AGS' | 'SSEF' | 'Gübelin' | 'AGL' | 'LOTUS';
  export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock' | 'pre-order';
  
  export interface ProductFilters {
    search?: string;
    categories: string[];
    gemstoneTypes: GemstoneType[];
    priceRange: [number, number];
    caratRange: [number, number];
    cuts: Cut[];
    colors: Color[];
    clarities: Clarity[];
    shapes: Shape[];
    certifications: CertificationAgency[];
    origins: string[];
    stockStatus: StockStatus[];
    onSale: boolean;
    featured: boolean;
    isNew: boolean;
  }
  
  export type SortOption = 
    | 'newest' 
    | 'price-low-high' 
    | 'price-high-low' 
    | 'carat-high-low' 
    | 'carat-low-high' 
    | 'rating' 
    | 'popularity';
  
  export type ViewMode = 'grid' | 'list';
  