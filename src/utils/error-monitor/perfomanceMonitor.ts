/**
 * Performance monitoring utility for tracking Core Web Vitals and custom metrics
 * Integrates with the Logger for comprehensive performance analytics
 */

import { logger } from "./logger";

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  url: string;
  tags?: Record<string, string>;
}

export interface WebVitals {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
}

export interface CustomTiming {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private timings: Map<string, CustomTiming> = new Map();
  private observer?: PerformanceObserver;
  private webVitals: WebVitals = {};
  private isSupported: boolean;
  private reportingEnabled: boolean;

  constructor() {
    this.isSupported = "PerformanceObserver" in window;
    this.reportingEnabled =
      import.meta.env.VITE_PERFORMANCE_MONITORING === "true";

    if (this.isSupported && this.reportingEnabled) {
      this.initialize();
    }
  }

  private initialize(): void {
    // Monitor Core Web Vitals
    this.observeWebVitals();

    // Monitor resource loading
    this.observeResources();

    // Monitor navigation timing
    this.observeNavigation();

    // Monitor long tasks
    this.observeLongTasks();

    // Auto-report metrics periodically
    setInterval(() => this.reportMetrics(), 30000); // Every 30 seconds
  }

  private observeWebVitals(): void {
    if (!this.isSupported) return;

    // FCP - First Contentful Paint
    this.observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          this.webVitals.FCP = entry.startTime;
          this.addMetric("FCP", entry.startTime, "ms", { type: "web-vital" });
        }
      }
    });
    this.observer.observe({ entryTypes: ["paint"] });

    // LCP - Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.webVitals.LCP = lastEntry.startTime;
      this.addMetric("LCP", lastEntry.startTime, "ms", { type: "web-vital" });
    });
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

    // CLS - Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      this.webVitals.CLS = clsValue;
      this.addMetric("CLS", clsValue, "score", { type: "web-vital" });
    });
    clsObserver.observe({ entryTypes: ["layout-shift"] });

    // FID - First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.webVitals.FID = (entry as any).processingStart - entry.startTime;
        this.addMetric("FID", this.webVitals.FID, "ms", { type: "web-vital" });
      }
    });
    fidObserver.observe({ entryTypes: ["first-input"] });
  }

  private observeResources(): void {
    if (!this.isSupported) return;

    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;

        // Track specific resource types
        if (resource.initiatorType === "img") {
          this.addMetric(
            "image-load-time",
            resource.responseEnd - resource.startTime,
            "ms",
            {
              url: resource.name,
              size: resource.transferSize?.toString() || "unknown",
            }
          );
        }

        if (resource.initiatorType === "script") {
          this.addMetric(
            "script-load-time",
            resource.responseEnd - resource.startTime,
            "ms",
            { url: resource.name }
          );
        }

        if (resource.initiatorType === "css") {
          this.addMetric(
            "css-load-time",
            resource.responseEnd - resource.startTime,
            "ms",
            { url: resource.name }
          );
        }
      }
    });
    resourceObserver.observe({ entryTypes: ["resource"] });
  }

  private observeNavigation(): void {
    if (!this.isSupported) return;

    const navigationObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const nav = entry as PerformanceNavigationTiming;

        // TTFB - Time to First Byte
        const ttfb = nav.responseStart - nav.requestStart;
        this.webVitals.TTFB = ttfb;
        this.addMetric("TTFB", ttfb, "ms", { type: "web-vital" });

        // DOM Content Loaded
        this.addMetric(
          "dom-content-loaded",
          nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
          "ms"
        );

        // Page Load Complete
        this.addMetric(
          "page-load-complete",
          nav.loadEventEnd - nav.loadEventStart,
          "ms"
        );

        // DNS Lookup Time
        this.addMetric(
          "dns-lookup-time",
          nav.domainLookupEnd - nav.domainLookupStart,
          "ms"
        );

        // TCP Connection Time
        this.addMetric(
          "tcp-connection-time",
          nav.connectEnd - nav.connectStart,
          "ms"
        );
      }
    });
    navigationObserver.observe({ entryTypes: ["navigation"] });
  }

  private observeLongTasks(): void {
    if (!this.isSupported) return;

    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.addMetric("long-task", entry.duration, "ms", {
          startTime: entry.startTime.toString(),
          warning: "potential-performance-issue",
        });
      }
    });
    longTaskObserver.observe({ entryTypes: ["longtask"] });
  }

  private addMetric(
    name: string,
    value: number,
    unit: string,
    tags?: Record<string, string>
  ): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date(),
      url: window.location.href,
      tags,
    };

    this.metrics.push(metric);

    // Log to logger for remote reporting
    logger.logPerformance(name, value, {
      unit,
      tags,
      timestamp: metric.timestamp.toISOString(),
    });

    // Alert on poor performance
    this.checkPerformanceThresholds(name, value);
  }

  private checkPerformanceThresholds(name: string, value: number): void {
    const thresholds = {
      LCP: 2500, // 2.5s
      FID: 100, // 100ms
      CLS: 0.1, // 0.1
      TTFB: 800, // 800ms
      "long-task": 50, // 50ms
    };

    if (
      thresholds[name as keyof typeof thresholds] &&
      value > thresholds[name as keyof typeof thresholds]
    ) {
      logger.warn(`Performance threshold exceeded: ${name}`, {
        value,
        threshold: thresholds[name as keyof typeof thresholds],
        url: window.location.href,
      });
    }
  }

  // Public API
  startTiming(name: string, metadata?: Record<string, any>): void {
    const timing: CustomTiming = {
      name,
      startTime: performance.now(),
      metadata,
    };
    this.timings.set(name, timing);
  }

  endTiming(
    name: string,
    additionalMetadata?: Record<string, any>
  ): number | null {
    const timing = this.timings.get(name);
    if (!timing) {
      logger.warn(`Timing '${name}' not found`);
      return null;
    }

    timing.endTime = performance.now();
    timing.duration = timing.endTime - timing.startTime;

    this.addMetric(name, timing.duration, "ms", {
      type: "custom-timing",
      ...timing.metadata,
      ...additionalMetadata,
    });

    this.timings.delete(name);
    return timing.duration;
  }

  // Measure function execution time
  measure<T>(name: string, fn: () => T, metadata?: Record<string, any>): T {
    this.startTiming(name, metadata);
    try {
      const result = fn();
      this.endTiming(name);
      return result;
    } catch (error) {
      this.endTiming(name, { error: "execution-failed" });
      throw error;
    }
  }

  // Measure async function execution time
  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.startTiming(name, metadata);
    try {
      const result = await fn();
      this.endTiming(name);
      return result;
    } catch (error) {
      this.endTiming(name, { error: "execution-failed" });
      throw error;
    }
  }

  // Track API request performance
  trackApiRequest(
    method: string,
    url: string,
    duration: number,
    status: number
  ): void {
    this.addMetric("api-request-duration", duration, "ms", {
      method,
      url,
      status: status.toString(),
      type: "api-request",
    });
  }

  // Track component render time
  trackComponentRender(componentName: string, duration: number): void {
    this.addMetric("component-render-time", duration, "ms", {
      component: componentName,
      type: "component-render",
    });
  }

  // Track route navigation time
  trackRouteNavigation(from: string, to: string, duration: number): void {
    this.addMetric("route-navigation-time", duration, "ms", {
      from,
      to,
      type: "route-navigation",
    });
  }

  // Get performance summary
  getPerformanceSummary(): {
    webVitals: WebVitals;
    averages: Record<string, number>;
    count: number;
  } {
    const averages: Record<string, number> = {};
    const metricGroups: Record<string, number[]> = {};

    // Group metrics by name
    this.metrics.forEach((metric) => {
      if (!metricGroups[metric.name]) {
        metricGroups[metric.name] = [];
      }
      metricGroups[metric.name].push(metric.value);
    });

    // Calculate averages
    Object.entries(metricGroups).forEach(([name, values]) => {
      averages[name] =
        values.reduce((sum, val) => sum + val, 0) / values.length;
    });

    return {
      webVitals: this.webVitals,
      averages,
      count: this.metrics.length,
    };
  }

  // Get recent metrics
  getRecentMetrics(minutes: number = 5): PerformanceMetric[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return this.metrics.filter((metric) => metric.timestamp > cutoff);
  }

  // Report metrics to analytics service
  private reportMetrics(): void {
    if (!this.reportingEnabled || this.metrics.length === 0) return;

    const recentMetrics = this.getRecentMetrics(1);
    if (recentMetrics.length === 0) return;

    logger.info("Performance metrics report", {
      metrics: recentMetrics,
      summary: this.getPerformanceSummary(),
    });
  }

  // Memory usage tracking
  getMemoryUsage(): any {
    if ("memory" in performance) {
      return {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
      };
    }
    return null;
  }

  // Clear old metrics
  clearOldMetrics(hours: number = 24): void {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    this.metrics = this.metrics.filter((metric) => metric.timestamp > cutoff);
  }

  // Export performance data
  exportData(): {
    webVitals: WebVitals;
    metrics: PerformanceMetric[];
    summary: ReturnType<PerformanceMonitor["getPerformanceSummary"]>;
    memoryUsage: any;
  } {
    return {
      webVitals: this.webVitals,
      metrics: this.metrics,
      summary: this.getPerformanceSummary(),
      memoryUsage: this.getMemoryUsage(),
    };
  }

  // Disable monitoring
  disable(): void {
    this.reportingEnabled = false;
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Convenience functions for Vue components
export const usePerformanceMonitor = () => {
  return {
    startTiming: performanceMonitor.startTiming.bind(performanceMonitor),
    endTiming: performanceMonitor.endTiming.bind(performanceMonitor),
    measure: performanceMonitor.measure.bind(performanceMonitor),
    measureAsync: performanceMonitor.measureAsync.bind(performanceMonitor),
    trackComponentRender:
      performanceMonitor.trackComponentRender.bind(performanceMonitor),
    trackApiRequest:
      performanceMonitor.trackApiRequest.bind(performanceMonitor),
    getPerformanceSummary:
      performanceMonitor.getPerformanceSummary.bind(performanceMonitor),
  };
};

export default performanceMonitor;
