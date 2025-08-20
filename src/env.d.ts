/* Global environment and module shims used across the project to reduce TS template errors */
declare global {
  interface Window {
    ApplePaySession?: any;
    google?: any;
  }

  // Simple Timeout alias used when code expects node/browser Timeout
  type Timeout = ReturnType<typeof setTimeout>;

  interface HTMLElement {
    // Some directives attach handlers directly to elements (e.g. _clickOutsideHandler)
    _clickOutsideHandler?: (event: Event) => void;
  }
}

// Allow importing .vue files without TS errors
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    any
  >;
  export default component;
}

// Allow image imports as strings
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.webp";

export {};
/// <reference types="vite/client" />

// Basic shims for .vue imports
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Shim for lucide-vue-next (used for icons)
declare module "lucide-vue-next" {
  const Icon: any;
  export default Icon;
  export const ChevronLeft: any;
  export const ChevronRight: any;
  export const ChevronDown: any;
  export const AlertCircle: any;
  export const Maximize: any;
  export const Minimize: any;
  export const HeartIcon: any;
  export const ShareIcon: any;
  export const CopyIcon: any;
  export const CreditCardIcon: any;
  export const PackageIcon: any;
  export const HomeIcon: any;
  export const CalendarIcon: any;
  export const BarChart3Icon: any;
  export const ShoppingCartIcon: any;
  export const MapPinIcon: any;
  export const SettingsIcon: any;
  export const SearchIcon: any;
  export const GiftIcon: any;
  export const StarIcon: any;
}

// IntersectionObserver composable shims
declare module "@/composables/useIntersectionObserver" {
  export function useIntersectionObserver(...args: any[]): any;
}

// Online status composable shim
declare module "@/composables/useOnlineStatus" {
  export function useOnlineStatus(): {
    isOnline: Ref<boolean>;
    checkConnection: () => Promise<void>;
    isChecking: Readonly<Ref<boolean>>;
  };
}

// Global window extras
interface Window {
  ApplePaySession?: any;
  google?: any;
  // used by PWA sync and other browser APIs
  registration?: any;
}

// NodeJS types for timeouts in browser code
declare namespace NodeJS {
  interface Timeout {}
}

// Export common Vue runtime helpers to avoid 'Cannot find name ref' in SFC <script setup>
declare global {
  const ref: any;
  const reactive: any;
  const computed: any;
  const onMounted: any;
  const onUnmounted: any;
}
