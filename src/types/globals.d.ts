declare global {
  interface Window {
    Vue?: any;
    ApplePaySession?: any;
    google?: any;
  }
}

export {};

// Also expose globals used directly in code
declare var ApplePaySession: any;
declare var google: any;
