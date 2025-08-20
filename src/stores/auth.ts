import { defineStore } from "pinia";
import { ref, computed, readonly } from "vue";
import { useUIStore } from "./ui";

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  dateOfBirth?: string;
  preferences: {
    currency: string;
    language: string;
    newsletter: boolean;
    notifications: boolean;
  };
  addresses: Address[];
  membershipTier: "bronze" | "silver" | "gold" | "platinum";
  joinDate: string;
  lastLogin?: string;
}

export interface Address {
  id: string;
  type: "billing" | "shipping";
  firstName: string;
  lastName: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginAttempts: number;
  lastLoginAttempt: number | null;
}

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

// Mock API service - replace with actual API calls
class AuthService {
  private static readonly STORAGE_TOKEN_KEY = "auth_token";
  private static readonly STORAGE_REFRESH_KEY = "auth_refresh_token";
  private static readonly STORAGE_USER_KEY = "auth_user";

  // Simulate API delay
  private delay(ms: number = 1000): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Mock user data
  private mockUsers: Array<User & { password: string }> = [
    {
      id: "1",
      email: "demo@gemstore.com",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
      phone: "+1234567890",
      emailVerified: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  ];

  async login(
    credentials: LoginCredentials
  ): Promise<{ user: User; token: string; refreshToken: string }> {
    await this.delay(800);

    const user = this.mockUsers.find((u) => u.email === credentials.email);
    if (!user || user.password !== credentials.password) {
      throw new Error("Invalid email or password");
    }

    const token = `mock_token_${Date.now()}`;
    const refreshToken = `mock_refresh_${Date.now()}`;

    // Store tokens based on remember me preference
    if (credentials.rememberMe) {
      localStorage.setItem(AuthService.STORAGE_TOKEN_KEY, token);
      localStorage.setItem(AuthService.STORAGE_REFRESH_KEY, refreshToken);
      localStorage.setItem(AuthService.STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      sessionStorage.setItem(AuthService.STORAGE_TOKEN_KEY, token);
      sessionStorage.setItem(
        AuthService.STORAGE_USER_KEY,
        JSON.stringify(user)
      );
    }

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token, refreshToken };
  }

  async register(
    data: RegisterData
  ): Promise<{ user: User; token: string; refreshToken: string }> {
    await this.delay(1000);

    // Check if user already exists
    if (this.mockUsers.some((u) => u.email === data.email)) {
      throw new Error("User with this email already exists");
    }

    const newUser: User & { password: string } = {
      id: String(Date.now()),
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.mockUsers.push(newUser);

    const token = `mock_token_${Date.now()}`;
    const refreshToken = `mock_refresh_${Date.now()}`;

    sessionStorage.setItem(AuthService.STORAGE_TOKEN_KEY, token);
    sessionStorage.setItem(
      AuthService.STORAGE_USER_KEY,
      JSON.stringify(newUser)
    );

    const { password, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword, token, refreshToken };
  }

  async forgotPassword(data: ResetPasswordData): Promise<{ message: string }> {
    await this.delay(800);

    const user = this.mockUsers.find((u) => u.email === data.email);
    if (!user) {
      throw new Error("No user found with this email address");
    }

    return {
      message: "Password reset instructions have been sent to your email",
    };
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ token: string; refreshToken: string }> {
    await this.delay(500);

    if (!refreshToken.startsWith("mock_refresh_")) {
      throw new Error("Invalid refresh token");
    }

    return {
      token: `mock_token_${Date.now()}`,
      refreshToken: `mock_refresh_${Date.now()}`,
    };
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    await this.delay(800);

    const userIndex = this.mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const updatedUser = {
      ...this.mockUsers[userIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.mockUsers[userIndex] = updatedUser;

    // Update stored user data
    const storage = localStorage.getItem(AuthService.STORAGE_USER_KEY)
      ? localStorage
      : sessionStorage;
    storage.setItem(AuthService.STORAGE_USER_KEY, JSON.stringify(updatedUser));

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  getStoredAuth(): {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
  } {
    const localStorage_token = localStorage.getItem(
      AuthService.STORAGE_TOKEN_KEY
    );
    const localStorage_user = localStorage.getItem(
      AuthService.STORAGE_USER_KEY
    );
    const localStorage_refresh = localStorage.getItem(
      AuthService.STORAGE_REFRESH_KEY
    );

    const sessionStorage_token = sessionStorage.getItem(
      AuthService.STORAGE_TOKEN_KEY
    );
    const sessionStorage_user = sessionStorage.getItem(
      AuthService.STORAGE_USER_KEY
    );

    const token = localStorage_token || sessionStorage_token;
    const userStr = localStorage_user || sessionStorage_user;
    const refreshToken = localStorage_refresh;

    const user = userStr ? JSON.parse(userStr) : null;

    return { user, token, refreshToken };
  }

  clearStoredAuth(): void {
    localStorage.removeItem(AuthService.STORAGE_TOKEN_KEY);
    localStorage.removeItem(AuthService.STORAGE_REFRESH_KEY);
    localStorage.removeItem(AuthService.STORAGE_USER_KEY);
    sessionStorage.removeItem(AuthService.STORAGE_TOKEN_KEY);
    sessionStorage.removeItem(AuthService.STORAGE_USER_KEY);
  }
}

export const useAuthStore = defineStore("auth", () => {
  const uiStore = useUIStore();

  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const loginAttempts = ref(0);
  const lastLoginAttempt = ref<number | null>(null);

  // Service instance
  const authService = new AuthService();

  // Computed
  const isAuthenticated = computed(() => !!user.value && !!token.value);
  const userFullName = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : ""
  );
  const userInitials = computed(() =>
    user.value ? `${user.value.firstName[0]}${user.value.lastName[0]}` : ""
  );
  const canAttemptLogin = computed(() => {
    if (loginAttempts.value < 3) return true;
    if (!lastLoginAttempt.value) return true;

    const timeSinceLastAttempt = Date.now() - lastLoginAttempt.value;
    const lockoutDuration = 15 * 60 * 1000; // 15 minutes
    return timeSinceLastAttempt > lockoutDuration;
  });
  // Actions
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    if (!canAttemptLogin.value) {
      uiStore.showNotification({
        type: "error",
        title: "Account Locked",
        message: "Too many failed attempts. Please try again in 15 minutes.",
      });
      return false;
    }
    isLoading.value = true;
    error.value = null;

    try {
      const response = await authService.login(credentials);
      user.value = response.user;
      token.value = response.token;
      refreshToken.value = response.refreshToken;

      // Store in localStorage if remember me is checked
      if (credentials.rememberMe) {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_refresh_token", refreshToken);
        localStorage.setItem("auth_user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("auth_token", token);
        sessionStorage.setItem("auth_user", JSON.stringify(user));
      }

      // Reset login attempts
      loginAttempts.value = 0;
      lastLoginAttempt.value = null;

      uiStore.showNotification({
        type: "success",
        title: "Welcome Back!",
        message: `Good to see you again, ${user.firstName}!`,
      });

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Login failed";
      uiStore.showNotification({
        type: "error",
        title: "Login Failed",
        message: "Invalid email or password. Please try again.",
      });
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await authService.register(data);
      user.value = response.user;
      token.value = response.token;
      refreshToken.value = response.refreshToken;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Registration failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const forgotPassword = async (data: ResetPasswordData): Promise<string> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await authService.forgotPassword(data);
      return response.message;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Password reset failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      authService.clearStoredAuth();
    } finally {
      user.value = null;
      token.value = null;
      refreshToken.value = null;
      error.value = null;
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user.value) {
      throw new Error("No user logged in");
    }

    isLoading.value = true;
    error.value = null;

    try {
      const updatedUser = await authService.updateProfile(user.value.id, data);
      user.value = updatedUser;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Profile update failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const checkAuth = async (): Promise<void> => {
    const stored = authService.getStoredAuth();

    if (stored.token && stored.user) {
      user.value = stored.user;
      token.value = stored.token;
      refreshToken.value = stored.refreshToken;

      // In a real app, you might want to validate the token with the server
      // For now, we'll assume stored tokens are valid
    }
  };

  const clearError = (): void => {
    error.value = null;
  };

  // Initialize auth state from storage
  checkAuth();

  return {
    // State
    user: readonly(user),
    token: readonly(token),
    refreshToken: readonly(refreshToken),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Computed
    isAuthenticated,
    userFullName,

    // Actions
    login,
    register,
    forgotPassword,
    logout,
    updateProfile,
    checkAuth,
    clearError,
  };
});
