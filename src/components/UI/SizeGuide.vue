<template>
  <template>
    <div
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <!-- Background overlay -->
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="$emit('close')"
        ></div>

        <!-- Modal panel -->
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
        >
          <!-- Header -->
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div
                  class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 sm:mx-0 sm:h-10 sm:w-10"
                >
                  <RulerIcon class="h-6 w-6 text-emerald-600" />
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    class="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    Gemstone Size Guide
                  </h3>
                  <p class="text-sm text-gray-500">
                    Compare {{ product.name }} with common reference objects
                  </p>
                </div>
              </div>
              <button
                @click="$emit('close')"
                class="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <XMarkIcon class="h-6 w-6" />
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="bg-gray-50 px-4 py-5 sm:p-6">
            <!-- Size Comparison Visual -->
            <div class="mb-8">
              <h4 class="text-lg font-medium text-gray-900 mb-4">
                Visual Size Comparison
              </h4>
              <div
                class="bg-white rounded-lg p-8 flex items-center justify-center space-x-12"
              >
                <!-- Penny -->
                <div class="text-center">
                  <div
                    class="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center mb-2 border-2 border-amber-600"
                  >
                    <span class="text-xs font-bold text-amber-900">1¢</span>
                  </div>
                  <p class="text-sm font-medium text-gray-700">Penny</p>
                  <p class="text-xs text-gray-500">19.05mm</p>
                </div>

                <!-- Product -->
                <div class="text-center">
                  <div
                    class="bg-emerald-600 rounded-full flex items-center justify-center mb-2 border-2 border-emerald-700"
                    :style="{
                      width: `${getVisualSize()}px`,
                      height: `${getVisualSize()}px`,
                    }"
                  >
                    <span class="text-xs font-bold text-white"
                      >{{ product.carat }}ct</span
                    >
                  </div>
                  <p class="text-sm font-medium text-gray-700">
                    {{ product.name }}
                  </p>
                  <p class="text-xs text-gray-500">
                    ~{{ getApproximateSize() }}mm
                  </p>
                </div>

                <!-- Dime -->
                <div class="text-center">
                  <div
                    class="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center mb-2 border-2 border-gray-600"
                  >
                    <span class="text-xs font-bold text-gray-900">10¢</span>
                  </div>
                  <p class="text-sm font-medium text-gray-700">Dime</p>
                  <p class="text-xs text-gray-500">17.91mm</p>
                </div>

                <!-- Quarter -->
                <div class="text-center">
                  <div
                    class="w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center mb-2 border-2 border-gray-600"
                  >
                    <span class="text-xs font-bold text-gray-900">25¢</span>
                  </div>
                  <p class="text-sm font-medium text-gray-700">Quarter</p>
                  <p class="text-xs text-gray-500">24.26mm</p>
                </div>
              </div>
            </div>

            <!-- Carat Weight Chart -->
            <div class="mb-8">
              <h4 class="text-lg font-medium text-gray-900 mb-4">
                Carat Weight Reference
              </h4>
              <div class="bg-white rounded-lg p-6">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div
                    v-for="weight in caratWeights"
                    :key="weight.carat"
                    class="text-center p-3 rounded-lg"
                    :class="
                      weight.carat === product.carat
                        ? 'bg-emerald-100 border-2 border-emerald-500'
                        : 'bg-gray-50'
                    "
                  >
                    <div
                      class="mx-auto rounded-full mb-2 flex items-center justify-center"
                      :style="{
                        width: `${weight.size}px`,
                        height: `${weight.size}px`,
                        backgroundColor:
                          weight.carat === product.carat
                            ? '#059669'
                            : '#6B7280',
                      }"
                    >
                      <span
                        class="text-xs font-bold"
                        :class="
                          weight.carat === product.carat
                            ? 'text-white'
                            : 'text-white'
                        "
                      >
                        {{ weight.carat }}
                      </span>
                    </div>
                    <p class="text-sm font-medium text-gray-700">
                      {{ weight.carat }} carat
                    </p>
                    <p class="text-xs text-gray-500">
                      ~{{ weight.diameter }}mm
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Shape Variations -->
            <div class="mb-8">
              <h4 class="text-lg font-medium text-gray-900 mb-4">
                Shape Impact on Appearance
              </h4>
              <div class="bg-white rounded-lg p-6">
                <p class="text-sm text-gray-600 mb-4">
                  The same carat weight can appear different in size depending
                  on the shape:
                </p>
                <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
                  <div
                    v-for="shape in shapeComparisons"
                    :key="shape.name"
                    class="text-center p-2 rounded"
                    :class="
                      shape.name === product.shape
                        ? 'bg-emerald-100'
                        : 'bg-gray-50'
                    "
                  >
                    <div class="mb-2 flex justify-center">
                      <div
                        class="border-2 border-gray-400"
                        :class="getShapeClass(shape.name)"
                        :style="{ width: '32px', height: '32px' }"
                      ></div>
                    </div>
                    <p class="text-xs font-medium text-gray-700">
                      {{ shape.name }}
                    </p>
                    <p class="text-xs text-gray-500">{{ shape.appearance }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Helpful Tips -->
            <div>
              <h4 class="text-lg font-medium text-gray-900 mb-4">
                Size Selection Tips
              </h4>
              <div class="bg-white rounded-lg p-6">
                <ul class="space-y-3 text-sm text-gray-600">
                  <li class="flex items-start space-x-2">
                    <LightBulbIcon
                      class="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0"
                    />
                    <span
                      >Consider finger size - larger stones may look
                      disproportionate on smaller fingers</span
                    >
                  </li>
                  <li class="flex items-start space-x-2">
                    <LightBulbIcon
                      class="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0"
                    />
                    <span
                      >Shape affects perceived size - elongated shapes appear
                      larger than round ones</span
                    >
                  </li>
                  <li class="flex items-start space-x-2">
                    <LightBulbIcon
                      class="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0"
                    />
                    <span
                      >Setting style impacts visual size - halo settings make
                      stones appear larger</span
                    >
                  </li>
                  <li class="flex items-start space-x-2">
                    <LightBulbIcon
                      class="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0"
                    />
                    <span
                      >View in person when possible - photos may not accurately
                      represent scale</span
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="$emit('close')"
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup lang="ts">
    import { computed } from "vue";
    import {
      XMarkIcon,
      RulerIcon,
      LightBulbIcon,
    } from "@heroicons/vue/24/outline";

    interface Product {
      name: string;
      carat: number;
      shape: string;
    }

    interface Props {
      product: Product;
    }

    const props = defineProps<Props>();
    defineEmits<{
      close: [];
    }>();

    // Reference data
    const caratWeights = [
      { carat: 0.25, size: 20, diameter: "4.1" },
      { carat: 0.5, size: 28, diameter: "5.1" },
      { carat: 0.75, size: 34, diameter: "5.9" },
      { carat: 1.0, size: 40, diameter: "6.5" },
      { carat: 1.5, size: 48, diameter: "7.4" },
      { carat: 2.0, size: 56, diameter: "8.1" },
      { carat: 2.5, size: 62, diameter: "8.7" },
      { carat: 3.0, size: 68, diameter: "9.3" },
    ];

    const shapeComparisons = [
      { name: "Round", appearance: "Standard" },
      { name: "Princess", appearance: "Smaller" },
      { name: "Emerald", appearance: "Larger" },
      { name: "Oval", appearance: "Larger" },
      { name: "Marquise", appearance: "Largest" },
      { name: "Pear", appearance: "Larger" },
    ];

    // Methods
    const getVisualSize = () => {
      const baseSize = 32;
      return Math.max(baseSize, baseSize + props.product.carat * 12);
    };

    const getApproximateSize = () => {
      // Rough calculation for round diamonds
      return (6.5 * Math.pow(props.product.carat, 1 / 3)).toFixed(1);
    };

    const getShapeClass = (shape: string) => {
      const classes: Record<string, string> = {
        Round: "rounded-full",
        Princess: "rounded-none",
        Emerald: "rounded-sm",
        Oval: "rounded-full",
        Marquise: "rounded-full",
        Pear: "rounded-full",
      };
      return classes[shape] || "rounded-full";
    };
  </script>
</template>
