import { createPathMatcher } from '@hyperse/ts-node';
const mockFileExists = (filePath: string) => {
  const test = filePath.includes('index') || filePath.includes('module');
  return test;
};

const pathMatcher = createPathMatcher('/project/root', {
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
