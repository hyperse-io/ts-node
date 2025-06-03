import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

process.on('uncaughtException', (err) => {
  console.error(err);
  process.exit(1);
});

// For compatibility with swc-node
if (process.env.HPS_TS_NODE_PROJECT) {
  // https://github.com/swc-project/swc-node/blob/1c896356dc5573bd4c6103a94bb7cbc7376a6f05/packages/register/esm.mts#L31
  process.env.SWC_NODE_PROJECT = process.env.HPS_TS_NODE_PROJECT;
}

register('@hyperse/ts-node/esm', pathToFileURL('./').toString());
