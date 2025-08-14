// stores/wishlist.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { WishlistItem, WishlistCollection, Product } from '@/types';

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<WishlistItem[]>([]);
  const collections = ref<WishlistCollection[]>([]);
  const isLoading = ref(false);

  const totalItems = computed(() => items.value.length);
  
  const uncategorizedItems = computed(() => 
    items.value.filter(item => !item.collectionId)
  );

  const addToWishlist = async (product: Product) => {
    const existingItem = items.value.find(item => item.product.id === product.id);
    if (existingItem) return;

    const newItem: WishlistItem = {
      id: Date.now().toString(),
      product,
      addedDate: new Date().toISOString(),
      priceAlert: false,
    };

    items.value.push(newItem);
  };

  const removeFromWishlist = async (itemId: string) => {
    items.value = items.value.filter(item => item.id !== itemId);
  };

  const updateWishlistItem = async (itemId: string, updates: Partial<WishlistItem>) => {
    const index = items.value.findIndex(item => item.id === itemId);
    if (index !== -1) {
      items.value[index] = { ...items.value[index], ...updates };
    }
  };

  const createCollection = async (name: string, description?: string) => {
    const collection: WishlistCollection = {
      id: Date.now().toString(),
      name,
      description,
      isPublic: false,
      items: [],
      createdDate: new Date().toISOString(),
    };

    collections.value.push(collection);
    return collection;
  };

  const addItemToCollection = async (itemId: string, collectionId: string) => {
    await updateWishlistItem(itemId, { collectionId });
  };

  const removeItemFromCollection = async (itemId: string) => {
    await updateWishlistItem(itemId, { collectionId: undefined });
  };

  const togglePriceAlert = async (itemId: string) => {
    const item = items.value.find(item => item.id === itemId);
    if (item) {
      await updateWishlistItem(itemId, { priceAlert: !item.priceAlert });
    }
  };

  return {
    items,
    collections,
    isLoading,
    totalItems,
    uncategorizedItems,
    addToWishlist,
    removeFromWishlist,
    updateWishlistItem,
    createCollection,
    addItemToCollection,
    removeItemFromCollection,
    togglePriceAlert,
  };
});