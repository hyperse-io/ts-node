import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { showWarns } from '../tool/showWarns.js';

process.on('uncaughtException', (err) => {
  console.error(err);
  process.exit(1);
});

if (process.env.TS_NODE_PROJECT) {
  showWarns('USING `HPS_TS_NODE_PROJECT` instead ');
  delete process.env.TS_NODE_PROJECT;
}

register('@hyperse/ts-node/esm', pathToFileURL('./').toString());
