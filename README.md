# @hyperse/ts-node

<p align="left">
  <a aria-label="Build" href="https://github.com/hyperse-io/ts-node/actions?query=workflow%3ACI">
    <img alt="build" src="https://img.shields.io/github/actions/workflow/status/hyperse-io/ts-node/ci-integrity.yml?branch=main&label=ci&logo=github&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="stable version" href="https://www.npmjs.com/package/@hyperse/ts-node">
    <img alt="stable version" src="https://img.shields.io/npm/v/%40hyperse%2Fts-node?branch=main&label=version&logo=npm&style=flat-quare&labelColor=000000" />
  </a>
  <a>
    <img alt="LoC" src="https://img.shields.io/bundlephobia/min/%40hyperse%2Fts-node?style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="Top language" href="https://github.com/hyperse-io/ts-node/search?l=typescript">
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/hyperse-io/ts-node?style=flat-square&labelColor=000&color=blue">
  </a>
  <a aria-label="Licence" href="https://github.com/hyperse-io/ts-node/blob/main/LICENSE">
    <img alt="Licence" src="https://img.shields.io/github/license/hyperse-io/ts-node?style=flat-quare&labelColor=000000" />
  </a>
</p>

A package to bind paths alias, resolving the `source` directory when the app is launched with ts-node, or resolving the `out` directory when ts-node isn't used. Includes some utilities in case if you need to generate paths dinamically depending of the code that is running.

This package has been designed to work with ESM projects (using [--loader](https://nodejs.org/api/esm.html#loaders) flag).

With this package, you can forget about those ugly imports like:

```ts
import { Jajaja } from '../../../../../../../jajaja.js';
import { Gegege } from '../../../../../gegege.js';
```

...and instead you can use alias like this (with the power of intellisense):

```ts
import { Jajaja } from '@alias-a/jajaja.js';
import { Gegege } from '@alias-b/gegege.js';
```

## Disclaimer

This package is designed to work in end-user backend aplications for unit-testing purpose

Also, this package is **experimental** and probably can generate unexpected behaviors, or performance issues. For that reason, <u>**you must test intensively this package in all possible use cases if do you want to implement in production.**</u>

## Installation

```bash
npm i --save @hyperse/ts-node
```

## Usage

To explain all features of this package, we will use this project estructure as example:

```bash
# Your current working directory
project-folder
│   # The project dependencies
├── node_modules
│
│   # The transpiled files
├── dist
│   │   # The file when the app starts
│   ├── index.js
│   │
│   ├── folder-a
│   │   ├── ...
│   │   └── ...
│   ├── folder-b
│   │   ├── ...
│   │   └── ...
│   └── ...
│
│   # The source code
├── src
│   │   # The file when the app starts
│   ├── index.ts
│   │
│   ├── folder-a
│   │   ├── ...
│   │   └── ...
│   ├── folder-b
│   │   ├── ...
│   │   └── ...
│   ├── file-x.ts
│   └── ...
│
│   # The project configuration files
├── package.json
├── package-lock.json
└── tsconfig.json
```

### Configure your `tsconfig.json`

This package reads the `tsconfig.json` file (and is capable to find values if the file extends another configuration files) to declare the alias. A typical configuration coul be similar to this:

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",

    "baseUrl": "./src",
    "paths": {
      "@file-x": ["./file-x.ts"],
      "@alias-a/*": ["./folder-a/*"],
      "@alias-b/*": ["./folder-b/*"]
    }
  }
}
```

### ENV

Path to tsconfig file. Environment: `HPS_TS_NODE_PROJECT`

```ts
runTsScript(
  program,
  {
    env: {
      HPS_TS_NODE_PROJECT: 'tsconfig.json',
    },
  },
  ...args
);
```

Enable `verbose` status messages by Environment: `'HPS_TS_NODE_VERBOSE': 'true'`

The fields listed in the example of above are all required in order to the correct working of the package.

### for **ESM** `type:module` projects with node>=20.6

- scripts (node 20.6+)

  ```json
  {
    "serve": "yarn node --import=@hyperse/ts-node/register ./config/dev-server.ts"
  }
  ```

## Utilities

This package includes `dotnet` package, so if you want, create a `.env` file in your current working directory.

### Function `isTsNodeRunning`

If you want to check if `ts-node` is running, you can execute this function:

```ts
import { isTsNodeRunning } from '@hyperse/ts-node';

const response = isTsNodeRunning(); // Returns a boolean
console.log('if hps-ts-node is running?', response);
```

### Function `pathResolve`

Resolve any subfolder of `"rootDir"` depending if **ts-node** is running. For example, imagine do you want to resolve the path `"./src/folder-a/*"`:

```ts
import { pathResolve } from '@hyperse/ts-node';

const path = pathResolve('./folder-a/*');
console.log('path:', path);
```

With **ts-node** the output is:

```bash
node --loader @hyperse/ts-node/esm ./src/index.ts # for esm project with node<=20.5, deprecated
node --import=@hyperse/ts-node/register ./scripts/build.ts # for esm project with node>=20.6

# path: src/folder-a/*
```

With the transpiled code:

```bash
node --loader @hyperse/ts-node/esm ./dist/index.js # for esm project with node<=20.5, deprecated
node --import=@hyperse/ts-node/register ./dist/index.js # for esm project with node>=20.6

# path: dist/folder-a/*
```

Optionally receives as second parameter an object with this options:

- `"absolute"`:

  > If `true`, returns the full path, otherwise returns the path relative to the current working directory.

- `"ext"`:
  > If true, converts the extensions `*.ts` / `*.mts` / `*.cts` / `*.js` / `*.mjs` / `*.cjs` depending if **ts-node** is running or not.

## Limitations

- The library requires a `"tsconfig.json"` file into the current working directory to work. Doesn't matter if that file extends another file, or be a part of a set of inhetirance, **while all required properties are accesible through its ancestors.**

- The resolve output between `"baseURL"` and the `"paths"` declared in the `"tsconfig.json"` file must always return a path inside of `"rootDir"` folder.
- Recommand setup your `tsconfig.json`, `baseUrl` to `./`

```ts
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    // If the code contains import 'events' and it coincidentally matches the paths baseUrl /src/events directory,
    // it may cause the built-in events module to be incorrectly resolved as a relative module of the project.
    // NOTE: recommmand config baseUrl:'./' Instead of use `./src`
    // Avoid run into issue of "builtin module `events` wrong resolved as `./src/events`"
    "baseUrl": "./",
    "allowJs": false,
    "noEmit": false,
    "incremental": true,
    "paths": {
      "@hyperse/testing": ["../../packages/testing/src/index.js"]
    },
    "types": ["vitest/globals"]
  },
  "exclude": ["**/node_modules", "**/.*/", "dist", "build"]
}

```
