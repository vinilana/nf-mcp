import { defineCapability } from "@invokta/core";

import {
  inputSchema,
  outputSchema,
} from "../openapi/contracts/emitir-nfse.js";
import type { EmitirNfsePort } from "../openapi/ports.js";

export function emitirNfse(port: EmitirNfsePort) {
  return defineCapability({
    title: "Criar NFS-e",
    description: "Cria uma **NFS-e** (nota de serviço) e a enfileira para emissão junto à prefeitura/provedor\r\nmunicipal. A emissão é **assíncrona**: a resposta `2xx` confirma que a solicitação foi aceita, não\r\nque a nota foi autorizada — acompanhe o resultado por webhook ou consulta.\r\n            \r\n**integrationId** — Identificador da nota no seu sistema (máx. 36 caracteres). Recomendado em todas as integrações:\r\n            \r\n- **Associação:** vincula a NFS-e gerada pela Spedy a um ID do seu sistema (ex: ID do pedido)\r\n- **Idempotência:** um segundo POST com o mesmo `integrationId` atualiza a nota existente em vez de criar uma nova — protege contra duplicidade em retries e timeouts\r\n- **Correção de rejeitada:** para corrigir uma NFS-e rejeitada, reenvie o POST com os dados corrigidos e o mesmo `integrationId` — sem necessidade de deletar a nota anterior",
    input: inputSchema,
    output: outputSchema,
    access: "authenticated",
    timeoutMs: 30_000,
    annotations: {
      readOnly: false,
      destructive: false,
      idempotent: false,
      openWorld: true,
    },
    async run({ input, context }) {
      return port.invoke(input, {
        signal: context.signal,
      });
    },
  });
}
