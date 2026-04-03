import { type CompilerOptions } from '../types/tsconfig.js';
import {
  TsConfigCompilerOptionsNotFoundError,
  TsConfigFieldsNotFoundError,
} from './errors/index.js';
import { TsConfigLoader } from './TsConfigLoader.js';

// `strictBuiltinIteratorReturn` Built-in iterators are instantiated with a `TReturn` type of undefined instead of `any`.
const ignoreCompilerOptionsFields: (keyof CompilerOptions)[] = [
  'strictBuiltinIteratorReturn',
];

/**
 * After `extends`, merged `baseUrl` can point at `./node_modules/<preset>/...` (preset used `"."`).
 * That path must not be used as the root for `paths`; TS 6+ expects mappings relative to the project tsconfig dir.
 */
function normalizeMergedBaseUrl(baseUrl: string | undefined): string {
  if (baseUrl == null || baseUrl === '') return './';
  const posix = baseUrl.replace(/\\/g, '/');
  if (posix.includes('/node_modules/') || posix.startsWith('node_modules/')) {
    return './';
  }
  return baseUrl;
}

export function getCompilerOptions(configPath: string): CompilerOptions {
  const configJson = new TsConfigLoader(configPath).loadSync();
  const compilerOptions = configJson.compilerOptions;
  const requiredFields: Array<keyof CompilerOptions> = ['rootDir', 'outDir'];

  if (!compilerOptions || Object.keys(compilerOptions).length === 0) {
    throw new TsConfigCompilerOptionsNotFoundError();
  }

  if (!requiredFields.every((field) => !!compilerOptions[field])) {
    throw new TsConfigFieldsNotFoundError();
  }

  for (const field of ignoreCompilerOptionsFields) {
    delete compilerOptions[field];
  }

  return {
    paths: {},
    // https://forgemia.inra.fr/lipme/ts-biofiledetector/-/blob/main/tsconfig.json
    ...compilerOptions,
    // TS 6.0 deprecates `baseUrl`; when omitted, path mappings are relative to the tsconfig directory (same as baseUrl: "./").
    baseUrl: normalizeMergedBaseUrl(compilerOptions.baseUrl),
    // Set `strict` to false to avoid unnecessary type checking
    strict: false,
    // Disable `verbatimModuleSyntax` to avoid unnecessary type checking of import/export syntax
    // https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax
    verbatimModuleSyntax: false,
  } as CompilerOptions;
}
