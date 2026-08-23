import { Buffer } from "node:buffer";

import { EngineError, defineConnector } from "@invokta/core";
import { z } from "zod";

import {
  outputValidator as listarNfseOutputValidator,
  type ListarNfseInput,
  type ListarNfseOutput,
} from "./contracts/listar-nfse.js";
import {
  outputValidator as consultarNfseOutputValidator,
  type ConsultarNfseInput,
  type ConsultarNfseOutput,
} from "./contracts/consultar-nfse.js";
import {
  outputValidator as emitirNfseOutputValidator,
  type EmitirNfseInput,
  type EmitirNfseOutput,
} from "./contracts/emitir-nfse.js";
import type { OpenApiOperationPort } from "./ports.js";

interface OpenApiParameterPlan {
  readonly name: string;
  readonly in: "path" | "query" | "header" | "cookie";
  readonly required: boolean;
  readonly style: string;
  readonly explode: boolean;
}

interface OpenApiSecuritySchemePlan {
  readonly name: string;
  readonly type: "apiKey" | "basic" | "bearer";
  readonly in?: "header" | "query" | "cookie";
  readonly parameterName?: string;
  readonly environmentVariables: Readonly<
    Partial<Record<"value" | "username" | "password" | "token", string>>
  >;
}

interface OpenApiOperationPlan {
  readonly method: string;
  readonly path: string;
  readonly connection: Readonly<{
    baseUrl: Readonly<{
      environmentVariable: string;
      default?: string;
    }>;
  }>;
  readonly parameters: readonly OpenApiParameterPlan[];
  readonly requestBody?: Readonly<{
    required: boolean;
    mediaType: "application/json";
  }>;
  readonly successResponses: readonly Readonly<{
    status: string;
    mediaType?: string;
  }>[];
  readonly security: Readonly<{
    alternatives: readonly (readonly OpenApiSecuritySchemePlan[])[];
  }>;
}

export interface SpedyConnectorDependencies {
  readonly fetch: typeof globalThis.fetch;
}

const listarNfseOperation = {
  "method": "GET",
  "path": "/v1/service-invoices",
  "connection": {
    "baseUrl": {
      "environmentVariable": "SPEDY_BASE_URL"
    }
  },
  "parameters": [
    {
      "name": "effectiveDateStart",
      "in": "query",
      "required": false,
      "style": "form",
      "explode": true
    },
    {
      "name": "effectiveDateEnd",
      "in": "query",
      "required": false,
      "style": "form",
      "explode": true
    },
    {
      "name": "transactionId",
      "in": "query",
      "required": false,
      "style": "form",
      "explode": true
    },
    {
      "name": "integrationId",
      "in": "query",
      "required": false,
      "style": "form",
      "explode": true
    },
    {
      "name": "receiverFederalTaxNumber",
      "in": "query",
      "required": false,
      "style": "form",
      "explode": true
    },
    {
      "name": "receiverName",
      "in": "query",
      "required": false,
      "style": "form",
      "explode": true
    },
    {
      "name": "receiverEmail",
      "in": "query",
      "required": false,
      "style": "form",
      "explode": true
    },
    {
      "name": "page",
      "in": "query",
      "required": false,
      "style": "form",
      "explode": true
    },
    {
      "name": "pageSize",
      "in": "query",
      "required": false,
      "style": "form",
      "explode": true
    }
  ],
  "successResponses": [
    {
      "status": "200",
      "mediaType": "application/json"
    }
  ],
  "security": {
    "alternatives": [
      [
        {
          "name": "ApiKey",
          "type": "apiKey",
          "in": "header",
          "parameterName": "X-Api-Key",
          "environmentVariables": {
            "value": "SPEDY_API_KEY"
          }
        }
      ]
    ]
  }
} as const;

const consultarNfseOperation = {
  "method": "GET",
  "path": "/v1/service-invoices/{id}",
  "connection": {
    "baseUrl": {
      "environmentVariable": "SPEDY_BASE_URL"
    }
  },
  "parameters": [
    {
      "name": "id",
      "in": "path",
      "required": true,
      "style": "simple",
      "explode": false
    }
  ],
  "successResponses": [
    {
      "status": "200",
      "mediaType": "application/json"
    }
  ],
  "security": {
    "alternatives": [
      [
        {
          "name": "ApiKey",
          "type": "apiKey",
          "in": "header",
          "parameterName": "X-Api-Key",
          "environmentVariables": {
            "value": "SPEDY_API_KEY"
          }
        }
      ]
    ]
  }
} as const;

