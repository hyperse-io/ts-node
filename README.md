# @hyperse/ts-node

Faster TypeScript/JavaScript transformer without typechecking and node-gyp and postinstall script.

<p align="left">
  <a aria-label="Build" href="https://github.com/hyperse-io/ts-node/actions?query=workflow%3ACI">
    <img alt="build" src="https://img.shields.io/github/actions/workflow/status/hyperse-io/ts-node/ci-integrity.yml?branch=main&label=ci&logo=github&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="stable version" href="https://www.npmjs.com/package/@hyperse/ts-node">
    <img alt="stable version" src="https://img.shields.io/npm/v/%40hyperse%2Fts-node?branch=main&label=version&logo=npm&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="Top language" href="https://github.com/hyperse-io/ts-node/search?l=typescript">
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/hyperse-io/ts-node?style=flat-square&labelColor=000&color=blue">
  </a>
  <a aria-label="Licence" href="https://github.com/hyperse-io/ts-node/blob/main/LICENSE">
    <img alt="Licence" src="https://img.shields.io/github/license/hyperse-io/ts-node?style=flat-quare&labelColor=000000" />
  </a>
</p>

A TypeScript path alias resolver for Node.js applications that works seamlessly with both development (ts-node) and production environments. This package automatically resolves path aliases based on your `tsconfig.json` configuration, eliminating the need for complex relative imports.

## Features

- 🔄 Automatic path resolution for both source (`src`) and compiled (`dist`) directories
- 🎯 Full TypeScript path alias support via `tsconfig.json` with extends and module resolution
- 🚀 ESM-first design with support for Node.js 20.6+
- 🔧 Zero configuration required - works out of the box
- 🛠️ Utility functions for dynamic path resolution
- ✨ Support for TypeScript decorators and metadata reflection
- 🔍 Smart path alias resolution
- 🎭 Seamless development and production environments
- ⚡️ Lightning fast performance with SWC
- 🧪 Comprehensive test coverage

## ⚠️ Important Notice

This package is:

- Designed primarily for backend applications and unit testing
- Currently in **experimental** status
- Requires thorough testing before production use
- Runtime sourcemap support via `sourceMap: true` in `tsconfig.json` for enhanced debugging

## Installation

```bash
npm install --save @hyperse/ts-node
```

## Quick Start

### 1. Configure `tsconfig.json`

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "baseUrl": "./",
    "sourceMap": true,
    "paths": {
      "@utils/*": ["./src/utils/*"],
      "@components/*": ["./src/components/*"],
      "@config": ["./src/config.ts"]
    }
  }
}
```

### 2. Usage in ESM Projects

For Node.js 20.6+:

```json
{
  "scripts": {
    "dev": "node --import=@hyperse/ts-node/register ./src/index.ts",
    "start": "node --import=@hyperse/ts-node/register ./dist/index.js"
  }
}
```

For Node.js ≤20.5 (deprecated):

```json
{
  "scripts": {
    "dev": "node --loader @hyperse/ts-node/esm ./src/index.ts",
    "start": "node --loader @hyperse/ts-node/esm ./dist/index.js"
  }
}
```

## Environment Variables

| Variable                    | Description              | Default         |
| --------------------------- | ------------------------ | --------------- |
| `HPS_TS_NODE_PROJECT`       | Path to tsconfig file    | `tsconfig.json` |
| `HPS_TS_NODE_LOG_LEVEL`     | Log level [0-4]          | `2` Info        |
| `HPS_TS_NODE_LOG_TIMESTAMP` | Enable timestamp in logs | `false`         |

## API Reference

### `createPathMatcher()`

Create a path resolver for your aliases:

```ts
import { createPathMatcher, HpsSpecifierLoader } from '@hyperse/ts-node';
import path from 'path';

const matcher = createPathMatcher('/project/root', {
  '@utils/*': ['src/utils/*'],
  '@components/*': ['src/components/*'],
});

// Resolve paths
const result = matcher('@utils/helper', {
  extensions: ['.ts', '.js'],
  // Optional: custom file existence checker
  fileExists: (filePath) => filePath.includes('index'),
});
```

## Best Practices

1. **Path Aliases**

   - Keep aliases simple and intuitive
   - Use consistent naming patterns
   - Avoid conflicts with built-in module names

2. **Project Structure**

```text
  project/
  ├── src/          # Source files
  ├── dist/         # Compiled files
  ├── tsconfig.json # TypeScript configuration
  └── package.json  # Project configuration
```

## Limitations

1. Requires a valid `tsconfig.json` file in the project root
2. Path resolution must be within the `rootDir` directory
3. All required properties must be accessible in the `tsconfig` inheritance chain
4. Not recommended for production use without thorough testing and validation

## Contributing

Contributions are welcome! Please read our [contributing guidelines](https://github.com/hyperse-io/.github/blob/main/CONTRIBUTING.md) before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
