import { join, resolve } from 'path';
import { TsConfig } from '../../src/tsconfig/TsConfig.js';
import { getDirname } from '../test-utils.js';

describe('test suites of tsconfig', () => {
  const fixtureCwd = getDirname(import.meta.url, './tsconfig-tests');

  it('should auto resolve and load project root tsconfig.json when no path provided', () => {
    const tsconfig = new TsConfig('./tsconfig.json');
    expect(tsconfig.path).toBe('./tsconfig.json');
    const opts = tsconfig.getCompilerOptions();
    expect(opts?.baseUrl).toBe(resolve('./'));
    expect(opts?.rootDir).toBe(resolve('./'));
    expect(opts?.outDir).toBe(resolve('./dist'));
    expect(opts?.paths).toMatchObject({
      '@hyperse/ts-node': ['./src/index.js'],
    });
  });

  it('Get Aliases "tsconfig.01.json"', () => {
    const tsconfig = new TsConfig(join(fixtureCwd, './tsconfig.01.json'));
    expect(tsconfig.path).toBe(join(fixtureCwd, './tsconfig.01.json'));
    const opts = tsconfig.getCompilerOptions();

    expect(opts?.baseUrl).toBe(resolve('./'));
    expect(opts?.rootDir).toBe(resolve('./src'));
    expect(opts?.outDir).toBe(resolve('./dist'));
    expect(opts?.paths).toMatchObject({
      '@models/*': ['./models/*'],
      '@tool/*': ['./tool/*'],
    });
  });

  it('Get Aliases "tsconfig.02.json"', () => {
    const tsconfig = new TsConfig(join(fixtureCwd, './tsconfig.02.json'));
    const opts = tsconfig.getCompilerOptions();

    expect(opts?.baseUrl).toBe(resolve('./'));
    expect(opts?.rootDir).toBe(resolve('./src'));
    expect(opts?.outDir).toBe(resolve('./dist'));
    expect(opts?.paths).toMatchObject({
      '@models/*': ['./models/*'],
      '@tool/*': ['./tool/*'],
    });
  });

  it('Get Aliases "tsconfig.03.json"', () => {
    const tsconfig = new TsConfig(join(fixtureCwd, './tsconfig.03.json'));
    const opts = tsconfig.getCompilerOptions();

    expect(opts?.baseUrl).toBe(resolve('./'));
    expect(opts?.rootDir).toBe(resolve('./src'));
    expect(opts?.outDir).toBe(resolve('./dist'));
    expect(opts?.paths).toMatchObject({
      '@models/*': ['./models/*'],
      '@tool/*': ['./tool/*'],
    });
  });

  it('Should correctly resolve baseUrl, rootDir and outDir paths relative to project root', () => {
    const tsconfig = new TsConfig(join(fixtureCwd, './tsconfig.03.json'));
    const opts = tsconfig.getCompilerOptions(fixtureCwd);

    expect(opts?.baseUrl).toBe(resolve(fixtureCwd, './'));
    expect(opts?.rootDir).toBe(resolve(fixtureCwd, './src'));
    expect(opts?.outDir).toBe(resolve(fixtureCwd, './dist'));
    expect(opts?.paths).toMatchObject({
      '@models/*': ['./models/*'],
      '@tool/*': ['./tool/*'],
    });
  });
});
