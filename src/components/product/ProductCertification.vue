<template>
  <div v-if="product?.certifications?.length" class="mt-8 border-t pt-8">
    <h2 class="text-2xl font-semibold mb-6">Certifications</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="cert in product.certifications"
        :key="cert.id"
        class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
      >
        <div class="flex-1">
          <div class="flex items-center space-x-2">
            <span class="text-lg font-medium">{{ cert.type }}</span>
            <span v-if="cert.verified" class="text-green-500">
              <CheckCircleIcon class="h-5 w-5" />
            </span>
          </div>
          <p class="text-sm text-gray-600 mt-1">
            Certificate #{{ cert.number }}
          </p>
          <p class="text-sm text-gray-600">
            Issued: {{ formatDate(cert.date) }}
          </p>
          <a
            v-if="cert.documentUrl"
            :href="cert.documentUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center mt-2 text-sm text-primary-600 hover:text-primary-700"
          >
            <FileTextIcon class="h-4 w-4 mr-1" />
            View Certificate
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import { CheckCircleIcon, FileTextIcon } from "lucide-vue-next";
import type { Product } from "@/types/product";

defineProps<{
  product?: Product;
}>();

const formatDate = (date: string) => {
  return format(new Date(date), "MMM dd, yyyy");
};
</script>
