import { projectB } from '@test/project-b';
import { printA } from '@utils/printb';

export const projectA = () => {
  projectB();
  printA('projectA...');
};
