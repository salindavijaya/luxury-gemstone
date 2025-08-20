# Claude Code Generation Prompts - Gemstone E-commerce Platform

## Consistency Guidelines (Use in Every Conversation)

### Core Architecture Standards
```
Technology Stack:
- Vue.js 3 with Composition API
- Vite build tool
- Tailwind CSS for styling
- Pinia for state management
- Vue Router 4
- TypeScript (optional)

Design System:
- Color Palette: Primary: emerald-600, Secondary: slate-800, Accent: amber-500
- Typography: Inter font family
- Spacing: Tailwind's default spacing scale
- Border Radius: rounded-lg (8px) for cards, rounded-md (6px) for buttons
- Shadows: shadow-lg for cards, shadow-md for hover states

Component Naming Convention:
- PascalCase for components (ProductCard.vue)
- Prefix with base type: Base*, Layout*, Product*, User*
- Composables: use* prefix (useAuth, useCart)

Responsive Breakpoints:
- Mobile: default (0px+)
- Tablet: md (768px+)
- Desktop: lg (1024px+)
- Large Desktop: xl (1280px+)
```

---

## Prompt 1: Project Foundation & Layout

```
Create a Vue.js 3 + Vite project foundation for a luxury gemstone e-commerce platform with the following specifications:

ARCHITECTURE REQUIREMENTS:
- Vue 3 with Composition API and <script setup>
- Tailwind CSS with modern design system
- Pinia for state management
- Vue Router 4 with lazy loading
- Mobile-first responsive design

GENERATE COMPLETE CODE FOR:

1. **Project Configuration Files:**
   - package.json with all necessary dependencies
   - vite.config.js with optimizations
   - tailwind.config.js with custom theme (emerald primary, slate secondary, amber accent)
   - index.html with proper meta tags and font imports (Inter)

2. **Core Layout Components:**
   - LayoutMain.vue (main app layout with header, main, footer slots)
   - LayoutHeader.vue (navigation with logo, search, cart, user menu)
   - LayoutFooter.vue (links, newsletter, social media)
   - LayoutMobileNav.vue (hamburger menu for mobile)

3. **Router Setup:**
   - router/index.js with routes for: Home, Products, Product Detail, Cart, Auth, Dashboard
   - Include lazy loading and route guards structure

4. **Base Pinia Stores:**
   - stores/auth.js (user authentication state)
   - stores/cart.js (shopping cart management)
   - stores/ui.js (global UI state - modals, loading, mobile menu)

5. **Global Styles:**
   - main.css with Tailwind imports and custom classes
   - Component base styles for consistent design

DESIGN REQUIREMENTS:
- Modern luxury aesthetic suitable for high-end gemstones
- Glassmorphism effects and subtle animations
- Mobile-responsive navigation with smooth transitions
- Professional typography hierarchy
- Proper color contrast and accessibility

SPECIFICATIONS:
- Header: Logo left, search center, cart/user icons right
- Mobile: Collapsible hamburger menu with smooth slide animation
- Footer: Multi-column layout with company info, links, newsletter
- Loading states with skeleton screens
- Dark/light mode toggle preparation

Generate complete, production-ready code with proper TypeScript types (if using TS), comprehensive comments, and modern CSS practices.
```

---

## Prompt 2: Authentication System

```
Create a complete authentication system for the gemstone e-commerce platform following these specifications:

CONTEXT (Consistent Architecture):
- Vue 3 Composition API with <script setup>
- Tailwind CSS (emerald-600 primary, slate-800 secondary, amber-500 accent)
- Pinia stores for state management
- Mobile-first responsive design
- Inter font family, rounded-lg cards, shadow-lg effects

GENERATE COMPLETE CODE FOR:

1. **Authentication Components:**
   - AuthLogin.vue (login form with email/password)
   - AuthRegister.vue (registration with validation)
   - AuthForgotPassword.vue (password reset form)
   - AuthModal.vue (modal wrapper for auth forms)

2. **Enhanced Auth Store:**
   - stores/auth.js with complete authentication logic
   - User state management (login, logout, registration)
   - Token handling and persistence
   - Form validation states

3. **Composables:**
   - composables/useAuth.js (authentication logic)
   - composables/useValidation.js (form validation helpers)

4. **Route Guards:**
   - router/guards.js (authentication guards)
   - Protected route handling

5. **User Dashboard Components:**
   - UserDashboard.vue (main dashboard layout)
   - UserProfile.vue (profile editing)
   - UserOrders.vue (order history)
   - UserAddresses.vue (address management)

DESIGN REQUIREMENTS:
- Modern form design with floating labels
- Smooth form validation with real-time feedback
- Loading states for all async operations
- Modal overlays with backdrop blur
- Responsive mobile-optimized forms
- Social login buttons preparation (Google, Facebook)
- Password strength indicator
- Remember me functionality

FEATURES:
- Client-side validation with proper error messages
- Form state management (dirty, touched, valid)
- Auto-focus and keyboard navigation
- Accessibility (ARIA labels, screen reader support)
- Toast notifications for success/error states
- Guest checkout option preparation

API INTEGRATION PREPARATION:
- Mock API service structure for easy backend integration
- Error handling for network failures
- Token refresh logic structure
- Logout on token expiration

Generate complete, production-ready components with proper form handling, validation, and responsive design.
```

