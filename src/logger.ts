import { blue, cyan, gray, magenta, red, yellow } from 'colorette';

export enum LogLevel {
  /**
   * @description
   * Log Errors only. These are usually indicative of some potentially
   * serious issue, so should be acted upon.
   */
  Error = 0,
  /**
   * @description
   * Warnings indicate that some situation may require investigation
   * and handling. But not as serious as an Error.
   */
  Warn = 1,
  /**
   * @description
   * Logs general information such as startup messages.
   */
  Info = 2,
  /**
   * @description
   * Logs additional information
   */
  Verbose = 3,
  /**
   * @description
   * Logs detailed info useful in debug scenarios, including stack traces for
   * all errors. In production this would probably generate too much noise.
   */
  Debug = 4,
}

export class Logger {
  private defaultContext = 'HPS_TS_NODE';
  private readonly logLevel: LogLevel;
  private readonly timestamp: boolean;
  private readonly localeStringOptions = {
    year: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
  } as const;

  constructor(options?: { logLevel?: LogLevel; timestamp?: boolean }) {
    this.logLevel =
      options?.logLevel ??
      (Number(
        process.env['HPS_TS_NODE_LOG_LEVEL'] ?? LogLevel.Info
      ) as LogLevel);
    this.timestamp =
      options?.timestamp ?? process.env['HPS_TS_NODE_LOG_TIMESTAMP'] === 'true';
  }

  info(message: string, context?: string) {
    if (this.logLevel >= LogLevel.Info) {
      this.logMessage(blue('INFO'), this.ensureString(message), context);
    }
  }

  warn(message: string, context?: string) {
    if (this.logLevel >= LogLevel.Warn) {
      this.logMessage(yellow('WARN'), this.ensureString(message), context);
    }
  }

  error(message: string, context?: string) {
    if (this.logLevel >= LogLevel.Error) {
      this.logMessage(red('ERROR'), this.ensureString(message), context);
    }
  }

  debug(message: string, context?: string) {
    if (this.logLevel >= LogLevel.Debug) {
      this.logMessage(magenta('DEBUG'), this.ensureString(message), context);
    }
  }

  verbose(message: string, context?: string) {
    if (this.logLevel >= LogLevel.Verbose) {
      this.logMessage(magenta('VERBOSE'), this.ensureString(message), context);
    }
  }

  private ensureString(message: string | object | any[]): string {
    return typeof message === 'string'
      ? message
      : JSON.stringify(message, null, 2);
  }

  private logTimestamp() {
    if (this.timestamp) {
      const timestamp = new Date(Date.now()).toLocaleString(
        undefined,
        this.localeStringOptions
      );
      return gray(timestamp + ' -');
    } else {
      return '';
    }
  }

  private logContext(context?: string) {
    return cyan(`[${context || this.defaultContext}]`);
  }

  private logMessage(prefix: string, message: string, context?: string) {
    process.stdout.write(
      [
        prefix,
        this.logTimestamp(),
        this.logContext(context),
        message,
        '\n',
      ].join(' ')
    );
  }
}

export const logger = new Logger();
