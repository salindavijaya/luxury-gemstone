<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <LayoutHeader v-if="!hideNavigation" />

    <!-- Main Content -->
    <main>
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <!-- Footer -->
    <LayoutFooter v-if="!hideNavigation" />

    <!-- Mobile Navigation -->
    <LayoutMobileNav v-if="!hideNavigation" />

    <!-- Auth Modal -->
    <AuthModal />

    <!-- Cart Drawer -->
    <CartDrawer />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import LayoutHeader from "@/components/layout/LayoutHeader.vue";
import LayoutFooter from "@/components/layout/LayoutFooter.vue";
import LayoutMobileNav from "@/components/layout/LayoutMobileNav.vue";
import AuthModal from "@/components/auth/AuthModal.vue";
import CartDrawer from "@/components/cart/CartDrawer.vue";

const route = useRoute();

// Hide navigation for specific routes like checkout
const hideNavigation = computed(() => {
  return route.meta.hideNavigation;
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
