describe('swc-node compatibility ', () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.HPS_TS_NODE_PROJECT;
  });

  afterEach(() => {
    process.env.HPS_TS_NODE_PROJECT = originalEnv;
    delete process.env.SWC_NODE_PROJECT;
  });

  it('should set SWC_NODE_PROJECT when HPS_TS_NODE_PROJECT is set', async () => {
    process.env.HPS_TS_NODE_PROJECT = 'test.tsconfig.json';
    await import('../../src/loader/register.js');
    expect(process.env.SWC_NODE_PROJECT).toBe('test.tsconfig.json');
  });

  it('should not set SWC_NODE_PROJECT when HPS_TS_NODE_PROJECT is not set', async () => {
    delete process.env.HPS_TS_NODE_PROJECT;
    await import('../../src/loader/register.js');
    expect(process.env.SWC_NODE_PROJECT).toBeUndefined();
  });
});
