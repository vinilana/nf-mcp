import { describe, expect, it, vi } from "vitest";

import { createOpenApiEngine } from "../src/openapi-engine.js";
import { createHttpAuth } from "../src/http-auth.js";
import { spedyConnector } from "../src/openapi/connector.js";
import type {
  OpenApiOperationPort,
  OpenApiPorts,
} from "../src/openapi/ports.js";

const contractCases = [
  {
    "capabilityId": "openapi.listar-nfse",
    "portName": "listarNfse",
    "selector": "GET:/v1/service-invoices",
    "input": {}
  },
  {
    "capabilityId": "openapi.consultar-nfse",
    "portName": "consultarNfse",
    "selector": "GET:/v1/service-invoices/{id}",
    "input": { "path": { "id": "9f623360-bba7-4dd9-b508-15c070d550cc" } }
  },
  {
    "capabilityId": "openapi.emitir-nfse",
    "portName": "emitirNfse",
    "selector": "POST:/v1/service-invoices",
    "input": {
      "body": {
        "description": "Software development services",
        "total": { "invoiceAmount": 1500 }
      }
    }
  }
] as const;
const successCases = [
  {
    "capabilityId": "openapi.listar-nfse",
    "portName": "listarNfse",
    "selector": "GET:/v1/service-invoices",
    "input": {},
    "status": "200",
    "output": {
      "status": 200,
      "body": {}
    }
  },
  {
    "capabilityId": "openapi.emitir-nfse",
    "portName": "emitirNfse",
    "selector": "POST:/v1/service-invoices",
    "input": {
      "body": {
        "integrationId": "order-123",
        "description": "Software development services",
        "total": { "invoiceAmount": 1500 }
      }
    },
    "status": "200",
    "output": {
      "status": 200,
      "body": {}
    }
  }
] as const;

function fakePorts(
  target: keyof OpenApiPorts,
  invoke: OpenApiOperationPort["invoke"],
): OpenApiPorts {
  return {
    listarNfse: {
      invoke: (target === "listarNfse" ? invoke : async () => ({})) as unknown as OpenApiPorts["listarNfse"]["invoke"],
    },
    consultarNfse: {
      invoke: (target === "consultarNfse" ? invoke : async () => ({})) as unknown as OpenApiPorts["consultarNfse"]["invoke"],
    },
    emitirNfse: {
      invoke: (target === "emitirNfse" ? invoke : async () => ({})) as unknown as OpenApiPorts["emitirNfse"]["invoke"],
    },
  };
}

