import type { ListarNfseInput } from "./openapi/contracts/listar-nfse.js";
import { reportConnectorConfigurationFailure } from "./openapi/startup.js";

function parseInput(text: string): ListarNfseInput {
  const value: unknown = JSON.parse(text);
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new TypeError("Input must be a JSON object.");
  }
  return value as ListarNfseInput;
}

try {
  const input = parseInput(process.argv[2] ?? "{}");
  const { engine } = await import("./engine.js");
  const result = await engine.invoke(
    "nota-fiscal.listar-nfse",
    input,
    { source: "direct", principal: { id: "direct:local" } },
  );

  process.stdout.write(`${JSON.stringify(result)}\n`);
} catch (error) {
  if (!reportConnectorConfigurationFailure(error)) throw error;
}
