// types/index.ts
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  memberSince: string;
  loyaltyPoints: number;
  preferredCurrency: string;
  timezone: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: 'shipping' | 'billing';
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  total: number;
  currency: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  tracking?: string;
  estimatedDelivery?: string;
  paymentMethod: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sku: string;
  gemstoneType: string;
  weight: number;
  cut: string;
  clarity: string;
  color: string;
  certification?: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  currency: string;
  sku: string;
  gemstoneType: string;
  weight: number;
  cut: string;
  clarity: string;
  color: string;
  certification?: string;
  inStock: boolean;
  description: string;
}

export interface WishlistItem {
  id: string;
  product: Product;
  addedDate: string;
  priceAlert?: boolean;
  targetPrice?: number;
  collectionId?: string;
}

export interface WishlistCollection {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  shareUrl?: string;
  items: WishlistItem[];
  createdDate: string;
}

export interface Notification {
  id: string;
  type: 'order' | 'price_alert' | 'system' | 'promotion';
  title: string;
  message: string;
  read: boolean;
  date: string;
  actionUrl?: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: Record<string, any>;
  alertEnabled: boolean;
  createdDate: string;
}