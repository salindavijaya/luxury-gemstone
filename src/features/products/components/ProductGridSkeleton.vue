<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
  >
    <div
      v-for="i in 8"
      :key="i"
      class="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse"
    >
      <div class="aspect-square bg-slate-200"></div>
      <div class="p-4 space-y-3">
        <div class="h-4 bg-slate-200 rounded w-3/4"></div>
        <div class="h-3 bg-slate-200 rounded w-1/2"></div>
        <div class="h-3 bg-slate-200 rounded w-2/3"></div>
        <div class="h-5 bg-slate-200 rounded w-1/3"></div>
      </div>
    </div>
  </div>
</template>
