<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold text-slate-900">Account Settings</h2>
      <p class="text-slate-600 mt-1">
        Manage your account preferences and security settings
      </p>
    </div>

    <!-- Profile Information -->
    <div class="bg-white rounded-lg border border-slate-200 p-6">
      <h3 class="text-lg font-medium text-slate-900 mb-6">
        Profile Information
      </h3>

      <form @submit.prevent="updateProfile" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              for="firstName"
              class="block text-sm font-medium text-slate-700 mb-2"
            >
              First Name
            </label>
            <input
              id="firstName"
              v-model="profileForm.firstName"
              type="text"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label
              for="lastName"
              class="block text-sm font-medium text-slate-700 mb-2"
            >
              Last Name
            </label>
            <input
              id="lastName"
              v-model="profileForm.lastName"
              type="text"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label
            for="email"
            class="block text-sm font-medium text-slate-700 mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            v-model="profileForm.email"
            type="email"
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label
            for="phone"
            class="block text-sm font-medium text-slate-700 mb-2"
          >
            Phone Number
          </label>
          <input
            id="phone"
            v-model="profileForm.phone"
            type="tel"
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label
            for="dateOfBirth"
            class="block text-sm font-medium text-slate-700 mb-2"
          >
            Date of Birth
          </label>
          <input
            id="dateOfBirth"
            v-model="profileForm.dateOfBirth"
            type="date"
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="isUpdatingProfile"
            class="px-4 py-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isUpdatingProfile ? "Updating..." : "Update Profile" }}
          </button>
        </div>
      </form>
    </div>

    <!-- Security Settings -->
    <div class="bg-white rounded-lg border border-slate-200 p-6">
      <h3 class="text-lg font-medium text-slate-900 mb-6">Security Settings</h3>

      <!-- Password Change -->
      <div class="space-y-6">
        <div
          class="flex items-center justify-between py-4 border-b border-slate-200"
        >
          <div>
            <h4 class="text-sm font-medium text-slate-900">Password</h4>
            <p class="text-sm text-slate-600">Last changed 3 months ago</p>
          </div>
          <button
            @click="showPasswordForm = !showPasswordForm"
            class="px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors"
          >
            Change Password
          </button>
        </div>

        <!-- Password Form -->
        <form
          v-if="showPasswordForm"
          @submit.prevent="changePassword"
          class="space-y-4"
        >
          <div>
            <label
              for="currentPassword"
              class="block text-sm font-medium text-slate-700 mb-2"
            >
              Current Password
            </label>
            <input
              id="currentPassword"
              v-model="passwordForm.currentPassword"
              type="password"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label
              for="newPassword"
              class="block text-sm font-medium text-slate-700 mb-2"
            >
              New Password
            </label>
            <input
              id="newPassword"
              v-model="passwordForm.newPassword"
              type="password"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-slate-700 mb-2"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              v-model="passwordForm.confirmPassword"
              type="password"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div class="flex gap-3">
            <button
              type="submit"
              :disabled="isChangingPassword"
              class="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ isChangingPassword ? "Updating..." : "Update Password" }}
            </button>
            <button
              type="button"
              @click="showPasswordForm = false"
              class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>

        <!-- Two-Factor Authentication -->
        <div
          class="flex items-center justify-between py-4 border-b border-slate-200"
        >
          <div>
            <h4 class="text-sm font-medium text-slate-900">
              Two-Factor Authentication
            </h4>
            <p class="text-sm text-slate-600">
              {{
                settings.twoFactorEnabled
                  ? "Enabled"
                  : "Add an extra layer of security"
              }}
            </p>
          </div>
          <button
            @click="toggleTwoFactor"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              settings.twoFactorEnabled
                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100',
            ]"
          >
            {{ settings.twoFactorEnabled ? "Disable" : "Enable" }}
          </button>
        </div>

        <!-- Login Sessions -->
        <div class="py-4">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h4 class="text-sm font-medium text-slate-900">
                Active Sessions
              </h4>
              <p class="text-sm text-slate-600">
                Manage your active login sessions
              </p>
            </div>
            <button
              @click="showSessions = !showSessions"
              class="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
            >
              {{ showSessions ? "Hide" : "View Sessions" }}
            </button>
          </div>

          <div v-if="showSessions" class="space-y-3">
            <div
              v-for="session in sessions"
              :key="session.id"
              class="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p class="text-sm font-medium text-slate-900">
                    {{ session.device }}
                  </p>
                  <p class="text-xs text-slate-600">
                    {{ session.location }} • {{ session.lastActive }}
                  </p>
                </div>
              </div>
              <button
                v-if="!session.current"
                @click="terminateSession(session.id)"
                class="text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                Terminate
              </button>
              <span v-else class="text-xs text-emerald-600 font-medium"
                >Current</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Preferences -->
    <div class="bg-white rounded-lg border border-slate-200 p-6">
      <h3 class="text-lg font-medium text-slate-900 mb-6">
        Notification Preferences
      </h3>

      <div class="space-y-6">
        <!-- Email Notifications -->
        <div>
          <h4 class="text-sm font-medium text-slate-900 mb-4">
            Email Notifications
          </h4>
          <div class="space-y-3">
            <label
              v-for="(option, key) in emailNotifications"
              :key="key"
              class="flex items-center justify-between"
            >
              <div>
                <span class="text-sm text-slate-700">{{ option.label }}</span>
                <p class="text-xs text-slate-500">{{ option.description }}</p>
              </div>
              <input
                v-model="settings.notifications.email[key]"
                type="checkbox"
                class="text-emerald-600 focus:ring-emerald-500 rounded"
              />
            </label>
          </div>
        </div>

        <!-- SMS Notifications -->
        <div>
          <h4 class="text-sm font-medium text-slate-900 mb-4">
            SMS Notifications
          </h4>
          <div class="space-y-3">
            <label
              v-for="(option, key) in smsNotifications"
              :key="key"
              class="flex items-center justify-between"
            >
              <div>
                <span class="text-sm text-slate-700">{{ option.label }}</span>
                <p class="text-xs text-slate-500">{{ option.description }}</p>
              </div>
              <input
                v-model="settings.notifications.sms[key]"
                type="checkbox"
                class="text-emerald-600 focus:ring-emerald-500 rounded"
              />
            </label>
          </div>
        </div>

        <!-- Push Notifications -->
        <div>
          <h4 class="text-sm font-medium text-slate-900 mb-4">
            Push Notifications
          </h4>
          <div class="space-y-3">
            <label
              v-for="(option, key) in pushNotifications"
              :key="key"
              class="flex items-center justify-between"
            >
              <div>
                <span class="text-sm text-slate-700">{{ option.label }}</span>
                <p class="text-xs text-slate-500">{{ option.description }}</p>
              </div>
              <input
                v-model="settings.notifications.push[key]"
                type="checkbox"
                class="text-emerald-600 focus:ring-emerald-500 rounded"
              />
            </label>
          </div>
        </div>

        <div class="flex justify-end pt-4 border-t border-slate-200">
          <button
            @click="updateNotificationSettings"
            :disabled="isUpdatingNotifications"
            class="px-4 py-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isUpdatingNotifications ? "Updating..." : "Save Preferences" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Privacy Settings -->
    <div class="bg-white rounded-lg border border-slate-200 p-6">
      <h3 class="text-lg font-medium text-slate-900 mb-6">Privacy Settings</h3>

      <div class="space-y-6">
        <label class="flex items-center justify-between">
          <div>
            <span class="text-sm font-medium text-slate-700"
              >Profile Visibility</span
            >
            <p class="text-xs text-slate-500">
              Allow others to see your profile information
            </p>
          </div>
          <input
            v-model="settings.privacy.profileVisible"
            type="checkbox"
            class="text-emerald-600 focus:ring-emerald-500 rounded"
          />
        </label>

        <label class="flex items-center justify-between">
          <div>
            <span class="text-sm font-medium text-slate-700"
              >Purchase History</span
            >
            <p class="text-xs text-slate-500">
              Show purchase history in public wishlists
            </p>
          </div>
          <input
            v-model="settings.privacy.showPurchaseHistory"
            type="checkbox"
            class="text-emerald-600 focus:ring-emerald-500 rounded"
          />
        </label>

        <label class="flex items-center justify-between">
          <div>
            <span class="text-sm font-medium text-slate-700"
              >Data Analytics</span
            >
            <p class="text-xs text-slate-500">
              Help improve our service with usage analytics
            </p>
          </div>
          <input
            v-model="settings.privacy.allowAnalytics"
            type="checkbox"
            class="text-emerald-600 focus:ring-emerald-500 rounded"
          />
        </label>

        <label class="flex items-center justify-between">
          <div>
            <span class="text-sm font-medium text-slate-700"
              >Marketing Communications</span
            >
            <p class="text-xs text-slate-500">
              Receive personalized offers and recommendations
            </p>
          </div>
          <input
            v-model="settings.privacy.allowMarketing"
            type="checkbox"
            class="text-emerald-600 focus:ring-emerald-500 rounded"
          />
        </label>

        <div class="flex justify-end pt-4 border-t border-slate-200">
          <button
            @click="updatePrivacySettings"
            :disabled="isUpdatingPrivacy"
            class="px-4 py-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isUpdatingPrivacy ? "Updating..." : "Update Privacy" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Account Management -->
    <div class="bg-white rounded-lg border border-slate-200 p-6">
      <h3 class="text-lg font-medium text-slate-900 mb-6">
        Account Management
      </h3>

      <div class="space-y-6">
        <div
          class="flex items-center justify-between py-4 border-b border-slate-200"
        >
          <div>
            <h4 class="text-sm font-medium text-slate-900">Export Data</h4>
            <p class="text-sm text-slate-600">
              Download a copy of your account data
            </p>
          </div>
          <button
            @click="exportData"
            class="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
          >
            Export Data
          </button>
        </div>

        <div
          class="flex items-center justify-between py-4 border-b border-slate-200"
        >
          <div>
            <h4 class="text-sm font-medium text-slate-900">
              Deactivate Account
            </h4>
            <p class="text-sm text-slate-600">
              Temporarily disable your account
            </p>
          </div>
          <button
            @click="deactivateAccount"
            class="px-4 py-2 text-sm font-medium text-amber-600 bg-amber-50 rounded-md hover:bg-amber-100 transition-colors"
          >
            Deactivate
          </button>
        </div>

        <div class="flex items-center justify-between py-4">
          <div>
            <h4 class="text-sm font-medium text-slate-900">Delete Account</h4>
            <p class="text-sm text-slate-600">
              Permanently delete your account and all data
            </p>
          </div>
          <button
            @click="deleteAccount"
            class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useUserStore } from "@/features/user/store";
