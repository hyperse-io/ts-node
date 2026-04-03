import { type TsConfigJson } from 'get-tsconfig';

type SetRequired<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};

export type CompilerOptions = SetRequired<
  TsConfigJson.CompilerOptions,
  'rootDir' | 'outDir' | 'paths'
>;
