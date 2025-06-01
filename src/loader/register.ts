import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

process.on('uncaughtException', (err) => {
  console.error(err);
  process.exit(1);
});

register('@hyperse/ts-node/esm', pathToFileURL('./').toString());
