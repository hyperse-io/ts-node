import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runTsCliMock } from './test-utils.js';

const getDirname = (url: string, ...paths: string[]) => {
  return join(dirname(fileURLToPath(url)), ...paths);
};

process.env['HPS_TS_NODE_LOG_LEVEL'] = '4';
const cliPath = getDirname(import.meta.url, '../e2e/mono/main/src/index.ts');

describe('CLI Program Execution Tests', () => {
  it('should successfully execute the CLI program without errors and output expected message', async () => {
    const { stderr, stdout } = await runTsCliMock(cliPath, process.cwd());
    console.log(stdout);
    expect(stderr).toBe('');
    expect(stdout).toMatch(/printC: projectC.../);
    expect(stdout).toMatch(/printB: projectB.../);
    expect(stdout).toMatch(/printA: projectA.../);
  });
});