import { useNotificationsStore } from "@/features/notifications/store";
import { NotificationType } from "@/features/notifications/store/types";

const userStore = useUserStore();
const notificationsStore = useNotificationsStore();

// Loading states
const isUpdatingProfile = ref(false);
const isChangingPassword = ref(false);
const isUpdatingNotifications = ref(false);
const isUpdatingPrivacy = ref(false);

// Form visibility
const showPasswordForm = ref(false);
const showSessions = ref(false);

// Profile form
const profileForm = reactive({
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  dateOfBirth: "1985-06-15",
});

// Password form
const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Settings
const settings = reactive({
  twoFactorEnabled: false,
  notifications: {
    email: {
      orderUpdates: true,
      promotions: false,
      priceDrops: true,
      backInStock: true,
      newsletter: false,
    },
    sms: {
      orderUpdates: true,
      promotions: false,
      priceDrops: false,
      backInStock: false,
    },
    push: {
      orderUpdates: true,
      promotions: false,
      priceDrops: true,
      backInStock: true,
    },
  },
  privacy: {
    profileVisible: true,
    showPurchaseHistory: false,
    allowAnalytics: true,
    allowMarketing: false,
  },
});

// Sessions
const sessions = ref([
  {
    id: "1",
    device: "Chrome on Windows",
    location: "New York, NY",
    lastActive: "2 minutes ago",
    current: true,
  },
  {
    id: "2",
    device: "Safari on iPhone",
    location: "New York, NY",
    lastActive: "1 hour ago",
    current: false,
  },
  {
    id: "3",
    device: "Chrome on macOS",
    location: "New York, NY",
    lastActive: "3 days ago",
    current: false,
  },
]);

