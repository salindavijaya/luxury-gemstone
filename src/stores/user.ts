// stores/user.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, Address } from '@/types';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const addresses = ref<Address[]>([]);
  const isLoading = ref(false);

  const defaultShippingAddress = computed(() => 
    addresses.value.find(addr => addr.type === 'shipping' && addr.isDefault)
  );

  const defaultBillingAddress = computed(() => 
    addresses.value.find(addr => addr.type === 'billing' && addr.isDefault)
  );

  const setUser = (userData: User) => {
    user.value = userData;
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user.value) return;
    
    isLoading.value = true;
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      user.value = { ...user.value, ...updates };
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const addAddress = async (address: Omit<Address, 'id'>) => {
    isLoading.value = true;
    try {
      const newAddress: Address = {
        ...address,
        id: Date.now().toString(),
      };
      
      if (address.isDefault) {
        addresses.value.forEach(addr => {
          if (addr.type === address.type) addr.isDefault = false;
        });
      }
      
      addresses.value.push(newAddress);
    } catch (error) {
      console.error('Failed to add address:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const updateAddress = async (id: string, updates: Partial<Address>) => {
    isLoading.value = true;
    try {
      const index = addresses.value.findIndex(addr => addr.id === id);
      if (index !== -1) {
        if (updates.isDefault) {
          addresses.value.forEach(addr => {
            if (addr.type === addresses.value[index].type) addr.isDefault = false;
          });
        }
        addresses.value[index] = { ...addresses.value[index], ...updates };
      }
    } catch (error) {
      console.error('Failed to update address:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteAddress = async (id: string) => {
    isLoading.value = true;
    try {
      addresses.value = addresses.value.filter(addr => addr.id !== id);
    } catch (error) {
      console.error('Failed to delete address:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    user,
    addresses,
    isLoading,
    defaultShippingAddress,
    defaultBillingAddress,
    setUser,
    updateUser,
    addAddress,
    updateAddress,
    deleteAddress,
  };
});