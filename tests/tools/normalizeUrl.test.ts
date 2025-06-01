import { normalizeParentUrl } from '../../src/tool/normalizeUrl.js';

describe('normalizeUrl', () => {
  it('should return the correct parent url for posix platform', () => {
    vi.stubGlobal('process', { platform: 'posix' });

    const parentUrls: string[] = [
      'file:///Users/tianyingchun/Documents/hyperse-io/ts-node/tests/cli-test-program.ts',
      'file:///Users/tianyingchun/Documents/hyperse-io/ts-node/src/index.ts',
      '@test/project-a',
      './src/index.ts',
    ];

    const expectedUrls: string[] = [
      '/Users/tianyingchun/Documents/hyperse-io/ts-node/tests/cli-test-program.ts',
      '/Users/tianyingchun/Documents/hyperse-io/ts-node/src/index.ts',
      '@test/project-a',
      './src/index.ts',
    ];

    parentUrls.forEach((url, index) => {
      expect(normalizeParentUrl(url)).toBe(expectedUrls[index]);
    });
  });

  it('should return the correct parent url for windows platform', () => {
    vi.stubGlobal('process', { platform: 'win32' });
    const parentUrls: string[] = [
      'file:///C:/Users/tianyingchun/Documents/hyperse-io/ts-node/tests/cli-test-program.ts',
      'file:///C:/Users/tianyingchun/Documents/hyperse-io/ts-node/src/index.ts',
    ];

    const expectedUrls: string[] = [
      'C:\\Users\\tianyingchun\\Documents\\hyperse-io\\ts-node\\tests\\cli-test-program.ts',
      'C:\\Users\\tianyingchun\\Documents\\hyperse-io\\ts-node\\src\\index.ts',
    ];

    parentUrls.forEach((url, index) => {
      expect(normalizeParentUrl(url)).toBe(expectedUrls[index]);
    });
  });
});
