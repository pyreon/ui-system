# Pyreon UI System — Component Library

## Overview
UI component library built on the Pyreon framework (`@pyreon/core` + `@pyreon/reactivity`).
Ported from `vitus-labs/ui-system` (React) to Pyreon's signal-based architecture. Web-only, no React Native.

## Packages (12)
| Package | Description | Framework deps |
|---|---|---|
| `@pyreon/ui-core` | CSS engine connector, init(), utilities | `@pyreon/core` |
| `@pyreon/styler` | CSS-in-JS: `styled()`, `css`, `keyframes`, theming | `@pyreon/core` |
| `@pyreon/unistyle` | Responsive breakpoints, media queries, unit utilities | None (framework-agnostic) |
| `@pyreon/hooks` | 16 signal-based utilities (useHover, useFocus, useBreakpoint, etc.) | `@pyreon/core`, `@pyreon/reactivity` |
| `@pyreon/elements` | Element, Text, List, Overlay, Portal components | `@pyreon/core`, `@pyreon/reactivity` |
| `@pyreon/attrs` | Chainable component factory: attrs().attrs().config().statics().compose() | `@pyreon/core` |
| `@pyreon/rocketstyle` | Multi-state styling: dimensions, themes, dark/light mode | `@pyreon/core` |
| `@pyreon/coolgrid` | Responsive 12-column grid (Container, Row, Col) | `@pyreon/core` |
| `@pyreon/kinetic` | CSS-transition animations: Transition, TransitionGroup, Stagger, Collapse | `@pyreon/core`, `@pyreon/reactivity` |
| `@pyreon/kinetic-presets` | 122+ animation presets, `compose`, `withDuration`, factories | None (framework-agnostic) |
| `@pyreon/connector-document` | Connects `@pyreon/document` to the component system | `@pyreon/core`, `@pyreon/document` |
| `@pyreon/document-primitives` | Document-level primitive components | `@pyreon/core`, `@pyreon/document` |

## Tooling
- **TypeScript**: 6.0 via `@pyreon/typescript` shared config
- **Testing**: Vitest 4.1 with jsdom, `resolve.conditions: ['source']` for workspace resolution
- **Linting**: Biome 2.4 via `@vitus-labs/tools-lint/biome` shared config
- **Build**: `@vitus-labs/tools-rolldown` (rolldown-based), config in `vl-tools.config.js`
- **Publishing**: Changesets + custom `scripts/publish.ts` and `scripts/version.ts`
- **MCP**: Pyreon MCP server configured via `.mcp.json`

## Development Commands
```bash
bun install              # Install dependencies
bun run test             # Run all tests (Vitest)
bun run lint             # Lint with Biome
bun run lint -- --fix    # Auto-fix lint issues
bun run format           # Format with Biome
bun run build            # Build all packages (rolldown)
bun run typecheck        # Type-check all packages
bun run verify           # Run lint + typecheck + test
```

Single package:
```bash
bun run --filter='./packages/styler' build
bun run test -- packages/styler
```

## Key Patterns (Pyreon-specific)

### Component signature
`ComponentFn<P> = (props: P) => VNode | null` — NOT `VNodeChild`.

### Signal-based state
- `signal()` for state, `computed()` for derived, `effect()` for side effects
- `onMount(fn)` / `onUnmount(fn)` for lifecycle
- `onMount` expects `() => CleanupFn | undefined` — callbacks must `return undefined`, not void

### Context
- `createContext<T>(default)` returns `Context<T>` object (NOT a tuple/array)
- Read: `useContext(ctx)`
- Provide: `pushContext(new Map([[ctx.id, value]]))` + `onUnmount(() => popContext())`

### CSS-in-JS (`@pyreon/styler`)
- `styled('div')\`color: red\`` → returns `ComponentFn`
- `css\`...\`` → lazy `CSSResult`, resolved on use
- `keyframes\`...\`` → returns animation name string
- Theme: `ThemeContext` (Context object) + `useTheme()` helper
- Singleton `StyleSheet` with FNV-1a hashing, dedup cache, SSR support

## TypeScript
- `exactOptionalPropertyTypes` enabled — use `| undefined` on optional props
- `verbatimModuleSyntax` — use `import type` for type-only imports
- Biome linter: `noNonNullAssertion` → use guards instead of `!`

## Architecture Notes
- Inter-package deps use `workspace:^` protocol
- Framework deps (`@pyreon/core`, `@pyreon/reactivity`, etc.) installed from npm via root `devDependencies`
- Build output: `lib/` with ESM bundle + DTS
- All packages are published under `@pyreon/` scope with OIDC provenance
