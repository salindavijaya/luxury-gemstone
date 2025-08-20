<template>
  <div class="min-h-screen bg-slate-50 py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Success Header -->
      <div class="text-center mb-8">
        <div
          class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-4"
        >
          <CheckCircleIcon class="h-8 w-8 text-emerald-600" />
        </div>
        <h1 class="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
        <p class="text-slate-600">
          Thank you for your purchase. Your order has been received and is being
          processed.
        </p>
      </div>

      <!-- Order Details Card -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div class="border-b border-slate-200 pb-4 mb-4">
          <h2 class="text-lg font-semibold text-slate-900 mb-2">
            Order Details
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-slate-600">Order Number:</span>
              <span class="font-medium text-slate-900 ml-2"
                >#{{ order.orderNumber }}</span
              >
            </div>
            <div>
              <span class="text-slate-600">Order Date:</span>
              <span class="font-medium text-slate-900 ml-2">{{
                formatDate(order.orderDate)
              }}</span>
            </div>
            <div>
              <span class="text-slate-600">Total Amount:</span>
              <span class="font-medium text-emerald-600 ml-2"
                >${{ order.total.toFixed(2) }}</span
              >
            </div>
            <div>
              <span class="text-slate-600">Payment Method:</span>
              <span class="font-medium text-slate-900 ml-2">{{
                order.paymentMethod
              }}</span>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="mb-4">
          <h3 class="font-semibold text-slate-900 mb-3">Items Ordered</h3>
          <div class="space-y-3">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex items-center space-x-4 p-3 border border-slate-200 rounded-lg"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="h-16 w-16 object-cover rounded-lg"
                loading="lazy"
              />
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-slate-900 truncate">
                  {{ item.name }}
                </h4>
                <p class="text-sm text-slate-600">{{ item.specifications }}</p>
                <div class="flex items-center justify-between mt-1">
                  <span class="text-sm text-slate-600"
                    >Qty: {{ item.quantity }}</span
                  >
                  <span class="font-medium text-slate-900"
                    >${{ item.price.toFixed(2) }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Shipping Information -->
        <div class="border-t border-slate-200 pt-4">
          <h3 class="font-semibold text-slate-900 mb-3">
            Shipping Information
          </h3>
          <div class="bg-slate-50 rounded-lg p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 class="font-medium text-slate-900 mb-2">
                  Shipping Address
                </h4>
                <div class="text-slate-600 space-y-1">
                  <div>{{ order.shippingAddress.fullName }}</div>
                  <div>{{ order.shippingAddress.street }}</div>
                  <div>
                    {{ order.shippingAddress.city }},
                    {{ order.shippingAddress.state }}
                    {{ order.shippingAddress.zipCode }}
                  </div>
                  <div>{{ order.shippingAddress.country }}</div>
                </div>
              </div>
              <div>
                <h4 class="font-medium text-slate-900 mb-2">
                  Delivery Details
                </h4>
                <div class="text-slate-600 space-y-1">
                  <div>{{ order.shippingMethod }}</div>
                  <div>
                    Estimated Delivery:
                    {{ formatDate(order.estimatedDelivery) }}
                  </div>
                  <div>Tracking: Available after shipment</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- What's Next Card -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 class="text-lg font-semibold text-slate-900 mb-4">
          What Happens Next?
        </h2>
        <div class="space-y-4">
          <div class="flex items-start space-x-3">
            <div
              class="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center"
            >
              <span class="text-emerald-600 text-sm font-medium">1</span>
            </div>
            <div>
              <h3 class="font-medium text-slate-900">Order Confirmation</h3>
              <p class="text-sm text-slate-600">
                You'll receive an email confirmation shortly with your order
                details.
              </p>
            </div>
          </div>

          <div class="flex items-start space-x-3">
            <div
              class="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center"
            >
              <span class="text-slate-600 text-sm font-medium">2</span>
            </div>
            <div>
              <h3 class="font-medium text-slate-900">
                Processing & Authentication
              </h3>
              <p class="text-sm text-slate-600">
                Our experts will verify and prepare your gemstones with proper
                certification.
              </p>
            </div>
          </div>

          <div class="flex items-start space-x-3">
            <div
              class="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center"
            >
              <span class="text-slate-600 text-sm font-medium">3</span>
            </div>
            <div>
              <h3 class="font-medium text-slate-900">Secure Shipping</h3>
              <p class="text-sm text-slate-600">
                Your items will be shipped with full insurance and tracking
                information.
              </p>
            </div>
          </div>

          <div class="flex items-start space-x-3">
            <div
              class="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center"
            >
              <span class="text-slate-600 text-sm font-medium">4</span>
            </div>
            <div>
              <h3 class="font-medium text-slate-900">Delivery</h3>
              <p class="text-sm text-slate-600">
                Receive your luxury gemstones with authentication certificates.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link
          to="/account/orders"
          class="inline-flex items-center justify-center px-6 py-3 border border-emerald-600 text-emerald-600 bg-white rounded-lg hover:bg-emerald-50 transition-colors duration-200 font-medium"
        >
          <ClipboardDocumentListIcon class="h-5 w-5 mr-2" />
          View Order Status
        </router-link>

        <router-link
          to="/products"
          class="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
        >
          <ArrowLeftIcon class="h-5 w-5 mr-2" />
          Continue Shopping
        </router-link>
      </div>

      <!-- Support Information -->
      <div class="text-center mt-8 p-4 bg-amber-50 rounded-lg">
        <h3 class="font-medium text-amber-800 mb-2">Need Help?</h3>
        <p class="text-sm text-amber-700 mb-3">
          Our customer service team is here to assist you with any questions
          about your order.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center text-sm">
          <a
            href="tel:+1-800-GEM-SHOP"
            class="text-amber-800 hover:text-amber-900 font-medium"
          >
            📞 1-800-GEM-SHOP
          </a>
          <a
            href="mailto:support@luxurygemstones.com"
            class="text-amber-800 hover:text-amber-900 font-medium"
          >
            ✉️ support@luxurygemstones.com
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ArrowLeftIcon,
} from "@heroicons/vue/24/outline";

