import type { LoadHook, ResolveHook } from 'module';
import { pathToFileURL } from 'url';
import { load as loadTs, resolve as resolveTs } from '@swc-node/register/esm';
import { hpsTsNode } from '../hpsTsNode.js';
import { createMatchPath } from '../tool/createMatchPath.js';
import { replace } from '../tool/replace.js';

hpsTsNode.showInConsole();

const matchPath = createMatchPath(hpsTsNode.opts.baseUrl, hpsTsNode.opts.paths);

export const load: LoadHook = async (url, context, nextLoad) => {
  const isTsNode = hpsTsNode.checkTsNode(url);
  if (isTsNode) {
    return loadTs(url, context, nextLoad);
  } else {
    return nextLoad(url, context);
  }
};

// Use the ts-node mechanism only if applied
export const resolve: ResolveHook = async (specifier, context, nextResolve) => {
  const isTsNode = hpsTsNode.checkTsNode(specifier, context);
  if (isTsNode) {
    // Handle module resolution using ts-node and path mapping
    const lastIndexOfIndex = specifier.lastIndexOf('/index.js');
    if (lastIndexOfIndex !== -1) {
      // Handle index.js
      const trimmed = specifier.substring(0, lastIndexOfIndex);
      const match = matchPath(trimmed);
      if (match) {
        return resolveTs(
          pathToFileURL(`${match}/index.js`).href,
          context,
          nextResolve
        );
      }
    } else {
      const ext = (specifier.match(/\.(m|c)?js$/gi) ?? ['.js'])[0];
      const clearedPath = specifier.replace(/\.(m|c)?js$/gi, '');

      const match = matchPath(clearedPath);
      if (match) {
        return resolveTs(
          pathToFileURL(`${match}${ext}`).href,
          context,
          nextResolve
        );
      } else if (typeof context.parentURL === 'string') {
        const newPath = replace(specifier, context.parentURL);
        if (typeof newPath === 'string') {
          const newUrl =
            process.platform !== 'win32'
              ? pathToFileURL(newPath).href
              : newPath;

          return resolveTs(newUrl, context, nextResolve);
        }
      }
    }
    return resolveTs(specifier, context, nextResolve);
  } else {
    // Use node directly, skipping ts-node
    const newEspecif = replace(specifier, context.parentURL);
    if (typeof newEspecif === 'string') {
      return nextResolve(newEspecif, context);
    } else {
      return nextResolve(specifier, context);
    }
  }
};
