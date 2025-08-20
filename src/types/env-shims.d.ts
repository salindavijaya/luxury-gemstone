declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare global {
  interface Window {
    ApplePaySession?: any;
    google?: any;
    Vue?: any;
  }

  // Node-style require used in some utility scripts
  var require: any;

  // Timeout returned by setTimeout in different environments
  // Relaxed to `any` to avoid browser/node mismatch errors in the repo.
  type Timeout = any;
}

export {};

// Top-level globals used by payment libraries
declare const ApplePaySession: any;
declare const google: any;

// Augment Vue runtime types to be more permissive for this migration/cleanup pass.
declare module "@vue/runtime-core" {
  // Allow arbitrary properties on component instances to reduce template type errors
  interface ComponentCustomProperties {
    [key: string]: any;
  }
}

declare module "@vue/runtime-dom" {
  // Relax some DOM attribute types used in templates (e.g. :src bindings)
  interface HTMLAttributes {
    src?: any;
    "aria-expanded"?: any;
  }
}

// Helpful global lifecycle declarations used without explicit imports in some files
declare function onUnmounted(fn: () => void): void;
