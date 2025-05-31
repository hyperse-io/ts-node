import { packageUpSync } from 'package-up';
import { vi } from 'vitest';
import { searchProjectDir } from '../../src/tool/searchProjectDir.js';

vi.mock('package-up');

describe('searchMonoProjectDir', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return directory path when package.json is found outside node_modules', () => {
    const mockPackageFile = '/path/to/package.json';
    vi.mocked(packageUpSync).mockImplementation(() => mockPackageFile);

    const result = searchProjectDir({ cwd: '/some/path' });

    expect(result).toBe('/path/to');
    expect(packageUpSync).toHaveBeenCalledWith({ cwd: '/some/path' });
  });

  it('should return undefined when package.json is in node_modules', () => {
    const mockPackageFile = '/path/node_modules/pkg/package.json';
    vi.mocked(packageUpSync).mockImplementation(() => mockPackageFile);

    const result = searchProjectDir({ cwd: '/some/path' });

    expect(result).toBeUndefined();
  });

  it('should return undefined when no package.json found', () => {
    vi.mocked(packageUpSync).mockImplementation(() => undefined);

    const result = searchProjectDir({ cwd: '/some/path' });

    expect(result).toBeUndefined();
  });
});
