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
export function createMatchPath(
  absoluteBaseUrl: string,
  paths: Record<string, string[]>,
  mainFields: Array<string | string[]> = ['main'],
  addMatchAll: boolean = true
) {
  const absolutePaths: ReadonlyArray<MappingEntry> = getAbsoluteMappingEntries(
    absoluteBaseUrl,
    paths,
    addMatchAll
  ).map((s) => {
    return {
      ...s,
      // make sure that `paths` are without file extensions, remove `.js` from the end
      // 1. paths: { "@hyperse/logger": ['../../src/index.js'] }
      // 2. paths: { "@hyperse/logger": ['../../src/index.ts'] }
      // ==> { pattern:'@hyperse/logger', paths:['/Users/tianyingchun/Documents/flatjs-next/dev-kits/packages/logger/src/index']}
      paths: s.paths.map((p) =>
        p.replace(/\.(js|jsx|cjs|mjs|ts|tsx|mts|cts)$/gi, '')
      ),
    };
  });

  return (
    requestedModule: string,
    readJson?: ReadJsonSync,
    fileExists?: FileExistsSync,
    extensions?: Array<string>
  ) =>
    // If the code contains import 'events' and it coincidentally matches the paths baseUrl `/src/events` directory,
    // it may cause the built-in events module to be incorrectly resolved as a relative module of the project.
    // NOTE: recommmand config baseUrl:'./' Instead of use `./src`
    matchFromAbsolutePaths(
      absolutePaths,
      requestedModule,
      readJson,
      fileExists,
      extensions,
      mainFields
    );
}
