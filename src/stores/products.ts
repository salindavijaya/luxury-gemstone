// stores/products.ts
import { defineStore } from "pinia";
import type {
  Product,
  ProductFilters,
  ProductSortOption as SortOption,
  ViewMode,
  ProductsState,
} from "@/types";

export const useProductsStore = defineStore("products", {
  state: (): ProductsState => ({
    products: [],
    filteredProducts: [],
    filters: {
      search: "",
      categories: [],
      gemstoneTypes: [],
      priceRange: [0, 100000],
      caratRange: [0, 20],
      cuts: [],
      colors: [],
      clarities: [],
      shapes: [],
      certifications: [],
      origins: [],
      stockStatus: [],
      onSale: false,
      inStock: true,
      featured: false,
      isNew: false,
    },
    sortBy: { id: "newest", label: "Newest", value: "newest", order: "desc" },
    viewMode: "grid",
    currentPage: 1,
    itemsPerPage: 20,
    totalPages: 0,
    loading: false,
    error: null,
    searchQuery: "",
    recentlyViewed: [],
    savedSearches: [],
  }),

  getters: {
    paginatedProducts: (state) => {
      const start = (state.currentPage - 1) * state.itemsPerPage;
      const end = start + state.itemsPerPage;
      return state.filteredProducts.slice(start, end);
    },
    featuredProducts: (state) => {
      return state.products.filter((product) => product.featured).slice(0, 8);
    },
    hasActiveFilters: (state) => {
      return (
        state.filters.categories.length > 0 ||
        state.filters.gemstoneTypes.length > 0 ||
        state.filters.priceRange[0] > 0 ||
        state.filters.priceRange[1] < 100000 ||
        state.filters.caratRange[0] > 0 ||
        state.filters.caratRange[1] < 20 ||
        state.filters.cuts.length > 0 ||
        state.filters.colors.length > 0 ||
        state.filters.clarities.length > 0 ||
        state.filters.shapes.length > 0 ||
        state.filters.certifications.length > 0 ||
        state.filters.origins.length > 0 ||
        state.filters.stockStatus.length > 0 ||
        state.filters.onSale ||
        state.filters.featured ||
        state.filters.isNew
      );
    },

    categories: (state) => {
      const categories = new Set(state.products.map((p) => p.category));
      return Array.from(categories);
    },

    gemstoneTypes: (state) => {
      const types = new Set(state.products.map((p) => p.gemstoneType));
      return Array.from(types);
    },

    origins: (state) => {
      const origins = new Set(
        state.products.map((p) => p.specifications.origin).filter(Boolean)
      );
      return Array.from(origins);
    },

    priceRange: (state) => {
      if (state.products.length === 0) return [0, 100000];
      const prices = state.products.map((p) => p.price);
      return [Math.min(...prices), Math.max(...prices)];
    },

    caratRange: (state) => {
      if (state.products.length === 0) return [0, 20];
      const carats = state.products.map((p) => p.specifications.carat);
      return [Math.min(...carats), Math.max(...carats)];
    },
  },

  actions: {
    async fetchProducts() {
      this.loading = true;
      this.error = null;

      try {
        // Simulate API call with mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));
        this.products = generateMockProducts();
        this.applyFiltersAndSort();
      } catch (error) {
        this.error = "Failed to fetch products";
        console.error("Error fetching products:", error);
      } finally {
        this.loading = false;
      }
    },

    setFilters(filters: Partial<ProductFilters>) {
      this.filters = { ...this.filters, ...filters };
      this.currentPage = 1;
      this.applyFiltersAndSort();
    },

    clearFilters() {
      this.filters = {
        search: "",
        categories: [],
        gemstoneTypes: [],
        priceRange: this.priceRange,
        caratRange: this.caratRange,
        cuts: [],
        colors: [],
        clarities: [],
        shapes: [],
        certifications: [],
        origins: [],
        stockStatus: [],
        onSale: false,
        featured: false,
        isNew: false,
      };
      this.currentPage = 1;
      this.applyFiltersAndSort();
    },
    removeFilter(key: any) {
      delete this.filters[key];
    },

    setSortBy(sortBy: SortOption) {
      this.sortBy = sortBy;
      this.applyFiltersAndSort();
    },

    setViewMode(viewMode: ViewMode) {
      this.viewMode = viewMode;
    },

    setPage(page: number) {
      this.currentPage = page;
    },

    setSearchQuery(query: string) {
      this.searchQuery = query;
      this.filters.search = query;
      this.currentPage = 1;
      this.applyFiltersAndSort();
    },

    addToRecentlyViewed(productId: string) {
      this.recentlyViewed = [
        productId,
        ...this.recentlyViewed.filter((id) => id !== productId),
      ].slice(0, 10);
    },

    saveSearch() {
      if (this.hasActiveFilters || this.searchQuery) {
        this.savedSearches = [
          { ...this.filters },
          ...this.savedSearches.filter(
            (search) => JSON.stringify(search) !== JSON.stringify(this.filters)
          ),
        ].slice(0, 5);
      }
    },

    applyFiltersAndSort() {
      let filtered = [...this.products];

      // Apply search filter
      if (this.filters.search) {
        const query = this.filters.search.toLowerCase();
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.gemstoneType.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }

      // Apply category filter
      if (this.filters.categories.length > 0) {
        filtered = filtered.filter((product) =>
          this.filters.categories.includes(product.category)
        );
      }

      // Apply gemstone type filter
      if (this.filters.gemstoneTypes.length > 0) {
        filtered = filtered.filter((product) =>
          this.filters.gemstoneTypes.includes(product.gemstoneType)
        );
      }

      // Apply price range filter
      filtered = filtered.filter(
        (product) =>
          product.price >= this.filters.priceRange[0] &&
          product.price <= this.filters.priceRange[1]
      );

      // Apply carat range filter
      filtered = filtered.filter(
        (product) =>
          product.specifications.carat >= this.filters.caratRange[0] &&
          product.specifications.carat <= this.filters.caratRange[1]
      );

      // Apply cut filter
      if (this.filters.cuts.length > 0) {
        filtered = filtered.filter((product) =>
          this.filters.cuts.includes(product.specifications.cut)
        );
      }

      // Apply color filter
      if (this.filters.colors.length > 0) {
        filtered = filtered.filter((product) =>
          this.filters.colors.includes(product.specifications.color)
        );
      }

      // Apply clarity filter
      if (this.filters.clarities.length > 0) {
        filtered = filtered.filter((product) =>
          this.filters.clarities.includes(product.specifications.clarity)
        );
      }

      // Apply shape filter
      if (this.filters.shapes.length > 0) {
        filtered = filtered.filter((product) =>
          this.filters.shapes.includes(product.specifications.shape)
        );
      }

      // Apply certification filter
      if (this.filters.certifications.length > 0) {
        filtered = filtered.filter(
          (product) =>
            product.certification &&
            this.filters.certifications.includes(product.certification.agency)
        );
      }

      // Apply origin filter
      if (this.filters.origins.length > 0) {
        filtered = filtered.filter(
          (product) =>
            product.specifications.origin &&
            this.filters.origins.includes(product.specifications.origin)
        );
      }

      // Apply stock status filter
      if (this.filters.stockStatus.length > 0) {
        filtered = filtered.filter((product) =>
          this.filters.stockStatus.includes(product.stockStatus)
        );
      }

      // Apply boolean filters
      if (this.filters.onSale) {
        filtered = filtered.filter((product) => product.onSale);
      }

      if (this.filters.featured) {
        filtered = filtered.filter((product) => product.featured);
      }

      if (this.filters.isNew) {
        filtered = filtered.filter((product) => product.isNew);
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (this.sortBy) {
          case "price-low-high":
            return a.price - b.price;
          case "price-high-low":
            return b.price - a.price;
          case "carat-high-low":
            return b.specifications.carat - a.specifications.carat;
          case "carat-low-high":
            return a.specifications.carat - b.specifications.carat;
          case "rating":
            return b.rating - a.rating;
          case "popularity":
            return b.reviewCount - a.reviewCount;
          case "newest":
          default:
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }
      });

      this.filteredProducts = filtered;
      this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);

      // Reset to first page if current page is out of bounds
      if (this.currentPage > this.totalPages && this.totalPages > 0) {
        this.currentPage = 1;
      }
    },
  },
});

