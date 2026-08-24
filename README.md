# Spedy NFS-e MCP

An Invokta Action Engine that exposes Spedy NFS-e emission and status operations
through an authenticated MCP Streamable HTTP endpoint.

The engine contains three capabilities:

- `nota-fiscal.emitir`: creates and enqueues an NFS-e for asynchronous issue.
- `nota-fiscal.consultar`: reads the current status of one NFS-e.
- `nota-fiscal.listar-nfse`: lists NFS-e records with Spedy filters and pagination.

All capabilities require an authenticated principal. Spedy credentials remain
server-side and are never accepted as MCP tool input.

## First run

```sh
npm run check
npm run build
npm run mcp:http
```

The included local configuration serves MCP at `http://127.0.0.1:3400/mcp`. Clients
authenticate via Better Auth OAuth 2.1 and send `Authorization: Bearer <token>`.

The committed `.env.example` and the ignored local `.env` contain mock values.
Configure `BETTER_AUTH_URL` and `SPEDY_API_KEY` before making real requests. The
default connector target is Spedy's sandbox; production is never selected
implicitly.

## Configuration

| Variable | Purpose |
| --- | --- |
| `BETTER_AUTH_URL` | Base URL of the Better Auth OAuth 2.1 authorization server (e.g. `http://127.0.0.1:4000`). |
| `BETTER_AUTH_SECRET` | (Optional) Shared secret for symmetric JWT verification. |
| `BETTER_AUTH_JWKS_URL` | (Optional) Custom JWKS endpoint for asymmetric token verification (defaults to `${BETTER_AUTH_URL}/api/auth/jwks`). |
| `MCP_RESOURCE_URL` | (Optional) Public MCP resource URL (defaults to `http://${host}:${port}/mcp`). |
| `SPEDY_API_KEY` | Server-side credential sent by the connector as `X-Api-Key`. Never exposed to MCP clients. |
| `SPEDY_BASE_URL` | Spedy API origin, normally `https://sandbox-api.spedy.com.br`. Do not append `/v1`. |
| `INVOKTA_HTTP_HOST` | Bind host; defaults to `127.0.0.1`. |
| `INVOKTA_HTTP_PORT` | Bind port; the local example uses `3400` and the adapter defaults to `3000` when unset. |

Emission is asynchronous. A successful `emitir-nfse` result means Spedy
accepted and enqueued the request; use `consultar-nfse` or Spedy webhooks to
observe authorization or rejection. Always provide a stable `integrationId`
to make retries idempotent.

## Project map

- `src/capabilities/` owns domain actions and their input, output, access,
  and execution contracts.
- `src/engine.ts` registers stable capability IDs and supplies engine-owned
  dependencies.
- `src/direct.ts` is the smallest executable smoke path.
- `test/engine.test.ts` proves behavior through the public engine boundary.
- `AGENTS.md` records the project's non-negotiable architecture and delivery
  rules.
- `.agents/skills/develop-invokta-project/SKILL.md` gives compatible agents a
  complete change workflow.

## Review the generated capabilities

1. Read `AGENTS.md` and the generated development skill.
2. Add a failing engine-level test for the domain outcome you need.
3. Update or replace the module under `src/capabilities/`, then register its
   literal capability ID in `src/engine.ts`.
4. Keep direct and generated adapter entry points on the same exported engine;
   do not duplicate the capability handler in an adapter.
5. Run `npm run check`, then inspect the capability in the devtools before
   deploying it.

## Develop interactively

```sh
npm run devtools
```

Builds the engine and starts the Invokta devtools, normally on
http://localhost:4100/. Open the URL printed by the command to browse
capabilities, invoke them from schema-seeded JSON through the execution
path you select, follow the live invocation trace, switch test identities, and
read the doctor report. Source changes rebuild and restart the hosted engine
automatically.

Run the read-only devtools diagnostics with:

```sh
npm run devtools:doctor
```

## Start MCP HTTP

```sh
npm run build
npm run mcp:http
```

Package the server and probe an existing endpoint with:

```sh
npm run deploy:package
npm run deploy:probe -- --url https://engine.example/mcp
```

Review every generated capability's domain meaning and access rule before deployment.
