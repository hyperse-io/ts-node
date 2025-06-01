import path from 'path';
import { describe, expect, it } from 'vitest';
import { createPathMatcher } from '../../src/tool/createPathMatcher.js';

describe('createPathMatcher', () => {
  const mockBaseUrl = '/project/root';
  const mockReadJson = (filePath: string) => {
    if (filePath.includes('package.json')) {
      return {
        main: 'dist/index.js',
        exports: {
          '.': {
            import: './dist/index.mjs',
            require: './dist/index.cjs',
          },
        },
      };
    }
    return null;
  };

  const mockFileExists = (filePath: string) => {
    console.log('testFileExists:', filePath);
    return filePath.includes('index') || filePath.includes('module');
  };

  it('should resolve basic paths correctly', () => {
    const paths = {
      '@utils/*': ['src/utils/*'],
      '@components/*': ['src/components/*'],
    };
    const matcher = createPathMatcher(mockBaseUrl, paths);

    const result = matcher('@utils/helper', mockReadJson, mockFileExists, [
      '.ts',
      '.js',
    ]);

    // mockReadJson return `false`, so try to resolve main fields from package.json
    expect(result).toBe(
      path.join(mockBaseUrl, 'src/utils/helper/dist/index.js')
    );
  });

  it('should handle paths with file extensions', () => {
    const paths = {
      '@lib/*': ['src/lib/*.ts'],
      '@config': ['src/config/index.js'],
    };
    const matcher = createPathMatcher(mockBaseUrl, paths);

    // mockFileExists return `true`, so directly return the matched path
    const result = matcher('@lib/module', mockReadJson, mockFileExists, [
      '.js',
      '.ts',
    ]);

    // Should strip the extension from the path
    expect(result).toBe(path.join(mockBaseUrl, 'src/lib/module'));
  });

  it('should respect mainFields configuration', () => {
    const paths = {
      '@package/*': ['packages/*'],
    };
    const matcher = createPathMatcher(mockBaseUrl, paths);

    const result = matcher(
      '@package/new',
      mockReadJson,
      mockFileExists,
      ['.mjs', '.cjs', '.js'],
      ['exports', 'main']
    );

    // Should use the exports field from package.json
    expect(result).toBe(path.join(mockBaseUrl, 'packages/new/dist/index.js'));
  });

  it('should handle addMatchAll option', () => {
    const paths = {
      '@specific/*': ['src/specific/*'],
    };

    // Test without addMatchAll
    const matcherWithoutMatchAll = createPathMatcher(mockBaseUrl, paths, false);
    const resultWithoutMatchAll = matcherWithoutMatchAll(
      '@unknown/module',
      mockReadJson,
      mockFileExists,
      ['main']
    );
    expect(resultWithoutMatchAll).toBeUndefined();

    // Test with addMatchAll (default)
    const matcherWithMatchAll = createPathMatcher(mockBaseUrl, paths);
    const resultWithMatchAll = matcherWithMatchAll(
      '@unknown/module',
      mockReadJson,
      mockFileExists
    );
    expect(resultWithMatchAll).toBe(path.join(mockBaseUrl, '@unknown/module'));
  });

  it('should not interfere with built-in modules', () => {
    const paths = {
      'events/*': ['src/events/*'], // This could potentially conflict with Node's built-in 'events' module
    };
    const matcher = createPathMatcher(mockBaseUrl, paths);

    // Should not resolve built-in 'events' module
    const result = matcher('events', mockReadJson, () => false);
    expect(result).toBeUndefined();

    // Should still resolve our custom events path
    const customResult = matcher('events/custom', mockReadJson, mockFileExists);
    expect(customResult).toBe(
      path.join(mockBaseUrl, 'src/events/custom/dist/index.js')
    );
  });

  it('should handle multiple path mappings for the same pattern', () => {
    const paths = {
      '@shared/*': ['src/shared/*', 'packages/shared/*'],
    };
    const matcher = createPathMatcher(mockBaseUrl, paths);

    // Mock fileExists to return true for the second path
    const customFileExists = (filePath: string) => {
      console.log('customFileExists:', filePath);
      return filePath.includes('packages/shared');
    };

    const result = matcher('@shared/module', mockReadJson, customFileExists);

    // Should use the first path that exists
    expect(result).toBe(path.join(mockBaseUrl, 'packages/shared/module'));
  });
});
