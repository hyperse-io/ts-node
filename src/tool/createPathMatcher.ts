import { existsSync } from 'fs';
import {
  type FileExistsSync,
  matchFromAbsolutePaths,
  type ReadJsonSync,
} from 'tsconfig-paths';
import {
  getAbsoluteMappingEntries,
  type MappingEntry,
} from 'tsconfig-paths/lib/mapping-entry.js';

/**
 * Creates a function that can resolve paths according to tsconfig paths property.
 *
 * @param absoluteBaseUrl Absolute version of baseUrl as specified in tsconfig.
 * @param paths The paths as specified in tsconfig.
 * @param mainFields A list of package.json field names to try when resolving module files. Select a nested field using an array of field names.
 * @param addMatchAll Add a match-all "*" rule if none is present
 * @returns a function that can resolve paths.
 */
export function createPathMatcher(
  absoluteBaseUrl: string,
  paths: Record<string, string[]>,
  addMatchAll: boolean = true
) {
  const absolutePaths: ReadonlyArray<MappingEntry> = getAbsoluteMappingEntries(
    absoluteBaseUrl,
    paths,
    addMatchAll
  )
    .map((s) => {
      return {
        ...s,
        paths: s.paths.map((p) =>
          p.replace(/\.(js|jsx|cjs|mjs|ts|tsx|mts|cts)$/gi, '')
        ),
      };
    })
    .sort((a, b) => b.paths.length - a.paths.length);

  return (
    requestedModule: string,
    readJson?: ReadJsonSync,
    fileExists?: FileExistsSync,
    extensions: Array<string> = [
      '.ts',
      '.tsx',
      '.mts',
      '.cts',
      '.js',
      '.cjs',
      '.mjs',
      '.jsx',
      '.json',
    ],
    mainFields: Array<string | string[]> = ['main', 'exports']
  ) => {
    const matchFileResolver: FileExistsSync = (filePath: string) => {
      const fileExistsResult = fileExists
        ? fileExists(filePath)
        : existsSync(filePath);
      return fileExistsResult ?? false;
    };

    // Make sure request module we have not file extension
    const requestSepcifier = requestedModule.replace(
      /\.(js|jsx|cjs|mjs|ts|tsx|mts|cts)$/gi,
      ''
    );
    return matchFromAbsolutePaths(
      absolutePaths,
      requestSepcifier,
      readJson,
      matchFileResolver,
      extensions,
      mainFields
    );
  };
}
