<template>
    <div class="bg-white rounded-lg shadow-lg p-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 mb-2">Delivery Addresses</h2>
          <p class="text-slate-600">Manage your shipping and billing addresses</p>
        </div>
        <button
          @click="openAddModal"
          class="mt-4 sm:mt-0 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center gap-2"
          :disabled="loading"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Address
        </button>
      </div>
  
      <!-- Loading State -->
      <div v-if="loading && addresses.length === 0" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
  
      <!-- Empty State -->
      <div v-else-if="!loading && addresses.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3 class="text-lg font-medium text-slate-900 mb-2">No addresses found</h3>
        <p class="text-slate-600 mb-4">Add your first delivery address to get started</p>
        <button
          @click="openAddModal"
          class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
        >
          Add Address
        </button>
      </div>
  
      <!-- Address Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="address in addresses"
          :key="address.id"
          class="relative border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          :class="{
            'ring-2 ring-emerald-500 border-emerald-500': address.isDefault,
            'opacity-50': address.id === deletingAddressId
          }"
        >
          <!-- Default Badge -->
          <div v-if="address.isDefault" class="absolute top-2 right-2">
            <span class="bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-full">
              Default
            </span>
          </div>
  
          <!-- Address Type -->
          <div class="flex items-center gap-2 mb-3">
            <svg v-if="address.type === 'home'" class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1m-6 0h6" />
            </svg>
            <svg v-else-if="address.type === 'office'" class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <svg v-else class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="font-medium text-slate-800 capitalize">{{ address.type }}</span>
          </div>
  
          <!-- Address Details -->
          <div class="space-y-1 mb-4">
            <p class="font-medium text-slate-900">{{ address.fullName }}</p>
            <p class="text-slate-600">{{ address.streetAddress }}</p>
            <p v-if="address.apartment" class="text-slate-600">{{ address.apartment }}</p>
            <p class="text-slate-600">
              {{ address.city }}, {{ address.state }} {{ address.postalCode }}
            </p>
            <p class="text-slate-600">{{ address.country }}</p>
            <p v-if="address.phoneNumber" class="text-slate-600">{{ address.phoneNumber }}</p>
          </div>
  
          <!-- Actions -->
          <div class="flex flex-wrap gap-2">
            <button
              @click="editAddress(address)"
              class="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              :disabled="address.id === deletingAddressId"
            >
              Edit
            </button>
            <button
              v-if="!address.isDefault"
              @click="setAsDefault(address.id)"
              class="text-amber-600 hover:text-amber-700 text-sm font-medium"
              :disabled="settingDefaultId === address.id"
            >
              <span v-if="settingDefaultId === address.id">Setting...</span>
              <span v-else>Set as Default</span>
            </button>
            <button
              v-if="!address.isDefault"
              @click="deleteAddress(address.id)"
              class="text-red-600 hover:text-red-700 text-sm font-medium"
              :disabled="address.id === deletingAddressId"
            >
              <span v-if="address.id === deletingAddressId">Deleting...</span>
              <span v-else>Delete</span>
            </button>
          </div>
        </div>
      </div>
  
      <!-- Add/Edit Address Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b border-slate-200 px-6 py-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-slate-900">
                {{ isEditing ? 'Edit Address' : 'Add New Address' }}
              </h3>
              <button
                @click="closeModal"
                class="text-slate-400 hover:text-slate-600 transition-colors duration-200"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
  
          <form @submit.prevent="saveAddress" class="p-6 space-y-4">
            <!-- Address Type -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Address Type</label>
              <div class="flex gap-3">
                <label class="flex items-center">
                  <input
                    v-model="form.type"
                    type="radio"
                    value="home"
                    class="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
                  />
                  <span class="ml-2 text-sm text-slate-700">Home</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="form.type"
                    type="radio"
                    value="office"
                    class="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
                  />
                  <span class="ml-2 text-sm text-slate-700">Office</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="form.type"
                    type="radio"
                    value="other"
                    class="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
                  />
                  <span class="ml-2 text-sm text-slate-700">Other</span>
                </label>
              </div>
            </div>
  
            <!-- Full Name -->
            <div>
              <label for="fullName" class="block text-sm font-medium text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                id="fullName"
                v-model="form.fullName"
                type="text"
                required
                class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                :class="{ 'border-red-500': formErrors.fullName }"
              />
              <p v-if="formErrors.fullName" class="mt-1 text-sm text-red-600">{{ formErrors.fullName }}</p>
            </div>
  
            <!-- Street Address -->
            <div>
              <label for="streetAddress" class="block text-sm font-medium text-slate-700 mb-1">
                Street Address *
              </label>
              <input
                id="streetAddress"
                v-model="form.streetAddress"
                type="text"
                required
                class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                :class="{ 'border-red-500': formErrors.streetAddress }"
              />
              <p v-if="formErrors.streetAddress" class="mt-1 text-sm text-red-600">{{ formErrors.streetAddress }}</p>
            </div>
  
            <!-- Apartment/Suite -->
            <div>
              <label for="apartment" class="block text-sm font-medium text-slate-700 mb-1">
                Apartment, Suite, etc. (Optional)
              </label>
              <input
                id="apartment"
                v-model="form.apartment"
                type="text"
                class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
  
            <!-- City & State -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label for="city" class="block text-sm font-medium text-slate-700 mb-1">
                  City *
                </label>
                <input
                  id="city"
                  v-model="form.city"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  :class="{ 'border-red-500': formErrors.city }"
                />
                <p v-if="formErrors.city" class="mt-1 text-sm text-red-600">{{ formErrors.city }}</p>
              </div>
              <div>
                <label for="state" class="block text-sm font-medium text-slate-700 mb-1">
                  State *
                </label>
                <input
                  id="state"
                  v-model="form.state"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  :class="{ 'border-red-500': formErrors.state }"
                />
                <p v-if="formErrors.state" class="mt-1 text-sm text-red-600">{{ formErrors.state }}</p>
              </div>
            </div>
  
            <!-- Postal Code & Country -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label for="postalCode" class="block text-sm font-medium text-slate-700 mb-1">
                  Postal Code *
                </label>
                <input
                  id="postalCode"
                  v-model="form.postalCode"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  :class="{ 'border-red-500': formErrors.postalCode }"
                />
                <p v-if="formErrors.postalCode" class="mt-1 text-sm text-red-600">{{ formErrors.postalCode }}</p>
              </div>
              <div>
                <label for="country" class="block text-sm font-medium text-slate-700 mb-1">
                  Country *
                </label>
                <select
                  id="country"
                  v-model="form.country"
                  required
                  class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  :class="{ 'border-red-500': formErrors.country }"
                >
                  <option value="">Select Country</option>
                  <option v-for="country in countries" :key="country" :value="country">
                    {{ country }}
                  </option>
                </select>
                <p v-if="formErrors.country" class="mt-1 text-sm text-red-600">{{ formErrors.country }}</p>
              </div>
            </div>
  
            <!-- Phone Number -->
            <div>
              <label for="phoneNumber" class="block text-sm font-medium text-slate-700 mb-1">
                Phone Number (Optional)
              </label>
              <input
                id="phoneNumber"
                v-model="form.phoneNumber"
                type="tel"
                class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
  
            <!-- Set as Default -->
            <div class="flex items-center">
              <input
                id="isDefault"
                v-model="form.isDefault"
                type="checkbox"
                class="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
              />
              <label for="isDefault" class="ml-2 text-sm text-slate-700">
                Set as default address
              </label>
            </div>
  
            <!-- Form Actions -->
            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="flex-1 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md font-medium transition-colors duration-200"
                :disabled="submitting"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium transition-colors duration-200 disabled:opacity-50"
                :disabled="submitting"
              >
                <span v-if="submitting">
                  {{ isEditing ? 'Updating...' : 'Adding...' }}
                </span>
                <span v-else>
                  {{ isEditing ? 'Update Address' : 'Add Address' }}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  
  // Types
  interface Address {
    id: string
    type: 'home' | 'office' | 'other'
    fullName: string
    streetAddress: string
    apartment?: string
    city: string
    state: string
    postalCode: string
    country: string
    phoneNumber?: string
    isDefault: boolean
    userId: string
    createdAt: Date
    updatedAt: Date
  }
  
  interface AddressForm {
    type: 'home' | 'office' | 'other'
    fullName: string
    streetAddress: string
    apartment: string
    city: string
    state: string
    postalCode: string
    country: string
    phoneNumber: string
    isDefault: boolean
  }
  
  // Reactive state
  const addresses = ref<Address[]>([])
  const loading = ref(false)
  const showModal = ref(false)
  const isEditing = ref(false)
  const editingAddressId = ref<string | null>(null)
  const submitting = ref(false)
  const deletingAddressId = ref<string | null>(null)
  const settingDefaultId = ref<string | null>(null)
  
  // Form state
  const form = reactive<AddressForm>({
    type: 'home',
    fullName: '',
    streetAddress: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phoneNumber: '',
    isDefault: false
  })
  
  const formErrors = reactive<Partial<Record<keyof AddressForm, string>>>({})
  
  // Countries list (simplified for demo)
  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'Italy',
    'Spain',
    'Netherlands',
    'Sweden',
    'Norway',
    'Denmark',
    'Switzerland',
    'Austria',
    'Belgium',
    'Ireland',
    'Portugal',
    'Finland',
    'New Zealand',
    'Japan',
    'South Korea',
    'Singapore',
    'Hong Kong'
  ]
  
  // Mock data for demonstration
  const mockAddresses: Address[] = [
    {
      id: '1',
      type: 'home',
      fullName: 'John Doe',
      streetAddress: '123 Emerald Street',
      apartment: 'Apt 4B',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'United States',
      phoneNumber: '+1 (555) 123-4567',
      isDefault: true,
      userId: 'user1',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      type: 'office',
      fullName: 'John Doe',
      streetAddress: '456 Business Ave',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94103',
      country: 'United States',
      phoneNumber: '+1 (555) 987-6543',
      isDefault: false,
      userId: 'user1',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01')
    }
  ]
  
  // Methods
  const loadAddresses = async () => {
    try {
      loading.value = true
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      addresses.value = [...mockAddresses]
    } catch (error) {
      console.error('Failed to load addresses:', error)
      // Handle error with toast notification
    } finally {
      loading.value = false
    }
  }
  
  const openAddModal = () => {
    resetForm()
    isEditing.value = false
    editingAddressId.value = null
    showModal.value = true
  }
  
  const editAddress = (address: Address) => {
    form.type = address.type
    form.fullName = address.fullName
    form.streetAddress = address.streetAddress
    form.apartment = address.apartment || ''
    form.city = address.city
    form.state = address.state
    form.postalCode = address.postalCode
    form.country = address.country
    form.phoneNumber = address.phoneNumber || ''
    form.isDefault = address.isDefault
    
    isEditing.value = true
    editingAddressId.value = address.id
    showModal.value = true
  }
  
  const closeModal = () => {
    showModal.value = false
    resetForm()
    clearErrors()
  }
  
  const resetForm = () => {
    form.type = 'home'
    form.fullName = ''
    form.streetAddress = ''
    form.apartment = ''
    form.city = ''
    form.state = ''
    form.postalCode = ''
    form.country = ''
    form.phoneNumber = ''
    form.isDefault = false
  }
  
  const clearErrors = () => {
    Object.keys(formErrors).forEach(key => {
      delete formErrors[key as keyof AddressForm]
    })
  }
  
  const validateForm = (): boolean => {
    clearErrors()
    let isValid = true
  
    // Required field validation
    const requiredFields: (keyof AddressForm)[] = [
      'fullName', 'streetAddress', 'city', 'state', 'postalCode', 'country'
    ]
  
    requiredFields.forEach(field => {
      if (!form[field] || (form[field] as string).trim() === '') {
        formErrors[field] = `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`
        isValid = false
      }
    })
  
    // Postal code validation (basic)
    if (form.postalCode && !/^[A-Za-z0-9\s-]{3,10}$/.test(form.postalCode)) {
      formErrors.postalCode = 'Please enter a valid postal code'
      isValid = false
    }
  
    // Phone number validation (basic)
    if (form.phoneNumber && !/^[\+]?[1-9][\d]{0,15}$/.test(form.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
      formErrors.phoneNumber = 'Please enter a valid phone number'
      isValid = false
    }
  
    return isValid
  }
  
  const saveAddress = async () => {
    if (!validateForm()) {
      return
    }
  
    try {
      submitting.value = true
  
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
  
      if (isEditing.value && editingAddressId.value) {
        // Update existing address
        const index = addresses.value.findIndex(addr => addr.id === editingAddressId.value)
        if (index !== -1) {
          // If setting as default, remove default from others
          if (form.isDefault) {
            addresses.value.forEach(addr => addr.isDefault = false)
          }
  
          addresses.value[index] = {
            ...addresses.value[index],
            ...form,
            updatedAt: new Date()
          }
        }
      } else {
        // Add new address
        const newAddress: Address = {
          id: Date.now().toString(),
          ...form,
          userId: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
  
        // If setting as default, remove default from others
        if (form.isDefault) {
          addresses.value.forEach(addr => addr.isDefault = false)
        }
  
        addresses.value.push(newAddress)
      }
  
      closeModal()
      // Show success toast
    } catch (error) {
      console.error('Failed to save address:', error)
      // Show error toast
    } finally {
      submitting.value = false
    }
  }
  
  const setAsDefault = async (addressId: string) => {
    try {
      settingDefaultId.value = addressId
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
  
      // Remove default from all addresses
      addresses.value.forEach(addr => addr.isDefault = false)
      
      // Set new default
      const address = addresses.value.find(addr => addr.id === addressId)
      if (address) {
        address.isDefault = true
        address.updatedAt = new Date()
      }
  
      // Show success toast
    } catch (error) {
      console.error('Failed to set default address:', error)
      // Show error toast
    } finally {
      settingDefaultId.value = null
    }
  }
  
  const deleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return
    }
  
    try {
      deletingAddressId.value = addressId
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
  
      // Remove address from list
      const index = addresses.value.findIndex(addr => addr.id === addressId)
      if (index !== -1) {
        addresses.value.splice(index, 1)
      }
  
      // Show success toast
    } catch (error) {
      console.error('Failed to delete address:', error)
      // Show error toast
    } finally {
      deletingAddressId.value = null
    }
  }
  
  // Lifecycle
  onMounted(() => {
    loadAddresses()
  })
  </script>
  
  <style scoped>
  /* Custom styles for address cards */
  .address-card {
    transition: all 0.2s ease-in-out;
  }
  
  .address-card:hover {
    transform: translateY(-2px);
  }
  
  /* Modal animation */
  .modal-enter-active,
  .modal-leave-active {
    transition: all 0.3s ease;
  }
  
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }
  
  /* Form focus states */
  input[type="text"]:focus,
  input[type="tel"]:focus,
  select:focus {
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  /* Radio button styling */
  input[type="radio"]:checked {
    background-color: #059669;
    border-color: #059669;
  }
  
  /* Checkbox styling */
  input[type="checkbox"]:checked {
    background-color: #059669;
    border-color: #059669;
  }
  
  /* Loading spinner */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    .modal-content {
      margin: 1rem;
      max-height: calc(100vh - 2rem);
    }
  }
  </style>