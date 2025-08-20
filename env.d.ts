/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.webp";
declare module "*.svg";

declare namespace NodeJS {
  interface Global {}
  // allow usage of NodeJS.Timeout in browser-adjacent code
  type Timeout = ReturnType<typeof setTimeout>;
}

// ApplePay / Google Pay ambient declarations (guarded usage in code)
declare var ApplePaySession: any;
declare var google: any;

// Extend Window with common properties used in the app
interface Window {
  Stripe?: any;
  paypal?: any;
  ApplePaySession?: any;
  // allow attaching debug helpers
  __APP_DEBUG__?: boolean;
}

// Simple ErrorLogger interface used by components to check runtime logger
interface ErrorLogger {
  log?: (payload: any) => void;
  error?: (payload: any) => void;
}

export {};
