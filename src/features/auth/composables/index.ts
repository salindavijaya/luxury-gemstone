import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/features/auth/store";
import type {
  User,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
} from "@/types";

export const useAuth = () => {
  const auth = useAuthStore();
  const router = useRouter();

  // Expose all the required functionality from the store with router navigation
  return {
    user: computed(() => auth.user).value,
    token: computed(() => auth.token).value,
    isAuthenticated: computed(() => auth.isAuthenticated).value,
    isLoading: computed(() => auth.isLoading).value,
    error: computed(() => auth.error).value,
    isInitialized: computed(() => auth.isInitialized).value,
    userFullName: computed(() => auth.userFullName).value,
    userInitials: computed(() => auth.userInitials).value,
    initialize: auth.initialize,
    login: async (credentials: LoginCredentials) => {
      try {
        await auth.login(credentials);
        // Redirect to intended page or dashboard after successful login
        const redirect = router.currentRoute.value.query.redirect as string;
        await router.push(redirect || "/dashboard");
      } catch (error) {
        // Error is handled by the store
        throw error;
      }
    },
    register: async (data: RegisterData) => {
      try {
        await auth.register(data);
        // Redirect to dashboard after successful registration
        await router.push("/dashboard");
      } catch (error) {
        // Error is handled by the store
        throw error;
      }
    },
    logout: async () => {
      await auth.logout();
      await router.push("/login");
    },
    forgotPassword: auth.forgotPassword,
    resetPassword: auth.resetPassword,
    updateProfile: auth.updateProfile,
    refreshUser: auth.refreshUser,
    clearError: auth.clearError,
    changePassword: auth.changePassword,
    // Compatibility alias for forgotPassword to match component expectations
    requestPasswordReset: async (email: string) => {
      await auth.forgotPassword({ email });
    },
  };
};
