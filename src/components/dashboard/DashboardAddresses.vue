<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Address Book</h2>
        <p class="text-slate-600 mt-1">Manage your shipping and billing addresses</p>
      </div>
      <button
        @click="showAddForm = true"
        class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Address
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 2" :key="i" class="animate-pulse">
        <div class="bg-white rounded-lg border border-slate-200 p-6">
          <div class="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div class="space-y-2">
            <div class="h-3 bg-slate-200 rounded w-full"></div>
            <div class="h-3 bg-slate-200 rounded w-3/4"></div>
            <div class="h-3 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Addresses Grid -->
    <div v-else-if="addresses.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="address in addresses"
        :key="address.id"
        class="bg-white rounded-lg border border-slate-200 p-6 relative group hover:shadow-md transition-shadow"
      >
        <!-- Address Type Badge -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-2">
            <span
              :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                address.isDefault
                  ? 'bg-emerald-100 text-emerald-800'
                  : address.type === 'billing'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-800'
              ]"
            >
              {{ address.isDefault ? 'Default' : address.type }}
            </span>
            <span v-if="address.isDefault" class="text-emerald-600 text-xs font-medium">Primary</span>
          </div>
          
          <!-- Actions Menu -->
          <div class="relative">
            <button
              @click="toggleMenu(address.id)"
              class="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
              :aria-expanded="openMenuId === address.id"
              aria-label="Address options"
            >
              <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01" />
              </svg>
            </button>
            
            <div
              v-if="openMenuId === address.id"
              class="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-10"
              role="menu"
            >
              <button
                @click="editAddress(address)"
                class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                role="menuitem"
              >
                Edit Address
              </button>
              <button
                v-if="!address.isDefault"
                @click="setDefaultAddress(address.id)"
                class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                role="menuitem"
              >
                Set as Default
              </button>
              <button
                @click="deleteAddress(address.id)"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                role="menuitem"
                :disabled="address.isDefault"
              >
                Delete Address
              </button>
            </div>
          </div>
        </div>

        <!-- Address Details -->
        <div class="space-y-1 text-sm">
          <p class="font-medium text-slate-900">{{ address.fullName }}</p>
          <p class="text-slate-600">{{ address.streetAddress }}</p>
          <p v-if="address.apartmentUnit" class="text-slate-600">{{ address.apartmentUnit }}</p>
          <p class="text-slate-600">
            {{ address.city }}, {{ address.state }} {{ address.postalCode }}
          </p>
          <p class="text-slate-600">{{ address.country }}</p>
          <p v-if="address.phoneNumber" class="text-slate-600 mt-2">{{ address.phoneNumber }}</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <h3 class="text-lg font-medium text-slate-900 mb-2">No addresses found</h3>
      <p class="text-slate-600 mb-6">Add your first address to get started</p>
      <button
        @click="showAddForm = true"
        class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition-colors"
      >
        Add Address
      </button>
    </div>

    <!-- Add/Edit Address Modal -->
    <Modal
      :show="showAddForm || editingAddress !== null"
      @close="closeAddressForm"
      title="Address Details"
      max-width="2xl"
    >
      <form @submit.prevent="saveAddress" class="space-y-6">
        <!-- Address Type -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Address Type</label>
          <div class="flex gap-4">
            <label class="flex items-center">
              <input
                v-model="addressForm.type"
                type="radio"
                value="shipping"
                class="text-emerald-600 focus:ring-emerald-500"
              >
              <span class="ml-2 text-sm text-slate-700">Shipping</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="addressForm.type"
                type="radio"
                value="billing"
                class="text-emerald-600 focus:ring-emerald-500"
              >
              <span class="ml-2 text-sm text-slate-700">Billing</span>
            </label>
          </div>
        </div>

        <!-- Full Name -->
        <div>
          <label for="fullName" class="block text-sm font-medium text-slate-700 mb-2">
            Full Name *
          </label>
          <input
            id="fullName"
            v-model="addressForm.fullName"
            type="text"
            required
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.fullName }"
          >
          <p v-if="errors.fullName" class="mt-1 text-sm text-red-600">{{ errors.fullName }}</p>
        </div>

        <!-- Street Address -->
        <div>
          <label for="streetAddress" class="block text-sm font-medium text-slate-700 mb-2">
            Street Address *
          </label>
          <input
            id="streetAddress"
            v-model="addressForm.streetAddress"
            type="text"
            required
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.streetAddress }"
          >
          <p v-if="errors.streetAddress" class="mt-1 text-sm text-red-600">{{ errors.streetAddress }}</p>
        </div>

        <!-- Apartment/Unit -->
        <div>
          <label for="apartmentUnit" class="block text-sm font-medium text-slate-700 mb-2">
            Apartment, suite, unit, etc. (optional)
          </label>
          <input
            id="apartmentUnit"
            v-model="addressForm.apartmentUnit"
            type="text"
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
        </div>

        <!-- City, State, Postal Code -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="city" class="block text-sm font-medium text-slate-700 mb-2">
              City *
            </label>
            <input
              id="city"
              v-model="addressForm.city"
              type="text"
              required
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.city }"
            >
            <p v-if="errors.city" class="mt-1 text-sm text-red-600">{{ errors.city }}</p>
          </div>

          <div>
            <label for="state" class="block text-sm font-medium text-slate-700 mb-2">
              State/Province *
            </label>
            <input
              id="state"
              v-model="addressForm.state"
              type="text"
              required
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.state }"
            >
            <p v-if="errors.state" class="mt-1 text-sm text-red-600">{{ errors.state }}</p>
          </div>

          <div>
            <label for="postalCode" class="block text-sm font-medium text-slate-700 mb-2">
              Postal Code *
            </label>
            <input
              id="postalCode"
              v-model="addressForm.postalCode"
              type="text"
              required
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.postalCode }"
            >
            <p v-if="errors.postalCode" class="mt-1 text-sm text-red-600">{{ errors.postalCode }}</p>
          </div>
        </div>

        <!-- Country -->
        <div>
          <label for="country" class="block text-sm font-medium text-slate-700 mb-2">
            Country *
          </label>
          <select
            id="country"
            v-model="addressForm.country"
            required
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.country }"
          >
            <option value="">Select Country</option>
            <option v-for="country in countries" :key="country" :value="country">
              {{ country }}
            </option>
          </select>
          <p v-if="errors.country" class="mt-1 text-sm text-red-600">{{ errors.country }}</p>
        </div>

        <!-- Phone Number -->
        <div>
          <label for="phoneNumber" class="block text-sm font-medium text-slate-700 mb-2">
            Phone Number (optional)
          </label>
          <input
            id="phoneNumber"
            v-model="addressForm.phoneNumber"
            type="tel"
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
        </div>

        <!-- Default Address -->
        <div>
          <label class="flex items-center">
            <input
              v-model="addressForm.isDefault"
              type="checkbox"
              class="text-emerald-600 focus:ring-emerald-500"
            >
            <span class="ml-2 text-sm text-slate-700">Set as default address</span>
          </label>
        </div>

        <!-- Actions -->
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-slate-200">
          <button
            type="button"
            @click="closeAddressForm"
            class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSaving"
            class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isSaving ? 'Saving...' : editingAddress ? 'Update Address' : 'Add Address' }}
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useNotificationsStore } from '../stores/notifications'
import Modal from './Modal.vue'

