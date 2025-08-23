/**
 * Production Monitoring and Error Tracking
 * Provides error logging and monitoring utilities for the production environment
 */

// Simple error logger for production environments
export class ProductionLogger {
  private static instance: ProductionLogger;
  
  private constructor() {}
  
  static getInstance(): ProductionLogger {
    if (!ProductionLogger.instance) {
      ProductionLogger.instance = new ProductionLogger();
    }
    return ProductionLogger.instance;
  }
  
  /**
   * Log errors with context information
   */
  error(error: Error | string, context?: Record<string, any>) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
      context: context || {},
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    };
    
    // In production, you might want to send this to a logging service
    // For now, we'll use console.error with structured data
    console.error('[PRODUCTION ERROR]', JSON.stringify(errorInfo, null, 2));
    
    // You can extend this to send to services like:
    // - Sentry: Sentry.captureException(error, { extra: context })
    // - LogRocket: LogRocket.captureException(error)
    // - Custom webhook: fetch('/api/log-error', { method: 'POST', body: JSON.stringify(errorInfo) })
  }
  
  /**
   * Log performance metrics
   */
  performance(metric: string, value: number, context?: Record<string, any>) {
    const perfInfo = {
      timestamp: new Date().toISOString(),
      metric,
      value,
      context: context || {},
    };
    
    console.log('[PERFORMANCE]', JSON.stringify(perfInfo, null, 2));
  }
  
  /**
   * Log user actions for debugging
   */
  userAction(action: string, context?: Record<string, any>) {
    const actionInfo = {
      timestamp: new Date().toISOString(),
      action,
      context: context || {},
      url: typeof window !== 'undefined' ? window.location.href : 'server',
    };
    
    console.log('[USER ACTION]', JSON.stringify(actionInfo, null, 2));
  }
}

// Global error handler for unhandled errors
export function setupGlobalErrorHandling() {
  const logger = ProductionLogger.getInstance();
  
  // Client-side error handling
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      logger.error(event.error || event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      logger.error(event.reason, {
        type: 'unhandledPromiseRejection',
      });
    });
  }
  
  // Performance monitoring
  if (typeof window !== 'undefined' && 'performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          logger.performance('pageLoad', navigation.loadEventEnd - navigation.fetchStart, {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
          });
        }
      }, 0);
    });
  }
}

// Error boundary hook for React components
export function useErrorHandler() {
  const logger = ProductionLogger.getInstance();
  
  return (error: Error, errorInfo?: { componentStack: string }) => {
    logger.error(error, {
      type: 'ReactError',
      componentStack: errorInfo?.componentStack,
    });
  };
}

// API error handler for server-side functions
export function handleAPIError(error: any, req?: any, context?: Record<string, any>) {
  const logger = ProductionLogger.getInstance();
  
  logger.error(error, {
    type: 'APIError',
    method: req?.method,
    url: req?.url,
    headers: req?.headers,
    body: req?.body,
    ...context,
  });
}

// Database error handler
export function handleDatabaseError(error: any, query?: string, params?: any) {
  const logger = ProductionLogger.getInstance();
  
  logger.error(error, {
    type: 'DatabaseError',
    query,
    params,
  });
}

// Export singleton instance
export const logger = ProductionLogger.getInstance();
