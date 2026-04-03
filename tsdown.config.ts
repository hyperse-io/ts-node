import { defineConfig, type OutExtensionContext } from 'tsdown';

const shared = {
  platform: 'node' as const,
  target: 'es2020',
  treeshake: true,
  tsconfig: './tsconfig.build.json',
  hash: false,
  outExtensions: ({ format }: OutExtensionContext) => ({
    js: format === 'cjs' ? '.cjs' : '.js',
  }),
};

export default defineConfig([
  {
    name: 'index',
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    ...shared,
  },
  {
    name: 'loader-esm',
    entry: { 'loader/esm': 'src/loader/esm.ts' },
    format: 'esm',
    dts: false,
    clean: false,
    ...shared,
  },
  {
    name: 'loader-register',
    entry: { 'loader/register': 'src/loader/register.ts' },
    format: 'esm',
    dts: false,
    clean: false,
    ...shared,
  },
]);
