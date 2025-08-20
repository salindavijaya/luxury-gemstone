declare module "lodash-es" {
  export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    wait?: number
  ): (...args: Parameters<T>) => ReturnType<T>;
  export function throttle<T extends (...args: any[]) => any>(
    fn: T,
    wait?: number
  ): (...args: Parameters<T>) => ReturnType<T>;
}
