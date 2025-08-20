<template>
  <div
    :class="[
      'bg-white border border-slate-200 rounded-lg p-4 transition-all duration-200',
      { 'shadow-md': !compact, 'shadow-sm': compact },
    ]"
  >
    <div :class="['flex gap-4', compact ? 'items-start' : 'items-center']">
      <!-- Product Image -->
      <div
        :class="[
          'flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden',
          compact ? 'w-16 h-16' : 'w-20 h-20 md:w-24 md:h-24',
        ]"
      >
        <img
          :src="item.image"
          :alt="item.name"
          class="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <!-- Product Details -->
      <div class="flex-1 min-w-0">
        <div
          class="flex flex-col md:flex-row md:items-start md:justify-between gap-2"
        >
          <!-- Product Info -->
          <div class="flex-1 min-w-0">
            <h3
              :class="[
                'font-semibold text-slate-800 truncate',
                compact ? 'text-sm' : 'text-base',
              ]"
            >
              {{ item.name }}
            </h3>

            <div
              :class="[
                'text-slate-600 space-y-1',
                compact ? 'text-xs' : 'text-sm',
              ]"
            >
              <p>{{ item.category }}</p>
              <div
                v-if="
                  !compact &&
                  (item.weight || item.cut || item.clarity || item.color)
                "
                class="flex flex-wrap gap-2 text-xs"
              >
                <span v-if="item.weight" class="bg-slate-100 px-2 py-1 rounded">
                  {{ item.weight }}ct
                </span>
                <span v-if="item.cut" class="bg-slate-100 px-2 py-1 rounded">
                  {{ item.cut }}
                </span>
                <span
                  v-if="item.clarity"
                  class="bg-slate-100 px-2 py-1 rounded"
                >
                  {{ item.clarity }}
                </span>
                <span v-if="item.color" class="bg-slate-100 px-2 py-1 rounded">
                  {{ item.color }}
                </span>
              </div>
              <div
                v-if="item.certification"
                class="flex items-center gap-1 text-emerald-600"
              >
                <CheckBadgeIcon class="w-3 h-3" />
                <span class="text-xs">{{ item.certification }} Certified</span>
              </div>
            </div>

            <!-- Price -->
            <div class="mt-2">
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'font-bold text-slate-800',
                    compact ? 'text-sm' : 'text-lg',
                  ]"
                >
                  ${{ item.price.toLocaleString() }}
                </span>
                <span
                  v-if="item.originalPrice && item.originalPrice > item.price"
                  :class="[
                    'line-through text-slate-500',
                    compact ? 'text-xs' : 'text-sm',
                  ]"
                >
                  ${{ item.originalPrice.toLocaleString() }}
                </span>
              </div>
            </div>
          </div>

          <!-- Quantity and Actions -->
          <div
            :class="[
              'flex items-center gap-3',
              compact ? 'flex-col items-end' : 'md:flex-col md:items-end',
            ]"
          >
            <!-- Quantity Controls -->
            <div
              class="flex items-center border border-slate-300 rounded-lg overflow-hidden"
            >
              <button
                @click="decreaseQuantity"
                :disabled="item.quantity <= 1"
                :class="[
                  'px-2 py-1 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
                  compact ? 'text-xs' : 'text-sm',
                ]"
                :aria-label="`Decrease quantity of ${item.name}`"
              >
                <MinusIcon :class="compact ? 'w-3 h-3' : 'w-4 h-4'" />
              </button>

              <input
                :value="item.quantity"
                @input="handleQuantityInput"
                @blur="handleQuantityBlur"
                :class="[
                  'text-center border-none outline-none bg-white',
                  compact ? 'w-8 text-xs py-1' : 'w-12 text-sm py-1',
                ]"
                type="number"
                min="1"
                max="10"
                :aria-label="`Quantity of ${item.name}`"
              />

              <button
                @click="increaseQuantity"
                :disabled="item.quantity >= 10"
                :class="[
                  'px-2 py-1 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
                  compact ? 'text-xs' : 'text-sm',
                ]"
                :aria-label="`Increase quantity of ${item.name}`"
              >
                <PlusIcon :class="compact ? 'w-3 h-3' : 'w-4 h-4'" />
              </button>
            </div>

            <!-- Remove Button -->
            <button
              @click="handleRemove"
              :class="[
                'text-slate-400 hover:text-red-500 transition-colors',
                compact ? 'p-1' : 'p-2',
              ]"
              :aria-label="`Remove ${item.name} from cart`"
            >
              <TrashIcon :class="compact ? 'w-4 h-4' : 'w-5 h-5'" />
            </button>
          </div>
        </div>

        <!-- Additional Services (Only show in full view) -->
        <div v-if="!compact" class="mt-4 pt-4 border-t border-slate-100">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <!-- Insurance Option -->
            <label class="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                :checked="item.insuranceSelected"
                @change="handleInsuranceToggle"
                class="mt-1 w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 focus:ring-2"
              />
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <ShieldCheckIcon
                    class="w-4 h-4 text-slate-500 group-hover:text-emerald-600 transition-colors"
                  />
                  <span class="text-sm font-medium text-slate-700"
                    >Insurance Coverage</span
                  >
                </div>
                <p class="text-xs text-slate-500 mt-1">
                  Protect your investment (+2% of item value)
                </p>
                <p class="text-xs font-medium text-emerald-600">
                  +${{ (item.price * item.quantity * 0.02).toFixed(2) }}
                </p>
              </div>
            </label>

            <!-- Appraisal Option -->
            <label class="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                :checked="item.appraisalRequested"
                @change="handleAppraisalToggle"
                class="mt-1 w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 focus:ring-2"
              />
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <DocumentCheckIcon
                    class="w-4 h-4 text-slate-500 group-hover:text-emerald-600 transition-colors"
                  />
                  <span class="text-sm font-medium text-slate-700"
                    >Professional Appraisal</span
                  >
                </div>
                <p class="text-xs text-slate-500 mt-1">
                  Certified gemologist evaluation
                </p>
                <p class="text-xs font-medium text-emerald-600">+$150.00</p>
              </div>
            </label>
          </div>

          <!-- Special Instructions (collapsed by default) -->
          <div v-if="showInstructions || item.specialInstructions" class="mt-3">
            <button
              v-if="!showInstructions"
              @click="showInstructions = true"
              class="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              <PlusIcon class="w-4 h-4" />
              Add special instructions
            </button>

            <div v-else class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">
                Special Instructions
              </label>
              <textarea
                v-model="localInstructions"
                @blur="updateInstructions"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                rows="2"
                placeholder="Any special handling or packaging requests..."
                maxlength="200"
              />
              <div class="flex justify-between items-center">
                <span class="text-xs text-slate-500">
                  {{ localInstructions.length }}/200 characters
                </span>
                <button
                  v-if="!item.specialInstructions"
                  @click="
                    showInstructions = false;
                    localInstructions = '';
                  "
                  class="text-xs text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Item Total -->
        <div v-if="!compact" class="mt-4 pt-3 border-t border-slate-200">
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-600">Item Total:</span>
            <div class="text-right">
              <div class="font-bold text-lg text-slate-800">
                ${{ itemTotal.toLocaleString() }}
              </div>
              <div v-if="additionalCosts > 0" class="text-xs text-slate-500">
                includes ${{ additionalCosts.toFixed(2) }} in services
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { CartItem } from "@/stores/cart";
import {
  MinusIcon,
  PlusIcon,
  TrashIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  DocumentCheckIcon,
} from "@heroicons/vue/24/outline";