---

## Prompt 3: Product Catalog & Search

```
Create a comprehensive product catalog system for the luxury gemstone e-commerce platform with advanced filtering and search capabilities:

CONTEXT (Consistent Architecture):
- Vue 3 Composition API with <script setup>
- Tailwind CSS design system (emerald-600 primary, slate-800 secondary, amber-500 accent)
- Pinia for state management, mobile-first responsive
- Inter font, rounded-lg cards, shadow-lg effects

GENERATE COMPLETE CODE FOR:

1. **Product Components:**
   - ProductGrid.vue (responsive grid layout with view toggle)
   - ProductCard.vue (product card with hover effects, quick actions)
   - ProductList.vue (list view alternative)
   - ProductFilters.vue (advanced filtering sidebar)
   - ProductSearch.vue (search bar with autocomplete)
   - ProductSort.vue (sorting dropdown)

2. **Product Store:**
   - stores/products.js (product catalog state management)
   - Filtering, sorting, and search logic
   - Pagination handling
   - Categories and collections

3. **Composables:**
   - composables/useProducts.js (product data management)
   - composables/useFilters.js (filtering logic)
   - composables/useSearch.js (search functionality)

4. **Filter Components:**
   - FilterPrice.vue (price range slider)
   - FilterCategory.vue (category checkboxes)
   - FilterGemstoneType.vue (gemstone-specific filters)
   - FilterColor.vue (color picker)
   - FilterClarity.vue (clarity ratings)
   - FilterCarat.vue (carat weight range)

5. **Views:**
   - ProductsView.vue (main catalog page)
   - CategoryView.vue (category-specific listings)

GEMSTONE-SPECIFIC FEATURES:
- Gemstone type filters (Diamond, Ruby, Sapphire, Emerald, etc.)
- 4Cs filtering (Cut, Color, Clarity, Carat)
- Shape/cut selection with visual icons
- Price per carat calculations
- Certification filters (GIA, AGS, etc.)
- Origin/source location filters

DESIGN REQUIREMENTS:
- Modern grid layout with aspect ratio preservation
- High-quality image placeholders with lazy loading
- Smooth hover animations and transitions
- Mobile-optimized filter drawer
- Infinite scroll or pagination options
- Loading skeletons for better UX
- Empty states with compelling CTAs

ADVANCED FEATURES:
- Multi-select filters with clear indicators
- Filter breadcrumbs
- Save search functionality
- Recently viewed products
- Quick view modals
- Comparison checkbox preparation
- Stock status indicators
- Wishlist quick-add buttons

RESPONSIVE DESIGN:
- 1 column (mobile), 2 columns (tablet), 3-4 columns (desktop)
- Collapsible filter sidebar on mobile
- Touch-friendly controls
- Optimized image sizes for different viewports

Generate complete, production-ready components with mock data structure, proper state management, and modern UI patterns.
```

---

## Prompt 4: Product Detail & Image Gallery

