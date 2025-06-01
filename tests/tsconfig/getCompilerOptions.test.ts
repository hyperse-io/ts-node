import { join } from 'path';
import { getCompilerOptions } from '../../src/tsconfig/getCompilerOptions.js';
import { getDirname } from '../test-utils.js';

describe('get compiler options', () => {
  const fixtureCwd = getDirname(import.meta.url, './tsconfig-tests');

  it('Read "tsconfig.01.json"', () => {
    const options = getCompilerOptions(join(fixtureCwd, './tsconfig.01.json'));

    expect(options).toMatchObject({
      rootDir: './src',
      outDir: './dist',
      baseUrl: './',
      paths: {
        '@models/*': ['./models/*'],
        '@tool/*': ['./tool/*'],
      },
    });
  });

  it('Read "tsconfig.02.json"', () => {
    const options = getCompilerOptions(join(fixtureCwd, './tsconfig.02.json'));

    expect(options).toMatchObject({
      rootDir: './src',
      outDir: './dist',
      baseUrl: './',
      paths: {
        '@models/*': ['./models/*'],
        '@tool/*': ['./tool/*'],
      },
    });
  });

  it('Read "tsconfig.03.json"', () => {
    const options = getCompilerOptions(join(fixtureCwd, './tsconfig.03.json'));
    expect(options).toMatchObject({
      rootDir: './src',
      outDir: './dist',
      baseUrl: './',
      paths: {
        '@models/*': ['./models/*'],
        '@tool/*': ['./tool/*'],
      },
    });
  });

  it('Read "tsconfig.npm.json"', () => {
    const options = getCompilerOptions(join(fixtureCwd, './tsconfig.npm.json'));
    expect(options).toMatchObject({
      module: 'nodenext',
      moduleResolution: 'nodenext',
      target: 'es2020',
    });
  });

  it('Read "tsconfig.compiler-options.json"', () => {
    expect(() => {
      getCompilerOptions(join(fixtureCwd, './tsconfig.compiler-options.json'));
    }).toThrowError('`compilerOptions` are missing in "tsconfig.json"!');
  });

  it('Read "tsconfig.no-fields.json"', () => {
    expect(() => {
      getCompilerOptions(join(fixtureCwd, './tsconfig.no-fields.json'));
    }).toThrowError(
      'Fields `baseUrl`, `rootDir`, `outDir`, `paths` are missing in "tsconfig.json"!'
    );
  });
});
