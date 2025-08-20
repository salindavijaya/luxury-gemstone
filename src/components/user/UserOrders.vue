<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { Order, OrderStatus } from "@/types/checkout";
import type { ErrorMessages } from "@/types/common";
import { useCartStore } from "@/stores/cart";

// Methods
const copyTrackingNumber = async (trackingNumber: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(trackingNumber);
    // In a real app, you would show a toast notification
    console.log("Tracking number copied to clipboard");
  } catch (error) {
    console.error("Failed to copy tracking number:", error);
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = trackingNumber;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
};

const showTrackingModal = (order: Order): void => {
  if (order.details.shipping.tracking) {
    // In a real app, you might open a tracking page or modal
    console.log("Tracking order:", order.details.shipping.tracking);
    alert(`Tracking number: ${order.details.shipping.tracking}`);
  }
};

// State
const orders = ref<Order[]>([]);
const selectedStatus = ref<OrderStatus | "">("");
const selectedDateRange = ref<string>("");
const expandedOrders = ref<Set<string>>(new Set());
const isLoading = ref(true);
const isCancelling = ref(false);
const showCancelConfirm = ref(false);
const orderToCancel = ref<Order | null>(null);
const errors = ref<ErrorMessages>({});
const cancellationReason = ref<string>("");
const cancellationReasonText = ref<string>("");

// Store
const cartStore = useCartStore();
const router = useRouter();

// Computed
const filteredOrders = computed(() => {
  let filtered = [...orders.value];

  // Filter by status
  if (selectedStatus.value) {
    filtered = filtered.filter(
      (order) => order.status === selectedStatus.value
    );
  }

  // Filter by date range
  if (selectedDateRange.value) {
    const days = parseInt(selectedDateRange.value);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    filtered = filtered.filter((order) => new Date(order.createdAt) >= cutoff);
  }

  return filtered;
});

// Methods
const fetchOrders = async () => {
  isLoading.value = true;
  try {
    // This should be replaced with an actual API call
    orders.value = []; // Mock data for now
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    errors.value = { general: ["Failed to load orders"] };
  } finally {
    isLoading.value = false;
  }
};

const clearFilters = () => {
  selectedStatus.value = "";
  selectedDateRange.value = "";
};

const filterOrders = () => {
  // The filtering is handled by the computed property
};

const toggleOrderDetails = (orderId: string) => {
  if (expandedOrders.value.has(orderId)) {
    expandedOrders.value.delete(orderId);
  } else {
    expandedOrders.value.add(orderId);
  }
};

const getStatusClasses = (status: OrderStatus): string => {
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

  switch (status) {
    case "pending":
      return `${baseClasses} bg-amber-100 text-amber-800`;
    case "processing":
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case "shipped":
      return `${baseClasses} bg-purple-100 text-purple-800`;
    case "delivered":
      return `${baseClasses} bg-emerald-100 text-emerald-800`;
    case "cancelled":
      return `${baseClasses} bg-red-100 text-red-800`;
    case "refunded":
      return `${baseClasses} bg-slate-100 text-slate-800`;
    default:
      return `${baseClasses} bg-slate-100 text-slate-800`;
  }
};

const getStatusLabel = (status: OrderStatus): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const canReorder = (status: OrderStatus): boolean => {
  return (
    status === "delivered" || status === "cancelled" || status === "refunded"
  );
};

const canTrack = (status: OrderStatus): boolean => {
  return status === "shipped";
};

const canCancel = (status: OrderStatus): boolean => {
  return status === "pending" || status === "confirmed";
};

const reorderItems = async (order: Order) => {
  try {
    for (const item of order.items) {
      await cartStore.addItem({ ...item });
    }
    router.push("/cart");
  } catch (error) {
    console.error("Failed to reorder items:", error);
    errors.value = { reorder: ["Failed to add items to cart"] };
  }
};

const showCancelModal = (order: Order) => {
  orderToCancel.value = order;
  showCancelConfirm.value = true;
};

