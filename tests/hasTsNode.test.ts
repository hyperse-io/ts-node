import type { ResolveHookContext } from 'node:module';
import { HYPERSE_TS_NODE } from '../src/constants.js';
import { HyperseTsNode } from '../src/hpsTsNode.js';
import { Tsconfig } from '../src/tsconfig/index.js';
import type { CompilerOptions } from '../src/types/tsconfig.js';

vi.mock('../src/tsconfig/index.js');

describe('HyperseTsNode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env['HPS_TS_NODE_VERBOSE'] = undefined;
    process.env['HPS_TS_NODE_PROJECT'] = undefined;
    // Reset any symbols that may have been added
    const symbols = Object.getOwnPropertySymbols(process);
    symbols.forEach((symbol) => {
      if (symbol === HYPERSE_TS_NODE) {
        delete (process as any)[symbol];
      }
    });
  });

  describe('constructor', () => {
    it('should create instance with default options', () => {
      const mockOptions: CompilerOptions = {
        rootDir: '/test/root',
        outDir: '/test/out',
        baseUrl: '/test/root',
        paths: {},
      };
      vi.mocked(Tsconfig.prototype.getCompilerOptions).mockReturnValue(
        mockOptions
      );

      const tsNode = new HyperseTsNode();
      expect(tsNode.opts).toEqual(mockOptions);
      expect(tsNode.isTsNode).toBe(false);
    });

    it('should use HPS_TS_NODE_PROJECT env var', () => {
      process.env['HPS_TS_NODE_PROJECT'] = '/custom/tsconfig.json';
      const _tsNode = new HyperseTsNode();

      expect(Tsconfig).toHaveBeenCalledWith('/custom/tsconfig.json');
    });
  });

  describe('verbose', () => {
    it('should return false by default', () => {
      const tsNode = new HyperseTsNode();
      expect(tsNode.verbose).toBe(false);
    });

    it('should return true when env var is set to "true"', () => {
      process.env['HPS_TS_NODE_VERBOSE'] = 'true';
      const tsNode = new HyperseTsNode();
      expect(tsNode.verbose).toBe(true);
    });
  });

  describe('showInConsole', () => {
    it('should log messages when verbose is true', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      process.env['HPS_TS_NODE_VERBOSE'] = 'true';

      const tsNode = new HyperseTsNode();
      tsNode.showInConsole();

      expect(consoleSpy).toHaveBeenCalledTimes(4);
    });

    it('should not log messages when verbose is false', () => {
      const consoleSpy = vi.spyOn(console, 'log');

      const tsNode = new HyperseTsNode();
      tsNode.showInConsole();

      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('checkTsNode', () => {
    const mockOptions: CompilerOptions = {
      rootDir: '/test/root',
      outDir: '/test/out',
      baseUrl: '/test/root',
      paths: {},
    };
    beforeEach(() => {
      vi.mocked(Tsconfig.prototype.getCompilerOptions).mockReturnValue(
        mockOptions
      );
    });

    it('should detect ts-node from process symbols', () => {
      const tsNode = new HyperseTsNode();
      (process as any)[HYPERSE_TS_NODE] = true;

      expect(tsNode.checkTsNode('file:///some/path')).toBe(true);
      expect(tsNode.isTsNode).toBe(true);
    });

    it('should detect ts-node from file path in rootDir', () => {
      const tsNode = new HyperseTsNode();
      const url = 'file:///test/root/src/file.ts';

      expect(tsNode.checkTsNode(url)).toBe(true);
      expect(tsNode.isTsNode).toBe(true);
      expect((process as any)[HYPERSE_TS_NODE]).toBe(true);
    });

    it('should handle resolve hook context', () => {
      const tsNode = new HyperseTsNode();
      const context: ResolveHookContext = {
        parentURL: 'file:///test/root/src/parent.ts',
        conditions: [],
        importAttributes: {
          type: 'import',
          specifier: 'some-module',
        },
      };

      expect(tsNode.checkTsNode('some-module', context)).toBe(true);
      expect(tsNode.isTsNode).toBe(true);
    });

    it('should handle invalid URLs gracefully', () => {
      const tsNode = new HyperseTsNode();

      expect(tsNode.checkTsNode('invalid-url')).toBe(false);
      expect(tsNode.isTsNode).toBe(false);
    });
  });
});
