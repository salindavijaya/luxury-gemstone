# Directory Structure

## Core

- `/src/components/UI/` - Reusable UI components
- `/src/components/common/` - Common components used across features
- `/src/components/layout/` - Layout components
- `/src/lib/` - Shared libraries and utilities
  - `/performance/` - Performance optimization utilities
  - `/error-monitoring/` - Error monitoring and handling

## Feature Modules

Each feature module follows this structure:

- `/src/features/{feature}/`
  - `/components/` - Feature-specific components
  - `/composables/` - Feature-specific composables
  - `/store/` - Feature-specific store
  - `/types/` - Feature-specific types (optional)
  - `index.ts` - Public API

### Features

- `/src/features/products/` - Product catalog and search
- `/src/features/auth/` - Authentication and authorization
- `/src/features/cart/` - Shopping cart
- `/src/features/checkout/` - Checkout process
- `/src/features/dashboard/` - User dashboard

## Shared

- `/src/types/` - Shared TypeScript types
- `/src/utils/` - Shared utilities
- `/src/assets/` - Static assets
- `/src/styles/` - Global styles
- `/src/router/` - Route definitions
- `/src/services/` - API services

## Configuration

- `/src/env.d.ts` - Environment and global type definitions
