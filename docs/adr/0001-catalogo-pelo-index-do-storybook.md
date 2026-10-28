# ADR-001: The MCP server reads the catalog from Storybook's index

## Status

Accepted (2026-10-27). Records a decision already in the code.

## Context

Team apps (`packages/demo-timeA`, `packages/demo-timeB`) should be able to ask an AI assistant which design-system components exist, without the assistant reading the design-system source. Each app points its editor at one MCP endpoint (`.cursor/mcp.json`, `.vscode/mcp.json`: `http://localhost:13316/mcp`).

The components already have stories (`packages/design-system/src/components/*/*.stories.tsx`), and Storybook already produces a list of them: `index.json`, served by the dev server and written by `storybook build`.

## Options

### Option A — a hand-written component list for the server

Simple, but a second list that has to be edited every time a component or story changes.

### Option B — parse the component source

Reads props and exports directly, but needs a TypeScript parser in the server and couples it to the source layout the team apps are not supposed to know.

### Option C — Storybook's own MCP addon

`@storybook/addon-mcp` runs inside Storybook. The endpoint would only exist while a Storybook process runs, which does not fit a server deployed on its own from a container.

### Option D — a standalone server that reads `index.json`

An Express server that loads Storybook's index, groups entries into components, and answers MCP calls from that in-memory catalog.

## Decision

Option D.

- `packages/design-system/src/mcp-server/utils/get-manifest.ts` fetches `${STORYBOOK_URL}/index.json` with a 2 s timeout and, if that fails, reads `index.json` from `STORYBOOK_STATIC_PATH` (default `storybook-static`). The result is tagged `dev` or `static`.
- `processStorybookIndex` keeps only `type: "story"` entries, groups them by the last segment of the story title, and records the import path and the docs description.
- `packages/design-system/src/mcp-server/server.ts` is a small Express app. `POST /mcp` handles `initialize` (which reloads the catalog), `tools/list`, `tools/call`, and an empty `resources/list`. The five tools live in `src/mcp-server/tools/`. `GET /healthz` reports the component and story counts and the source. The catalog is reloaded every `POLL_INTERVAL` ms (5000 by default).
- `packages/design-system/Dockerfile` builds Storybook and the server, copies `storybook-static`, `dist/mcp-server`, and `node_modules` into the runtime image, and runs the server on port 13316.

## Consequences

- A new story shows up in the MCP catalog without touching the server. In dev it appears on the next poll.
- The catalog is only as good as the stories. A component without a story is invisible, and a component's name is taken from its story title.
- The server sees names, story ids, import paths, and descriptions. It does not see prop types. `suggest-composition` matches keywords such as "header", "card", and "button" in the use case.
- The server hand-rolls JSON-RPC instead of using an MCP SDK. Error codes are strings (`INVALID_REQUEST`, `INVALID_PARAMS`), not JSON-RPC integers. A later ADR could move to an SDK.
- `@storybook/addon-mcp` is still listed in `.storybook/main.ts`, although the team apps use the standalone server. The two can be reconciled later.
- The image needs a Storybook build before the server can answer.
