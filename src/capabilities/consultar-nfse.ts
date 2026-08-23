import { defineCapability } from "@invokta/core";

import {
  inputSchema,
  outputSchema,
} from "../openapi/contracts/consultar-nfse.js";
import type { ConsultarNfsePort } from "../openapi/ports.js";

export function consultarNfse(port: ConsultarNfsePort) {
  return defineCapability({
    title: "Obter NFS-e",
    description: "Retorna a nota pelo `id`, com o `status` atual e o resultado do último processamento\r\n(`processingDetail`). Use para acompanhar o status quando não usa webhooks.",
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
