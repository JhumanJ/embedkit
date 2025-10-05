# Contributing to EmbedKit

Thanks for helping improve EmbedKit!

## Development

- Node 18+ recommended
- Install: `npm install`
- Build: `npm run build`
- Tests: `npm test`

## Project structure

- `src/` TypeScript source
- `src/adapters/` Built-in providers
- `test/` Node test runner specs

## Adding a provider adapter

- Create `src/adapters/<provider>.ts`
- Implement `{ name, match(u), build(u, ctx) }`
- Return `EmbedDescriptor` (HTTPS-only `src`) or `ResolveError`
- Update `src/adapters/index.ts` to register it
- Add tests in `test/adapters/`

## Code style

- TypeScript, strict
- No network calls
- Prefer clear names and early returns
- Avoid comments for obvious code; include rationale for non-obvious decisions

## Commit messages

- Conventional and descriptive messages appreciated

## Reporting issues

- Include sample URLs, expected descriptor, actual result
- Mention Node version and environment

## Security

- See `SECURITY.md` for reporting vulnerabilities