// Notification options
const emailNotifications = {
  orderUpdates: {
    label: "Order Updates",
    description: "Shipping confirmations, delivery updates, and order changes",
  },
  promotions: {
    label: "Promotional Emails",
    description: "Special offers, sales, and exclusive deals",
  },
  priceDrops: {
    label: "Price Drop Alerts",
    description: "Notifications when items in your wishlist go on sale",
  },
  backInStock: {
    label: "Back in Stock",
    description: "Alerts when out-of-stock items become available",
  },
  newsletter: {
    label: "Newsletter",
    description: "Monthly newsletter with gemstone insights and trends",
  },
};

const smsNotifications = {
  orderUpdates: {
    label: "Order Updates",
    description: "Critical shipping and delivery notifications",
  },
  promotions: {
    label: "Promotional SMS",
    description: "Exclusive SMS-only offers and flash sales",
  },
  priceDrops: {
    label: "Price Drop Alerts",
    description: "Instant notifications for wishlist price drops",
  },
  backInStock: {
    label: "Back in Stock",
    description: "Immediate alerts for restocked items",
  },
};

const pushNotifications = {
  orderUpdates: {
    label: "Order Updates",
    description: "Real-time order status and shipping updates",
  },
  promotions: {
    label: "Promotional Notifications",
    description: "Flash sales and limited-time offers",
  },
  priceDrops: {
    label: "Price Drop Alerts",
    description: "Instant alerts when wishlist items drop in price",
  },
  backInStock: {
    label: "Back in Stock",
    description: "Immediate notifications for restocked items",
  },
};