interface Address {
  id: string
  type: 'shipping' | 'billing'
  fullName: string
  streetAddress: string
  apartmentUnit?: string
  city: string
  state: string
  postalCode: string
  country: string
  phoneNumber?: string
  isDefault: boolean
}

const userStore = useUserStore()
const notificationsStore = useNotificationsStore()

// Reactive state
const isLoading = ref(false)
const isSaving = ref(false)
const showAddForm = ref(false)
const editingAddress = ref<Address | null>(null)
const openMenuId = ref<string | null>(null)
const addresses = ref<Address[]>([])

// Address form
const addressForm = reactive({
  type: 'shipping' as 'shipping' | 'billing',
  fullName: '',
  streetAddress: '',
  apartmentUnit: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  phoneNumber: '',
  isDefault: false
})

// Form errors
const errors = reactive({
  fullName: '',
  streetAddress: '',
  city: '',
  state: '',
  postalCode: '',
  country: ''
})

// Countries list
const countries = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
  'France', 'Italy', 'Spain', 'Netherlands', 'Switzerland', 'Austria',
  'Belgium', 'Denmark', 'Norway', 'Sweden', 'Finland', 'Japan',
  'South Korea', 'Singapore', 'Hong Kong', 'New Zealand'
]

// Load addresses
const loadAddresses = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    addresses.value = [
      {
        id: '1',
        type: 'shipping',
        fullName: 'John Doe',
        streetAddress: '123 Main Street',
        apartmentUnit: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States',
        phoneNumber: '+1 (555) 123-4567',
        isDefault: true
      },
      {
        id: '2',
        type: 'billing',
        fullName: 'John Doe',
        streetAddress: '456 Business Ave',
        city: 'New York',
        state: 'NY',
        postalCode: '10002',
        country: 'United States',
        phoneNumber: '+1 (555) 987-6543',
        isDefault: false
      }
    ]
  } catch (error) {
    notificationsStore.addNotification({
      type: 'error',
      title: 'Error',
      message: 'Failed to load addresses'
    })
  } finally {
    isLoading.value = false
  }
}