// Mock data generator
function generateMockProducts(): Product[] {
  const gemstoneTypes: GemstoneType[] = [
    "diamond",
    "ruby",
    "sapphire",
    "emerald",
    "amethyst",
    "topaz",
    "garnet",
    "peridot",
    "tanzanite",
    "aquamarine",
  ];
  const cuts: Cut[] = ["excellent", "very-good", "good", "fair"];
  const colors: Color[] = ["D", "E", "F", "G", "H", "I", "J", "K"];
  const clarities: Clarity[] = [
    "FL",
    "IF",
    "VVS1",
    "VVS2",
    "VS1",
    "VS2",
    "SI1",
    "SI2",
  ];
  const shapes: Shape[] = [
    "round",
    "princess",
    "cushion",
    "oval",
    "emerald",
    "pear",
    "marquise",
    "asscher",
  ];
  const certifications: CertificationAgency[] = [
    "GIA",
    "AGS",
    "SSEF",
    "Gübelin",
  ];
  const origins = [
    "Sri Lanka",
    "Myanmar",
    "Madagascar",
    "Mozambique",
    "Thailand",
    "Brazil",
    "Colombia",
    "Kashmir",
  ];
  const stockStatuses: StockStatus[] = [
    "in-stock",
    "low-stock",
    "out-of-stock",
  ];

  const products: Product[] = [];

  for (let i = 1; i <= 100; i++) {
    const gemstoneType =
      gemstoneTypes[Math.floor(Math.random() * gemstoneTypes.length)];
    const carat = parseFloat((Math.random() * 10 + 0.5).toFixed(2));
    const basePrice = carat * (Math.random() * 5000 + 1000);
    const price = Math.round(basePrice);
    const onSale = Math.random() > 0.8;
    const originalPrice = onSale ? Math.round(price * 1.2) : undefined;

    products.push({
      id: `product-${i}`,
      name: `${gemstoneType.charAt(0).toUpperCase() + gemstoneType.slice(1)} ${shapes[Math.floor(Math.random() * shapes.length)]} ${carat}ct`,
      price,
      originalPrice,
      images: [
        `https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop&crop=center&q=80`,
        `https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&h=800&fit=crop&crop=center&q=80`,
        `https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&h=800&fit=crop&crop=center&q=80`,
      ],
      category: "Loose Gemstones",
      subcategory: gemstoneType,
      gemstoneType,
      description: `Exquisite ${carat} carat ${gemstoneType} with exceptional brilliance and fire. This stunning gemstone features premium quality and certification, perfect for creating heirloom jewelry pieces.`,
      specifications: {
        carat,
        cut: cuts[Math.floor(Math.random() * cuts.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        clarity: clarities[Math.floor(Math.random() * clarities.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        origin: origins[Math.floor(Math.random() * origins.length)],
        dimensions: {
          length: parseFloat((Math.random() * 5 + 5).toFixed(2)),
          width: parseFloat((Math.random() * 5 + 5).toFixed(2)),
          depth: parseFloat((Math.random() * 3 + 3).toFixed(2)),
        },
        fluorescence:
          Math.random() > 0.7
            ? "None"
            : Math.random() > 0.5
              ? "Faint"
              : "Medium",
        treatments: Math.random() > 0.6 ? [] : ["Heat Treatment"],
      },
      certification:
        Math.random() > 0.3
          ? {
              agency:
                certifications[
                  Math.floor(Math.random() * certifications.length)
                ],
              certificateNumber: `${Math.random().toString(36).substring(2, 8).toUpperCase()}${Math.floor(Math.random() * 10000)}`,
              date: new Date(
                Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
              )
                .toISOString()
                .split("T")[0],
            }
          : undefined,
      stockStatus:
        stockStatuses[Math.floor(Math.random() * stockStatuses.length)],
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 200),
      tags: [gemstoneType, "natural", "certified", "premium"],
      featured: Math.random() > 0.8,
      isNew: Math.random() > 0.9,
      onSale,
      createdAt: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return products;
}
