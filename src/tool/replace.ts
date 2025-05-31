import { dirname, join, resolve } from 'path';
import { pathToFileURL } from 'url';
import { hpsTsNode } from '../hpsTsNode.js';
import { TsConfig } from '../tsconfig/TsConfig.js';
import { leftReplacer } from './leftReplacer.js';
import { searchProjectDir } from './searchProjectDir.js';

export function replace(
  specifier: string,
  parentUrl?: string
): string | undefined {
  // ParentURL is required
  if (typeof parentUrl !== 'string') {
    return specifier;
  }

  // Check if inside of...
  const path =
    process.platform !== 'win32'
      ? new URL(parentUrl).pathname
      : new URL(parentUrl).pathname
          .replace(/^(\\|\/)+/g, '')
          .replace(/\//g, '\\');

  const projectCwd = searchProjectDir({
    cwd: dirname(path),
  });

  // handle mono repo dependency project tsconfig path
  const projectTsconfig = new TsConfig(
    projectCwd ? join(projectCwd, './tsconfig.json') : undefined
  );

  const tsconfigOpts = projectTsconfig.getCompilerOptions(projectCwd);

  const base = hpsTsNode.isTsNode
    ? tsconfigOpts.baseUrl
    : leftReplacer(
        tsconfigOpts.baseUrl,
        tsconfigOpts.rootDir,
        tsconfigOpts.outDir
      );

  if (path.startsWith(base)) {
    // support config `@hyperse/logger/node`, `@hyperse/logger`
    const pathEntries = Object.entries(tsconfigOpts.paths)
      .map(([k, v]) => ({
        alias: k.replace(/\*/g, ''),
        path: v[0]?.replace(/\*/g, ''),
      }))
      .sort((a, b) => b.alias.length - a.alias.length);

    const found = pathEntries.find(({ alias }) => specifier.startsWith(alias));

    if (found) {
      const fullPath = resolve(base, found.path);
      const result =
        specifier !== found.alias
          ? join(fullPath, leftReplacer(specifier, found.alias, ''))
          : fullPath;

      let out: string;
      if (hpsTsNode.isTsNode) {
        out = result.replace(/\.js$/gi, '.ts').replace(/\.mjs$/gi, '.mts');
      } else {
        out = result.replace(/\.ts$/gi, '.js').replace(/\.mts$/gi, '.mjs');
      }

      if (process.platform === 'win32') {
        return pathToFileURL(out).href;
      } else {
        return out;
      }
    }
  }

  return undefined;
}
