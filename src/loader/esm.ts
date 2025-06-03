import type { LoadHook, ResolveHook } from 'node:module';
import { load as loadTs, resolve as resolveTs } from '@swc-node/register/esm';
import { HpsSpecifierLoader } from '../tool/HpsSpecifierLoader.js';

export const load: LoadHook = async (url, context, nextLoad) => {
  return loadTs(url, context, nextLoad);
};

// Use the ts-node mechanism only if applied
export const resolve: ResolveHook = async (specifier, context, nextResolve) => {
  // Try to analyze the specifier using tsconfig paths from the current project or sibling projects in a monorepo.
  // For example, in a monorepo structure like:
  //   Project A --> imports from Project B --> imports from Project C
  // Each project has its own tsconfig.json with paths mappings relative to its root.
  // The specifier will be resolved against the importing project's tsconfig paths first.
  const hpsSpecifierLoader = new HpsSpecifierLoader(
    specifier,
    context.parentURL
  );
  // First, try to resolve the specifier using tsconfig paths, then fallback to swc-node resolver
  const resolvedFilePath = hpsSpecifierLoader.resolve();

  // Second, try resolve using swc-node resolver
  return resolveTs(resolvedFilePath, context, nextResolve);
};
