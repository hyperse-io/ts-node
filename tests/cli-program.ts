import { createPathMatcher } from '@hyperse/ts-node';
import { normalizePlatformPath } from './test-utils.js';

const mockFileExists = (filePath: string) => {
  const test = filePath.includes('index') || filePath.includes('module');
  return test;
};

const pathMatcher = createPathMatcher(normalizePlatformPath('/project/root'), {
  '@utils/*': ['src/utils/*'],
  '@components/*': ['src/components/*'],
});

const resolvedFilePath = pathMatcher(
  '@utils/helper',
  undefined,
  mockFileExists
);
console.log('resolvedFilePath', resolvedFilePath);
console.log('cli...');
