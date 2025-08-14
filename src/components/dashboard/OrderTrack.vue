<!-- OrderTracker.vue -->
<template>
  <div class="space-y-6">
    <!-- Progress Bar -->
    <div class="relative">
      <div class="flex items-center justify-between mb-8">
        <div
          v-for="(step, index) in trackingSteps"
          :key="step.id"
          class="flex flex-col items-center flex-1"
        >
          <div class="relative flex items-center justify-center w-12 h-12 mb-3">
            <!-- Progress line -->
            <div
              v-if="index < trackingSteps.length - 1"
              :class="[
                'absolute left-full top-1/2 transform -translate-y-1/2 h-0.5 w-full',
                step.completed ? 'bg-emerald-500' : 'bg-slate-200'
              ]"
            ></div>
            
            <!-- Step circle -->
            <div :class="[
              'w-12 h-12 rounded-full flex items-center justify-center border-2 bg-white z-10',
              step.completed 
                ? 'border-emerald-500 bg-emerald-50' 
                : step.current 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-200 bg-slate-50'
            ]">
              <component 
                :is="step.icon" 
                :class="[
                  'w-6 h-6',
                  step.completed 
                    ? 'text-emerald-600' 
                    : step.current 
                      ? 'text-blue-600' 
                      : 'text-slate-400'
                ]" 
              />
            </div>
          </div>
          <div class="text-center">
            <h4 :class="[
              'text-sm font-medium mb-1',
              step.completed || step.current ? 'text-slate-900' : 'text-slate-500'
            ]">
              {{ step.title }}
            </h4>
            <p v-if="step.date" class="text-xs text-slate-500">
              {{ formatDate(step.date) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tracking Details -->
    <div v-if="order.tracking" class="bg-slate-50 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-900">Tracking Number</p>
          <p class="text-lg font-mono text-slate-700">{{ order.tracking }}</p>
        </div>
        <button
          @click="openCarrierTracking"
          class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          Track with Carrier
        </button>
      </div>
      <div v-if="order.estimatedDelivery" class="mt-4 pt-4 border-t border-slate-200">
        <div class="flex items-center space-x-2 text-sm">
          <CalendarIcon class="w-4 h-4 text-slate-500" />
          <span class="text-slate-600">Estimated delivery:</span>
          <span class="font-medium text-slate-900">
            {{ formatDate(order.estimatedDelivery) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Delivery Updates -->
    <div v-if="deliveryUpdates.length" class="space-y-4">
      <h4 class="text-lg font-semibold text-slate-900">Delivery Updates</h4>
      <div class="space-y-3">
        <div
          v-for="update in deliveryUpdates"
          :key="update.id"
          class="flex items-start space-x-3 p-4 bg-white border border-slate-200 rounded-lg"
        >
          <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
          <div class="flex-1">
            <p class="text-sm font-medium text-slate-900">{{ update.status }}</p>
            <p class="text-sm text-slate-600">{{ update.location }}</p>
            <p class="text-xs text-slate-500 mt-1">{{ formatDateTime(update.timestamp) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  ShoppingCartIcon,
  PackageIcon,
  TruckIcon,
  HomeIcon,
  CalendarIcon
} from 'lucide-vue-next';
import type { Order } from '@/types';

interface Props {
  order: Order;
}

const props = defineProps<Props>();

interface TrackingStep {
  id: string;
  title: string;
  icon: any;
  completed: boolean;
  current: boolean;
  date?: string;
}

interface DeliveryUpdate {
  id: string;
  status: string;
  location: string;
  timestamp: string;
}

const trackingSteps = computed<TrackingStep[]>(() => {
  const steps = [
    {
      id: 'confirmed',
      title: 'Order Confirmed',
      icon: ShoppingCartIcon,
      completed: ['confirmed', 'shipped', 'delivered'].includes(props.order.status),
      current: props.order.status === 'pending',
      date: props.order.date,
    },
    {
      id: 'processing',
      title: 'Processing',
      icon: PackageIcon,
      completed: ['shipped', 'delivered'].includes(props.order.status),
      current: props.order.status === 'confirmed',
    },
    {
      id: 'shipped',
      title: 'Shipped',
      icon: TruckIcon,
      completed: props.order.status === 'delivered',
      current: props.order.status === 'shipped',
    },
    {
      id: 'delivered',
      title: 'Delivered',
      icon: HomeIcon,
      completed: props.order.status === 'delivered',
      current: false,
    },
  ];

  return steps;
});

// Mock delivery updates
const deliveryUpdates: DeliveryUpdate[] = [
  {
    id: '1',
    status: 'Package shipped from facility',
    location: 'New York Distribution Center',
    timestamp: '2024-01-20T14:30:00Z',
  },
  {
    id: '2',
    status: 'In transit to destination',
    location: 'Philadelphia, PA',
    timestamp: '2024-01-21T09:15:00Z',
  },
  {
    id: '3',
    status: 'Out for delivery',
    location: 'Local delivery facility',
    timestamp: '2024-01-22T08:00:00Z',
  },
];

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const openCarrierTracking = () => {
  if (props.order.tracking) {
    window.open(`https://www.fedex.com/fedextrack/?trknbr=${props.order.tracking}`, '_blank');
  }
};
</script>