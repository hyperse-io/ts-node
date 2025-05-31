import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runTsCliMock } from './test-utils.js';

const getDirname = (url: string, ...paths: string[]) => {
  return join(dirname(fileURLToPath(url)), ...paths);
};

const cliPath = getDirname(import.meta.url, './cli-test-program.ts');

describe('CLI Program Execution Tests', () => {
  it('should successfully execute the CLI program without errors and output expected message', async () => {
    const { stderr, stdout } = await runTsCliMock(cliPath);
    expect(stderr).toBe('');
    expect(stdout).toMatch(/cli.../);
    expect(stdout).toMatch(/true/);
  });
});
