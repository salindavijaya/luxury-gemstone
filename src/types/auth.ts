export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  subscribeNewsletter?: boolean;
}

export interface ResetPasswordData {
  email: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  settings?: {
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
    preferences?: {
      currency?: string;
      language?: string;
      theme?: string;
    };
  };
  addresses?: Array<{
    id: string;
    type: "shipping" | "billing";
    isDefault: boolean;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  }>;
}
