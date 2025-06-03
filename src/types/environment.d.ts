export {};

// Here we declare the members of the process.env object, so that we
// can use them in our application code in a type-safe manner.
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SWC_NODE_PROJECT?: string;
      HPS_TS_NODE_PROJECT?: string;
      HPS_TS_NODE_LOG_LEVEL?: '0' | '1' | '2' | '3' | '4';
      HPS_TS_NODE_LOG_TIMESTAMP?: 'true' | 'false';
    }
  }
}
