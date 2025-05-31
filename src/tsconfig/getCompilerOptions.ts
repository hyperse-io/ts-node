import { showWarns } from '../tool/showWarns.js';
import { type CompilerOptions } from '../types/tsconfig.js';
import {
  TsConfigCompilerOptionsNotFoundError,
  TsConfigFieldsNotFoundError,
} from './errors/index.js';
import { TsConfigJsonLoader } from './TsConfigJsonLoader.js';

// `strictBuiltinIteratorReturn` Built-in iterators are instantiated with a `TReturn` type of undefined instead of `any`.
const ignoreCompilerOptionsFields: (keyof CompilerOptions)[] = [
  'strictBuiltinIteratorReturn',
];

export function getCompilerOptions(configPath: string): CompilerOptions {
  const configJson = new TsConfigJsonLoader(configPath).loadSync();
  const compilerOptions = configJson.compilerOptions;
  const requiredFields: Array<keyof CompilerOptions> = [
    'baseUrl',
    'rootDir',
    'outDir',
  ];

  if (!compilerOptions || Object.keys(compilerOptions).length === 0) {
    throw new TsConfigCompilerOptionsNotFoundError();
  }

  if (!requiredFields.every((field) => !!compilerOptions[field])) {
    throw new TsConfigFieldsNotFoundError();
  }

  if (compilerOptions.baseUrl?.startsWith('./src')) {
    showWarns(
      "Recommend using './' instead of './src' for `baseUrl` in tsconfig",
      configPath
    );
  }

  for (const field of ignoreCompilerOptionsFields) {
    delete compilerOptions[field];
  }

  return {
    paths: {},
    // https://forgemia.inra.fr/lipme/ts-biofiledetector/-/blob/main/tsconfig.json
    ...compilerOptions,
    // Set `strict` to false to avoid unnecessary type checking
    strict: false,
    // Disable `verbatimModuleSyntax` to avoid unnecessary type checking of import/export syntax
    // https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax
    verbatimModuleSyntax: false,
  } as CompilerOptions;
}
