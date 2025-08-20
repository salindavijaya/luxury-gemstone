// Try to import the canonical logger file; repo historically had both Logger.ts and logger.ts
let loggerDefault: any = null;
let loggerInstance: any = null;
try {
  // prefer exact import first
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("./logger");
  loggerDefault = mod.default || mod;
  loggerInstance = mod.logger;
} catch (e) {
  try {
    // fallback to capitalized file if present
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod2 = require("./Logger");
    loggerDefault = mod2.default || mod2;
    loggerInstance = mod2.logger;
  } catch (e2) {
    // no logger found; create a noop
    loggerDefault = { log: () => {}, error: () => {}, warn: () => {} };
  }
}

export const logger = (loggerInstance as any) || loggerDefault;
export default logger;
