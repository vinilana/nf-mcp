import { createEngine } from "@invokta/core";

import { listarNfse } from "./capabilities/listar-nfse.js";
import { consultarNfse } from "./capabilities/consultar-nfse.js";
import { emitirNfse } from "./capabilities/emitir-nfse.js";
import type { OpenApiPorts } from "./openapi/ports.js";

export interface CreateOpenApiEngineOptions {
  readonly ports: OpenApiPorts;
}

export function createOpenApiEngine({ ports }: CreateOpenApiEngineOptions) {
  return createEngine({
    name: "spedy-nfse-mcp",
    version: "0.1.0",
    capabilities: {
      "nota-fiscal.listar-nfse": listarNfse(ports.listarNfse),
      "nota-fiscal.consultar": consultarNfse(ports.consultarNfse),
      "nota-fiscal.emitir": emitirNfse(ports.emitirNfse),
    },
  });
}
