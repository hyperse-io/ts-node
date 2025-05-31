import { resolve } from 'path';
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
   * @param projectCwd - The project root directory.
   * @returns The normalized tsconfig.json options.
   */
  getCompilerOptions(projectCwd = '') {
    const opts = getCompilerOptions(this.tsConfigPath);
    opts.baseUrl = resolve(projectCwd, opts.baseUrl);
    opts.rootDir = resolve(projectCwd, opts.rootDir);
    opts.outDir = resolve(projectCwd, opts.outDir);
    return opts;
  }
}
