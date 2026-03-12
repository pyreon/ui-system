import type { ComponentFn, VNode } from '@pyreon/core'
import type {
  CSSProperties,
  ClassTransitionProps,
  StyleTransitionProps,
  TransitionCallbacks,
} from '../types'

// ─── Kinetic Modes ────────────────────────────────────────

export type KineticMode = 'transition' | 'collapse' | 'stagger' | 'group'

// ─── Internal Config (accumulated through chaining) ──────

export type KineticConfig = StyleTransitionProps &
  ClassTransitionProps &
  TransitionCallbacks & {
    tag: string
    mode: KineticMode
    appear?: boolean | undefined
    unmount?: boolean | undefined
    timeout?: number | undefined
    /** Collapse: CSS transition for height. */
    transition?: string | undefined
    /** Stagger: delay between each child in ms. */
    interval?: number | undefined
    /** Stagger: reverse order on leave. */
    reverseLeave?: boolean | undefined
  }

// ─── Class Config (for .enterClass / .leaveClass) ────────

export type ClassConfig = {
  active?: string | undefined
  from?: string | undefined
  to?: string | undefined
}

// ─── Mode-specific config options for .config() ──────────

export type TransitionConfigOpts = {
  appear?: boolean | undefined
  unmount?: boolean | undefined
  timeout?: number | undefined
}

export type CollapseConfigOpts = {
  appear?: boolean | undefined
  timeout?: number | undefined
  transition?: string | undefined
}

export type StaggerConfigOpts = {
  appear?: boolean | undefined
  timeout?: number | undefined
  interval?: number | undefined
  reverseLeave?: boolean | undefined
}

export type GroupConfigOpts = {
  appear?: boolean | undefined
  timeout?: number | undefined
}

// ─── Mode-specific component props ───────────────────────

/** Keys that belong to kinetic and should NOT be forwarded as HTML attributes. */
type KineticOwnKeys =
  | 'show'
  | 'appear'
  | 'unmount'
  | 'timeout'
  | 'transition'
  | 'interval'
  | 'reverseLeave'
  | keyof TransitionCallbacks
  | 'children'

export type KineticTransitionProps<Tag extends string> = Record<
  string,
  unknown
> & {
  show: () => boolean
  appear?: boolean | undefined
  unmount?: boolean | undefined
  timeout?: number | undefined
  children?: VNode | VNode[] | undefined
} & Partial<TransitionCallbacks>

export type KineticCollapseProps<Tag extends string> = Record<
  string,
  unknown
> & {
  show: () => boolean
  appear?: boolean | undefined
  timeout?: number | undefined
  transition?: string | undefined
  children?: VNode | VNode[] | undefined
} & Partial<TransitionCallbacks>

export type KineticStaggerProps<Tag extends string> = Record<
  string,
  unknown
> & {
  show: () => boolean
  appear?: boolean | undefined
  timeout?: number | undefined
  interval?: number | undefined
  reverseLeave?: boolean | undefined
  children: VNode[] | VNode
} & Partial<TransitionCallbacks>

export type KineticGroupProps<Tag extends string> = Record<string, unknown> & {
  appear?: boolean | undefined
  timeout?: number | undefined
  children: VNode[] | VNode
} & Partial<TransitionCallbacks>

// ─── Conditional props based on mode ─────────────────────

export type KineticComponentProps<
  Tag extends string,
  Mode extends KineticMode,
> = Mode extends 'collapse'
  ? KineticCollapseProps<Tag>
  : Mode extends 'stagger'
    ? KineticStaggerProps<Tag>
    : Mode extends 'group'
      ? KineticGroupProps<Tag>
      : KineticTransitionProps<Tag>

// ─── Conditional config opts based on mode ───────────────

type ConfigOpts<Mode extends KineticMode> = Mode extends 'collapse'
  ? CollapseConfigOpts
  : Mode extends 'stagger'
    ? StaggerConfigOpts
    : Mode extends 'group'
      ? GroupConfigOpts
      : TransitionConfigOpts

// ─── Chain methods ───────────────────────────────────────

export type KineticChain<Tag extends string, Mode extends KineticMode> = {
  preset: (
    preset: StyleTransitionProps & ClassTransitionProps,
  ) => KineticComponent<Tag, Mode>
  enter: (styles: CSSProperties) => KineticComponent<Tag, Mode>
  enterTo: (styles: CSSProperties) => KineticComponent<Tag, Mode>
  enterTransition: (value: string) => KineticComponent<Tag, Mode>
  leave: (styles: CSSProperties) => KineticComponent<Tag, Mode>
  leaveTo: (styles: CSSProperties) => KineticComponent<Tag, Mode>
  leaveTransition: (value: string) => KineticComponent<Tag, Mode>
  enterClass: (opts: ClassConfig) => KineticComponent<Tag, Mode>
  leaveClass: (opts: ClassConfig) => KineticComponent<Tag, Mode>
  config: (opts: ConfigOpts<Mode>) => KineticComponent<Tag, Mode>
  on: (callbacks: Partial<TransitionCallbacks>) => KineticComponent<Tag, Mode>
  collapse: (opts?: CollapseConfigOpts) => KineticComponent<Tag, 'collapse'>
  stagger: (opts?: {
    interval?: number | undefined
    reverseLeave?: boolean | undefined
  }) => KineticComponent<Tag, 'stagger'>
  group: () => KineticComponent<Tag, 'group'>
}

// ─── The full kinetic component: renderable + chainable ───

export type KineticComponent<
  Tag extends string,
  Mode extends KineticMode = 'transition',
> = ComponentFn<KineticComponentProps<Tag, Mode>> & KineticChain<Tag, Mode>
