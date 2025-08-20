// src/types/user.ts
import type { BaseEntity, Currency } from "./common";
import type { Address } from "./checkout";
import type { Product } from "./product";

export type UserRole = "admin" | "customer" | "manager" | "guest";

export type UserStatus = "active" | "inactive" | "suspended" | "pending";

export interface User extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  defaultCurrency: Currency;
  defaultLanguage: string;
  defaultShippingAddress?: Address;
  defaultBillingAddress?: Address;
  loyaltyPoints: number;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginAt?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  twoFactorEnabled: boolean;
  language: string;
  timezone: string;
  currency: Currency;
  theme: "light" | "dark" | "system";
}

export interface WishlistItem extends BaseEntity {
  userId: string;
  product: Product;
  addedDate: string;
  priceAlert?: boolean;
  targetPrice?: number;
  collectionId?: string;
}

export interface WishlistCollection extends BaseEntity {
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  shareUrl?: string;
  items: WishlistItem[];
}

export interface SavedSearch extends BaseEntity {
  userId: string;
  name: string;
  filters: Record<string, any>;
  notifyOnNewResults: boolean;
  notifyOnPriceChange: boolean;
  lastNotificationSent?: string;
}

export interface Notification extends BaseEntity {
  userId: string;
  type: "order" | "price_alert" | "system" | "promotion" | "account";
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  data?: Record<string, any>;
}
