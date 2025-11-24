import { builtinModules, isBuiltin } from 'node:module';
import { dirname, join } from 'node:path';
import type { FileExistsSync } from 'tsconfig-paths';
import { logger } from '../logger.js';
import { TsConfig } from '../tsconfig/index.js';
import { createPathMatcher } from './createPathMatcher.js';
import { isValidFileUrl, normalizeParentUrl } from './normalizeUrl.js';
import { searchProjectDir } from './searchProjectDir.js';

export class HpsSpecifierLoader {
  constructor(
    private readonly specifier: string,
    private readonly parentUrl?: string
  ) {}

  resolve(
    /**
     * Resolve the specifier to a file path.
     * @param fileExists - A function that checks if a file exists, usefull for unit test.
     * @returns The resolved file path.
     */
    fileExists?: FileExistsSync
  ) {
    // Built-in modules should not be resolved, directly return the specifier.
    if (builtinModules.includes(this.specifier) || isBuiltin(this.specifier)) {
      return this.specifier;
    }

    // If it's absolute path, return the specifier.
    if (isValidFileUrl(this.specifier)) {
      return this.specifier;
    }

    const { compilerOptions } = this.constructContext();

    // create tsconfig.json paths based matcher
    const pathMatcher = createPathMatcher(
      compilerOptions.baseUrl,
      compilerOptions.paths
    );

    // resolve specifier to file path
    const resolvedFilePath = pathMatcher(this.specifier, undefined, fileExists);

    // If failed to resolve, fallback to swc-node resolver, just return the specifier.
    if (!resolvedFilePath) {
      return this.specifier;
    }

    logger.debug(
      `transform specifier: ${this.specifier} to ${resolvedFilePath}`
    );

    return resolvedFilePath;
  }

  private constructContext() {
    let projectCwd: string | undefined;

    // If parentUrl is provided, use it to resolve projectCwd, normally it is a mono repo project.
    if (this.parentUrl) {
      const parentPath = normalizeParentUrl(this.parentUrl);
      projectCwd = searchProjectDir({ cwd: dirname(parentPath) });
    }

    // If can not resolve projectCwd, use current working directory.
    if (!projectCwd) {
      projectCwd = process.cwd();
    }

    // Construct tsconfig.json path for parent project context.
    const tsConfigPath = join(
      projectCwd,
      process.env['HPS_TS_NODE_PROJECT'] ?? 'tsconfig.json'
    );

    // Get options from tsconfig.json
    const tsconfig = new TsConfig(tsConfigPath);
    const compilerOptions = tsconfig.getCompilerOptions(dirname(tsConfigPath));

    return {
      projectCwd,
      compilerOptions,
    };
  }
}
