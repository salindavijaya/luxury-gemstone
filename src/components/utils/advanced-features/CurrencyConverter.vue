<template>
  <div class="inline-flex items-center space-x-2">
    <!-- Currency Selector -->
    <div class="relative">
      <button
        @click="toggleDropdown"
        class="flex items-center space-x-1 px-2 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        :aria-expanded="showDropdown"
        aria-haspopup="listbox"
      >
        <span class="text-lg">{{ selectedCurrency.flag }}</span>
        <span class="font-medium text-sm">{{ selectedCurrency.code }}</span>
        <ChevronDown class="w-3 h-3 text-gray-500" />
      </button>

      <!-- Currency Dropdown -->
      <div
        v-show="showDropdown"
        class="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
        role="listbox"
      >
        <div class="p-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search currencies..."
            class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div
          v-for="currency in filteredCurrencies"
          :key="currency.code"
          @click="selectCurrency(currency)"
          class="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
          :class="{ 'bg-emerald-50': currency.code === selectedCurrency.code }"
          role="option"
          :aria-selected="currency.code === selectedCurrency.code"
        >
          <span class="text-base">{{ currency.flag }}</span>
          <span class="font-medium">{{ currency.code }}</span>
          <span class="text-gray-600 truncate">{{ currency.name }}</span>
          <span class="ml-auto text-xs text-gray-500">{{ currency.symbol }}</span>
        </div>
        
        <!-- No results -->
        <div v-if="filteredCurrencies.length === 0" class="px-3 py-4 text-center text-gray-500 text-sm">
          No currencies found
        </div>
      </div>
    </div>

    <!-- Price Display -->
    <div class="flex items-center space-x-1">
      <span class="text-lg font-semibold text-gray-900">
        {{ formattedPrice }}
      </span>
      <span v-if="showOriginalPrice && convertedPrice !== basePrice" class="text-sm text-gray-500 line-through">
        {{ formatPrice(basePrice, baseCurrency) }}
      </span>
    </div>

    <!-- Exchange Rate Info -->
    <div v-if="showExchangeRate && selectedCurrency.code !== baseCurrency" class="text-xs text-gray-500">
      1 {{ baseCurrency }} = {{ exchangeRate.toFixed(4) }} {{ selectedCurrency.code }}
    </div>

    <!-- Loading/Error States -->
    <div v-if="isLoading" class="flex items-center">
      <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-emerald-600"></div>
    </div>

    <div v-if="error" class="flex items-center text-red-500 text-xs">
      <AlertCircle class="w-3 h-3 mr-1" />
      <span>{{ error }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { ChevronDown, AlertCircle } from 'lucide-vue-next';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  decimals: number;
}

export interface ExchangeRates {
  [key: string]: number;
}

export interface Props {
  basePrice: number;
  baseCurrency?: string;
  defaultCurrency?: string;
  showOriginalPrice?: boolean;
  showExchangeRate?: boolean;
  allowedCurrencies?: string[];
  updateInterval?: number;
  apiKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  baseCurrency: 'USD',
  defaultCurrency: 'USD',
  showOriginalPrice: true,
  showExchangeRate: false,
  updateInterval: 3600000, // 1 hour
  allowedCurrencies: () => []
});

const emit = defineEmits<{
  'currency-change': [currency: string, price: number];
  'rate-update': [rates: ExchangeRates];
  'error': [error: string];
}>();

// Available currencies with comprehensive list
const availableCurrencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: ', flag: '🇺🇸', decimals: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', decimals: 2 },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', decimals: 2 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', decimals: 0 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A, flag: '🇦🇺', decimals: 2 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C, flag: '🇨🇦', decimals: 2 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', decimals: 2 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', decimals: 2 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', decimals: 2 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ, flag: '🇳🇿', decimals: 2 },
  { code: 'MXN', name: 'Mexican Peso', symbol: ', flag: '🇲🇽', decimals: 2 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S, flag: '🇸🇬', decimals: 2 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK, flag: '🇭🇰', decimals: 2 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', decimals: 2 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', decimals: 0 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷', decimals: 2 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺', decimals: 2 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', decimals: 2 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R, flag: '🇧🇷', decimals: 2 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', decimals: 2 },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', flag: '🇱🇰', decimals: 2 }
];

