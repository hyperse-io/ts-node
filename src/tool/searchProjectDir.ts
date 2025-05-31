import { dirname } from 'node:path';
import type { Options } from 'package-up';
import { packageUpSync } from 'package-up';

/**
 * Find the closest package.json file
 * @returns Returns the file path, or undefined if it could not be found.
 */
export const searchProjectDir = (options: Options) => {
  const packageFile = packageUpSync(options);
  if (packageFile && !/node_modules/.test(packageFile)) {
    return dirname(packageFile);
  }
  return undefined;
};