const emitirNfseOperation = {
  "method": "POST",
  "path": "/v1/service-invoices",
  "connection": {
    "baseUrl": {
      "environmentVariable": "SPEDY_BASE_URL"
    }
  },
  "parameters": [],
  "requestBody": {
    "required": true,
    "mediaType": "application/json"
  },
  "successResponses": [
    {
      "status": "200",
      "mediaType": "application/json"
    }
  ],
  "security": {
    "alternatives": [
      [
        {
          "name": "ApiKey",
          "type": "apiKey",
          "in": "header",
          "parameterName": "X-Api-Key",
          "environmentVariables": {
            "value": "SPEDY_API_KEY"
          }
        }
      ]
    ]
  }
} as const;

const maxUrlBytes = 8_192;
const maxRequestBytes = 10 * 1024 * 1024;
const maxResponseBytes = 10 * 1024 * 1024;
const publicFailureMessage = "The upstream API request failed.";
const decoder = new TextDecoder("utf-8", { fatal: true });
const encoder = new TextEncoder();

function failure(): EngineError {
  return new EngineError({
    code: "EXECUTION_FAILED",
    message: publicFailureMessage,
  });
}

function configurationFailure(): TypeError {
  return new TypeError("Invalid generated OpenAPI connector configuration.");
}

function record(value: unknown): Readonly<Record<string, unknown>> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw failure();
  }
  return value as Readonly<Record<string, unknown>>;
}

function group(
  input: Readonly<Record<string, unknown>>,
  name: string,
): Readonly<Record<string, unknown>> {
  const value = input[name];
  return value === undefined ? {} : record(value);
}

function scalar(value: unknown): string {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }
  throw failure();
}

function simple(value: unknown): string {
  return Array.isArray(value) ? value.map(scalar).join(",") : scalar(value);
}

function simplePath(value: unknown): string {
  return Array.isArray(value)
    ? value.map((member) => encodeURIComponent(scalar(member))).join(",")
    : encodeURIComponent(scalar(value));
}

function addQuery(
  url: URL,
  name: string,
  value: unknown,
  style: string,
  explode: boolean,
): void {
  if (style === "deepObject") {
    for (const [key, member] of Object.entries(record(value)).sort()) {
      url.searchParams.append(`${name}[${key}]`, scalar(member));
    }
    return;
  }
  if (Array.isArray(value) && explode) {
    for (const member of value) url.searchParams.append(name, scalar(member));
    return;
  }
  url.searchParams.append(name, simple(value));
}

function addCookie(
  cookies: string[],
  name: string,
  value: unknown,
  explode: boolean,
): void {
  const encodedName = encodeURIComponent(name);
  if (Array.isArray(value)) {
    const members = value.map((member) => encodeURIComponent(scalar(member)));
    cookies.push(
      explode
        ? members.map((member) => `${encodedName}=${member}`).join("&")
        : `${encodedName}=${members.join(",")}`,
    );
    return;
  }
  cookies.push(`${encodedName}=${encodeURIComponent(scalar(value))}`);
}

function environmentValue(
  env: Readonly<Record<string, string | undefined>>,
  name: string | undefined,
): string | undefined {
  if (name === undefined) return undefined;
  const value = env[name];
  return value === undefined || value === "" ? undefined : value;
}

function schemeComplete(
  scheme: OpenApiSecuritySchemePlan,
  env: Readonly<Record<string, string | undefined>>,
): boolean {
  if (scheme.type === "apiKey") {
    return environmentValue(env, scheme.environmentVariables.value) !== undefined;
  }
  if (scheme.type === "basic") {
    return (
      environmentValue(env, scheme.environmentVariables.username) !== undefined &&
      environmentValue(env, scheme.environmentVariables.password) !== undefined
    );
  }
  return environmentValue(env, scheme.environmentVariables.token) !== undefined;
}

function schemeConfigured(
  scheme: OpenApiSecuritySchemePlan,
  env: Readonly<Record<string, string | undefined>>,
): boolean {
  return Object.values(scheme.environmentVariables).some(
    (name) => environmentValue(env, name) !== undefined,
  );
}

function applyScheme(
  scheme: OpenApiSecuritySchemePlan,
  env: Readonly<Record<string, string | undefined>>,
  url: URL,
  headers: Headers,
  cookies: string[],
): void {
  if (scheme.type === "apiKey") {
    const value = environmentValue(env, scheme.environmentVariables.value);
    if (value === undefined || scheme.in === undefined || scheme.parameterName === undefined) {
      throw configurationFailure();
    }
    if (scheme.in === "header") headers.set(scheme.parameterName, value);
    else if (scheme.in === "query") url.searchParams.append(scheme.parameterName, value);
    else addCookie(cookies, scheme.parameterName, value, false);
    return;
  }
  if (scheme.type === "basic") {
    const username = environmentValue(env, scheme.environmentVariables.username);
    const password = environmentValue(env, scheme.environmentVariables.password);
    if (username === undefined || password === undefined) throw configurationFailure();
    headers.set(
      "authorization",
      `Basic ${Buffer.from(`${username}:${password}`, "utf8").toString("base64")}`,
    );
    return;
  }
  const token = environmentValue(env, scheme.environmentVariables.token);
  if (token === undefined) throw configurationFailure();
  headers.set("authorization", `Bearer ${token}`);
}

