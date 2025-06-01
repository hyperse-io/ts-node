import type { LoadHook, ResolveHook } from 'node:module';
import { load as loadTs, resolve as resolveTs } from '@swc-node/register/esm';
import { HpsSpecifierLoader } from '../tool/HpsSpecifierLoader.js';

export const load: LoadHook = async (url, context, nextLoad) => {
  return loadTs(url, context, nextLoad);
};

// Use the ts-node mechanism only if applied
export const resolve: ResolveHook = async (specifier, context, nextResolve) => {
  const hpsSpecifierLoader = new HpsSpecifierLoader(
    specifier,
    context.parentURL
  );
  const resolvedFilePath = hpsSpecifierLoader.resolve();
  if (!resolvedFilePath) {
    return nextResolve(specifier, context);
  }
  return resolveTs(resolvedFilePath, context, nextResolve);
};
