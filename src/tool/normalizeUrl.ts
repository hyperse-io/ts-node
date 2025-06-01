/**
 * Normalize the parentUrl to the correct path.
 * - `posix`: /Users/tianyingchun/Documents/hyperse-io/ts-node-paths/tests/cli-test-program.ts
 * - `windows`: C:\\Users\\tianyingchun\\Documents\\hyperse-io\\ts-node-paths\\tests\\cli-test-program.ts
 * @param parentUrl - The parentUrl to normalize.
 * - posix: 'file:///Users/tianyingchun/Documents/hyperse-io/ts-node-paths/src/index.ts'
 * - windows: 'file:///C:/Users/tianyingchun/Documents/hyperse-io/ts-node-paths/src/index.ts'
 * @returns The normalized parentUrl.
 */
export function normalizeParentUrl(parentUrl: string): string {
  if (!isValidFileUrl(parentUrl)) {
    return parentUrl;
  }
  const path =
    process.platform !== 'win32'
      ? new URL(parentUrl).pathname
      : new URL(parentUrl).pathname
          .replace(/^(\\|\/)+/g, '')
          .replace(/\//g, '\\');

  return path;
}

export function isValidFileUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'file:';
  } catch {
    return false;
  }
}
