import { fileURLToPath } from 'node:url';
/**
 * Normalize the parentUrl to the correct path.
 * @param parentUrl - The parentUrl to normalize.
 * @returns The normalized parentUrl.
 */
export function normalizeParentUrl(parentUrl: string): string {
  const path =
    process.platform !== 'win32'
      ? new URL(parentUrl).pathname
      : fileURLToPath(parentUrl);

  return path;
}