describe("generated OpenAPI engine", () => {
  it("rejects unknown connector configuration without external I/O", () => {
    const fetchImplementation = vi.fn<typeof globalThis.fetch>();
    const invalidConfig = {
      SPEDY_API_KEY: "mock-spedy-api-key",
      SPEDY_BASE_URL: "https://sandbox-api.spedy.com.br",
      OPENAPI_UNKNOWN_CONFIGURATION: "not-a-credential",
    };

    expect(() =>
      spedyConnector.create(invalidConfig, {
        fetch: fetchImplementation,
      }),
    ).toThrow("Connector configuration is invalid.");
    expect(fetchImplementation).not.toHaveBeenCalled();
  });

  it.each(contractCases)(
    "validates $selector contract without invoking the connector",
    async ({ capabilityId, portName }) => {
      const invoke = vi.fn(async () => ({}));
      const engine = createOpenApiEngine({
        ports: fakePorts(portName as keyof OpenApiPorts, invoke),
      });

      expect(engine.describe(capabilityId)).toMatchObject({
        inputSchema: { type: "object" },
        outputSchema: { type: "object" },
      });
      await expect(
        engine.invoke(
          capabilityId,
          { __generated_invalid: true } as never,
          { principal: null },
        ),
      ).rejects.toMatchObject({ code: "INPUT_INVALID" });
      expect(invoke).not.toHaveBeenCalled();
    },
  );

  it.each(contractCases)(
    "requires an authenticated principal for $selector",
    async ({ capabilityId, portName, input }) => {
      const invoke = vi.fn(async () => ({}));
      const engine = createOpenApiEngine({
        ports: fakePorts(portName as keyof OpenApiPorts, invoke),
      });

      await expect(
        engine.invoke(capabilityId, input, { principal: null }),
      ).rejects.toMatchObject({ code: "UNAUTHENTICATED" });
      expect(invoke).not.toHaveBeenCalled();
    },
  );

  it.each(successCases)(
    "invokes $selector for declared status $status when a witness is proven",
    async ({ capabilityId, portName, input, output }) => {
      const invoke = vi.fn(async () => output);
      const engine = createOpenApiEngine({
        ports: fakePorts(portName as keyof OpenApiPorts, invoke),
      });

      const result = await engine.invoke(capabilityId, input, {
        principal: { id: "test-client" },
      });
      expect(result.status).toBe(output.status);
      expect(Object.hasOwn(result, "body")).toBe(Object.hasOwn(output, "body"));
      expect(invoke).toHaveBeenCalledTimes(1);
    },
  );

  it("sends an NFS-e issue request to Spedy with server-owned credentials", async () => {
    const fetchImplementation = vi.fn<typeof globalThis.fetch>(async () =>
      new Response(JSON.stringify({ id: "9f623360-bba7-4dd9-b508-15c070d550cc" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    const connector = spedyConnector.create(
      {
        SPEDY_API_KEY: "mock-spedy-api-key",
        SPEDY_BASE_URL: "https://sandbox-api.spedy.com.br",
      },
      { fetch: fetchImplementation },
    );
    const engine = createOpenApiEngine({ ports: connector.ports });
    const body = {
      integrationId: "order-123",
      description: "Software development services",
      total: { invoiceAmount: 1500 },
    };

    await engine.invoke(
      "openapi.emitir-nfse",
      { body },
      { principal: { id: "test-client" } },
    );

    expect(fetchImplementation).toHaveBeenCalledOnce();
    const [url, init] = fetchImplementation.mock.calls[0] ?? [];
    expect(String(url)).toBe(
      "https://sandbox-api.spedy.com.br/v1/service-invoices",
    );
    expect(init?.method).toBe("POST");
    expect(new Headers(init?.headers).get("x-api-key")).toBe(
      "mock-spedy-api-key",
    );
    expect(init?.body).toBe(JSON.stringify(body));
  });

  it("requires the NFS-e payload when issuing an invoice", async () => {
    const invoke = vi.fn(async () => ({ status: 200, body: {} }));
    const engine = createOpenApiEngine({
      ports: fakePorts("emitirNfse", invoke),
    });

    await expect(
      engine.invoke(
        "openapi.emitir-nfse",
        {} as never,
        { principal: { id: "test-client" } },
      ),
    ).rejects.toMatchObject({ code: "INPUT_INVALID" });
    expect(invoke).not.toHaveBeenCalled();
  });
});

describe("MCP HTTP authentication", () => {
  const token = "mock-mcp-bearer-token-at-least-32-characters";

  function request(authorization: string | null) {
    return {
      path: "/mcp",
      method: "POST",
      headers: new Headers(
        authorization === null ? {} : { authorization },
      ),
      signal: AbortSignal.timeout(1_000),
    };
  }

  it("authenticates an exact bearer token", () => {
    const auth = createHttpAuth(token);

    expect(auth.authenticate(request(`Bearer ${token}`))).toEqual({
      id: "mcp-client",
    });
  });

  it.each([null, "Basic abc", "Bearer wrong", `bearer ${token}`])(
    "rejects an invalid authorization header",
    (authorization) => {
      const auth = createHttpAuth(token);

      expect(auth.authenticate(request(authorization))).toBeNull();
    },
  );
});
