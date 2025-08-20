// src/types/common.ts
export type Status = "active" | "inactive" | "pending" | "archived";

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  thumbnail?: string;
}

export type Currency = "USD" | "EUR" | "GBP" | "JPY" | "CNY" | "INR";

export type SortOrder = "asc" | "desc";

export type ViewMode = "grid" | "list";

export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorMessages {
  [key: string]: string[];
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
