<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <!-- Profile Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-semibold text-slate-800">Profile Settings</h2>
      <button
        v-if="!isEditing"
        @click="startEditing"
        class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-label="Edit profile"
      >
        <svg
          class="w-4 h-4 inline mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        Edit Profile
      </button>
    </div>

    <!-- Profile Avatar Section -->
    <div class="flex items-center mb-8">
      <div class="relative">
        <div
          class="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center"
        >
          <img
            v-if="profileForm.avatar"
            :src="profileForm.avatar"
            :alt="`${profileForm.firstName} ${profileForm.lastName}`"
            class="w-24 h-24 rounded-full object-cover"
          />
          <svg
            v-else
            class="w-12 h-12 text-emerald-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <button
          v-if="isEditing"
          @click="triggerFileUpload"
          class="absolute -bottom-2 -right-2 bg-amber-500 text-white p-2 rounded-full hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
          aria-label="Change profile picture"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleAvatarUpload"
          class="hidden"
          aria-hidden="true"
        />
      </div>
      <div class="ml-6">
        <h3 class="text-xl font-semibold text-slate-800">
          {{ user?.firstName }} {{ user?.lastName }}
        </h3>
        <p class="text-slate-600">{{ user?.email }}</p>
        <p class="text-sm text-slate-500">
          Member since {{ formatDate(user?.createdAt) }}
        </p>
      </div>
    </div>

    <!-- Profile Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Personal Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- First Name -->
        <div class="space-y-2">
          <label
            for="firstName"
            class="block text-sm font-medium text-slate-700"
          >
            First Name
          </label>
          <input
            id="firstName"
            v-model="profileForm.firstName"
            type="text"
            :disabled="!isEditing"
            :class="[
              'w-full px-3 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
              !isEditing
                ? 'bg-slate-50 text-slate-600 cursor-not-allowed'
                : 'bg-white',
              validationErrors.firstName
                ? 'border-red-500'
                : 'border-slate-300',
            ]"
            placeholder="Enter your first name"
            aria-describedby="firstName-error"
          />
          <p
            v-if="validationErrors.firstName"
            id="firstName-error"
            class="text-sm text-red-600"
            role="alert"
          >
            {{ validationErrors.firstName }}
          </p>
        </div>

        <!-- Last Name -->
        <div class="space-y-2">
          <label
            for="lastName"
            class="block text-sm font-medium text-slate-700"
          >
            Last Name
          </label>
          <input
            id="lastName"
            v-model="profileForm.lastName"
            type="text"
            :disabled="!isEditing"
            :class="[
              'w-full px-3 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
              !isEditing
                ? 'bg-slate-50 text-slate-600 cursor-not-allowed'
                : 'bg-white',
              validationErrors.lastName ? 'border-red-500' : 'border-slate-300',
            ]"
            placeholder="Enter your last name"
            aria-describedby="lastName-error"
          />
          <p
            v-if="validationErrors.lastName"
            id="lastName-error"
            class="text-sm text-red-600"
            role="alert"
          >
            {{ validationErrors.lastName }}
          </p>
        </div>
      </div>

      <!-- Email -->
      <div class="space-y-2">
        <label for="email" class="block text-sm font-medium text-slate-700">
          Email Address
        </label>
        <input
          id="email"
          v-model="profileForm.email"
          type="email"
          :disabled="!isEditing"
          :class="[
            'w-full px-3 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
            !isEditing
              ? 'bg-slate-50 text-slate-600 cursor-not-allowed'
              : 'bg-white',
            validationErrors.email ? 'border-red-500' : 'border-slate-300',
          ]"
          placeholder="Enter your email address"
          aria-describedby="email-error"
        />
        <p
          v-if="validationErrors.email"
          id="email-error"
          class="text-sm text-red-600"
          role="alert"
        >
          {{ validationErrors.email }}
        </p>
      </div>

      <!-- Phone -->
      <div class="space-y-2">
        <label for="phone" class="block text-sm font-medium text-slate-700">
          Phone Number
        </label>
        <input
          id="phone"
          v-model="profileForm.phone"
          type="tel"
          :disabled="!isEditing"
          :class="[
            'w-full px-3 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
            !isEditing
              ? 'bg-slate-50 text-slate-600 cursor-not-allowed'
              : 'bg-white',
            validationErrors.phone ? 'border-red-500' : 'border-slate-300',
          ]"
          placeholder="Enter your phone number"
          aria-describedby="phone-error"
        />
        <p
          v-if="validationErrors.phone"
          id="phone-error"
          class="text-sm text-red-600"
          role="alert"
        >
          {{ validationErrors.phone }}
        </p>
      </div>

      <!-- Date of Birth -->
      <div class="space-y-2">
        <label
          for="dateOfBirth"
          class="block text-sm font-medium text-slate-700"
        >
          Date of Birth
        </label>
        <input
          id="dateOfBirth"
          v-model="profileForm.dateOfBirth"
          type="date"
          :disabled="!isEditing"
          :class="[
            'w-full px-3 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
            !isEditing
              ? 'bg-slate-50 text-slate-600 cursor-not-allowed'
              : 'bg-white',
            validationErrors.dateOfBirth
              ? 'border-red-500'
              : 'border-slate-300',
          ]"
          aria-describedby="dateOfBirth-error"
        />
        <p
          v-if="validationErrors.dateOfBirth"
          id="dateOfBirth-error"
          class="text-sm text-red-600"
          role="alert"
        >
          {{ validationErrors.dateOfBirth }}
        </p>
      </div>

      <!-- Gender -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-700">Gender</label>
        <div class="flex flex-wrap gap-4">
          <label
            v-for="option in genderOptions"
            :key="option.value"
            class="flex items-center space-x-2 cursor-pointer"
          >
            <input
              v-model="profileForm.gender"
              type="radio"
              :value="option.value"
              :disabled="!isEditing"
              class="text-emerald-600 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span :class="!isEditing ? 'text-slate-500' : 'text-slate-700'">
              {{ option.label }}
            </span>
          </label>
        </div>
      </div>

      <!-- Password Change Section -->
      <div v-if="isEditing" class="border-t pt-6">
        <h3 class="text-lg font-medium text-slate-800 mb-4">Change Password</h3>
        <div class="space-y-4">
          <!-- Current Password -->
          <div class="space-y-2">
            <label
              for="currentPassword"
              class="block text-sm font-medium text-slate-700"
            >
              Current Password
            </label>
            <div class="relative">
              <input
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                :class="[
                  'w-full px-3 py-2 pr-10 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
                  validationErrors.currentPassword
                    ? 'border-red-500'
                    : 'border-slate-300',
                ]"
                placeholder="Enter current password"
                aria-describedby="currentPassword-error"
              />
              <button
                type="button"
                @click="showCurrentPassword = !showCurrentPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                :aria-label="
                  showCurrentPassword ? 'Hide password' : 'Show password'
                "
              >
                <svg
                  v-if="showCurrentPassword"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
                <svg
                  v-else
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
            <p
              v-if="validationErrors.currentPassword"
              id="currentPassword-error"
              class="text-sm text-red-600"
              role="alert"
            >
              {{ validationErrors.currentPassword }}
            </p>
          </div>

          <!-- New Password -->
          <div class="space-y-2">
            <label
              for="newPassword"
              class="block text-sm font-medium text-slate-700"
            >
              New Password
            </label>
            <div class="relative">
              <input
                id="newPassword"
                v-model="passwordForm.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                :class="[
                  'w-full px-3 py-2 pr-10 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
                  validationErrors.newPassword
                    ? 'border-red-500'
                    : 'border-slate-300',
                ]"
                placeholder="Enter new password"
                aria-describedby="newPassword-error"
              />
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                :aria-label="
                  showNewPassword ? 'Hide password' : 'Show password'
                "
              >
                <svg
                  v-if="showNewPassword"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
                <svg
                  v-else
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
            <p
              v-if="validationErrors.newPassword"
              id="newPassword-error"
              class="text-sm text-red-600"
              role="alert"
            >
              {{ validationErrors.newPassword }}
            </p>
          </div>

          <!-- Confirm New Password -->
          <div class="space-y-2">
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-slate-700"
            >
              Confirm New Password
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="passwordForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                :class="[
                  'w-full px-3 py-2 pr-10 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
                  validationErrors.confirmPassword
                    ? 'border-red-500'
                    : 'border-slate-300',
                ]"
                placeholder="Confirm new password"
                aria-describedby="confirmPassword-error"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                :aria-label="
                  showConfirmPassword ? 'Hide password' : 'Show password'
                "
              >
                <svg
                  v-if="showConfirmPassword"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
                <svg
                  v-else
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
            <p
              v-if="validationErrors.confirmPassword"
              id="confirmPassword-error"
              class="text-sm text-red-600"
              role="alert"
            >
              {{ validationErrors.confirmPassword }}
            </p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="isEditing" class="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          type="submit"
          :disabled="isLoading"
          class="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg
            v-if="isLoading"
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ isLoading ? "Saving..." : "Save Changes" }}
        </button>
        <button
          type="button"
          @click="cancelEditing"
          :disabled="isLoading"
          class="flex-1 bg-slate-200 text-slate-800 py-2 px-4 rounded-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/features/auth/store";
