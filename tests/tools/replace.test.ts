import { hpsTsNode } from '../../src/hpsTsNode.js';
import { replace } from '../../src/tool/replace.js';
import { searchProjectDir } from '../../src/tool/searchProjectDir.js';

// Mock dependencies
vi.mock('../../src/hpsTsNode.js', () => ({
  hpsTsNode: {
    isTsNode: false,
  },
}));

vi.mock('../../src/tool/searchProjectDir.js', () => ({
  searchProjectDir: vi.fn(),
}));

vi.mock('../../src/tsconfig/TsConfig.js', () => ({
  TsConfig: vi.fn().mockImplementation(() => ({
    getCompilerOptions: () => ({
      baseUrl: '/project/src',
      rootDir: '/project/src',
      outDir: '/project/dist',
      paths: {
        '@hyperse/*': ['packages/*'],
        '@hyperse/logger': ['packages/logger/src'],
      },
    }),
  })),
}));

describe('replace', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock searchProjectDir to return a project directory
    (searchProjectDir as any).mockReturnValue('/project');
  });

  it('should return specifier if parentUrl is not provided', () => {
    const specifier = '@hyperse/logger';
    expect(replace(specifier)).toBe(specifier);
  });

  it('should handle path resolution for non-Windows platform', () => {
    const specifier = '@hyperse/logger';
    const parentUrl = 'file:///project/src/index.ts';

    const result = replace(specifier, parentUrl);
    expect(result).toBe('/project/dist/packages/logger/src.js');
  });

  it('should handle path resolution for Windows platform', () => {
    vi.stubGlobal('process', { platform: 'win32' });

    const specifier = '@hyperse/logger';
    const parentUrl = 'file:///C:/project/src/index.ts';

    const result = replace(specifier, parentUrl);
    expect(result).toMatch(/^file:\/\/\/.*packages\/logger\/src\.js$/);

    vi.unstubAllGlobals();
  });

  it('should handle ts-node environment', () => {
    (hpsTsNode as any).isTsNode = true;

    const specifier = '@hyperse/logger';
    const parentUrl = 'file:///project/src/index.ts';

    const result = replace(specifier, parentUrl);
    expect(result).toBe('/project/src/packages/logger/src.ts');

    (hpsTsNode as any).isTsNode = false;
  });

  it('should handle wildcard path mappings', () => {
    const specifier = '@hyperse/other-package';
    const parentUrl = 'file:///project/src/index.ts';

    const result = replace(specifier, parentUrl);
    expect(result).toBe('/project/dist/packages/other-package.js');
  });

  it('should return undefined for non-matching paths', () => {
    const specifier = '@unknown/package';
    const parentUrl = 'file:///project/src/index.ts';

    const result = replace(specifier, parentUrl);
    expect(result).toBeUndefined();
  });

  it('should handle file extension conversions correctly', () => {
    // Test .ts to .js conversion
    const tsSpecifier = '@hyperse/logger/index.ts';
    const parentUrl = 'file:///project/src/index.ts';
    expect(replace(tsSpecifier, parentUrl)).toBe(
      '/project/dist/packages/logger/index.js'
    );

    // Test .mts to .mjs conversion
    const mtsSpecifier = '@hyperse/logger/index.mts';
    expect(replace(mtsSpecifier, parentUrl)).toBe(
      '/project/dist/packages/logger/index.mjs'
    );

    // Test in ts-node environment
    (hpsTsNode as any).isTsNode = true;
    expect(replace('@hyperse/logger/index.js', parentUrl)).toBe(
      '/project/src/packages/logger/index.ts'
    );
    expect(replace('@hyperse/logger/index.mjs', parentUrl)).toBe(
      '/project/src/packages/logger/index.mts'
    );
    (hpsTsNode as any).isTsNode = false;
  });
});
