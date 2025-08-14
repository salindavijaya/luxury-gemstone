/**
 * Client-side error logging and monitoring utility
 * Handles error collection, formatting, and remote logging
 */

export interface LogLevel {
  ERROR: 'error'
  WARN: 'warn'
  INFO: 'info'
  DEBUG: 'debug'
}

export interface LogEntry {
  id: string
  level: keyof LogLevel
  message: string
  timestamp: Date
  url: string
  userAgent: string
  userId?: string
  sessionId: string
  stack?: string
  context?: Record<string, any>
  tags?: string[]
}

export interface LoggerConfig {
  enabled: boolean
  level: keyof LogLevel
  maxLogs: number
  enableRemoteLogging: boolean
  remoteEndpoint?: string
  enableConsole: boolean
  enableStorage: boolean
  bufferSize: number
  flushInterval: number
}

class Logger {
  private config: LoggerConfig
  private logs: LogEntry[] = []
  private sessionId: string
  private buffer: LogEntry[] = []
  private flushTimer?: number

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      enabled: true,
      level: 'info',
      maxLogs: 1000,
      enableRemoteLogging: false,
      enableConsole: true,
      enableStorage: true,
      bufferSize: 50,
      flushInterval: 30000, // 30 seconds
      ...config
    }

    this.sessionId = this.generateSessionId()
    this.initializeLogger()
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeLogger(): void {
    if (!this.config.enabled) return

    // Global error handler
    window.addEventListener('error', (event) => {
      this.error('Global Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      })
    })

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Promise Rejection', {
        reason: event.reason,
        promise: event.promise.toString()
      })
    })

    // Vue error handler (if available)
    if (window.Vue && window.Vue.config) {
      window.Vue.config.errorHandler = (err: Error, instance: any, info: string) => {
        this.error('Vue Error', {
          message: err.message,
          stack: err.stack,
          component: instance?.$options.name || 'Unknown',
          info
        })
      }
    }

    // Start flush timer
    this.startFlushTimer()

    // Load persisted logs
    this.loadPersistedLogs()
  }

  private shouldLog(level: keyof LogLevel): boolean {
    if (!this.config.enabled) return false

    const levels: Record<keyof LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    }

    return levels[level] >= levels[this.config.level]
  }

  private createLogEntry(
    level: keyof LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      level,
      message,
      timestamp: new Date(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      stack: error?.stack,
      context,
      tags: this.extractTags(context)
    }
  }

  private extractTags(context?: Record<string, any>): string[] {
    const tags: string[] = []
    
    if (context?.userId) tags.push(`user:${context.userId}`)
    if (context?.component) tags.push(`component:${context.component}`)
    if (context?.action) tags.push(`action:${context.action}`)
    
    return tags
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry)
    this.buffer.push(entry)

    // Maintain max logs limit
    if (this.logs.length > this.config.maxLogs) {
      this.logs.shift()
    }

    // Console logging
    if (this.config.enableConsole) {
      const consoleMethod = entry.level === 'debug' ? 'debug' :
                          entry.level === 'info' ? 'info' :
                          entry.level === 'warn' ? 'warn' : 'error'
      
      console[consoleMethod](`[${entry.timestamp.toISOString()}] ${entry.message}`, entry.context)
    }

    // Persist to storage
    if (this.config.enableStorage) {
      this.persistLogs()
    }

    // Flush buffer if full
    if (this.buffer.length >= this.config.bufferSize) {
      this.flush()
    }
  }

  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }

    this.flushTimer = window.setInterval(() => {
      this.flush()
    }, this.config.flushInterval)
  }

  private async flush(): Promise<void> {
    if (!this.config.enableRemoteLogging || this.buffer.length === 0) {
      this.buffer = []
      return
    }

    const logsToSend = [...this.buffer]
    this.buffer = []

    try {
      await this.sendLogsToRemote(logsToSend)
    } catch (error) {
      // Re-add failed logs to buffer for retry
      this.buffer.unshift(...logsToSend)
      console.error('Failed to send logs to remote:', error)
    }
  }

  private async sendLogsToRemote(logs: LogEntry[]): Promise<void> {
    if (!this.config.remoteEndpoint) return

    const response = await fetch(this.config.remoteEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        logs,
        metadata: {
          sessionId: this.sessionId,
          url: window.location.href,
          timestamp: new Date().toISOString()
        }
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  }

  private persistLogs(): void {
    try {
      const recentLogs = this.logs.slice(-100) // Keep last 100 logs
      localStorage.setItem('app_logs', JSON.stringify(recentLogs))
    } catch (error) {
      console.error('Failed to persist logs:', error)
    }
  }

  private loadPersistedLogs(): void {
    try {
      const stored = localStorage.getItem('app_logs')
      if (stored) {
        const persistedLogs = JSON.parse(stored)
        this.logs = persistedLogs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }))
      }
    } catch (error) {
      console.error('Failed to load persisted logs:', error)
    }
  }

  // Public logging methods
  debug(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog('debug')) return
    
    const entry = this.createLogEntry('debug', message, context)
    this.addLog(entry)
  }

  info(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog('info')) return
    
    const entry = this.createLogEntry('info', message, context)
    this.addLog(entry)
  }

  warn(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog('warn')) return
    
    const entry = this.createLogEntry('warn', message, context)
    this.addLog(entry)
  }

  error(message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog('error')) return
    
    const entry = this.createLogEntry('error', message, context, error)
    this.addLog(entry)
  }

  // Utility methods
  getLogs(level?: keyof LogLevel): LogEntry[] {
    if (!level) return [...this.logs]
    return this.logs.filter(log => log.level === level)
  }

  clearLogs(): void {
    this.logs = []
    this.buffer = []
    localStorage.removeItem('app_logs')
  }

  getSessionId(): string {
    return this.sessionId
  }

  // Performance logging
  logPerformance(name: string, duration: number, context?: Record<string, any>): void {
    this.info(`Performance: ${name}`, {
      duration,
      ...context
    })
  }

  // User interaction logging
  logUserAction(action: string, context?: Record<string, any>): void {
    this.info(`User Action: ${action}`, {
      action,
      ...context
    })
  }

  // API request logging
  logApiRequest(method: string, url: string, status: number, duration: number): void {
    const level = status >= 400 ? 'error' : status >= 300 ? 'warn' : 'info'
    this[level](`API Request: ${method} ${url}`, {
      method,
      url,
      status,
      duration
    })
  }

  // Component lifecycle logging
  logComponentEvent(component: string, event: string, context?: Record<string, any>): void {
    this.debug(`Component ${component}: ${event}`, {
      component,
      event,
      ...context
    })
  }

  // Configuration update
  updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig }
    
    if (newConfig.flushInterval) {
      this.startFlushTimer()
    }
  }

  // Manual flush
  async forceFlush(): Promise<void> {
    await this.flush()
  }

  // Destroy logger
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }
    this.flush()
  }
}

// Create singleton instance
export const logger = new Logger({
  enabled: import.meta.env.PROD || import.meta.env.VITE_ENABLE_LOGGING === 'true',
  level: import.meta.env.VITE_LOG_LEVEL as keyof LogLevel || 'info',
  enableRemoteLogging: import.meta.env.VITE_REMOTE_LOGGING === 'true',
  remoteEndpoint: import.meta.env.VITE_LOG_ENDPOINT
})

// Convenience functions
export const log = {
  debug: (message: string, context?: Record<string, any>) => logger.debug(message, context),
  info: (message: string, context?: Record<string, any>) => logger.info(message, context),
  warn: (message: string, context?: Record<string, any>) => logger.warn(message, context),
  error: (message: string, context?: Record<string, any>, error?: Error) => logger.error(message, context, error),
  performance: (name: string, duration: number, context?: Record<string, any>) => logger.logPerformance(name, duration, context),
  userAction: (action: string, context?: Record<string, any>) => logger.logUserAction(action, context),
  apiRequest: (method: string, url: string, status: number, duration: number) => logger.logApiRequest(method, url, status, duration),
  component: (component: string, event: string, context?: Record<string, any>) => logger.logComponentEvent(component, event, context)
}

export default logger