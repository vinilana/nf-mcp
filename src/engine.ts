import "./env.js";

import { createOpenApiEngine } from "./openapi-engine.js";
import { spedyConnector } from "./openapi/connector.js";

function connectorConfigFromEnv(
  env: Readonly<Record<string, string | undefined>>,
): { readonly SPEDY_API_KEY: string; readonly SPEDY_BASE_URL: string } {
  return {
    SPEDY_API_KEY: env.SPEDY_API_KEY ?? "",
    SPEDY_BASE_URL: env.SPEDY_BASE_URL ?? "",
  };
}

const connector = spedyConnector.create(
  connectorConfigFromEnv(process.env),
  { fetch: globalThis.fetch },
);

export const engine = createOpenApiEngine({
  ports: connector.ports,
});
