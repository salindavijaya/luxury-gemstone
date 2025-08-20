// Re-export all types from features
export * from "@/features/products/store";
export * from "@/features/auth/store";
export * from "@/features/cart/store";
export * from "@/features/checkout/store";
export * from "@/features/ui/store";
export * from "@/features/user/store";
export * from "@/features/wishlist/store";
export * from "@/features/notifications/store";

export interface Address {
  id?: string;
  company?: string;
  address1?: string;
  address2?: string;
  type?: "billing" | "shipping";
  firstName?: string;
  lastName?: string;
  street?: string;
  street2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  zipCode?: string;
  country?: string;
  isDefault?: boolean;
}

export interface UserPreferences {
  currency: string;
  language: string;
  newsletter: boolean;
  notifications: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string;
  memberSince?: string;
  loyaltyPoints?: number;
  gender?: "male" | "female" | "other" | string;
  phone?: string;
  avatar?: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  dateOfBirth?: string;
  roles?: string[];
  permissions?: string[];
  preferences?: UserPreferences;
  addresses?: Address[];
}

export interface NotificationAction {
  id?: string;
  label?: string;
  action?: string;
  primary?: boolean;
  handler?: string;
}

export interface Notification {
  id: string;
  title?: string;
  message: string;
  type?: string;
  read?: boolean;
  createdAt?: string | Date;
  actions?: NotificationAction[];
  priority?: "low" | "normal" | "high" | "medium";
}

export interface OrderItem {
  id: string;
  image?: string;
  name: string;
  price: number;
  quantity: number;
  sku?: string;
  specs?: {
    carat?: number;
    gemstoneType?: string;
    weight?: number;
    cut?: string;
    color?: string;
    clarity?: string;
    certification?: string;
  };
  // also allow some fields to be present at top-level for older fixtures
  gemstoneType?: string;
  weight?: number;
  cut?: string;
  color?: string;
  clarity?: string;
  certification?: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  status: string;
  total: number;
  currency?: string;
  date: string;
  paymentMethod?: string;
  tracking?: string;
  estimatedDelivery?: string | Date;
  // many templates access these directly without guards — make them present to reduce template errors
  billingAddress: Address;
  shippingAddress: Address;
  items: OrderItem[];
}

// Cart types: exported so components and stores can rely on a canonical shape
export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  gemType?: string;
  gemstone?: string;
  carat?: number;
  cut?: string;
  color?: string;
  clarity?: string;
  quantity: number;
  inStock?: boolean;
  category?: string;
  weight?: number;
  certification?: string;
  insuranceSelected?: boolean;
  appraisalRequested?: boolean;
  specialInstructions?: string;
  // compatibility helper fields
  insurance?: boolean | number;
  discountAmount?: number;
  [key: string]: any;
}

export interface Cart {
  items: CartItem[];
  subtotal?: number;
  total?: number;
  shippingMethod?: string;
  promoCode?: string;
  promoDiscount?: number;
}