import { useValidation } from "@/composables/useValidation";

// Types
interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  avatar: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Composables
const auth = useAuthStore();
const { user } = storeToRefs(auth);
const { validateRequired, validateEmail, validatePhone, validatePassword } =
  useValidation();

// Reactive state
const isEditing = ref(false);
const isLoading = ref(false);
const fileInput = ref<HTMLInputElement>();

// Form data
const profileForm = reactive<ProfileForm>({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  avatar: "",
});

const passwordForm = reactive<PasswordForm>({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// UI state
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// Constants
const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

// Validation
const validationErrors = reactive<Record<string, string>>({});

// Computed properties
const isFormValid = computed(() => {
  return Object.keys(validationErrors).length === 0;
});

// Methods
const validateForm = (): boolean => {
  // Clear previous errors
  Object.keys(validationErrors).forEach((key) => {
    delete validationErrors[key];
  });

  // Validate profile fields
  if (!validateRequired(profileForm.firstName)) {
    validationErrors.firstName = "First name is required";
  }

  if (!validateRequired(profileForm.lastName)) {
    validationErrors.lastName = "Last name is required";
  }

  if (!validateRequired(profileForm.email)) {
    validationErrors.email = "Email is required";
  } else if (!validateEmail(profileForm.email)) {
    validationErrors.email = "Please enter a valid email address";
  }

  if (profileForm.phone && !validatePhone(profileForm.phone)) {
    validationErrors.phone = "Please enter a valid phone number";
  }

  // Validate password fields if any password field is filled
  if (
    passwordForm.currentPassword ||
    passwordForm.newPassword ||
    passwordForm.confirmPassword
  ) {
    if (!validateRequired(passwordForm.currentPassword)) {
      validationErrors.currentPassword = "Current password is required";
    }

    if (!validateRequired(passwordForm.newPassword)) {
      validationErrors.newPassword = "New password is required";
    } else if (!validatePassword(passwordForm.newPassword)) {
      validationErrors.newPassword =
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
    }

    if (!validateRequired(passwordForm.confirmPassword)) {
      validationErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }
  }

  return Object.keys(validationErrors).length === 0;
};

const startEditing = (): void => {
  isEditing.value = true;
  // Populate form with current user data
  if (user.value) {
    profileForm.firstName = user.value.firstName || "";
    profileForm.lastName = user.value.lastName || "";
    profileForm.email = user.value.email || "";
    profileForm.phone = user.value.phone || "";
    profileForm.dateOfBirth = user.value.dateOfBirth || "";
    profileForm.gender = user.value.gender || "";
    profileForm.avatar = user.value.avatar || "";
  }
};

const cancelEditing = (): void => {
  isEditing.value = false;
  // Clear password form
  passwordForm.currentPassword = "";
  passwordForm.newPassword = "";
  passwordForm.confirmPassword = "";
  // Clear validation errors
  Object.keys(validationErrors).forEach((key) => {
    delete validationErrors[key];
  });
};

const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  try {
    // Update profile
    await auth.updateProfile({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      email: profileForm.email,
      phone: profileForm.phone,
      dateOfBirth: profileForm.dateOfBirth,
      gender: profileForm.gender,
      avatar: profileForm.avatar,
    });

    // Change password if provided
    if (passwordForm.currentPassword && passwordForm.newPassword) {
      await auth.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
    }

    // Success - exit editing mode
    isEditing.value = false;

    // Clear password form
    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";

    // Show success message (would typically use a toast notification)
    console.log("Profile updated successfully");
  } catch (error) {
    console.error("Failed to update profile:", error);
    // Handle error (would typically show error toast)
  } finally {
    isLoading.value = false;
  }
};

const triggerFileUpload = (): void => {
  fileInput.value?.click();
};

const handleAvatarUpload = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    // In a real app, you would upload to a server
    // For now, create a local URL for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      profileForm.avatar = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Initialize component
onMounted(() => {
  // Component initialization logic if needed
});
</script>

<style scoped>
/* Component-specific styles if needed */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
