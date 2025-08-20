<template>
  <div
    class="flex items-center border border-slate-300 rounded-md overflow-hidden"
  >
    <button
      @click="decrement"
      :disabled="modelValue <= 1"
      class="px-3 py-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      aria-label="Decrease quantity"
    >
      <MinusIcon class="w-4 h-4 text-slate-600" />
    </button>

    <input
      :value="modelValue"
      @input="handleInput"
      @blur="validateInput"
      type="number"
      :min="1"
      :max="max"
      class="w-16 px-2 py-2 text-center border-0 focus:ring-0 focus:outline-none"
      aria-label="Quantity"
    />

    <button
      @click="increment"
      :disabled="modelValue >= max"
      class="px-3 py-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      aria-label="Increase quantity"
    >
      <PlusIcon class="w-4 h-4 text-slate-600" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { MinusIcon, PlusIcon } from "@heroicons/vue/24/outline";

interface Props {
  modelValue: number;
  max?: number;
  min?: number;
}

const props = withDefaults(defineProps<Props>(), {
  max: 99,
  min: 1,
});

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const increment = () => {
  if (props.modelValue < props.max) {
    emit("update:modelValue", props.modelValue + 1);
  }
};

const decrement = () => {
  if (props.modelValue > props.min) {
    emit("update:modelValue", props.modelValue - 1);
  }
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value) || props.min;
  emit("update:modelValue", Math.max(props.min, Math.min(props.max, value)));
};

const validateInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value) || props.min;
  const validValue = Math.max(props.min, Math.min(props.max, value));

  if (value !== validValue) {
    target.value = validValue.toString();
    emit("update:modelValue", validValue);
  }
};
</script>
