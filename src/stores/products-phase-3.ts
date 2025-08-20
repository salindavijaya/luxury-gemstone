// stores/products.ts
import { defineStore } from "pinia";
import type {
  Product,
  ProductFilters,
  ViewMode,
} from "@/features/products/store";

import {
  SortOption,
  GemstoneType,
  Cut,
  Color,
  Clarity,
  Shape,
  CertificationAgency,
  StockStatus,
} from "@/features/products/store/types";

interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  filters: ProductFilters;
  sortBy: SortOption;
  viewMode: ViewMode;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  recentlyViewed: string[];
  savedSearches: ProductFilters[];
}

const gemstoneTypes = [
  GemstoneType.Diamond,
  GemstoneType.Ruby,
  GemstoneType.Sapphire,
  GemstoneType.Emerald,
  GemstoneType.Amethyst,
  GemstoneType.Topaz,
  GemstoneType.Garnet,
  GemstoneType.Peridot,
  GemstoneType.Tanzanite,
  GemstoneType.Aquamarine,
];

export const useProductsStore = defineStore("products", {
  state: (): ProductsState => ({
    products: [],
    filteredProducts: [],
    filters: {
      search: "",
      categories: [],
      gemstoneTypes: [],
      priceRange: [0, 50000],
      caratRange: [0, 10],
      cuts: [],
      colors: [],
      clarities: [],
      shapes: [],
      certifications: [],
      origins: [],
      stockStatus: [],
      inStock: false,
      onSale: false,
      featured: false,
      isNew: false,
    } as ProductFilters,
    sortBy: SortOption.Newest,
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
        state.products
          .map((p) => p.specifications?.origin || p.origin)
          .filter(Boolean)
      );
      return Array.from(origins);
    },

    priceRange: (state) => {
      if (state.products.length === 0) return [0, 100000] as [number, number];
      const prices = state.products.map((p) => p.price);
      return [Math.min(...prices), Math.max(...prices)] as [number, number];
    },

    caratRange: (state) => {
      if (state.products.length === 0) return [0, 20] as [number, number];
      const carats = state.products.map(
        (p) => p.specifications?.carat || p.carat || 0
      );
      return [Math.min(...carats), Math.max(...carats)] as [number, number];
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
            product.name?.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query) ||
            (product.gemstoneType || product.gemType)
              ?.toLowerCase()
              .includes(query) ||
            product.category?.toLowerCase().includes(query) ||
            product.tags?.some((tag) => tag?.toLowerCase().includes(query))
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
        filtered = filtered.filter((product) => {
          const gemType = product.gemstoneType || product.gemType || "";
          return this.filters.gemstoneTypes.includes(gemType);
        });
      }

      // Apply price range filter
      filtered = filtered.filter(
        (product) =>
          product.price >= this.filters.priceRange[0] &&
          product.price <= this.filters.priceRange[1]
      );

      // Apply carat range filter
      filtered = filtered.filter((product) => {
        const carat = product.specifications?.carat || product.carat || 0;
        return (
          carat >= this.filters.caratRange[0] &&
          carat <= this.filters.caratRange[1]
        );
      });

      // Apply cut filter
      if (this.filters.cuts.length > 0) {
        filtered = filtered.filter((product) =>
          this.filters.cuts.includes(product.cut)
        );
      }

      // Apply color filter
      if (this.filters.colors.length > 0) {
        filtered = filtered.filter((product) =>
          this.filters.colors.includes(product.color)
        );
      }

      // Apply clarity filter
      if (this.filters.clarities.length > 0) {
        filtered = filtered.filter((product) =>
          this.filters.clarities.includes(product.clarity)
        );
      }

      // Apply shape filter
      if (this.filters.shapes.length > 0) {
        filtered = filtered.filter((product) =>
          this.filters.shapes.includes(
            Shape[product.shape as keyof typeof Shape] || Shape.Round
          )
        );
      }

      // Apply certification filter
      if (this.filters.certifications.length > 0) {
        filtered = filtered.filter(
          (product) =>
            typeof product.certification !== "string" &&
            product.certification &&
            this.filters.certifications.includes(
              (product.certification as any).agency
            )
        );
      }

      // Apply origin filter
      if (this.filters.origins.length > 0) {
        filtered = filtered.filter((product) => {
          const origin = product.specifications?.origin || product.origin;
          return origin && this.filters.origins.includes(origin);
        });
      }

      // Apply stock status filter
      if (this.filters.stockStatus.length > 0) {
        filtered = filtered.filter(
          (product) =>
            !!product.stockStatus &&
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
            return (
              (b.specifications?.carat || b.carat || 0) -
              (a.specifications?.carat || a.carat || 0)
            );
          case "carat-low-high":
            return (
              (a.specifications?.carat || a.carat || 0) -
              (b.specifications?.carat || b.carat || 0)
            );
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          case "popularity":
            return (b.reviewCount || 0) - (a.reviewCount || 0);
          case "newest":
          default:
            return (
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
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
  const cuts: Cut[] = [
    Cut.Excellent,
    Cut.VeryGood,
    Cut.Good,
    Cut.Fair,
    Cut.Poor,
  ];
  const colors: Color[] = [
    Color.D,
    Color.E,
    Color.F,
    Color.G,
    Color.H,
    Color.I,
    Color.J,
  ];
  const clarities: Clarity[] = [
    Clarity.FL,
    Clarity.IF,
    Clarity.VVS1,
    Clarity.VVS2,
    Clarity.VS1,
    Clarity.VS2,
    Clarity.SI1,
    Clarity.SI2,
    Clarity.I1,
    Clarity.I2,
    Clarity.I3,
  ];
  const shapes: Shape[] = [
    Shape.Round,
    Shape.Princess,
    Shape.Cushion,
    Shape.Oval,
    Shape.Emerald,
    Shape.Pear,
    Shape.Marquise,
    Shape.Asscher,
    Shape.Heart,
    Shape.Radiant,
  ];
  const certifications: CertificationAgency[] = [
    CertificationAgency.GIA,
    CertificationAgency.AGS,
    CertificationAgency.IGI,
    CertificationAgency.HRD,
    CertificationAgency.GCAL,
    CertificationAgency.GRS,
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
    StockStatus.InStock,
    StockStatus.LowStock,
    StockStatus.OutOfStock,
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

    const cut = cuts[Math.floor(Math.random() * cuts.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const clarity = clarities[Math.floor(Math.random() * clarities.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const stockStatus =
      stockStatuses[Math.floor(Math.random() * stockStatuses.length)];
    const inStock = stockStatus !== StockStatus.OutOfStock;

    products.push({
      id: `product-${i}`,
      name: `${gemstoneType} ${shape} ${carat}ct`,
      description: `Beautiful ${gemstoneType.toLowerCase()} gemstone of ${carat} carats. Features ${cut} cut, ${color} color, and ${clarity} clarity. Natural and certified premium quality.`,
      price,
      originalPrice,
      category: "Loose Gemstones",
      gemstoneType,
      images: [
        {
          url: `https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop&crop=center&q=80`,
          alt: `${gemstoneType} image 1`,
        },
        {
          url: `https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&h=800&fit=crop&crop=center&q=80`,
          alt: `${gemstoneType} image 2`,
        },
        {
          url: `https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&h=800&fit=crop&crop=center&q=80`,
          alt: `${gemstoneType} image 3`,
        },
      ],
      description: `Beautiful ${gemstoneType.toLowerCase()} gemstone of ${carat} carats. Features ${cut} cut, ${color} color, and ${clarity} clarity. Natural and certified premium quality.`,
      carat,
      cut,
      color,
      clarity,
      inStock,
      stockStatus,
      subcategory: gemstoneType.toLowerCase(),
      gemstoneType,
      certification:
        Math.random() > 0.3
          ? {
              agency:
                certifications[
                  Math.floor(Math.random() * certifications.length)
                ],
              number: `${Math.random().toString(36).substring(2, 8).toUpperCase()}${Math.floor(Math.random() * 10000)}`,
            }
          : undefined,
    });
  }

  return products;
}