interface Props {
  item: CartItem;
  compact?: boolean;
}

interface Emits {
  (e: "update-quantity", itemId: string, quantity: number): void;
  (e: "remove", itemId: string): void;
  (e: "toggle-insurance", itemId: string): void;
  (e: "toggle-appraisal", itemId: string): void;
  (e: "update-instructions", itemId: string, instructions: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
});

const emit = defineEmits<Emits>();

// Local state for special instructions
const showInstructions = ref(!!props.item.specialInstructions);
const localInstructions = ref(props.item.specialInstructions || "");

// Computed values
const itemTotal = computed(() => {
  const baseTotal = props.item.price * props.item.quantity;
  const insurance = props.item.insuranceSelected ? baseTotal * 0.02 : 0;
  const appraisal = props.item.appraisalRequested ? 150 : 0;
  return baseTotal + insurance + appraisal;
});

const additionalCosts = computed(() => {
  const insurance = props.item.insuranceSelected
    ? props.item.price * props.item.quantity * 0.02
    : 0;
  const appraisal = props.item.appraisalRequested ? 150 : 0;
  return insurance + appraisal;
});

// Event handlers
const decreaseQuantity = () => {
  if (props.item.quantity > 1) {
    emit("update-quantity", props.item.id, props.item.quantity - 1);
  }
};

const increaseQuantity = () => {
  if (props.item.quantity < 10) {
    emit("update-quantity", props.item.id, props.item.quantity + 1);
  }
};

const handleQuantityInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const value = parseInt(input.value);

  if (!isNaN(value) && value >= 1 && value <= 10) {
    emit("update-quantity", props.item.id, value);
  } else {
    // Reset to current quantity if invalid
    input.value = props.item.quantity.toString();
  }
};

const handleQuantityBlur = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const value = parseInt(input.value);

  if (isNaN(value) || value < 1) {
    input.value = "1";
    emit("update-quantity", props.item.id, 1);
  } else if (value > 10) {
    input.value = "10";
    emit("update-quantity", props.item.id, 10);
  }
};

const handleRemove = () => {
  emit("remove", props.item.id);
};

const handleInsuranceToggle = () => {
  emit("toggle-insurance", props.item.id);
};

const handleAppraisalToggle = () => {
  emit("toggle-appraisal", props.item.id);
};

const updateInstructions = () => {
  emit("update-instructions", props.item.id, localInstructions.value);
};

// Watch for external changes to instructions
watch(
  () => props.item.specialInstructions,
  (newVal) => {
    localInstructions.value = newVal || "";
  }
);
</script>

<style scoped>
/* Remove spinner buttons from number input */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Custom checkbox styling */
input[type="checkbox"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e");
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Focus styles for accessibility */
input:focus,
button:focus,
textarea:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

/* Hover effects */
.group:hover .group-hover\:text-emerald-600 {
  color: #059669;
}
</style>
