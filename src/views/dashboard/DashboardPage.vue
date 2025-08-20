<template>
  <div class="dashboard-page">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar -->
        <DashboardSidebar class="w-full lg:w-1/4" />

        <!-- Main Content -->
        <main class="w-full lg:w-3/4">
          <DashboardOverview />
          
          <!-- Recent Orders -->
          <div class="mt-8">
            <h2 class="text-2xl font-semibold mb-4">Recent Orders</h2>
            <div class="space-y-4">
              <OrderCard
                v-for="order in recentOrders"
                :key="order.id"
                :order="order"
              />
            </div>
          </div>

          <!-- Recently Viewed -->
          <div class="mt-8">
            <h2 class="text-2xl font-semibold mb-4">Recently Viewed</h2>
            <RecentlyViewed />
          </div>

          <!-- Notifications -->
          <div class="mt-8">
            <h2 class="text-2xl font-semibold mb-4">Notifications</h2>
            <NotificationCenter />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue'
import DashboardOverview from '@/components/dashboard/DashboardOverview.vue'
import OrderCard from '@/components/dashboard/OrderCard.vue'
import RecentlyViewed from '@/components/dashboard/RecentlyViewed.vue'
import NotificationCenter from '@/components/dashboard/NotificationCenter.vue'

const recentOrders = ref([])

onMounted(async () => {
  // Fetch recent orders
})
</script>
