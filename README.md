# @pyreon/ui-system

Modular UI ecosystem for Pyreon — components, styling, layout, hooks, animations, theming, and document export.

## Packages

| Package | Description | Size (gzip) |
|---------|-------------|-------------|
| `@pyreon/ui-core` | Config, init(), utilities (get, set, merge, omit, pick) | 4.5 KB |
| `@pyreon/styler` | CSS-in-JS engine: css, styled, keyframes, ThemeProvider | 7.5 KB |
| `@pyreon/elements` | Base primitives: Element, Text, List, Overlay, Portal | 10.0 KB |
| `@pyreon/attrs` | Chainable component factory: .attrs().config().statics() | 2.0 KB |
| `@pyreon/rocketstyle` | Multi-state styling: dimensions, themes, dark/light mode | 6.1 KB |
| `@pyreon/unistyle` | 170+ CSS property mappings, responsive breakpoints | 7.3 KB |
| `@pyreon/coolgrid` | Responsive grid: Container, Row, Col | 3.9 KB |
| `@pyreon/hooks` | 27+ hooks (DOM, state, accessibility, timing, theme) | 4.4 KB |
| `@pyreon/kinetic` | CSS-transition animations: Transition, Stagger, Collapse | 6.0 KB |
| `@pyreon/kinetic-presets` | 120+ animation presets + factories | 3.9 KB |
| `@pyreon/connector-document` | Bridge: ui-system ↔ @pyreon/document (18 formats) | 2.1 KB |
| `@pyreon/document-primitives` | Rocketstyle document components for export | 3.4 KB |

**Total: ~61 KB gzipped** across all 12 packages.

## Quick Start

```bash
bun add @pyreon/ui-core @pyreon/styler @pyreon/elements @pyreon/rocketstyle
```

```tsx
import { config } from '@pyreon/ui-core'
import { css, styled, ThemeProvider } from '@pyreon/styler'

config.init({ component: 'div', textComponent: 'span' })
```

## Development

```bash
bun install              # Install dependencies
bun run test             # Run all tests (2289 tests)
bun run lint             # Lint with Biome
bun run typecheck        # TypeScript check all packages
bun run pkgs:build       # Build all packages
bun run verify           # Full pipeline: lint + typecheck + test
```

## Architecture

- **Pyreon framework** — signal-based reactivity, no React dependency
- **@pyreon/typescript** — strict TypeScript 6.0 config
- **Biome** — linting and formatting
- **Vitest** — testing with jsdom
- **Changesets** — version management and publishing
- **OIDC** — trusted npm publishing via GitHub Actions

## License

MIT