function applySecurity(
  operation: OpenApiOperationPlan,
  env: Readonly<Record<string, string | undefined>>,
  url: URL,
  headers: Headers,
  cookies: string[],
): void {
  const credentialed = operation.security.alternatives.filter(
    (alternative) =>
      alternative.length > 0 && alternative.every((scheme) => schemeComplete(scheme, env)),
  );
  if (credentialed.length > 1) throw configurationFailure();
  const selected = credentialed[0];
  if (selected !== undefined) {
    for (const scheme of selected) applyScheme(scheme, env, url, headers, cookies);
    return;
  }
  const partiallyConfigured = operation.security.alternatives.some(
    (alternative) =>
      alternative.length > 0 &&
      alternative.some((scheme) => schemeConfigured(scheme, env)),
  );
  if (partiallyConfigured) throw configurationFailure();
  if (operation.security.alternatives.some((alternative) => alternative.length === 0)) {
    return;
  }
  throw configurationFailure();
}

function baseUrl(
  operation: OpenApiOperationPlan,
  env: Readonly<Record<string, string | undefined>>,
): URL {
  const configured = environmentValue(
    env,
    operation.connection.baseUrl.environmentVariable,
  );
  const value = configured ?? operation.connection.baseUrl.default;
  if (value === undefined) throw configurationFailure();
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw configurationFailure();
    }
    if (parsed.username !== "" || parsed.password !== "") {
      throw configurationFailure();
    }
    return parsed;
  } catch {
    throw configurationFailure();
  }
}

function validateConfiguration(
  operation: OpenApiOperationPlan,
  env: Readonly<Record<string, string | undefined>>,
): void {
  const url = baseUrl(operation, env);
  applySecurity(operation, env, url, new Headers(), []);
}

function requestUrl(
  operation: OpenApiOperationPlan,
  input: Readonly<Record<string, unknown>>,
  env: Readonly<Record<string, string | undefined>>,
): Readonly<{ url: URL; headers: Headers; cookies: string[] }> {
  const root = baseUrl(operation, env);
  let path = operation.path;
  const headers = new Headers({ accept: "application/json, application/*+json" });
  const cookies: string[] = [];
  for (const parameter of operation.parameters) {
    const publicGroup =
      parameter.in === "header"
        ? "headers"
        : parameter.in === "cookie"
          ? "cookies"
          : parameter.in;
    const value = group(input, publicGroup)[parameter.name];
    if (value === undefined) {
      if (parameter.required) throw failure();
      continue;
    }
    if (parameter.in === "path") {
      path = path.replaceAll(`{${parameter.name}}`, simplePath(value));
    } else if (parameter.in === "header") {
      headers.set(parameter.name, simple(value));
    }
  }
  if (/\{[^{}]+\}/u.test(path)) throw failure();
  const rootPath = root.pathname.endsWith("/") ? root.pathname : `${root.pathname}/`;
  const operationPath = path.replace(/^\/+/u, "");
  const url = new URL(root.href);
  url.pathname = `${rootPath}${operationPath}`;
  url.search = "";
  url.hash = "";
  if (url.origin !== root.origin) throw failure();
  for (const parameter of operation.parameters) {
    if (parameter.in !== "query" && parameter.in !== "cookie") continue;
    const publicGroup = parameter.in === "cookie" ? "cookies" : "query";
    const value = group(input, publicGroup)[parameter.name];
    if (value === undefined) continue;
    if (parameter.in === "query") {
      addQuery(url, parameter.name, value, parameter.style, parameter.explode);
    } else {
      addCookie(cookies, parameter.name, value, parameter.explode);
    }
  }
  if (url.origin !== root.origin) throw failure();
  applySecurity(operation, env, url, headers, cookies);
  if (url.origin !== root.origin) throw failure();
  if (cookies.length > 0) headers.set("cookie", cookies.join("; "));
  if (encoder.encode(url.href).byteLength > maxUrlBytes) throw failure();
  return { url, headers, cookies };
}

