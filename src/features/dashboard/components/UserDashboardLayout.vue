<!-- UserDashboardLayout.vue -->
<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Mobile Header -->
    <div class="lg:hidden bg-white shadow-sm border-b border-slate-200">
      <div class="px-4 py-3 flex items-center justify-between">
        <button
          @click="sidebarOpen = true"
          class="p-2 -ml-2 text-slate-600 hover:text-slate-900"
          aria-label="Open sidebar"
        >
          <MenuIcon class="w-6 h-6" />
        </button>
        <h1 class="text-lg font-semibold text-slate-900">
          {{ currentPageTitle }}
        </h1>
        <div class="w-10"></div>
      </div>
    </div>

    <div class="lg:flex">
      <!-- Desktop Sidebar -->
      <DashboardSidebar
        :is-mobile="false"
        :current-page="currentPage"
        @navigate="handleNavigation"
        class="hidden lg:flex"
      />

      <!-- Mobile Sidebar Overlay -->
      <Teleport to="body">
        <div
          v-if="sidebarOpen"
          class="fixed inset-0 z-50 lg:hidden"
          @click="sidebarOpen = false"
        >
          <div class="fixed inset-0 bg-slate-600 bg-opacity-75"></div>
          <div class="fixed inset-y-0 left-0 w-64 bg-white" @click.stop>
            <div
              class="flex items-center justify-between p-4 border-b border-slate-200"
            >
              <h2 class="text-lg font-semibold text-slate-900">Menu</h2>
              <button
                @click="sidebarOpen = false"
                class="p-2 -mr-2 text-slate-400 hover:text-slate-600"
              >
                <XIcon class="w-5 h-5" />
              </button>
            </div>
            <DashboardSidebar
              :is-mobile="true"
              :current-page="currentPage"
              @navigate="handleMobileNavigation"
            />
          </div>
        </div>
      </Teleport>

      <!-- Main Content -->
      <div class="flex-1 lg:pl-64">
        <div class="px-4 py-6 lg:px-8">
          <!-- Desktop Header -->
          <div class="hidden lg:block mb-6">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-bold text-slate-900">
                  {{ currentPageTitle }}
                </h1>
                <Breadcrumb :items="breadcrumbItems" class="mt-1" />
              </div>
              <div class="flex items-center space-x-4">
                <NotificationCenter />
                <div class="flex items-center space-x-3">
                  <img
                    :src="user?.avatar || '/default-avatar.jpg'"
                    :alt="user?.firstName"
                    class="w-8 h-8 rounded-full"
                  />
                  <span class="text-sm font-medium text-slate-700">
                    {{ user?.firstName }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Page Content -->
          <div class="max-w-7xl mx-auto">
            <component :is="currentComponent" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/features/user/store";
import { MenuIcon, XIcon } from "lucide-vue-next";
import DashboardSidebar from "./DashboardSidebar.vue";
import NotificationCenter from "./NotificationCenter.vue";
import Breadcrumb from "./Breadcrumb.vue";
import DashboardOverview from "./DashboardOverview.vue";
import DashboardOrderHistory from "./DashboardOrderHistory.vue";
import DashboardWishlist from "./DashboardWishlist.vue";
import DashboardAddresses from "./DashboardAddresses.vue";
import DashboardSettings from "./DashboardSettings.vue";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const sidebarOpen = ref(false);
const currentPage = ref("overview");

const user = computed(() => userStore.user);

const pageComponents = {
  overview: DashboardOverview,
  orders: DashboardOrderHistory,
  wishlist: DashboardWishlist,
  addresses: DashboardAddresses,
  settings: DashboardSettings,
};

const pageTitles = {
  overview: "Dashboard Overview",
  orders: "Order History",
  wishlist: "My Wishlist",
  addresses: "Address Book",
  settings: "Account Settings",
};

const currentComponent = computed(
  () =>
    pageComponents[currentPage.value as keyof typeof pageComponents] ||
    DashboardOverview
);
const currentPageTitle = computed(
  () => pageTitles[currentPage.value as keyof typeof pageTitles] || "Dashboard"
);

const breadcrumbItems = computed(() => [
  { label: "Account", href: "/dashboard" },
  { label: currentPageTitle.value, href: route.path, current: true },
]);

const handleNavigation = (page: string) => {
  currentPage.value = page;
  router.push(`/dashboard/${page}`);
};

const handleMobileNavigation = (page: string) => {
  handleNavigation(page);
  sidebarOpen.value = false;
};

onMounted(() => {
  // Initialize current page from route
  const routePage = route.params.page as string;
  if (routePage && pageComponents[routePage as keyof typeof pageComponents]) {
    currentPage.value = routePage;
  }
});
</script>