```
Create a comprehensive product detail system with advanced image gallery for the luxury gemstone e-commerce platform:

CONTEXT (Consistent Architecture):
- Vue 3 Composition API with <script setup>
- Tailwind CSS (emerald-600 primary, slate-800 secondary, amber-500 accent)
- Pinia stores, mobile-first responsive design
- Inter font, rounded-lg cards, shadow-lg effects

GENERATE COMPLETE CODE FOR:

1. **Product Detail Components:**
   - ProductDetail.vue (main product page layout)
   - ProductImageGallery.vue (advanced image viewer with zoom)
   - ProductInfo.vue (product information section)
   - ProductSpecs.vue (detailed specifications)
   - ProductCertification.vue (certification display)
   - ProductReviews.vue (customer reviews section)
   - ProductRelated.vue (related products carousel)

2. **Image Gallery Features:**
   - ImageViewer.vue (lightbox with zoom functionality)
   - ImageThumbnails.vue (thumbnail navigation)
   - Image360Viewer.vue (360-degree view preparation)
   - ImageZoom.vue (magnifying glass effect)

3. **Action Components:**
   - ProductActions.vue (add to cart, wishlist, share buttons)
   - QuantitySelector.vue (quantity input with validation)
   - SizeGuide.vue (gemstone size comparison tool)
   - PriceCalculator.vue (price per carat calculator)

4. **Composables:**
   - composables/useProductDetail.js (product data management)
   - composables/useImageGallery.js (gallery functionality)
   - composables/useCart.js (cart operations)

5. **Enhanced Stores:**
   - Update stores/cart.js with add/remove product logic
   - Update stores/products.js with single product handling

GEMSTONE-SPECIFIC FEATURES:
- Certification document viewer (GIA reports, etc.)
- 4Cs detailed information display
- Carat weight to visual size converter
- Color grading visualization
- Clarity plotting diagrams
- Cut grade illustrations
- Investment value indicators
- Gemstone care instructions

DESIGN REQUIREMENTS:
- High-resolution image handling with progressive loading
- Smooth gallery transitions and animations
- Mobile-optimized touch gestures (pinch-to-zoom, swipe)
- Professional product information layout
- Trust indicators (certifications, guarantees)
- Social proof elements (reviews, ratings)
- Sticky add-to-cart section on mobile

ADVANCED FEATURES:
- Image comparison slider (before/after treatments)
- Multiple angle views synchronization
- Color temperature adjustment for accurate viewing
- Full-screen gallery mode
- Social sharing with proper meta tags
- Print-friendly product sheets
- QR code generation for mobile sharing
- Augmented reality viewer preparation

INTERACTIVE ELEMENTS:
- Smooth zoom with mouse/touch controls
- Thumbnail sync with main image
- Keyboard navigation support
- Touch-friendly mobile interactions
- Loading states for all images
- Error handling for missing images
- Lazy loading with intersection observer

RESPONSIVE LAYOUT:
- Side-by-side (desktop): Gallery left, info right
- Stacked (mobile): Gallery top, info below
- Optimized image sizes for different screens
- Touch-friendly control elements

Generate complete, production-ready components with proper image optimization, accessibility features, and modern interaction patterns.
```

---

## Prompt 5: Shopping Cart & Checkout

```
Create a complete shopping cart and checkout system for the luxury gemstone e-commerce platform:

CONTEXT (Consistent Architecture):
- Vue 3 Composition API with <script setup>
- Tailwind CSS (emerald-600 primary, slate-800 secondary, amber-500 accent)
- Pinia stores, mobile-first responsive design
- Inter font, rounded-lg cards, shadow-lg effects

GENERATE COMPLETE CODE FOR:

1. **Shopping Cart Components:**
   - CartDrawer.vue (slide-out cart sidebar)
   - CartPage.vue (full cart page)
   - CartItem.vue (individual cart item with controls)
   - CartSummary.vue (price breakdown and totals)
   - CartEmpty.vue (empty cart state)

2. **Checkout Components:**
   - CheckoutLayout.vue (multi-step checkout container)
   - CheckoutSteps.vue (progress indicator)
   - CheckoutShipping.vue (shipping address form)
   - CheckoutPayment.vue (payment method selection)
   - CheckoutReview.vue (order review and confirmation)
   - CheckoutSuccess.vue (order confirmation page)

3. **Form Components:**
   - AddressForm.vue (reusable address input form)
   - PaymentForm.vue (credit card form with validation)
   - ShippingOptions.vue (delivery method selection)
   - BillingAddress.vue (billing address with same-as-shipping option)

4. **Enhanced Cart Store:**
   - Complete stores/cart.js with all cart operations
   - Persistent cart state (localStorage)
   - Cart calculations (subtotal, tax, shipping, total)
   - Checkout state management

5. **Composables:**
   - composables/useCart.js (cart management logic)
   - composables/useCheckout.js (checkout process logic)
   - composables/usePayment.js (payment processing preparation)

CART FEATURES:
- Add/remove/update quantity
- Save for later functionality
- Price calculations with tax
- Shipping cost estimation
- Discount code application
- Recently removed items recovery
- Cart persistence across sessions
- Stock validation

CHECKOUT FEATURES:
- Multi-step process (Shipping → Payment → Review)
- Guest checkout option
- Address validation and autocomplete
- Multiple payment methods (Credit Card, PayPal, etc.)
- Order notes and special instructions
- Gift message options
- Email confirmation
- Order tracking preparation

DESIGN REQUIREMENTS:
- Smooth slide animations for cart drawer
- Mobile-optimized checkout flow
- Clear progress indicators
- Form validation with inline errors
- Loading states for all async operations
- Professional invoice-style summary
- Trust badges and security indicators

GEMSTONE-SPECIFIC FEATURES:
- Insurance options for high-value items
- Certification shipping preferences
- Secure packaging options
- Appraisal services add-on
- Special handling instructions
- Authentication guarantee display

RESPONSIVE DESIGN:
- Drawer-style cart on desktop, full-page on mobile
- Single-column checkout on mobile
- Touch-friendly form inputs
- Optimized button sizes for mobile

SECURITY CONSIDERATIONS:
- PCI-compliant form structure
- Input sanitization
- Secure data handling preparation
- SSL indicators and trust badges

Generate complete, production-ready components with proper form validation, state management, and secure checkout flow preparation.
```