// Update profile
const updateProfile = async () => {
  isUpdatingProfile.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    notificationsStore.addNotification({
      type: NotificationType.Success,
      title: "Profile Updated",
      message: "Your profile information has been updated successfully",
    });
  } catch (error) {
    notificationsStore.addNotification({
      type: NotificationType.Error,
      title: "Update Failed",
      message: "Failed to update profile information",
    });
  } finally {
    isUpdatingProfile.value = false;
  }
};

// Change password
const changePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    notificationsStore.addNotification({
      type: NotificationType.Error,
      title: "Password Mismatch",
      message: "New passwords do not match",
    });
    return;
  }

  if (passwordForm.newPassword.length < 8) {
    notificationsStore.addNotification({
      type: NotificationType.Error,
      title: "Weak Password",
      message: "Password must be at least 8 characters long",
    });
    return;
  }

  isChangingPassword.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Reset form
    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";
    showPasswordForm.value = false;

    notificationsStore.addNotification({
      type: NotificationType.Success,
      title: "Password Updated",
      message: "Your password has been changed successfully",
    });
  } catch (error) {
    notificationsStore.addNotification({
      type: NotificationType.Error,
      title: "Password Update Failed",
      message: "Failed to update password",
    });
  } finally {
    isChangingPassword.value = false;
  }
};

// Toggle two-factor authentication
const toggleTwoFactor = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    settings.twoFactorEnabled = !settings.twoFactorEnabled;

    notificationsStore.addNotification({
      type: NotificationType.Success,
      title: settings.twoFactorEnabled ? "2FA Enabled" : "2FA Disabled",
      message: settings.twoFactorEnabled
        ? "Two-factor authentication has been enabled"
        : "Two-factor authentication has been disabled",
    });
  } catch (error) {
    notificationsStore.addNotification({
      type: NotificationType.Error,
      title: "Update Failed",
      message: "Failed to update two-factor authentication setting",
    });
  }
};

// Terminate session
const terminateSession = async (sessionId: string) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    sessions.value = sessions.value.filter((s) => s.id !== sessionId);

    notificationsStore.addNotification({
      type: NotificationType.Success,
      title: "Session Terminated",
      message: "The session has been terminated successfully",
    });
  } catch (error) {
    notificationsStore.addNotification({
      type: NotificationType.Error,
      title: "Termination Failed",
      message: "Failed to terminate the session",
    });
  }
};

// Update notification settings
const updateNotificationSettings = async () => {
  isUpdatingNotifications.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    notificationsStore.addNotification({
      type: NotificationType.Success,
      title: "Preferences Updated",
      message: "Your notification preferences have been saved",
    });
  } catch (error) {
    notificationsStore.addNotification({
      type: NotificationType.Error,
      title: "Update Failed",
      message: "Failed to update notification preferences",
    });
  } finally {
    isUpdatingNotifications.value = false;
  }
};

// Update privacy settings
const updatePrivacySettings = async () => {
  isUpdatingPrivacy.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    notificationsStore.addNotification({
      type: NotificationType.Success,
      title: "Privacy Updated",
      message: "Your privacy settings have been updated",
    });
  } catch (error) {
    notificationsStore.addNotification({
      type: NotificationType.Error,
      title: "Update Failed",
      message: "Failed to update privacy settings",
    });
  } finally {
    isUpdatingPrivacy.value = false;
  }
};

// Export data
const exportData = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    notificationsStore.addNotification({
      type: NotificationType.Success,
      title: "Export Complete",
      message: "Your data export has been sent to your email",
    });
  } catch (error) {
    notificationsStore.addNotification({
      type: NotificationType.Error,
      title: "Export Failed",
      message: "Failed to export your data",
    });
  }
};

// Deactivate account
const deactivateAccount = () => {
  if (
    confirm(
      "Are you sure you want to deactivate your account? You can reactivate it later by signing in."
    )
  ) {
    notificationsStore.addNotification({
      type: NotificationType.Info,
      title: "Account Deactivated",
      message: "Your account has been temporarily deactivated",
    });
  }
};

// Delete account
const deleteAccount = () => {
  if (
    confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost."
    )
  ) {
    if (
      confirm(
        "This is your final warning. Are you absolutely sure you want to delete your account permanently?"
      )
    ) {
      notificationsStore.addNotification({
        type: NotificationType.Error,
        title: "Account Scheduled for Deletion",
        message:
          "Your account will be deleted in 30 days. You can cancel this action by contacting support.",
      });
    }
  }
};

onMounted(() => {
  // Load current settings
});
</script>
