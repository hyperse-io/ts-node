export class TsConfigFieldsNotFoundError extends Error {
  constructor() {
    super('Fields `rootDir`, `outDir` are missing in "tsconfig.json"!');
  }
}
