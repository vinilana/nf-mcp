import type {
  ListarNfseInput,
  ListarNfseOutput,
} from "./contracts/listar-nfse.js";
import type {
  ConsultarNfseInput,
  ConsultarNfseOutput,
} from "./contracts/consultar-nfse.js";
import type {
  EmitirNfseInput,
  EmitirNfseOutput,
} from "./contracts/emitir-nfse.js";

declare const operationIdentity: unique symbol;

export interface OpenApiOperationPort<
  OperationName extends string = string,
  Input extends Readonly<Record<string, unknown>> = Readonly<Record<string, unknown>>,
  Output extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly [operationIdentity]?: OperationName;
  readonly invoke: (
    input: Input,
    options: Readonly<{ readonly signal: AbortSignal }>,
  ) => Promise<Output>;
}

export type ListarNfsePort = OpenApiOperationPort<
  "listarNfse",
  ListarNfseInput,
  ListarNfseOutput
>;
export type ConsultarNfsePort = OpenApiOperationPort<
  "consultarNfse",
  ConsultarNfseInput,
  ConsultarNfseOutput
>;
export type EmitirNfsePort = OpenApiOperationPort<
  "emitirNfse",
  EmitirNfseInput,
  EmitirNfseOutput
>;

export interface OpenApiPorts {
  readonly listarNfse: ListarNfsePort;
  readonly consultarNfse: ConsultarNfsePort;
  readonly emitirNfse: EmitirNfsePort;
}
