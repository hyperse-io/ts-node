import type { ResolveHookContext } from 'node:module';
import { fileURLToPath } from 'node:url';
import { HYPERSE_TS_NODE } from './constants.js';
import { Tsconfig } from './tsconfig/index.js';
import { type CompilerOptions } from './types/tsconfig.js';

export class HyperseTsNode {
  #opts: CompilerOptions;
  get opts(): CompilerOptions {
    return this.#opts;
  }

  #isTsNode: boolean;
  get isTsNode(): boolean {
    return this.#isTsNode;
  }

  constructor(path?: string) {
    // Get options
    const tsconfig = new Tsconfig(path ?? process.env['HPS_TS_NODE_PROJECT']);
    this.#opts = tsconfig.getCompilerOptions();

    // Check if the path is on source
    this.#isTsNode = false;
  }

  get verbose(): boolean {
    const verbose = process.env['HPS_TS_NODE_VERBOSE'];
    return verbose?.toLowerCase() === 'true';
  }

  showInConsole(): void {
    if (this.verbose) {
      console.log('------------------------------------');
      console.log('@hyperse/ts-node/esm');
      console.log('Preparing to execute...');
      console.log('------------------------------------');
    }
  }

  checkTsNode(url: string): boolean;
  checkTsNode(specifier: string, context: ResolveHookContext): boolean;
  checkTsNode(...args: [string, ResolveHookContext?]): boolean {
    const found = Object.getOwnPropertySymbols(process).some(
      (x) => x === HYPERSE_TS_NODE
    );

    try {
      if (found) {
        this.#isTsNode = true;
      } else if (args.length === 1) {
        const path = fileURLToPath(args[0]);
        this.#isTsNode = path.startsWith(this.#opts.rootDir);
      } else if (typeof args[1]?.parentURL !== 'string') {
        const path = fileURLToPath(args[0]);
        this.#isTsNode = path.startsWith(this.#opts.rootDir);
      } else {
        const path = fileURLToPath(args[1].parentURL);
        this.#isTsNode = path.startsWith(this.#opts.rootDir);
      }
    } catch {
      this.#isTsNode = false;
    }

    if (this.#isTsNode && !found) {
      if (this.verbose) {
        console.log('------------------------------------');
        console.log('Source file found!');
        console.log('Using "@hyperse/ts-node"...');
        console.log('------------------------------------');
      }
      (process as any)[HYPERSE_TS_NODE] = true;
    }

    return this.#isTsNode;
  }
}

/**
 * A constant to manage the current library status.
 */
export const hpsTsNode = new HyperseTsNode();
