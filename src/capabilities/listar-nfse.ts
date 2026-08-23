import { defineCapability } from "@invokta/core";

import {
  inputSchema,
  outputSchema,
} from "../openapi/contracts/listar-nfse.js";
import type { ListarNfsePort } from "../openapi/ports.js";

export function listarNfse(port: ListarNfsePort) {
  return defineCapability({
    title: "Listar Notas Fiscais",
    description: "Lista as notas fiscais da empresa, das mais recentes para as mais antigas, com paginação\r\ne filtros por período de competência, `status`, `integrationId`, `transactionId` e dados do\r\ndestinatário.",
    input: inputSchema,
    output: outputSchema,
    access: "authenticated",
    timeoutMs: 30_000,
    annotations: {
      readOnly: true,
      destructive: false,
      idempotent: true,
      openWorld: true,
    },
    async run({ input, context }) {
      return port.invoke(input, {
        signal: context.signal,
      });
    },
  });
}
