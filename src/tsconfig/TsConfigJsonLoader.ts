import { getTsconfig, type TsConfigJsonResolved } from 'get-tsconfig';
import { basename, resolve } from 'path';
import { TsConfigNotFoundError } from './errors/index.js';

export class TsConfigJsonLoader {
  /**
   * The resolved absolute filesystem path to the TypeScript configuration file
   */
  public configPath: string;

  /**
   * The path to the tsconfig.json file. Can be either a relative path from the project root
   * or an absolute filesystem path.
   * @param configPath
   */
  constructor(configPath: string, projectCwd = '') {
    this.configPath = resolve(projectCwd, configPath);
  }

  /**
   * Attempts to resolve and load the TypeScript configuration file specified by `configPath`.
   * The file is searched for in the directory specified by `configPath` and its parent directories.
   * @returns The parsed and resolved TypeScript configuration object
   * @throws {TsConfigNotFoundError} If no valid tsconfig file is found
   */
  loadSync(): TsConfigJsonResolved {
    // tsconfig.json, tsconfig.build.json, ...
    const configName = basename(this.configPath);
    const tsConfig = getTsconfig(
      this.configPath,
      configName.endsWith('.json') ? configName : undefined
    );
    if (!tsConfig) {
      throw new TsConfigNotFoundError();
    }
    return tsConfig.config;
  }
}
