export interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  memberSince: string;
  loyaltyPoints: number;
  roles: string[];
  permissions: string[];
  emailVerified: boolean;
  gender: "male" | "female" | "other" | "";
  preferences: {
    newsletter: boolean;
    marketingEmails: boolean;
    productAlerts: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface ResetPasswordData {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword?: string;
}