---

## Prompt 6: Dashboard & User Experience

```
Create a comprehensive user dashboard and enhanced user experience components for the luxury gemstone e-commerce platform:

CONTEXT (Consistent Architecture):
- Vue 3 Composition API with <script setup>
- Tailwind CSS (emerald-600 primary, slate-800 secondary, amber-500 accent)
- Pinia stores, mobile-first responsive design
- Inter font, rounded-lg cards, shadow-lg effects

GENERATE COMPLETE CODE FOR:

1. **Dashboard Components:**
   - UserDashboardLayout.vue (dashboard container with sidebar)
   - DashboardOverview.vue (account summary and quick stats)
   - DashboardSidebar.vue (navigation menu)
   - DashboardOrderHistory.vue (order history with filtering)
   - DashboardWishlist.vue (saved items management)
   - DashboardAddresses.vue (address book management)
   - DashboardSettings.vue (account preferences)

2. **Order Management:**
   - OrderCard.vue (order summary card)
   - OrderDetails.vue (detailed order view)
   - OrderTracker.vue (shipping progress indicator)
   - OrderInvoice.vue (printable invoice)

3. **Wishlist Features:**
   - WishlistGrid.vue (wishlist product grid)
   - WishlistActions.vue (share, organize, move to cart)
   - WishlistCollections.vue (organize into collections)

4. **Enhanced User Experience:**
   - RecentlyViewed.vue (recently browsed products)
   - ProductComparison.vue (side-by-side comparison)
   - NotificationCenter.vue (account notifications)
   - SavedSearches.vue (saved search queries)

5. **Global UI Components:**
   - Toast.vue (notification toasts)
   - Modal.vue (reusable modal component)
   - LoadingSpinner.vue (loading indicators)
   - Breadcrumb.vue (navigation breadcrumbs)
   - Pagination.vue (pagination component)

6. **Enhanced Stores:**
   - stores/user.js (user preferences and data)
   - stores/notifications.js (notification management)
   - stores/wishlist.js (wishlist state management)

DASHBOARD FEATURES:
- Order status tracking with real-time updates
- Purchase history with search and filtering
- Wishlist organization and sharing
- Address book with validation
- Account security settings
- Communication preferences
- Recently viewed products
- Saved search queries

USER EXPERIENCE ENHANCEMENTS:
- Product comparison tool (up to 3 items)
- Size/price alerts for wishlist items
- Personalized recommendations
- Purchase anniversary reminders
- Loyalty program integration preparation
- Social sharing capabilities
- Print-friendly order history

DESIGN REQUIREMENTS:
- Clean dashboard layout with clear navigation
- Card-based information display
- Responsive sidebar that collapses on mobile
- Smooth transitions between sections
- Empty states with helpful guidance
- Loading skeletons for better perceived performance
- Consistent iconography throughout

GEMSTONE-SPECIFIC FEATURES:
- Gemstone collection organizer
- Certification document storage
- Appraisal tracking and reminders
- Insurance documentation area
- Care instruction quick access
- Investment portfolio tracking
- Authentication history

MOBILE OPTIMIZATION:
- Tab-based navigation on mobile
- Touch-friendly controls
- Swipe gestures for order cards
- Optimized form layouts
- Quick action buttons

ACCESSIBILITY:
- Proper ARIA labels and roles
- Keyboard navigation support
- High contrast mode compatibility
- Screen reader optimization
- Focus management

Generate complete, production-ready components with proper state management, responsive design, and modern UX patterns.
```

---

## Prompt 7: Performance & Production Optimization