function requestBody(
  operation: OpenApiOperationPlan,
  input: Readonly<Record<string, unknown>>,
  headers: Headers,
): string | undefined {
  if (operation.requestBody === undefined) return undefined;
  const value = input.body;
  if (value === undefined) {
    if (operation.requestBody.required) throw failure();
    return undefined;
  }
  let encoded: string;
  try {
    encoded = JSON.stringify(value);
  } catch {
    throw failure();
  }
  if (encoder.encode(encoded).byteLength > maxRequestBytes) throw failure();
  headers.set("content-type", operation.requestBody.mediaType);
  return encoded;
}

function expectedResponse(
  operation: OpenApiOperationPlan,
  status: number,
): OpenApiOperationPlan["successResponses"][number] | undefined {
  return operation.successResponses.find(
    (candidate) =>
      candidate.status === String(status) ||
      (candidate.status === "2XX" && status >= 200 && status <= 299),
  );
}

async function readBounded(response: Response): Promise<Uint8Array> {
  const declared = response.headers.get("content-length");
  if (declared !== null && /^\d+$/u.test(declared) && Number(declared) > maxResponseBytes) {
    throw failure();
  }
  if (response.body === null) return new Uint8Array();
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const result = await reader.read();
    if (result.done) break;
    total += result.value.byteLength;
    if (total > maxResponseBytes) {
      await reader.cancel().catch(() => undefined);
      throw failure();
    }
    chunks.push(result.value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

async function decodeResponse(
  operation: OpenApiOperationPlan,
  response: Response,
): Promise<Record<string, unknown>> {
  const expected = expectedResponse(operation, response.status);
  if (expected === undefined) throw failure();
  const bytes = await readBounded(response);
  if (expected.mediaType === undefined) {
    if (bytes.byteLength !== 0) throw failure();
    return { status: response.status };
  }
  const contentType = response.headers.get("content-type")?.split(";", 1)[0]?.trim();
  if (contentType === undefined) throw failure();
  if (contentType.toLowerCase() !== expected.mediaType.toLowerCase()) throw failure();
  try {
    const body: unknown = JSON.parse(decoder.decode(bytes));
    return { status: response.status, body };
  } catch {
    throw failure();
  }
}

function createPort<
  OperationName extends string,
  Input extends Readonly<Record<string, unknown>>,
  Output extends Record<string, unknown>,
>(
  operation: OpenApiOperationPlan,
  outputValidator: z.ZodType<Record<string, unknown>>,
  config: Readonly<Record<string, string | undefined>>,
  fetchImplementation: typeof globalThis.fetch,
): OpenApiOperationPort<OperationName, Input, Output> {
  const port: OpenApiOperationPort<OperationName, Input, Output> = {
    async invoke(inputValue, options) {
      const input = record(inputValue);
      const target = requestUrl(operation, input, config);
      const body = requestBody(operation, input, target.headers);
      let response: Response;
      try {
        response = await fetchImplementation(target.url, {
          method: operation.method,
          headers: target.headers,
          ...(body === undefined ? {} : { body }),
          redirect: "manual",
          signal: options.signal,
        });
      } catch (error) {
        if (options.signal.aborted) throw error;
        throw failure();
      }
      const output = await decodeResponse(operation, response);
      const validated = outputValidator.safeParse(output);
      if (!validated.success) throw failure();
      return record(validated.data) as Output;
    },
  };
  return Object.freeze(port);
}

const spedyConnectorConfig = z
  .object({
    "SPEDY_API_KEY": z.string().min(1),
    "SPEDY_BASE_URL": z.string().url(),
  })
  .strict()
  .superRefine((config, context) => {
    try {
    validateConfiguration(listarNfseOperation, config);
    validateConfiguration(consultarNfseOperation, config);
    validateConfiguration(emitirNfseOperation, config);
    } catch {
      context.addIssue({
        code: "custom",
        message: "Invalid generated OpenAPI connector configuration.",
      });
    }
  });

export const spedyConnector = defineConnector({
  name: "spedy-http",
  config: spedyConnectorConfig,
  create(config, dependencies: SpedyConnectorDependencies) {
    return {
      ports: {
      listarNfse: createPort<
        "listarNfse",
        ListarNfseInput,
        ListarNfseOutput
      >(
        listarNfseOperation,
        listarNfseOutputValidator,
        config,
        dependencies.fetch,
      ),
      consultarNfse: createPort<
        "consultarNfse",
        ConsultarNfseInput,
        ConsultarNfseOutput
      >(
        consultarNfseOperation,
        consultarNfseOutputValidator,
        config,
        dependencies.fetch,
      ),
      emitirNfse: createPort<
        "emitirNfse",
        EmitirNfseInput,
        EmitirNfseOutput
      >(
        emitirNfseOperation,
        emitirNfseOutputValidator,
        config,
        dependencies.fetch,
      ),
      },
    };
  },
});
