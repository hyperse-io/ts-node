import { dirname, resolve } from 'node:path';
import { getCompilerOptions } from './getCompilerOptions.js';

export class TsConfig {
  private tsConfigPath: string;

  /**
   * The tsconfig.json file path you passed to the constructor.
   */
  get path(): string {
    return this.tsConfigPath;
  }

  /**
   * Initialize the TsConfig class.
   * @param tsConfigPath - The path to the tsconfig.json file.
   */
  constructor(tsConfigPath?: string) {
    this.tsConfigPath = tsConfigPath ?? './tsconfig.json';
  }

  /**
   * Normalize the tsconfig.json file path, make sure we have the correct absolute `baseUrl`, `rootDir`, `outDir`.
   * When `baseUrl` is omitted (TypeScript 6.0+ style), it defaults to the tsconfig directory, matching `paths` resolution.
   * @param projectCwd - Directory to resolve `rootDir` / `outDir` / `baseUrl` against (default: directory of this tsconfig file).
   * @returns The normalized tsconfig.json options.
   */
  getCompilerOptions(projectCwd?: string) {
    const opts = getCompilerOptions(this.tsConfigPath);
    const root =
      projectCwd !== undefined && projectCwd !== ''
        ? projectCwd
        : dirname(resolve(this.tsConfigPath));
    opts.baseUrl = resolve(root, opts.baseUrl ?? './');
    opts.rootDir = resolve(root, opts.rootDir);
    opts.outDir = resolve(root, opts.outDir);
    return opts;
  }
}
