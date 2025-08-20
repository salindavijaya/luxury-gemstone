import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useUIStore } from "../../ui/store";
import type {
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  User,
} from "@/features/auth/types";

export type { User, LoginCredentials, RegisterData, ResetPasswordData };

// Mock API service - replace with actual API calls
class AuthService {
  private static readonly STORAGE_TOKEN_KEY = "auth_token";
  private static readonly STORAGE_REFRESH_KEY = "auth_refresh_token";
  private static readonly STORAGE_USER_KEY = "auth_user";

  async getCurrentUser(): Promise<User> {
    // In a real app, this would make an API call with the current token
    const storedUser =
      localStorage.getItem(AuthService.STORAGE_USER_KEY) ||
      sessionStorage.getItem(AuthService.STORAGE_USER_KEY);

    if (!storedUser) {
      throw new Error("No user found");
    }

    await this.delay(); // Simulate API delay
    return JSON.parse(storedUser);
  }

  async login(
    credentials: LoginCredentials
  ): Promise<{ user: User; token: string; refreshToken: string }> {
    await this.delay();
    // Mock successful login
    const mockUser: User = {
      id: "1",
      name: "John Doe",
      email: credentials.email,
      firstName: "John",
      lastName: "Doe",
      roles: ["user"],
      permissions: ["view_dashboard", "place_order"],
      emailVerified: true,
      memberSince: "2023-01-01",
      loyaltyPoints: 100,
      gender: "male",
      preferences: {
        newsletter: true,
        marketingEmails: true,
        productAlerts: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return {
      user: mockUser,
      token: "mock_token",
      refreshToken: "mock_refresh_token",
    };
  }

  async register(
    data: RegisterData
  ): Promise<{ user: User; token: string; refreshToken: string }> {
    await this.delay();
    // Mock successful registration
    const mockUser: User = {
      id: "1",
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      roles: ["user"],
      permissions: ["view_dashboard", "place_order"],
      emailVerified: true,
      memberSince: new Date().toISOString(),
      loyaltyPoints: 0,
      gender: "",
      preferences: {
        newsletter: true,
        marketingEmails: true,
        productAlerts: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return {
      user: mockUser,
      token: "mock_token",
      refreshToken: "mock_refresh_token",
    };
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    await this.delay();
    const currentUser = await this.getCurrentUser();
    return {
      ...currentUser,
      ...data,
      updatedAt: new Date().toISOString(),
    };
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await this.delay();
    // In a real app, verify current password and update with new password
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.delay();
    // In a real app, verify token and update password
  }

  async forgotPassword(data: ResetPasswordData): Promise<{ message: string }> {
    await this.delay();
    return {
      message:
        "If an account exists with that email, password reset instructions have been sent.",
    };
  }

  // Simulate API delay
  private delay(ms: number = 1000): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
  const isInitialized = ref(false);

  // Service instance
  const authService = new AuthService();

  // Computed
  const isAuthenticated = computed(() => !!user.value && !!token.value);
  const userFullName = computed(() =>
    user.value && user.value.firstName && user.value.lastName
      ? `${user.value.firstName} ${user.value.lastName}`
      : user.value?.name || ""
  );
  const userInitials = computed(() =>
    user.value?.firstName?.[0] && user.value?.lastName?.[0]
      ? `${user.value.firstName[0]}${user.value.lastName[0]}`
      : user.value?.name?.[0] || ""
  );

  // Actions
  const initialize = async (): Promise<void> => {
    if (isInitialized.value) return;

    try {
      const storedToken =
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token");
      const storedUser =
        localStorage.getItem("auth_user") ||
        sessionStorage.getItem("auth_user");

      if (storedToken && storedUser) {
        token.value = storedToken;
        user.value = JSON.parse(storedUser);
      }

      await refreshUser();
    } catch (err) {
      console.error("Failed to initialize auth store:", err);
    } finally {
      isInitialized.value = true;
    }
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await authService.login(credentials);
      user.value = response.user;
      token.value = response.token;
      refreshToken.value = response.refreshToken;

      // Store in localStorage if remember me is checked
      if (credentials.rememberMe) {
        localStorage.setItem("auth_token", token.value ?? "");
        localStorage.setItem("auth_refresh_token", refreshToken.value ?? "");
        localStorage.setItem("auth_user", JSON.stringify(user.value));
      } else {
        sessionStorage.setItem("auth_token", token.value ?? "");
        sessionStorage.setItem("auth_user", JSON.stringify(user.value));
      }

      // Reset login attempts
      loginAttempts.value = 0;
      lastLoginAttempt.value = null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Login failed";
      loginAttempts.value++;
      lastLoginAttempt.value = Date.now();
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

      // Store in localStorage
      localStorage.setItem("auth_token", token.value ?? "");
      localStorage.setItem("auth_refresh_token", refreshToken.value ?? "");
      localStorage.setItem("auth_user", JSON.stringify(user.value));
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Registration failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const refreshUser = async (): Promise<void> => {
    if (!token.value) return;

    try {
      isLoading.value = true;
      const updatedUser = await authService.getCurrentUser();
      user.value = updatedUser;
    } catch (err) {
      console.error("Failed to refresh user:", err);
      // Only clear if it's an auth error
      if (
        err instanceof Error &&
        err.message.toLowerCase().includes("unauthorized")
      ) {
        await logout();
      }
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

  const clearError = (): void => {
    error.value = null;
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

  const resetPassword = async (
    token: string,
    newPassword: string
  ): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      await authService.resetPassword(token, newPassword);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Password reset failed";
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

  const checkAuth = async () => {
    if (user.value && token.value) return;
    await initialize();
  };

  return {
    // State
    user: computed(() => user.value),
    token: computed(() => token.value),
    refreshToken: computed(() => refreshToken.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    isAuthenticated,
    isInitialized: computed(() => isInitialized.value),
    userFullName,
    userInitials,
    // Actions
    initialize,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    refreshUser,
    clearError,
    checkAuth,
    // Additional methods
    changePassword: async (currentPassword: string, newPassword: string) => {
      try {
        isLoading.value = true;
        await authService.changePassword(currentPassword, newPassword);
        uiStore.showSuccessToast("Success", "Password changed successfully");
      } catch (err) {
        uiStore.showErrorToast(
          "Error",
          err instanceof Error ? err.message : "Failed to change password"
        );
        throw err;
      } finally {
        isLoading.value = false;
      }
    },
  };
});
