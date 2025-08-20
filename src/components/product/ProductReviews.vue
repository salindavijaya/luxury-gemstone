<template>
  <section class="mt-8 border-t pt-8">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-semibold">Customer Reviews</h2>
      <button
        @click="showReviewForm = true"
        class="inline-flex items-center px-4 py-2 border border-emerald-600 text-emerald-600 rounded-md hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      >
        <PlusIcon class="h-5 w-5 mr-2" />
        Write a Review
      </button>
    </div>

    <!-- Review Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div class="space-y-4">
        <div class="flex items-center">
          <div class="flex items-center">
            <StarIcon v-for="i in 5" :key="i" class="h-5 w-5 text-yellow-400" />
          </div>
          <span class="ml-2 text-sm text-gray-600"
            >{{ product?.rating }} out of 5</span
          >
        </div>
        <p class="text-sm text-gray-600">
          {{ product?.reviewCount }} total reviews
        </p>
      </div>
    </div>

    <!-- Review List -->
    <div class="space-y-8">
      <div v-if="!reviews.length" class="text-center py-8">
        <p class="text-gray-600">No reviews yet. Be the first to write one!</p>
      </div>
      <div v-for="review in reviews" :key="review.id" class="border-b pb-8">
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center">
              <div class="flex items-center">
                <StarIcon
                  v-for="i in 5"
                  :key="i"
                  :class="[
                    'h-4 w-4',
                    i <= review.rating ? 'text-yellow-400' : 'text-gray-300',
                  ]"
                />
              </div>
              <p class="ml-2 text-sm font-medium text-gray-900">
                {{ review.userName }}
              </p>
            </div>
            <p class="mt-1 text-sm text-gray-600">
              {{ format(new Date(review.date), "MMM dd, yyyy") }}
            </p>
          </div>
          <button
            v-if="review.verified"
            class="flex items-center text-green-600"
          >
            <CheckCircleIcon class="h-4 w-4 mr-1" />
            <span class="text-xs">Verified Purchase</span>
          </button>
        </div>
        <h3 class="mt-4 text-base font-medium">{{ review.title }}</h3>
        <p class="mt-2 text-gray-600">{{ review.comment }}</p>
        <div v-if="review.images?.length" class="mt-4 flex space-x-2">
          <div
            v-for="image in review.images"
            :key="image.id"
            class="h-20 w-20 rounded-md overflow-hidden"
          >
            <img
              :src="image.url"
              :alt="image.alt"
              class="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Review Form Modal -->
    <Modal v-model="showReviewForm" title="Write a Review">
      <form @submit.prevent="handleSubmitReview" class="space-y-6">
        <div>
          <label for="rating" class="block text-sm font-medium text-gray-700"
            >Rating</label
          >
          <div class="mt-1">
            <div class="flex items-center space-x-1">
              <button
                v-for="i in 5"
                :key="i"
                type="button"
                @click="rating = i"
                :class="[
                  'p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500',
                  i <= rating
                    ? 'text-yellow-400'
                    : 'text-gray-300 hover:text-gray-400',
                ]"
              >
                <StarIcon class="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <label for="title" class="block text-sm font-medium text-gray-700"
            >Title</label
          >
          <div class="mt-1">
            <input
              id="title"
              v-model="reviewForm.title"
              type="text"
              class="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label for="comment" class="block text-sm font-medium text-gray-700"
            >Review</label
          >
          <div class="mt-1">
            <textarea
              id="comment"
              v-model="reviewForm.comment"
              rows="4"
              class="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="showReviewForm = false"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Submit Review
          </button>
        </div>
      </form>
    </Modal>
  </section>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";
import { format } from "date-fns";
import { StarIcon, CheckCircleIcon, PlusIcon } from "lucide-vue-next";
import type { Product } from "@/types/product";
import Modal from "@/components/UI/Modal.vue";

const props = defineProps<{
  product?: Product;
}>();

interface ReviewImage {
  id: string;
  url: string;
  alt?: string;
}

interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  images?: ReviewImage[];
}

const showReviewForm = ref(false);
const rating = ref(0);
const reviewForm = ref({
  title: "",
  comment: "",
});

const reviews = ref<Review[]>([
  {
    id: "1",
    productId: "1",
    userId: "1",
    userName: "John Doe",
    rating: 5,
    title: "Beautiful piece!",
    comment:
      "This is an absolutely stunning gemstone. The quality is exceptional.",
    date: "2024-01-15",
    verified: true,
  },
  // Add more mock reviews here
]);

const handleSubmitReview = () => {
  // Add review submission logic here
  showReviewForm.value = false;
};
</script>
