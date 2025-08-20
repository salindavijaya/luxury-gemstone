<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="n in 9"
      :key="n"
      class="animate-pulse bg-white rounded-lg h-56"
    />
  </div>
</template>
<script setup lang="ts" />
