# Contributing to frontend-mcp-design-system

Thanks for your interest. This monorepo has three packages:

- `packages/design-system`: React components, Storybook and the MCP HTTP server;
- `packages/demo-timeA` and `packages/demo-timeB`: team apps that consume the design system through the workspace.

## Setup

You need Node 18 or newer (20+ recommended) and pnpm (the root `packageManager` pins pnpm 9; `corepack enable` picks it up). Docker is only needed for the container mode.

```bash
git clone https://github.com/EliseuSantos/frontend-mcp-design-system.git
cd frontend-mcp-design-system
pnpm install
```

Common commands (see the [README](README.md) for the full list):

```bash
pnpm --filter @org/design-system storybook:build   # static Storybook, read by the MCP server
pnpm --filter @org/design-system mcp:dev           # MCP server on http://localhost:13316/mcp
pnpm storybook                                     # Storybook dev server
pnpm demo-timeA:dev                                # team A app on :3000
pnpm demo-timeB:dev                                # team B app on :3001
```

## Checks

There is no CI and there are no automated tests in the repository yet. Before opening a pull request, make sure these still work:

```bash
pnpm build
pnpm --filter @org/design-system storybook:build
pnpm --filter @org/design-system mcp:build
```

Then start the MCP server and check `http://localhost:13316/healthz`. If you add a component, add a Storybook story for it, because the MCP server reads the component docs from the Storybook build.

Pull requests that add tests (the design system already has a `vitest` script) or a CI workflow are welcome.

## Workflow

1. Open an issue first for anything beyond a small fix, so we can agree on the approach.
2. Fork the repository and create a branch from `main`.
3. Keep the pull request focused on one change and describe how you tested it.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/) in English, for example:

```text
feat(design-system): add a Badge component
fix(mcp): return 404 for unknown components
docs: explain the Docker mode
```
