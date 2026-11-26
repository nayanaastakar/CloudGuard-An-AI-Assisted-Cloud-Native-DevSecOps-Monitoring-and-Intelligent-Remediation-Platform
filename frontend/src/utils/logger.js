/**
 * Frontend logger utility
 * Provides consistent logging with environment-aware behavior
 * In production, only warnings and errors are logged
 */









const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

const isDevelopment = import.meta.env.DEV;

const defaultConfig = {
  enabled: true,
  minLevel: isDevelopment ? 'debug' : 'warn',
  prefix: '[CloudGuard]'
};

class Logger {
  config;

  constructor(config = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  shouldLog(level) {
    if (!this.config.enabled) return false;
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel];
  }

  formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    return `${this.config.prefix} [${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  debug(message, ...args) {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message), ...args);
    }
  }

  info(message, ...args) {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), ...args);
    }
  }

  warn(message, ...args) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), ...args);
    }
  }

  error(message, ...args) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), ...args);
    }
  }

  /**
   * Create a child logger with a specific prefix
   */
  child(prefix) {
    return new Logger({
      ...this.config,
      prefix: `${this.config.prefix}:${prefix}`
    });
  }
}

// Default logger instance
export const logger = new Logger();

// Named loggers for different modules
export const apiLogger = logger.child('API');
export const authLogger = logger.child('Auth');
export const k8sLogger = logger.child('K8s');
export const helmLogger = logger.child('Helm');
export const pipelineLogger = logger.child('Pipeline');
export const securityLogger = logger.child('Security');
export const wsLogger = logger.child('WebSocket');

export default logger;