# Pyreon UI System — Component Library

## Overview
UI component library built on the Pyreon framework (`@pyreon/core` + `@pyreon/reactivity`).
Ported from `vitus-labs/ui-system` (React) to Pyreon's signal-based architecture. Web-only, no React Native.

## Packages
| Package | Description | Framework deps |
|---|---|---|
| `@pyreon/kinetic-presets` | 122+ animation presets, `compose`, `withDuration`, factories | None (framework-agnostic) |
| `@pyreon/unistyle` | Responsive breakpoints, media queries, unit utilities | None (framework-agnostic) |
| `@pyreon/styler` | CSS-in-JS: `styled()`, `css`, `keyframes`, theming | `@pyreon/core` |
| `@pyreon/hooks` | 16 signal-based utilities (useHover, useFocus, useBreakpoint, etc.) | `@pyreon/core`, `@pyreon/reactivity` |
| `@pyreon/elements` | Element, Text, List, Overlay, Portal components | `@pyreon/core`, `@pyreon/reactivity` |
| `@pyreon/coolgrid` | Responsive 12-column grid (Container, Row, Col) | `@pyreon/core` |

## Local Development
Framework deps (`@pyreon/core`, `@pyreon/reactivity`, etc.) are installed from npm via root `devDependencies`.
Workspace packages use `workspace:^` for both `peerDependencies` and cross-package references.
```bash
bun install    # resolves framework deps from npm, workspace packages locally
bun test       # run all tests (uses vitest with jsdom)
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

### Hooks (`@pyreon/hooks`)
All hooks use `signal()` for internal state and return reactive getters.
Hooks: useHover, useFocus, useClickOutside, useElementSize, useBreakpoint, useMediaQuery, useIntersection, useWindowResize, useScrollLock, useReducedMotion, useColorScheme, useToggle, usePrevious, useDebouncedValue, useKeyboard, useFocusTrap.

### Elements (`@pyreon/elements`)
- `Element` — 3-section flex layout (beforeContent/children/afterContent)
- `Text` — text rendering with paragraph/tag support
- `List` — data-driven list with positional metadata (index, first, last, odd, even)
- `Overlay` — headless trigger+content pattern
- `Portal` — stub (runtime-dom provides actual portal)

### Grid (`@pyreon/coolgrid`)
- `Container` / `Row` / `Col` with context-based config passing
- Uses `pushContext`/`popContext` pattern for nesting

## TypeScript
- `exactOptionalPropertyTypes` enabled — use `| undefined` on optional props
- `verbatimModuleSyntax` — use `import type` for type-only imports
- Biome linter: `noNonNullAssertion` → use guards instead of `!`
