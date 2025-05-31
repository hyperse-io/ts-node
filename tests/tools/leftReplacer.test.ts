import { leftReplacer } from '../../src/tool/leftReplacer.js';
import { TsConfig } from '../../src/tsconfig/TsConfig.js';
import { getDirname } from '../test-utils.js';

describe('leftReplacer', () => {
  it('should replace matching prefix with replacer', () => {
    expect(leftReplacer('/foo/bar/baz', '/foo', '/qux')).toBe('/qux/bar/baz');
    expect(leftReplacer('/foo/bar/baz', '/foo/src', '/qux')).toBe(
      '/foo/bar/baz'
    );
    expect(leftReplacer('/foo/bar/baz', '/foo/bar', '/qux')).toBe('/qux/baz');
    expect(leftReplacer('./', './', 'dist')).toBe('dist');
    expect(leftReplacer('./', '.', 'dist')).toBe('dist/');
  });

  it('should return original string if prefix does not match', () => {
    expect(leftReplacer('/foo/bar/baz', '/qux', '/xyz')).toBe('/foo/bar/baz');
  });

  it('should handle empty replacer', () => {
    expect(leftReplacer('/foo/bar/baz', '/foo', '')).toBe('/bar/baz');
    expect(leftReplacer('/foo/bar/baz', '/foo/src', '')).toBe('/foo/bar/baz');
  });

  it('should handle undefined replacer', () => {
    expect(leftReplacer('/foo/bar/baz', '/foo', undefined)).toBe('/bar/baz');
  });

  it('should handle empty pattern', () => {
    expect(leftReplacer('/foo/bar/baz', '', '/qux')).toBe('/qux/foo/bar/baz');
  });

  it('should handle tsconfig paths', () => {
    const tsconfig = new TsConfig(
      getDirname(import.meta.url, '../tsconfig/tsconfig-tests/tsconfig.01.json')
    );
    const tsconfigOpts = tsconfig.getCompilerOptions();
    const baseUrl = leftReplacer(
      // /Users/tianyingchun/Documents/hyperse-io/ts-node-paths
      tsconfigOpts.baseUrl,
      // /Users/tianyingchun/Documents/hyperse-io/ts-node-paths/src
      tsconfigOpts.rootDir,
      // /Users/tianyingchun/Documents/hyperse-io/ts-node-paths/dist
      tsconfigOpts.outDir
    );
    expect(baseUrl).toBe(tsconfigOpts.baseUrl);
  });
});
