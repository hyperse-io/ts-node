import { HpsSpecifierLoader } from '../../src/tool/HpsSpecifierLoader.js';
import { normalizePlatformPath } from '../test-utils.js';

// Mock the Tsconfig class
vi.mock('../../src/tsconfig/TsConfig.js', () => {
  const MockedTsConfig = vi.fn().mockImplementation(function (
    this: any,
    _tsConfigPath?: string
  ) {
    this.getCompilerOptions = (projectCwd = '') => {
      const baseUrl = projectCwd || '/project/root';
      return {
        baseUrl,
        rootDir: baseUrl,
        outDir: `${baseUrl}/dist`,
        paths: {
          '@utils/*': ['src/utils/*'],
          '@components/*': ['src/components/*'],
          '@config': ['src/config.ts'],
        },
      };
    };
    return this;
  });
  return {
    TsConfig: MockedTsConfig,
  };
});

describe('HpsSpecifierLoader', () => {
  const originalCwd = process.cwd;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    // Mock process.cwd
    process.cwd = vi.fn().mockReturnValue('/project/root');
  });

  afterEach(() => {
    // Restore original process.cwd
    process.cwd = originalCwd;
  });

  describe('built-in modules', () => {
    it('should return the specifier for built-in modules', () => {
      const loader = new HpsSpecifierLoader('fs');
      expect(loader.resolve()).toBe('fs');
    });

    it('should return the specifier for node: prefixed built-in modules', () => {
      const loader = new HpsSpecifierLoader('node:path');
      expect(loader.resolve()).toBe('node:path');
    });
  });

  describe('file URLs', () => {
    it('should return the specifier for valid file URLs', () => {
      // file:///project/root/src/index.ts
      const fileUrl = `file://project/root/src/index.ts`;
      const loader = new HpsSpecifierLoader(fileUrl);
      expect(loader.resolve()).toBe(fileUrl);
    });
  });

  describe('path alias resolution', () => {
    it('should resolve path aliases defined in tsconfig', () => {
      const loader = new HpsSpecifierLoader('@utils/helper');
      const resolved = loader.resolve((filePath: string) =>
        filePath.includes('helper')
      );
      expect(normalizePlatformPath(resolved)).toMatch(
        normalizePlatformPath('/project/root/src/utils/helper')
      );
    });

    it('should resolve exact path aliases', () => {
      const loader = new HpsSpecifierLoader('@config');
      const resolved = loader.resolve((filePath: string) => {
        return filePath.includes('config.ts');
      });
      expect(normalizePlatformPath(resolved)).toMatch(
        normalizePlatformPath('/project/root/src/config')
      );
    });

    it('should return original specifier for unknown aliases', () => {
      const loader = new HpsSpecifierLoader('@unknown/module');
      expect(normalizePlatformPath(loader.resolve())).toBe(
        normalizePlatformPath('@unknown/module')
      );
    });
  });

  describe('project directory resolution', () => {
    it('should use parent URL to resolve project directory', () => {
      const parentUrl = `file:///project/root/src/index.ts`;
      const loader = new HpsSpecifierLoader('@utils/helper', parentUrl);
      const resolved = loader.resolve((filePath: string) => {
        return filePath.includes('helper');
      });
      expect(normalizePlatformPath(resolved)).toMatch(
        normalizePlatformPath('/project/root/src/utils/helper')
      );
    });

    it('should fallback to current working directory when parent URL is invalid', () => {
      const loader = new HpsSpecifierLoader('@utils/helper', 'invalid://url');
      const resolved = loader.resolve((filePath: string) => {
        return filePath.includes('helper');
      });
      expect(normalizePlatformPath(resolved)).toMatch(
        normalizePlatformPath('/project/root/src/utils/helper')
      );
    });
  });
});
