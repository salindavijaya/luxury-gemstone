// src/types/product.ts
import type { BaseEntity, Image, Currency, ViewMode } from "./common";
import type {
  GemstoneType,
  GemstoneSpecifications,
  Certification,
  StockStatus,
  Cut,
  Color,
  Clarity,
  Shape,
  CertificationAgency,
} from "./gemstone";

export interface Product extends BaseEntity {
  name: string;
  slug: string;
  sku: string;
  price: number;
  originalPrice?: number;
  pricePerCarat?: number;
  currency: Currency;
  images: Image[];
  mainImage: Image;
  category: string;
  subcategory?: string;
  gemstoneType: GemstoneType;
  description: string;
  shortDescription?: string;
  specifications: GemstoneSpecifications;
  certification?: Certification;
  stockStatus: StockStatus;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  featured: boolean;
  isNew: boolean;
  onSale: boolean;
  has360View: boolean;
  customizationOptions?: Record<string, any>;
}

export interface ProductVariant extends BaseEntity {
  productId: string;
  sku: string;
  specifications: Partial<GemstoneSpecifications>;
  price: number;
  stockQuantity: number;
  stockStatus: StockStatus;
}

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

export interface ProductSortOption {
  id: string;
  label: string;
  value: string;
  order: "asc" | "desc";
}

export interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  filters: ProductFilters;
  sortBy: ProductSortOption;
  viewMode: ViewMode;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  recentlyViewed: string[];
  savedSearches: ProductFilters[];
}
