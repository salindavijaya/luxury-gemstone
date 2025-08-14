<template>
    <div class="min-h-screen bg-slate-50">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Logo and Title -->
            <div class="flex items-center">
              <h1 class="text-2xl font-bold text-slate-800">Dashboard</h1>
            </div>
  
            <!-- User Menu -->
            <div class="relative" ref="userMenuRef">
              <button
                type="button"
                class="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 p-2 hover:bg-slate-50 transition-colors duration-200"
                @click="toggleUserMenu"
                :aria-expanded="isUserMenuOpen"
                aria-haspopup="true"
              >
                <div class="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span class="text-white font-medium text-sm">
                    {{ userInitials }}
                  </span>
                </div>
                <div class="hidden md:block text-left">
                  <div class="text-sm font-medium text-slate-700">{{ user?.name || 'User' }}</div>
                  <div class="text-xs text-slate-500">{{ user?.email }}</div>
                </div>
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
  
              <!-- Dropdown Menu -->
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-if="isUserMenuOpen"
                  class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div class="py-1">
                    <button
                      type="button"
                      class="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors duration-200"
                      role="menuitem"
                      @click="setActiveTab('profile'); toggleUserMenu()"
                    >
                      Profile Settings
                    </button>
                    <button
                      type="button"
                      class="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors duration-200"
                      role="menuitem"
                      @click="handleLogout"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </header>
  
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Sidebar Navigation -->
          <nav class="w-full lg:w-64 flex-shrink-0">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h2 class="text-lg font-semibold text-slate-800 mb-4">Account</h2>
              <ul class="space-y-2">
                <li>
                  <button
                    type="button"
                    class="w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    :class="activeTab === 'overview' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-100'"
                    @click="setActiveTab('overview')"
                  >
                    <svg class="inline-block w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
                    </svg>
                    Overview
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    class="w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    :class="activeTab === 'orders' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-100'"
                    @click="setActiveTab('orders')"
                  >
                    <svg class="inline-block w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Orders
                    <span v-if="orderCount > 0" class="ml-auto inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                      {{ orderCount }}
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    class="w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    :class="activeTab === 'profile' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-100'"
                    @click="setActiveTab('profile')"
                  >
                    <svg class="inline-block w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    class="w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    :class="activeTab === 'addresses' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-100'"
                    @click="setActiveTab('addresses')"
                  >
                    <svg class="inline-block w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Addresses
                  </button>
                </li>
              </ul>
            </div>
          </nav>
  
          <!-- Main Content -->
          <main class="flex-1 min-w-0">
            <!-- Overview Tab -->
            <div v-if="activeTab === 'overview'" class="space-y-6">
              <!-- Welcome Section -->
              <div class="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg shadow-lg p-6 text-white">
                <h2 class="text-2xl font-bold mb-2">Welcome back, {{ user?.name?.split(' ')[0] || 'User' }}!</h2>
                <p class="text-emerald-100">Here's what's happening with your account.</p>
              </div>
  
              <!-- Stats Cards -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="bg-white rounded-lg shadow-lg p-6">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <p class="text-sm font-medium text-slate-600">Total Orders</p>
                      <p class="text-2xl font-semibold text-slate-900">{{ orderCount }}</p>
                    </div>
                  </div>
                </div>
  
                <div class="bg-white rounded-lg shadow-lg p-6">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <p class="text-sm font-medium text-slate-600">Total Spent</p>
                      <p class="text-2xl font-semibold text-slate-900">${{ totalSpent.toFixed(2) }}</p>
                    </div>
                  </div>
                </div>
  
                <div class="bg-white rounded-lg shadow-lg p-6">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                        <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <p class="text-sm font-medium text-slate-600">Wishlist Items</p>
                      <p class="text-2xl font-semibold text-slate-900">{{ wishlistCount }}</p>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Recent Orders -->
              <div class="bg-white rounded-lg shadow-lg p-6">
                <h3 class="text-lg font-semibold text-slate-800 mb-4">Recent Orders</h3>
                <div v-if="recentOrders.length > 0" class="space-y-4">
                  <div
                    v-for="order in recentOrders"
                    :key="order.id"
                    class="flex items-center justify-between p-4 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors duration-200"
                  >
                    <div class="flex items-center space-x-4">
                      <div class="w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center">
                        <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-medium text-slate-900">Order #{{ order.id }}</p>
                        <p class="text-sm text-slate-500">{{ formatDate(order.createdAt) }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-medium text-slate-900">${{ order.total.toFixed(2) }}</p>
                      <span
                        class="inline-block px-2 py-1 text-xs font-medium rounded-full"
                        :class="getOrderStatusClass(order.status)"
                      >
                        {{ order.status }}
                      </span>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8">
                  <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <h3 class="mt-2 text-sm font-medium text-slate-900">No orders yet</h3>
                  <p class="mt-1 text-sm text-slate-500">Start shopping to see your orders here.</p>
                  <div class="mt-6">
                    <router-link
                      to="/products"
                      class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
                    >
                      Start Shopping
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Dynamic Component for Other Tabs -->
            <component
              v-else
              :is="currentTabComponent"
              :key="activeTab"
              @update="handleComponentUpdate"
            />
          </main>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  import { useRouter } from 'vue-router'
  import UserProfile from './UserProfile.vue'
  import UserOrders from './UserOrders.vue'
  import UserAddresses from './UserAddresses.vue'
  
  // Router and stores
  const router = useRouter()
  const authStore = useAuthStore()
  
  // State
  const activeTab = ref<'overview' | 'orders' | 'profile' | 'addresses'>('overview')
  const isUserMenuOpen = ref(false)
  const userMenuRef = ref<HTMLElement>()
  
  // Mock data - replace with real API calls
  const orderCount = ref(5)
  const totalSpent = ref(1250.99)
  const wishlistCount = ref(12)
  const recentOrders = ref([
    {
      id: 'ORD-001',
      total: 299.99,
      status: 'delivered',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'ORD-002',
      total: 150.50,
      status: 'shipped',
      createdAt: new Date('2024-01-20')
    },
    {
      id: 'ORD-003',
      total: 800.00,
      status: 'processing',
      createdAt: new Date('2024-01-25')
    }
  ])
  
  // Computed
  const user = computed(() => authStore.user)
  
  const userInitials = computed(() => {
    const name = user.value?.name || 'User'
    return name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2)
  })
  
  const currentTabComponent = computed(() => {
    switch (activeTab.value) {
      case 'profile':
        return UserProfile
      case 'orders':
        return UserOrders
      case 'addresses':
        return UserAddresses
      default:
        return null
    }
  })
  
  // Methods
  const setActiveTab = (tab: typeof activeTab.value) => {
    activeTab.value = tab
  }
  
  const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value
  }
  
  const handleLogout = async () => {
    try {
      await authStore.logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
  
  const handleComponentUpdate = (data: any) => {
    // Handle updates from child components
    console.log('Component updated:', data)
    
    // Refresh data if needed
    if (data.type === 'profile-updated') {
      // Refresh user data
      authStore.refreshUser()
    }
  }
  
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }
  
  const getOrderStatusClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }
  
  const handleClickOutside = (event: Event) => {
    if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
      isUserMenuOpen.value = false
    }
  }
  
  // Lifecycle
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    
    // Load dashboard data
    loadDashboardData()
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
  
  const loadDashboardData = async () => {
    try {
      // TODO: Replace with actual API calls
      // const [orders, stats, wishlist] = await Promise.all([
      //   fetchRecentOrders(),
      //   fetchUserStats(),
      //   fetchWishlist()
      // ])
      
      // For now, using mock data
      console.log('Dashboard data loaded')
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    }
  }
  </script>
  
  <style scoped>
  /* Custom scrollbar for main content */
  main {
    scrollbar-width: thin;
    scrollbar-color: theme('colors.slate.300') transparent;
  }
  
  main::-webkit-scrollbar {
    width: 6px;
  }
  
  main::-webkit-scrollbar-track {
    background: transparent;
  }
  
  main::-webkit-scrollbar-thumb {
    background-color: theme('colors.slate.300');
    border-radius: 3px;
  }
  
  main::-webkit-scrollbar-thumb:hover {
    background-color: theme('colors.slate.400');
  }
  
  /* Smooth transitions for tab switching */
  .tab-content {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Focus styles for accessibility */
  button:focus-visible,
  a:focus-visible {
    outline: 2px solid theme('colors.emerald.500');
    outline-offset: 2px;
  }
  
  /* Responsive adjustments */
  @media (max-width: 1024px) {
    .lg\:flex-row {
      flex-direction: column;
    }
    
    .lg\:w-64 {
      width: 100%;
    }
  }
  
  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .bg-gradient-to-r {
      background: theme('colors.emerald.600');
    }
    
    .shadow-lg {
      box-shadow: 0 0 0 1px theme('colors.slate.300');
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .transition-colors,
    .transition-all,
    .duration-200 {
      transition: none;
    }
    
    .animate-spin {
      animation: none;
    }
    
    @keyframes fadeIn {
      from, to {
        opacity: 1;
        transform: none;
      }
    }
  }
  </style>