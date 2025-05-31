import { yellow } from 'colorette';
import { showWarns } from '../../src/tool/showWarns.js';

describe('showWarns', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('should show warning message once', () => {
    showWarns('test message');
    showWarns('test message');

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(
      `${yellow('WARN')}: test message`,
      undefined
    );
  });

  it('should show warning with context', () => {
    showWarns('test message1', 'test context');

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(
      `${yellow('WARN')}: test message1`,
      'test context'
    );
  });
});