// Types
interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  specifications: string;
}

interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Order {
  orderNumber: string;
  orderDate: Date;
  total: number;
  paymentMethod: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  estimatedDelivery: Date;
}

// Router
const router = useRouter();
const route = useRoute();

// State
const order = ref<Order>({
  orderNumber: "GEM-2024-001234",
  orderDate: new Date(),
  total: 2849.99,
  paymentMethod: "Credit Card ending in ****4567",
  items: [
    {
      id: "1",
      name: "Natural Blue Sapphire",
      image: "/api/placeholder/400/400",
      price: 1899.99,
      quantity: 1,
      specifications: "2.45ct, Ceylon Origin, Heated",
    },
    {
      id: "2",
      name: "Diamond Accent Set",
      image: "/api/placeholder/400/400",
      price: 949.99,
      quantity: 1,
      specifications: "0.75ctw, VS1 Clarity, G Color",
    },
  ],
  shippingAddress: {
    fullName: "John Smith",
    street: "123 Luxury Lane",
    city: "Beverly Hills",
    state: "CA",
    zipCode: "90210",
    country: "United States",
  },
  shippingMethod: "Express Insured Shipping",
  estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
});

// Methods
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

// Lifecycle
onMounted(() => {
  // In a real app, you would fetch the order details based on the order ID from the route
  const orderNumber = route.params.orderNumber || route.query.orderNumber;
  if (orderNumber) {
    order.value.orderNumber = orderNumber as string;
  }

  // Scroll to top
  window.scrollTo(0, 0);

  // Clear any checkout state since order is complete
  // clearCheckoutState()
});
</script>

<style scoped>
/* Additional animations for success state */
@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.bg-white {
  animation: fadeInScale 0.5s ease-out;
}

/* Responsive image styling */
@media (max-width: 640px) {
  .flex-1 {
    min-width: 0;
  }
}
</style>
