<template>
  <div class="relative inline-block text-left">
    <button
      @click="toggleDropdown"
      @keydown.enter.prevent="toggleDropdown"
      @keydown.space.prevent="toggleDropdown"
      :aria-expanded="isOpen.toString()"
      aria-haspopup="true"
      class="flex items-center gap-2 bg-white border border-slate-300 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none"
    >
      <span>Sort</span>
      <svg
        class="w-4 h-4"
        fill="none"
        <template>
          <div class="relative inline-block text-left">
            <button
              @click="toggleDropdown"
              @keydown.enter.prevent="toggleDropdown"
              @keydown.space.prevent="toggleDropdown"
              :aria-expanded="isOpen"
              aria-haspopup="true"
              class="flex items-center gap-2 bg-white border border-slate-300 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none"
            >
              <span>Sort</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div v-if="isOpen" class="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-md shadow z-10">
              <div class="py-1">
                <button
                  v-for="option in sortOptions"
                  :key="option.value"
                  @click="selectSort(option.value)"
                  class="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>
        </template>

        <script setup lang="ts">
        import { ref, computed } from 'vue'

        const sortOptions = [
          { value: 'featured', label: 'Featured' },
          { value: 'price-low', label: 'Price: Low to High' },
          { value: 'price-high', label: 'Price: High to Low' },
          { value: 'name', label: 'Name' },
          { value: 'rating', label: 'Rating' }
        ]

        const isOpen = ref(false)
        const selectedSort = ref('featured')

        const toggleDropdown = () => { isOpen.value = !isOpen.value }
        const closeDropdown = () => { isOpen.value = false }
        const selectSort = (value: string) => { selectedSort.value = value; closeDropdown() }

        const selectedSortLabel = computed(() => sortOptions.find(o => o.value === selectedSort.value)?.label || 'Featured')
        </script>

        <style scoped>
        .sr-only { position: absolute !important; width: 1px !important; height: 1px !important; padding: 0 !important; margin: -1px !important; overflow: hidden !important; clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; border: 0 !important; }
        </style>
                v-for="option in sortOptions"
                :key="option.value"
                @click="selectSort(option.value)"
                class="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>
      </template>

      <script setup lang="ts">
      import { ref, computed } from 'vue'

      const sortOptions = [
        { value: 'featured', label: 'Featured' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'name', label: 'Name' },
        { value: 'rating', label: 'Rating' }
      ]

      const isOpen = ref(false)
      const selectedSort = ref('featured')

      const toggleDropdown = () => { isOpen.value = !isOpen.value }
      const closeDropdown = () => { isOpen.value = false }
      const selectSort = (value: string) => { selectedSort.value = value; closeDropdown() }

      const selectedSortLabel = computed(() => sortOptions.find(o => o.value === selectedSort.value)?.label || 'Featured')
      </script>

      <style scoped>
      .sr-only { position: absolute !important; width: 1px !important; height: 1px !important; padding: 0 !important; margin: -1px !important; overflow: hidden !important; clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; border: 0 !important; }
      </style>
  white-space: nowrap !important;
