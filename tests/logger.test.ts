import { Logger, logger, LogLevel } from '../src/logger.js';

describe('Logger', () => {
  let mockStdout: { write: (str: string) => void };
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Mock process.stdout.write
    mockStdout = { write: vi.fn() };
    vi.spyOn(process.stdout, 'write').mockImplementation(
      mockStdout.write as any
    );

    // Save original env and reset it
    originalEnv = process.env;
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env = originalEnv;
  });

  describe('Log Levels', () => {
    it('should only log messages at or above the set log level', () => {
      const logger = new Logger({ logLevel: LogLevel.Warn });

      logger.error('error message');
      logger.warn('warn message');
      logger.info('info message');
      logger.debug('debug message');
      logger.verbose('verbose message');

      expect(mockStdout.write).toHaveBeenCalledTimes(2); // Only error and warn
      expect(mockStdout.write).toHaveBeenCalledWith(
        expect.stringContaining('ERROR')
      );
      expect(mockStdout.write).toHaveBeenCalledWith(
        expect.stringContaining('WARN')
      );
    });

    it('should log all messages when log level is Debug', () => {
      const logger = new Logger({ logLevel: LogLevel.Debug });

      logger.error('error message');
      logger.warn('warn message');
      logger.info('info message');
      logger.debug('debug message');
      logger.verbose('verbose message');

      expect(mockStdout.write).toHaveBeenCalledTimes(5);
    });
  });

  describe('Timestamp', () => {
    it('should include timestamp when enabled', () => {
      const logger = new Logger({ timestamp: true });
      const now = new Date('2024-03-20T10:30:00');
      vi.setSystemTime(now);

      logger.info('test message');

      expect(mockStdout.write).toHaveBeenCalledWith(
        expect.stringMatching(/\d{1,2}\/\d{1,2}\/\d{2}, \d{1,2}:\d{1,2}/)
      );
    });

    it('should not include timestamp when disabled', () => {
      const logger = new Logger({ timestamp: false });

      logger.info('test message');

      expect(mockStdout.write).toHaveBeenCalledWith(
        expect.not.stringMatching(/\d{1,2}\/\d{1,2}\/\d{2}, \d{1,2}:\d{1,2}/)
      );
    });
  });

  describe('Context', () => {
    it('should use default context when none provided', () => {
      const logger = new Logger();

      logger.info('test message');

      expect(mockStdout.write).toHaveBeenCalledWith(
        expect.stringContaining('[HPS_TS_NODE]')
      );
    });

    it('should use provided context', () => {
      const logger = new Logger();

      logger.info('test message', 'TEST_CONTEXT');

      expect(mockStdout.write).toHaveBeenCalledWith(
        expect.stringContaining('[TEST_CONTEXT]')
      );
    });
  });

  describe('Message Formatting', () => {
    it('should handle string messages', () => {
      const logger = new Logger();

      logger.info('test message');

      expect(mockStdout.write).toHaveBeenCalledWith(
        expect.stringContaining('test message')
      );
    });

    it('should stringify object messages', () => {
      const logger = new Logger();
      const obj = { key: 'value', nested: { foo: 'bar' } };

      logger.info(obj as any);

      expect(mockStdout.write).toHaveBeenCalledWith(
        expect.stringContaining(JSON.stringify(obj, null, 2))
      );
    });

    it('should stringify array messages', () => {
      const logger = new Logger();
      const arr = [1, 2, { foo: 'bar' }];

      logger.info(arr as any);

      expect(mockStdout.write).toHaveBeenCalledWith(
        expect.stringContaining(JSON.stringify(arr, null, 2))
      );
    });
  });

  describe('Environment Configuration', () => {
    it('should use log level from environment variable', () => {
      process.env.HPS_TS_NODE_LOG_LEVEL = '3'; // Verbose
      const logger = new Logger({});

      logger.verbose('test message');
      expect(mockStdout.write).toHaveBeenCalledWith(
        expect.stringContaining('VERBOSE')
      );
    });

    it('should use timestamp from environment variable', () => {
      process.env.HPS_TS_NODE_LOG_TIMESTAMP = 'true';
      const logger = new Logger();

      logger.info('test message');
      expect(mockStdout.write).toHaveBeenCalledWith(
        expect.stringMatching(/\d{1,2}\/\d{1,2}\/\d{2}, \d{1,2}:\d{1,2}/)
      );
    });
  });

  describe('Default Logger Instance', () => {
    it('should use Info level by default', () => {
      logger.debug('debug message');
      expect(mockStdout.write).not.toHaveBeenCalled();

      logger.info('info message');
      expect(mockStdout.write).toHaveBeenCalledWith(
        expect.stringContaining('INFO')
      );
    });
  });
});