// State
const selectedCurrency = ref<Currency>(
  availableCurrencies.find(c => c.code === props.defaultCurrency) ||
  availableCurrencies[0]
);
const exchangeRates = ref<ExchangeRates>({});
const showDropdown = ref(false);
const searchQuery = ref('');
const isLoading = ref(false);
const error = ref<string | null>(null);
const lastUpdate = ref<Date | null>(null);
const updateTimer = ref<number | null>(null);

// Computed properties
const currencies = computed(() => {
  if (props.allowedCurrencies.length > 0) {
    return availableCurrencies.filter(c => props.allowedCurrencies.includes(c.code));
  }
  return availableCurrencies;
});

const filteredCurrencies = computed(() => {
  if (!searchQuery.value) return currencies.value;
  
  const query = searchQuery.value.toLowerCase();
  return currencies.value.filter(currency => 
    currency.code.toLowerCase().includes(query) ||
    currency.name.toLowerCase().includes(query)
  );
});

const exchangeRate = computed(() => {
  if (selectedCurrency.value.code === props.baseCurrency) return 1;
  return exchangeRates.value[selectedCurrency.value.code] || 1;
});

const convertedPrice = computed(() => {
  return props.basePrice * exchangeRate.value;
});

const formattedPrice = computed(() => {
  return formatPrice(convertedPrice.value, selectedCurrency.value.code);
});

// Methods
const formatPrice = (price: number, currencyCode: string): string => {
  const currency = availableCurrencies.find(c => c.code === currencyCode);
  if (!currency) return price.toFixed(2);

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currency.decimals,
      maximumFractionDigits: currency.decimals
    }).format(price);
  } catch (e) {
    // Fallback formatting
    return `${currency.symbol}${price.toFixed(currency.decimals)}`;
  }
};

const toggleDropdown = (): void => {
  showDropdown.value = !showDropdown.value;
  if (showDropdown.value) {
    searchQuery.value = '';
  }
};

const selectCurrency = (currency: Currency): void => {
  selectedCurrency.value = currency;
  showDropdown.value = false;
  searchQuery.value = '';
  
  // Save to localStorage
  localStorage.setItem('preferred-currency', currency.code);
  
  emit('currency-change', currency.code, convertedPrice.value);
};

const fetchExchangeRates = async (): Promise<void> => {
  if (isLoading.value) return;
  
  isLoading.value = true;
  error.value = null;

  try {
    // Use multiple fallback APIs
    const rates = await fetchRatesWithFallback();
    exchangeRates.value = rates;
    lastUpdate.value = new Date();
    emit('rate-update', rates);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Failed to fetch exchange rates';
    error.value = errorMessage;
    emit('error', errorMessage);
    
    // Use cached rates if available
    const cachedRates = getCachedRates();
    if (cachedRates) {
      exchangeRates.value = cachedRates;
    }
  } finally {
    isLoading.value = false;
  }
};

const fetchRatesWithFallback = async (): Promise<ExchangeRates> => {
  const apis = [
    () => fetchFromExchangeRateAPI(),
    () => fetchFromFixer(),
    () => fetchFromCurrencyLayer(),
    () => fetchFromOpenExchangeRates()
  ];

  for (const apiFetch of apis) {
    try {
      const rates = await apiFetch();
      if (rates && Object.keys(rates).length > 0) {
        // Cache successful response
        cacheRates(rates);
        return rates;
      }
    } catch (e) {
      continue;
    }
  }

  throw new Error('All exchange rate APIs failed');
};

const fetchFromExchangeRateAPI = async (): Promise<ExchangeRates> => {
  const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${props.baseCurrency}`);
  if (!response.ok) throw new Error('Exchange Rate API failed');
  
  const data = await response.json();
  return data.rates;
};

const fetchFromFixer = async (): Promise<ExchangeRates> => {
  if (!props.apiKey) throw new Error('Fixer API key required');
  
  const response = await fetch(
    `https://api.fixer.io/latest?access_key=${props.apiKey}&base=${props.baseCurrency}`
  );
  if (!response.ok) throw new Error('Fixer API failed');
  
  const data = await response.json();
  if (!data.success) throw new Error(data.error?.info || 'Fixer API error');
  
  return data.rates;
};

