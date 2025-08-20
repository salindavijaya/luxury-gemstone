import type { BaseEntity, Currency } from "./common";
import type { Product, ProductVariant } from "./product";

export interface CartItem extends BaseEntity {
  productId: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  salePrice?: number;
  options?: Record<string, any>;
  note?: string;
  giftWrap?: boolean;
  giftMessage?: string;
}

export interface CartDiscount {
  code: string;
  type: "percentage" | "fixed" | "shipping";
  value: number;
  minimum?: number;
  maximum?: number;
  validUntil?: string;
}

export interface CartData {
  items: CartItem[];
  savedForLater: CartItem[];
  recentlyRemoved: CartItem[];
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  discountCode: string | null;
  total: number;
  currency: Currency;
  isLoading: boolean;
  error: string | null;
}

export interface CartValidation {
  valid: boolean;
  errors: string[];
}

export interface SavedForLaterItem extends CartItem {
  savedAt: string;
}
