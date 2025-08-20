declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";

declare namespace NodeJS {
  // map Timeout to number for browser timers compatibility
  type Timeout = number;
}

// lucide alias compatibility
declare module "lucide-vue-next" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
  export const ShoppingCartIcon: typeof component;
  // alias used in several files
  export const ShoppingBagIcon: typeof component;
}
