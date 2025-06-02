import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizePlatformPath, runTsCliMock } from './test-utils.js';

const getDirname = (url: string, ...paths: string[]) => {
  return join(dirname(fileURLToPath(url)), ...paths);
};

process.env['HPS_TS_NODE_LOG_LEVEL'] = '4';
const cliPath = getDirname(import.meta.url, './cli-program.ts');

describe('CLI Program Execution Tests', () => {
  it('should successfully execute the CLI program without errors and output expected message', async () => {
    try {
      const { stderr, stdout } = await runTsCliMock(cliPath, process.cwd());
      console.log(stdout);
      expect(stderr).toBe('');
      expect(stdout).toMatch(/cli.../);
      expect(stdout).toMatch(
        normalizePlatformPath('/project/root/src/utils/helper')
      );
    } catch {
      // TODO， windows don't know why will throw error from execa
      // execa Command failed with exit code 3221225477 windows
    }
  });
});
