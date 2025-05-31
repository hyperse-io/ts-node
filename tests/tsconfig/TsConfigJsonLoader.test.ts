import { join, resolve } from 'path';
import { TsConfigNotFoundError } from '../../src/tsconfig/errors/TsConfigNotFoundError.js';
import { TsConfigJsonLoader } from '../../src/tsconfig/TsConfigJsonLoader.js';
import { getDirname } from '../test-utils.js';

describe('TsConfigJsonLoader', () => {
  // /Users/xxxx/Documents/hyperse-io/ts-node-paths/tsconfig.json
  const rootTsConfigjson = resolve(process.cwd(), 'tsconfig.json');

  it('should load tsconfig.json successfully', () => {
    const loader = new TsConfigJsonLoader('./tsconfig.json');
    const config = loader.loadSync();
    expect(loader.configPath).toBe(rootTsConfigjson);
    expect(config).toMatchObject({
      compilerOptions: {
        baseUrl: './',
        rootDir: './',
        outDir: './dist',
      },
    });
  });

  it('should resolve path correctly', () => {
    const relativePath = './tsconfig.json';
    const loader = new TsConfigJsonLoader(relativePath);
    expect(loader.configPath).toBe(join(process.cwd(), relativePath));
  });

  it('should load tsconfig.build.json successfully', () => {
    const loader = new TsConfigJsonLoader('./tsconfig.build.json');
    const config = loader.loadSync();
    expect(config).toBeDefined();
  });

  it('should throw TsConfigNotFoundError when config not found', () => {
    const loader = new TsConfigJsonLoader('./non-existent.json');
    expect(() => loader.loadSync()).toThrow(TsConfigNotFoundError);
  });

  it('should load tsconfig.json with projectCwd', () => {
    const loader = new TsConfigJsonLoader(
      './tsconfig.json',
      getDirname(import.meta.url, './tsconfig-tests')
    );
    const config = loader.loadSync();
    expect(config.compilerOptions).toMatchObject({
      rootDir: './src',
      outDir: './dist',
      baseUrl: './src',
      paths: {
        '@root/*': ['./root/*'],
      },
    });
    expect(loader.configPath).toBe(
      getDirname(import.meta.url, './tsconfig-tests/tsconfig.json')
    );
  });
});
