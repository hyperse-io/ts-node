import type { Options } from 'execa';
import { execa } from 'execa';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const getDirname = (url: string, ...paths: string[]) => {
  return join(dirname(fileURLToPath(url)), ...paths);
};

/**
 * Normalize the path to the platform-specific format without drive letter
 * @param path - The path to normalize
 * @returns The normalized path
 */
export function normalizePlatformPath(path: string = ''): string {
  // Remove drive letter like F: using regex: ^\w:
  return process.platform === 'win32'
    ? path.replace(/\//g, '\\').replace(/^\w:/, '')
    : path.replace(/\\/g, '/');
}
/**
 * Process execute typescript script file using `@hyperse/ts-node`
 * @param program - The absolute typescript file path
 * @param options - The configuration of `execa` { env: { TS_NODE_PROJECT: tsconfig } }
 * @param args - The runtime argv for program
 */
const runTsScript = <T extends Options>(
  program: string,
  options: T,
  ...args: string[]
) => {
  const moduleArgs = ['--import', '@hyperse/ts-node/register', '--no-warnings'];
  return execa('node', moduleArgs.concat(program, ...args), {
    ...options,
  });
};

export async function runTsCliMock(
  program: string,
  cwd?: string,
  ...args: string[]
) {
  const result = await runTsScript(
    program,
    {
      cwd,
      env: {
        HPS_TS_NODE_PROJECT: 'tsconfig.json',
      },
    },
    ...args
  );
  return {
    stdout: result.stdout,
    stderr: result.stderr,
    exitCode: result.exitCode,
  };
}