```
Create performance optimizations, PWA features, and production-ready enhancements for the luxury gemstone e-commerce platform:

CONTEXT (Consistent Architecture):
- Vue 3 Composition API with <script setup>
- Tailwind CSS (emerald-600 primary, slate-800 secondary, amber-500 accent)
- Pinia stores, mobile-first responsive design
- All previous components and stores established

GENERATE COMPLETE CODE FOR:

1. **Performance Optimizations:**
   - LazyImage.vue (progressive image loading with placeholders)
   - VirtualScroller.vue (virtual scrolling for large product lists)
   - InfiniteScroll.vue (infinite scroll implementation)
   - ImageOptimizer.js (image compression and format detection)

2. **PWA Implementation:**
   - SW (Service Worker) registration and caching strategies
   - manifest.json for PWA installation
   - OfflineIndicator.vue (offline status notification)
   - InstallPrompt.vue (PWA installation prompt)

3. **SEO & Meta Management:**
   - composables/useSEO.js (dynamic meta tag management)
   - SitemapGenerator.js (sitemap generation utilities)
   - StructuredData.vue (JSON-LD for products)
   - OpenGraph.vue (social sharing optimization)

4. **Error Handling & Monitoring:**
   - ErrorBoundary.vue (global error handling)
   - ErrorPage.vue (custom error pages)
   - Logger.js (client-side error logging)
   - PerformanceMonitor.js (performance tracking)

5. **Advanced Features:**
   - SearchSuggestions.vue (AI-powered search suggestions)
   - ColorExtractor.js (dominant color extraction from images)
   - ImageComparison.vue (before/after image slider)
   - CurrencyConverter.vue (multi-currency support)

6. **Build Optimizations:**
   - vite.config.js (production optimizations)
   - Bundle analyzer configuration
   - Code splitting strategies
   - Asset optimization settings

PERFORMANCE FEATURES:
- Image lazy loading with intersection observer
- Virtual scrolling for large catalogs
- Code splitting by routes and features
- Preloading critical resources
- Caching strategies for API responses
- Debounced search and filtering
- Optimized bundle sizes

PWA CAPABILITIES:
- Offline browsing with cached data
- Add to home screen functionality
- Push notifications for order updates
- Background sync for cart persistence
- Install prompts with user engagement tracking
- Offline fallback pages

SEO OPTIMIZATIONS:
- Dynamic meta tags for all pages
- Open Graph tags for social sharing
- Structured data for product pages
- XML sitemap generation
- Canonical URLs management
- Page speed optimizations

ACCESSIBILITY ENHANCEMENTS:
- Screen reader optimization
- Keyboard navigation improvements
- High contrast mode support
- Focus management
- ARIA live regions for dynamic content

ADVANCED UX FEATURES:
- Smart search with typo tolerance
- Visual search preparation
- Color-based product filtering
- Multi-language preparation
- Currency conversion
- Personalized recommendations engine

MONITORING & ANALYTICS:
- Performance metrics collection
- Error boundary with reporting
- User interaction tracking
- Core Web Vitals monitoring
- Conversion funnel analysis preparation

SECURITY ENHANCEMENTS:
- Content Security Policy headers
- XSS protection utilities
- CSRF token management
- Secure cookie handling
- Input sanitization

DEPLOYMENT PREPARATION:
- Environment configuration
- Build optimization for different environments
- Asset CDN preparation
- Docker configuration
- CI/CD pipeline preparation

Generate complete, production-ready code with comprehensive performance monitoring, PWA capabilities, and deployment-ready optimizations.
```

---

## Usage Instructions for Each Conversation

### Before Starting Each Conversation:
1. Copy the "Consistency Guidelines" section
2. Paste the specific prompt for that conversation
3. Add this footer message:

```
IMPORTANT REQUIREMENTS:
- Generate COMPLETE, production-ready code (no placeholders or TODOs)
- All components must be fully responsive and mobile-optimized
- Include comprehensive error handling and loading states
- Add detailed comments explaining complex logic
- Ensure all code follows Vue 3 Composition API best practices
- Make components reusable and properly typed
- Include accessibility features (ARIA labels, keyboard navigation)
- Generate mock data where needed for realistic demonstrations

DELIVERABLES:
Please provide complete file contents for each requested component, including:
- Full component code with <template>, <script setup>, and <style scoped>
- All necessary imports and dependencies
- Proper TypeScript types (if applicable)
- Responsive design classes
- Error handling and loading states
- Accessibility attributes
```

### Conversation Management Tips:
1. **Save Key Architecture Decisions**: After each conversation, note any architectural decisions or component structures for consistency in next conversations.

2. **Reference Previous Components**: Mention component names and structures from previous conversations when they need to interact.

3. **Maintain Design System**: Always reference the established color palette, spacing, and component naming conventions.

4. **Mock Data Structure**: Establish and maintain consistent mock data structures across all conversations.

This structured approach ensures consistency across multiple Claude conversations while generating complete, production-ready code for your gemstone e-commerce platform.