import { projectC } from '@test/project-c';

export const printB = (str: string) => {
  projectC();
  console.log(`printB: ${str}`);
};