const fetchFromCurrencyLayer = async (): Promise<ExchangeRates> => {
  if (!props.apiKey) throw new Error('CurrencyLayer API key required');
  
  const response = await fetch(
    `https://api.currencylayer.com/live?access_key=${props.apiKey}&source=${props.baseCurrency}`
  );
  if (!response.ok) throw new Error('CurrencyLayer API failed');
  
  const data = await response.json();
  if (!data.success) throw new Error(data.error?.info || 'CurrencyLayer API error');
  
  // Transform quotes to simple rates
  const rates: ExchangeRates = {};
  Object.entries(data.quotes).forEach(([key, value]) => {
    const currency = key.substring(3); // Remove base currency prefix
    rates[currency] = value as number;
  });
  
  return rates;
};

const fetchFromOpenExchangeRates = async (): Promise<ExchangeRates> => {
  if (!props.apiKey) throw new Error('Open Exchange Rates API key required');
  
  const response = await fetch(
    `https://openexchangerates.org/api/latest.json?app_id=${props.apiKey}&base=${props.baseCurrency}`
  );
  if (!response.ok) throw new Error('Open Exchange Rates API failed');
  
  const data = await response.json();
  return data.rates;
};

const cacheRates = (rates: ExchangeRates): void => {
  try {
    const cacheData = {
      rates,
      timestamp: Date.now(),
      baseCurrency: props.baseCurrency
    };
    localStorage.setItem('exchange-rates-cache', JSON.stringify(cacheData));
  } catch (e) {
    // Ignore localStorage errors
  }
};

const getCachedRates = (): ExchangeRates | null => {
  try {
    const cached = localStorage.getItem('exchange-rates-cache');
    if (!cached) return null;
    
    const cacheData = JSON.parse(cached);
    const isExpired = Date.now() - cacheData.timestamp > props.updateInterval;
    const isWrongBase = cacheData.baseCurrency !== props.baseCurrency;
    
    if (isExpired || isWrongBase) return null;
    
    return cacheData.rates;
  } catch (e) {
    return null;
  }
};

const setupAutoUpdate = (): void => {
  if (updateTimer.value) {
    clearInterval(updateTimer.value);
  }
  
  updateTimer.value = window.setInterval(() => {
    fetchExchangeRates();
  }, props.updateInterval);
};

const handleClickOutside = (event: Event): void => {
  const target = event.target as Element;
  if (!target.closest('.relative')) {
    showDropdown.value = false;
  }
};

// Watchers
watch(() => props.baseCurrency, () => {
  fetchExchangeRates();
});

watch(() => props.basePrice, () => {
  emit('currency-change', selectedCurrency.value.code, convertedPrice.value);
});

// Lifecycle
onMounted(async () => {
  // Load preferred currency from localStorage
  const preferredCurrency = localStorage.getItem('preferred-currency');
  if (preferredCurrency) {
    const currency = availableCurrencies.find(c => c.code === preferredCurrency);
    if (currency) {
      selectedCurrency.value = currency;
    }
  }

  // Load cached rates or fetch new ones
  const cachedRates = getCachedRates();
  if (cachedRates) {
    exchangeRates.value = cachedRates;
  }
  
  await fetchExchangeRates();
  setupAutoUpdate();
  
  // Add click outside listener
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  if (updateTimer.value) {
    clearInterval(updateTimer.value);
  }
  document.removeEventListener('click', handleClickOutside);
});

// Expose methods for parent components
defineExpose({
  refreshRates: fetchExchangeRates,
  setCurrency: (code: string) => {
    const currency = availableCurrencies.find(c => c.code === code);
    if (currency) selectCurrency(currency);
  },
  getCurrentRate: () => exchangeRate.value,
  getLastUpdate: () => lastUpdate.value
});
</script>

<style scoped>
/* Custom dropdown animation */
.relative > div:last-child {
  animation: fadeInScale 0.15s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>