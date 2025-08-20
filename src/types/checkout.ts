import type { BaseEntity, Currency } from "./common";
import type { CartItem } from "./cart";

export interface Address extends BaseEntity {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
  type?: "shipping" | "billing";
  label?: string;
}

export interface ShippingOption extends BaseEntity {
  name: string;
  code: string;
  carrier: string;
  price: number;
  duration: string;
  description?: string;
  estimatedDays: number;
  tracking: boolean;
  insurance: boolean;
  insuranceLimit?: number;
  secure: boolean;
  recommended?: boolean;
  features?: string[];
}

export interface PaymentMethod extends BaseEntity {
  type: "card" | "paypal" | "apple_pay" | "google_pay" | "crypto";
  name: string;
  details: {
    cardNumber?: string;
    expiry?: string;
    cvv?: string;
    cardholderName?: string;
    cardType?: string;
    lastFourDigits?: string;
  };
  isDefault?: boolean;
}

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface ShippingDetails {
  address: Address;
  method: ShippingOption;
  cost: number;
  tracking?: string;
  estimatedDelivery?: string;
  instructions?: string;
}

export interface BillingDetails {
  address: Address;
  sameAsShipping: boolean;
  isBusinessPurchase?: boolean;
  taxId?: string;
  companyName?: string;
}

export interface PaymentDetails {
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  transactions?: Array<{
    id: string;
    amount: number;
    status: PaymentStatus;
    date: string;
    reference: string;
  }>;
}

export interface OrderDetails {
  shipping: ShippingDetails;
  billing: BillingDetails;
  payment: PaymentDetails;
}

export interface Order extends BaseEntity {
  orderNumber: string;
  userId: string;
  items: CartItem[];
  details: OrderDetails;
  subtotal: number;
  tax: number;
  discount?: number;
  total: number;
  currency: Currency;
  status: OrderStatus;
  notes?: string;
  giftNote?: string;
}

export interface CheckoutData {
  customer: {
    email: string;
    isGuest: boolean;
    createAccount?: boolean;
    password?: string;
  };
  shipping: ShippingDetails;
  billing: BillingDetails;
  payment: PaymentDetails;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount?: number;
  total: number;
  currency: Currency;
  marketingConsent: boolean;
  termsAccepted: boolean;
  notes?: string;
  giftNote?: string;
}
