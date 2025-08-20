import {
  GemstoneType,
  Cut,
  Color,
  Clarity,
  Shape,
  CertificationAgency,
  StockStatus,
} from "@/features/products/store/types";

export * from "@/features/products/store/types";

// Common interfaces
export interface Image {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ImageOrString {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

// Product related interfaces
export interface GemstoneSpecs {
  carat: number;
  cut: Cut;
  color: Color;
  clarity: Clarity;
  shape?: Shape;
}

export interface ProductFilters {
  categories?: string[];
  gemstoneTypes?: GemstoneType[];
  priceRange?: [number, number];
  caratRange?: [number, number];
  cuts?: Cut[];
  colors?: Color[];
  clarities?: Clarity[];
  shapes?: Shape[];
  certifications?: CertificationAgency[];
  origins?: string[];
  stockStatus?: StockStatus[];
}
