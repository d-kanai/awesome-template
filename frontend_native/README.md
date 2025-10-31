# Frontend Native

## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for TypeScript linting, formatting, and import organization.

- Run linting with automatic fixes: `pnpm lint`
- Run linting without applying fixes: `pnpm lint:check`
- Format files: `pnpm format`
- Check formatting without writing changes: `pnpm format:check`

All commands should be executed from the `frontend_native` directory.

## E2E Testing (Maestro)

End-to-end flows live under `e2e/` and leverage [Maestro](https://maestro.mobile.dev/).

1. Install the Maestro CLI (e.g. `brew install maestro-cli` or `curl -Ls https://get.maestro.mobile.dev | bash`).
2. Ensure the target app ID matches your build (default configuration uses Expo Go’s `host.exp.Exponent`).
3. Run the sanity check flow: `pnpm test:e2e`.