const confirmCancelOrder = async () => {
  if (!orderToCancel.value) return;

  isCancelling.value = true;
  try {
    // This should be replaced with an actual API call
    // await api.orders.cancel(orderToCancel.value.id)
    showCancelConfirm.value = false;
    orderToCancel.value = null;
  } catch (error) {
    console.error("Failed to cancel order:", error);
    errors.value = { cancel: ["Failed to cancel order"] };
  } finally {
    isCancelling.value = false;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Initialize component
onMounted(() => {
  fetchOrders();
});
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg">
    <!-- Orders Header -->
    <div class="p-6 border-b border-slate-200">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <h2 class="text-2xl font-semibold text-slate-800">Order History</h2>

        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Status Filter -->
          <select
            v-model="selectedStatus"
            @change="filterOrders"
            class="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            aria-label="Filter orders by status"
          >
            <option value="">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>

          <!-- Date Range Filter -->
          <select
            v-model="selectedDateRange"
            @change="filterOrders"
            class="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
            aria-label="Filter orders by date range"
          >
            <option value="">All Time</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 3 Months</option>
            <option value="365">Last Year</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="p-8 text-center">
      <div class="inline-flex items-center">
        <svg
          class="animate-spin -ml-1 mr-3 h-8 w-8 text-emerald-600"
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
        <span class="text-slate-600">Loading orders...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredOrders.length === 0" class="p-8 text-center">
      <div class="max-w-md mx-auto">
        <svg
          class="mx-auto h-24 w-24 text-slate-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h3 class="text-lg font-medium text-slate-800 mb-2">No Orders Found</h3>
        <p class="text-slate-600 mb-6">
          {{
            selectedStatus || selectedDateRange
              ? "No orders match your current filters."
              : "You haven't placed any orders yet."
          }}
        </p>
        <button
          v-if="selectedStatus || selectedDateRange"
          @click="clearFilters"
          class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Clear Filters
        </button>
        <router-link
          v-else
          to="/products"
          class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Start Shopping
        </router-link>
      </div>
    </div>

    <!-- Orders List -->
    <div v-else class="divide-y divide-slate-200">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="p-6 hover:bg-slate-50 transition-colors"
      >
        <!-- Order Header -->
        <div
          class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4"
        >
          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <div>
              <h3 class="font-semibold text-slate-800">
                Order #{{ order.orderNumber }}
              </h3>
              <p class="text-sm text-slate-600">
                Placed on {{ formatDate(order.createdAt) }}
              </p>
            </div>

            <!-- Order Status -->
            <span
              :class="getStatusClasses(order.status)"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit"
            >
              {{ getStatusLabel(order.status) }}
            </span>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <div class="text-right">
              <p class="font-semibold text-slate-800">
                {{ order.currency }} {{ order.total.toFixed(2) }}
              </p>
              <p class="text-sm text-slate-600">
                {{ order.items.length }} item{{
                  order.items.length !== 1 ? "s" : ""
                }}
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2">
              <button
                @click="toggleOrderDetails(order.id)"
                class="px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                :aria-label="`${expandedOrders.has(order.id) ? 'Hide' : 'Show'} details for order ${order.orderNumber}`"
              >
                {{
                  expandedOrders.has(order.id) ? "Hide Details" : "View Details"
                }}
              </button>

              <button
                v-if="canReorder(order.status)"
                @click="reorderItems(order)"
                class="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                :aria-label="`Reorder items from order ${order.orderNumber}`"
              >
                Reorder
              </button>

              <button
                v-if="canTrack(order.status)"
                @click="showTrackingModal(order)"
                class="px-3 py-1.5 text-sm bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                :aria-label="`Track order ${order.orderNumber}`"
              >
                Track
              </button>

              <button
                v-if="canCancel(order.status)"
                @click="showCancelModal(order)"
                class="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                :aria-label="`Cancel order ${order.orderNumber}`"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <!-- Order Details (Expandable) -->
        <div
          v-if="expandedOrders.has(order.id)"
          class="border-t pt-4 mt-4 space-y-4"
        >
          <!-- Shipping Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Shipping Address -->
            <div>
              <h4 class="font-medium text-slate-800 mb-2">Shipping Address</h4>
              <div class="text-sm text-slate-600 space-y-1">
                <p>
                  {{
                    `${order.details.shipping.address.firstName} ${order.details.shipping.address.lastName}`
                  }}
                </p>
                <p>{{ order.details.shipping.address.address1 }}</p>
                <p v-if="order.details.shipping.address.address2">
                  {{ order.details.shipping.address.address2 }}
                </p>
                <p>
                  {{ order.details.shipping.address.city }},
                  {{ order.details.shipping.address.state }}
                  {{ order.details.shipping.address.postalCode }}
                </p>
                <p>{{ order.details.shipping.address.country }}</p>
              </div>
            </div>

            <!-- Payment Method -->
            <div>
              <h4 class="font-medium text-slate-800 mb-2">Payment Method</h4>
              <div class="text-sm text-slate-600">
                <p>{{ order.details.payment.method.type }}</p>
                <p v-if="order.details.payment.method.details.lastFourDigits">
                  **** **** ****
                  {{ order.details.payment.method.details.lastFourDigits }}
                </p>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div>
            <h4 class="font-medium text-slate-800 mb-3">Order Items</h4>
            <div class="space-y-3">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex items-center gap-4 p-3 bg-slate-50 rounded-lg"
              >
                <!-- Product Image -->
                <div class="flex-shrink-0">
                  <img
                    :src="item.product.images[0]?.url || '/placeholder.jpg'"
                    :alt="item.product.name"
                    class="w-16 h-16 object-cover rounded-md"
                  />
                </div>

                <!-- Product Details -->
                <div class="flex-1 min-w-0">
                  <h5 class="font-medium text-slate-800 truncate">
                    {{ item.product.name }}
                  </h5>
                  <p class="text-sm text-slate-600">
                    SKU: {{ item.product.sku }}
                  </p>
                  <div class="flex items-center gap-4 mt-1">
                    <span class="text-sm text-slate-600">
                      Qty: {{ item.quantity }}
                    </span>
                    <span class="text-sm font-medium text-slate-800">
                      {{ order.currency }}
                      {{ (item.salePrice || item.product.price).toFixed(2) }}
                      each
                    </span>
                  </div>
                </div>

                <!-- Item Total -->
                <div class="text-right">
                  <p class="font-medium text-slate-800">
                    {{ order.currency }}
                    {{
                      (
                        (item.salePrice || item.product.price) * item.quantity
                      ).toFixed(2)
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="border-t pt-4">
            <div class="max-w-sm ml-auto space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-slate-600">Subtotal:</span>
                <span class="text-slate-800"
                  >{{ order.currency }}
                  {{
                    order.items
                      .reduce(
                        (sum, item) => sum + item.product.price * item.quantity,
                        0
                      )
                      .toFixed(2)
                  }}</span
                >
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-600">Shipping:</span>
                <span class="text-slate-800">
                  {{
                    order.details.shipping.cost === 0
                      ? "Free"
                      : `${order.currency} ${order.details.shipping.cost.toFixed(2)}`
                  }}
                </span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-600">Tax:</span>
                <span class="text-slate-800"
                  >{{ order.currency }} {{ order.tax.toFixed(2) }}</span
                >
              </div>
              <div
                v-if="order.discount && order.discount > 0"
                class="flex justify-between text-sm"
              >
                <span class="text-slate-600">Discount:</span>
                <span class="text-emerald-600"
                  >-{{ order.currency }} {{ order.discount.toFixed(2) }}</span
                >
              </div>
              <div
                class="flex justify-between font-semibold text-base border-t pt-2"
              >
                <span class="text-slate-800">Total:</span>
                <span class="text-slate-800"
                  >{{ order.currency }} {{ order.total.toFixed(2) }}</span
                >
              </div>
            </div>
          </div>

          <!-- Tracking Information -->
          <div v-if="order.details.shipping.tracking" class="border-t pt-4">
            <h4 class="font-medium text-slate-800 mb-2">
              Tracking Information
            </h4>
            <div class="flex items-center gap-4">
              <span class="text-sm text-slate-600">Tracking Number:</span>
              <code class="px-2 py-1 bg-slate-100 rounded text-sm font-mono">
                {{ order.details.shipping.tracking }}
              </code>
              <button
                @click="copyTrackingNumber(order.details.shipping.tracking)"
                class="text-sm text-emerald-600 hover:text-emerald-700 focus:outline-none focus:underline"
                :aria-label="`Copy tracking number ${order.details.shipping.tracking}`"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel Order Modal -->
    <div
      v-if="showCancelConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="showCancelConfirm = false"
    >
      <div
        class="bg-white rounded-lg max-w-md w-full p-6"
        role="dialog"
        aria-labelledby="cancel-modal-title"
        aria-modal="true"
      >
        <h3
          id="cancel-modal-title"
          class="text-lg font-semibold text-slate-800 mb-4"
        >
          Cancel Order
        </h3>
        <p class="text-slate-600 mb-6">
          Are you sure you want to cancel order #{{
            orderToCancel?.orderNumber
          }}? This action cannot be undone.
        </p>

        <!-- Cancellation Reason -->
        <div class="mb-6">
          <label
            for="cancellationReason"
            class="block text-sm font-medium text-slate-700 mb-2"
          >
            Reason for cancellation (optional)
          </label>
          <select
            id="cancellationReason"
            v-model="cancellationReason"
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Select a reason</option>
            <option value="changed-mind">Changed my mind</option>
            <option value="found-better-price">Found a better price</option>
            <option value="ordered-by-mistake">Ordered by mistake</option>
            <option value="delivery-too-long">Delivery taking too long</option>
            <option value="other">Other</option>
          </select>

          <textarea
            v-if="cancellationReason === 'other'"
            v-model="cancellationReasonText"
            placeholder="Please specify the reason..."
            class="w-full mt-2 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            rows="3"
          ></textarea>
        </div>

        <div class="flex gap-3">
          <button
            @click="confirmCancelOrder"
            :disabled="isCancelling"
            class="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isCancelling ? "Cancelling..." : "Cancel Order" }}
          </button>
          <button
            @click="showCancelConfirm = false"
            :disabled="isCancelling"
            class="flex-1 bg-slate-200 text-slate-800 py-2 px-4 rounded-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Keep Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, defineComponent } from "vue";
import { useRouter } from "vue-router";

import type { Order, OrderStatus } from "@/types/checkout";
import type { Address } from "@/types/checkout";
import type { PaymentMethod } from "@/types/checkout";
import type { CartItem } from "@/types/cart";

export default defineComponent({
  name: "UserOrders",
  setup() {

// Router
const router = useRouter();

// Reactive state and refs
const isLoading = ref(true);
const orders = ref<Order[]>([]);
const expandedOrders = ref(new Set<string>());
const selectedStatus = ref("");
const selectedDateRange = ref("");

// Cancel order modal state
const showCancelConfirm = ref(false);
const orderToCancel = ref<Order | null>(null);
const isCancelling = ref(false);
const cancellationReason = ref("");
const cancellationReasonText = ref("");

// Methods to handle tracking and copying
const copyTrackingNumber = async (trackingNumber: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(trackingNumber);
    // In a real app, you would show a toast notification
    console.log("Tracking number copied to clipboard");
  } catch (error) {
    console.error("Failed to copy tracking number:", error);
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = trackingNumber;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
};

const showTrackingModal = (order: Order): void => {
  if (order.details.shipping.tracking) {
    // In a real app, you might open a tracking page or modal
    console.log("Tracking order:", order.details.shipping.tracking);
    alert(`Tracking number: ${order.details.shipping.tracking}`);
  }
};



// Computed properties
const filteredOrders = computed(() => {
  let filtered = [...orders.value];

  // Filter by status
  if (selectedStatus.value) {
    filtered = filtered.filter(
      (order) => order.status === selectedStatus.value
    );
  }

  // Filter by date range
  if (selectedDateRange.value) {
    const days = parseInt(selectedDateRange.value);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    filtered = filtered.filter(
      (order) => new Date(order.createdAt) >= cutoffDate
    );
  }

  // Sort by creation date (newest first)
  filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return filtered;
});

// Methods
const fetchOrders = async (): Promise<void> => {
  isLoading.value = true;

  try {
    // Mock API call - replace with actual API integration
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock order data
    orders.value = [
      {
        id: "1",
        orderNumber: "GEM-2024-001",
        status: "delivered",
        createdAt: "2024-01-15T10:30:00Z",
        items: [
          {
            id: "item1",
            product: {
              id: "prod1",
              name: "Emerald Cut Diamond Ring",
              sku: "DR-EM-001",
              images: [{ url: "/api/placeholder/80/80" }],
              price: 2499.99,
            },
            quantity: 1,
            price: 2499.99,
          },
          {
            id: "item2",
            product: {
              id: "prod2",
              name: "Sapphire Stud Earrings",
              sku: "SE-SA-002",
              images: [{ url: "/api/placeholder/80/80" }],
              price: 899.99,
            },
            quantity: 1,
            price: 899.99,
          },
        ],
        currency: "$",
        tax: 271.99,
        discount: 100.0,
        total: 3571.97,
        details: {
          shipping: {
            address: {
              firstName: "John",
              lastName: "Doe",
              address1: "123 Main Street",
              address2: "Apt 4B",
              city: "New York",
              state: "NY",
              postalCode: "10001",
              country: "United States",
            },
            method: "Standard",
            cost: 0,
            tracking: "TRK-123456789",
            estimatedDelivery: "2024-01-20T00:00:00Z",
          },
          payment: {
            method: {
              type: "Credit Card",
              details: {
                lastFourDigits: "4242",
                cardType: "Visa",
                expiryMonth: 12,
                expiryYear: 2024,
              },
            },
            amount: 3571.97,
            currency: "$",
            status: "paid",
          },
        },
      },
      {
        id: "2",
        orderNumber: "GEM-2024-002",
        status: "processing",
        createdAt: "2024-01-20T14:15:00Z",
        items: [
          {
            id: "item3",
            product: {
              id: "prod3",
              name: "Ruby Tennis Bracelet",
              sku: "BR-RU-003",
              images: [{ url: "/api/placeholder/80/80" }],
              price: 1299.99,
            },
            quantity: 1,
            price: 1299.99,
          },
        ],
        currency: "$",
        tax: 104.0,
        total: 1428.99,
        details: {
          shipping: {
            address: {
              firstName: "Jane",
              lastName: "Smith",
              address1: "456 Oak Avenue",
              city: "Los Angeles",
              state: "CA",
              postalCode: "90210",
              country: "United States",
            },
            method: "Express",
            cost: 25.0,
            status: "pending",
          },
          payment: {
            method: {
              type: "PayPal",
              details: {
                email: "jane.smith@email.com",
              },
            },
            amount: 1428.99,
            currency: "$",
            status: "paid",
          },
        },
      },
    ];
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  } finally {
    isLoading.value = false;
  }
};

const toggleOrderDetails = (orderId: string): void => {
  if (expandedOrders.value.has(orderId)) {
    expandedOrders.value.delete(orderId);
  } else {
    expandedOrders.value.add(orderId);
  }
};

const getStatusClasses = (status: Order["status"]): string => {
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

  switch (status) {
    case "pending":
      return `${baseClasses} bg-amber-100 text-amber-800`;
    case "processing":
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case "shipped":
      return `${baseClasses} bg-purple-100 text-purple-800`;
    case "delivered":
      return `${baseClasses} bg-emerald-100 text-emerald-800`;
    case "cancelled":
      return `${baseClasses} bg-red-100 text-red-800`;
    case "returned":
      return `${baseClasses} bg-slate-100 text-slate-800`;
    default:
      return `${baseClasses} bg-slate-100 text-slate-800`;
  }
};

const getStatusLabel = (status: Order["status"]): string => {
  switch (status) {
    case "pending":
      return "Pending";
    case "processing":
      return "Processing";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    case "returned":
      return "Returned";
    default:
      return "Unknown";
  }
};

const canReorder = (status: Order["status"]): boolean => {
  return ["delivered", "cancelled"].includes(status);
};

const canTrack = (status: Order["status"]): boolean => {
  return ["shipped"].includes(status);
};

const canCancel = (status: Order["status"]): boolean => {
  return ["pending", "processing"].includes(status);
};

const filterOrders = (): void => {
  // Filtering is handled by computed property
  // This method exists for explicit filter triggers
};

const clearFilters = (): void => {
  selectedStatus.value = "";
  selectedDateRange.value = "";
};

const reorderItems = async (order: Order): Promise<void> => {
  try {
    // Add items to cart using the new structure
    console.log("Reordering items from order:", order.orderNumber);
    console.log(
      "Items:",
      order.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }))
    );

    // In a real app, you would add items to cart and redirect
    // For now, just show a success message
    alert(
      `Items from order ${order.orderNumber} have been added to your cart!`
    );

    // Redirect to cart
    router.push("/cart");
  } catch (error) {
    console.error("Failed to reorder items:", error);
    alert("Failed to add items to cart. Please try again.");
  }
};

const copyTrackingNumber = async (trackingNumber: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(trackingNumber);
    // In a real app, you would show a toast notification
    console.log("Tracking number copied to clipboard");
  } catch (error) {
    console.error("Failed to copy tracking number:", error);
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = trackingNumber;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
};

const showTrackingModal = (order: Order): void => {
  if (order.details.shipping.tracking) {
    // In a real app, you might open a tracking page or modal
    console.log("Tracking order:", order.details.shipping.tracking);
    alert(`Tracking number: ${order.details.shipping.tracking}`);
  }
};

const showCancelModal = (order: Order): void => {
  orderToCancel.value = order;
  showCancelOrderModal.value = true;
  cancellationReason.value = "";
  cancellationReasonText.value = "";
};

const closeCancelModal = (): void => {
  showCancelOrderModal.value = false;
  orderToCancel.value = null;
  cancellationReason.value = "";
  cancellationReasonText.value = "";
};

const confirmCancelOrder = async (): Promise<void> => {
  if (!orderToCancel.value) return;

  isCancelling.value = true;

  try {
    // Mock API call to cancel order
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update order status in local state
    const orderIndex = orders.value.findIndex(
      (o) => o.id === orderToCancel.value!.id
    );
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = "cancelled";
    }

    console.log("Order cancelled:", orderToCancel.value.orderNumber, {
      reason: cancellationReason.value,
      reasonText: cancellationReasonText.value,
    });

    // Close modal and show success message
    closeCancelModal();
    alert(
      `Order ${orderToCancel.value.orderNumber} has been cancelled successfully.`
    );
  } catch (error) {
    console.error("Failed to cancel order:", error);
    alert("Failed to cancel order. Please try again.");
  } finally {
    isCancelling.value = false;
  }
};

const copyTrackingNumber = async (trackingNumber: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(trackingNumber);
    // In a real app, you would show a toast notification
    console.log("Tracking number copied to clipboard");
  } catch (error) {
    console.error("Failed to copy tracking number:", error);
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = trackingNumber;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Initialize component
onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
/* Component-specific styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar for order details */
.order-details {
  max-height: 400px;
  overflow-y: auto;
}

.order-details::-webkit-scrollbar {
  width: 6px;
}

.order-details::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.order-details::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.order-details::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