// Validate form
const validateForm = (): boolean => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })

  let isValid = true

  if (!addressForm.fullName.trim()) {
    errors.fullName = 'Full name is required'
    isValid = false
  }

  if (!addressForm.streetAddress.trim()) {
    errors.streetAddress = 'Street address is required'
    isValid = false
  }

  if (!addressForm.city.trim()) {
    errors.city = 'City is required'
    isValid = false
  }

  if (!addressForm.state.trim()) {
    errors.state = 'State is required'
    isValid = false
  }

  if (!addressForm.postalCode.trim()) {
    errors.postalCode = 'Postal code is required'
    isValid = false
  }

  if (!addressForm.country.trim()) {
    errors.country = 'Country is required'
    isValid = false
  }

  return isValid
}

// Save address
const saveAddress = async () => {
  if (!validateForm()) return

  isSaving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (editingAddress.value) {
      // Update existing address
      const index = addresses.value.findIndex(a => a.id === editingAddress.value?.id)
      if (index !== -1) {
        addresses.value[index] = {
          ...editingAddress.value,
          ...addressForm
        }
      }
    } else {
      // Add new address
      const newAddress: Address = {
        id: Date.now().toString(),
        ...addressForm
      }
      addresses.value.push(newAddress)
    }

    // If this is set as default, remove default from others
    if (addressForm.isDefault) {
      addresses.value.forEach(addr => {
        if (addr.id !== editingAddress.value?.id) {
          addr.isDefault = false
        }
      })
    }

    notificationsStore.addNotification({
      type: 'success',
      title: 'Success',
      message: editingAddress.value ? 'Address updated' : 'Address added'
    })

    closeAddressForm()
  } catch (error) {
    notificationsStore.addNotification({
      type: 'error',
      title: 'Error',
      message: 'Failed to save address'
    })
  } finally {
    isSaving.value = false
  }
}

// Edit address
const editAddress = (address: Address) => {
  editingAddress.value = address
  Object.assign(addressForm, address)
  openMenuId.value = null
}

// Delete address
const deleteAddress = async (addressId: string) => {
  const address = addresses.value.find(a => a.id === addressId)
  if (address?.isDefault) {
    notificationsStore.addNotification({
      type: 'error',
      title: 'Cannot Delete',
      message: 'Cannot delete default address'
    })
    return
  }

  if (confirm('Are you sure you want to delete this address?')) {
    addresses.value = addresses.value.filter(a => a.id !== addressId)
    notificationsStore.addNotification({
      type: 'success',
      title: 'Deleted',
      message: 'Address deleted successfully'
    })
  }
  openMenuId.value = null
}

// Set default address
const setDefaultAddress = async (addressId: string) => {
  addresses.value.forEach(addr => {
    addr.isDefault = addr.id === addressId
  })
  
  notificationsStore.addNotification({
    type: 'success',
    title: 'Updated',
    message: 'Default address updated'
  })
  
  openMenuId.value = null
}

// Toggle menu
const toggleMenu = (addressId: string) => {
  openMenuId.value = openMenuId.value === addressId ? null : addressId
}

// Close address form
const closeAddressForm = () => {
  showAddForm.value = false
  editingAddress.value = null
  
  // Reset form
  Object.assign(addressForm, {
    type: 'shipping',
    fullName: '',
    streetAddress: '',
    apartmentUnit: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phoneNumber: '',
    isDefault: false
  })
  
  // Clear errors
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}

// Close menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    openMenuId.value = null
  }
}

onMounted(() => {
  loadAddresses()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>