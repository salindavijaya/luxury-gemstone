export enum GemstoneType {
  Diamond = "diamond",
  Ruby = "ruby",
  Sapphire = "sapphire",
  Emerald = "emerald",
  Amethyst = "amethyst",
  Topaz = "topaz",
  Garnet = "garnet",
  Peridot = "peridot",
  Tanzanite = "tanzanite",
  Aquamarine = "aquamarine",
  Other = "other",
}

export enum Cut {
  Excellent = "excellent",
  VeryGood = "very-good",
  Good = "good",
  Fair = "fair",
  Poor = "poor",
}

export enum Color {
  D = "D",
  E = "E",
  F = "F",
  G = "G",
  H = "H",
  I = "I",
  J = "J",
}

export enum Clarity {
  FL = "FL",
  IF = "IF",
  VVS1 = "VVS1",
  VVS2 = "VVS2",
  VS1 = "VS1",
  VS2 = "VS2",
  SI1 = "SI1",
  SI2 = "SI2",
  I1 = "I1",
  I2 = "I2",
  I3 = "I3",
}

export enum Shape {
  Round = "round",
  Princess = "princess",
  Cushion = "cushion",
  Oval = "oval",
  Emerald = "emerald",
  Pear = "pear",
  Marquise = "marquise",
  Radiant = "radiant",
  Asscher = "asscher",
  Heart = "heart",
}

export enum CertificationAgency {
  GIA = "GIA",
  IGI = "IGI",
  AGS = "AGS",
  HRD = "HRD",
  GCAL = "GCAL",
  GRS = "GRS",
}

export enum StockStatus {
  InStock = "in-stock",
  LowStock = "low-stock",
  OutOfStock = "out-of-stock",
}

export enum SortOption {
  NameAsc = "name-asc",
  NameDesc = "name-desc",
  PriceLowToHigh = "price-low-high",
  PriceHighToLow = "price-high-low",
  Newest = "newest",
  Popularity = "popularity",
  Featured = "featured",
  Rating = "rating",
  BestSelling = "best-selling",
}

export interface Image {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export type ImageOrString = string | Image;

export enum Fluorescence {
  None = "none",
  Faint = "faint",
  Medium = "medium",
  Strong = "strong",
  VeryStrong = "very-strong",
}

export interface Product {
  id: string;
  name: string;
  description: string;
  slug?: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  gemstoneType?: GemstoneType;
  // legacy/compat alias
  gemType?: GemstoneType;

  // images: string array or structured images
  images?: Array<ImageOrString>;
  // single-image convenience field
  image?: string;
  // legacy gallery field
  gallery?: string[];

  carat: number;
  cut: Cut;
  color: Color;
  clarity: Clarity;

  specs?: {
    carat?: number;
    cut?: Cut;
    color?: Color;
    clarity?: Clarity;
    shape?: Shape;
  };

  certification?: {
    agency: string;
    number: string;
  };

  inStock: boolean;
  stockStatus: StockStatus;
  stockQuantity?: number;
  rating?: number;
  reviews?: number;
  reviewCount?: number;

  isNew?: boolean;
  onSale?: boolean;
  featured?: boolean;

  specifications?: ProductSpecifications;

  // Computed/derived fields
  discount?: number;
  pricePerCarat?: number;
  certified?: boolean;
  shape?: string;
  origin?: string;
  treatment?: string;
  fluorescence?: string;
  collection?: string;
}

export interface ProductSpecifications {
  carat?: number;
  cut?: string;
  color?: string;
  clarity?: string;
  origin?: string;
  shape?: string;
  certificationAgency?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    depth?: number;
  };
  fluorescence?: string;
  treatments?: string[];
  weight?: number;
  labReport?: string;
  // allow legacy/unknown keys
  [key: string]: any;
}

export interface ProductFilters {
  search: string;
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
  inStock: boolean;
  onSale: boolean;
  featured: boolean;
  isNew: boolean;
}

export type ViewMode = "grid" | "list";
