<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="backdrop">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        @click="close"
        aria-hidden="true"
      />
    </Transition>

    <!-- Cart Drawer -->
    <Transition name="drawer">
      <div
        v-if="isOpen"
        class="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
        role="dialog"
        aria-labelledby="cart-drawer-title"
        aria-modal="true"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 id="cart-drawer-title" class="text-lg font-semibold text-slate-800">
            Shopping Cart ({{ cartStore.itemCount }})
          </h2>
          <button
            @click="close"
            class="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close cart"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Cart Content -->
        <div class="flex-1 overflow-y-auto">
          <!-- Loading State -->
          <div v-if="isLoading" class="p-6 text-center">
            <div class="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p class="text-slate-600">Loading cart...</p>
          </div>

          <!-- Empty Cart -->
          <CartEmpty v-else-if="cartStore.items.length === 0" :show-continue-shopping="false" />

          <!-- Cart Items -->
          <div v-else class="p-4 space-y-4">
            <TransitionGroup name="cart-item" tag="div" class="space-y-4">
              <CartItem
                v-for="item in cartStore.items"
                :key="item.id"
                :item="item"
                :compact="true"
                @update-quantity="cartStore.updateQuantity"
                @remove="cartStore.removeItem"
                @toggle-insurance="cartStore.toggleInsurance"
              />
            </TransitionGroup>

            <!-- Recently Removed Items -->
            <div v-if="cartStore.recentlyRemoved.length > 0" class="pt-4 border-t border-slate-200">
              <h3 class="text-sm font-medium text-slate-700 mb-3">Recently Removed</h3>
              <div class="space-y-2">
                <div
                  v-for="item in cartStore.recentlyRemoved.slice(0, 2)"
                  :key="`removed-${item.id}`"
                  class="flex items-center gap-3 p-2 bg-slate-50 rounded-lg"
                >
                  <img
                    :src="item.image"
                    :alt="item.name"
                    class="w-10 h-10 object-cover rounded"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-slate-700 truncate">{{ item.name }}</p>
                    <p class="text-xs text-slate-500">${{ item.price.toLocaleString() }}</p>
                  </div>
                  <button
                    @click="cartStore.restoreItem(item)"
                    class="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Restore
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer with Summary and Actions -->
        <div v-if="cartStore.items.length > 0" class="border-t border-slate-200 p-4 bg-slate-50">
          <!-- Quick Summary -->
          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
              <span class="text-slate-600">Subtotal</span>
              <span class="font-medium">${{ cartStore.subtotal.toLocaleString() }}</span>
            </div>
            <div v-if="cartStore.discountAmount > 0" class="flex justify-between text-sm text-emerald-600">
              <span>Discount</span>
              <span>-${{ cartStore.discountAmount.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between font-semibold text-slate-800 pt-2 border-t border-slate-300">
              <span>Total</span>
              <span>${{ (cartStore.subtotal - cartStore.discountAmount).toLocaleString() }}</span>
            </div>
            <p class="text-xs text-slate-500">
              Shipping, taxes, and insurance calculated at checkout
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <button
              @click="goToCheckout"
              :disabled="isProcessing"
              class="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <template v-if="isProcessing">
                <div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Processing...
              </template>
              <template v-else>
                <LockClosedIcon class="w-4 h-4" />
                Secure Checkout
              </template>
            </button>

            <button
              @click="viewFullCart"
              class="w-full bg-white hover:bg-slate-50 text-slate-700 font-medium py-2.5 px-4 rounded-lg border border-slate-300 transition-colors"
            >
              View Full Cart
            </button>

            <button
              @click="close"
              class="w-full text-slate-500 hover:text-slate-700 font-medium py-2 transition-colors"
            >
              Continue Shopping
            </button>
          </div>

          <!-- Trust Indicators -->
          <div class="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-300">
            <div class="flex items-center gap-1 text-xs text-slate-500">
              <ShieldCheckIcon class="w-4 h-4" />
              <span>SSL Secured</span>
            </div>
            <div class="flex items-center gap-1 text-xs text-slate-500">
              <TruckIcon class="w-4 h-4" />
              <span>Insured Shipping</span>
            </div>
            <div class="flex items-center gap-1 text-xs text-slate-500">
              <CheckBadgeIcon class="w-4 h-4" />
              <span>Authentic</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import CartEmpty from './CartEmpty.vue'
import CartItem from './CartItem.vue'
import {
  XMarkIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  TruckIcon,
  CheckBadgeIcon
} from '@heroicons/vue/24/outline'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'view-cart'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const router = useRouter()
const cartStore = useCartStore()

const isLoading = ref(false)
const isProcessing = ref(false)

// Close drawer when escape key is pressed
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
  }
}

const close = () => {
  emit('close')
}

const viewFullCart = () => {
  emit('view-cart')
  router.push('/cart')
}

const goToCheckout = async () => {
  isProcessing.value = true
  
  // Simulate validation/processing
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  try {
    close()
    await router.push('/checkout')
  } catch (error) {
    console.error('Navigation error:', error)
  } finally {
    isProcessing.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
  // Prevent body scroll when drawer is open
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Backdrop transitions */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

/* Drawer transitions */
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}

/* Cart item transitions */
.cart-item-enter-active,
.cart-item-leave-active {
  transition: all 0.3s ease;
}

.cart-item-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.cart-item-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.cart-item-leave-active {
  position: absolute;
  right: 0;
  left: 0;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>