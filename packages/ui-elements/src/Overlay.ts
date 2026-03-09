import { h, Fragment, createContext } from '@pyreon/core'
import { signal } from '@pyreon/reactivity'
import type { Props, VNode, VNodeChild } from '@pyreon/core'

export interface OverlayProps {
  /** Content to show when open. */
  content: (ctx: OverlayContext) => VNode | null
  /** Trigger element that toggles the overlay. */
  trigger: (ctx: OverlayContext) => VNode | null
}

export interface OverlayContext {
  /** Whether the overlay is open. */
  isOpen: () => boolean
  /** Open the overlay. */
  open: () => void
  /** Close the overlay. */
  close: () => void
  /** Toggle the overlay. */
  toggle: () => void
}

/**
 * Overlay — headless trigger + content pattern.
 *
 * @example
 * h(Overlay, {
 *   trigger: ({ toggle }) => h('button', { onClick: toggle }, 'Menu'),
 *   content: ({ close }) => h('div', { class: 'dropdown' },
 *     h('button', { onClick: close }, 'Close')
 *   ),
 * })
 */
export function Overlay(props: OverlayProps): VNodeChild {
  const isOpen = signal(false)

  const ctx: OverlayContext = {
    isOpen,
    open: () => isOpen.set(true),
    close: () => isOpen.set(false),
    toggle: () => isOpen.update(v => !v),
  }

  return h(Fragment, null,
    props.trigger(ctx),
    () => isOpen() ? props.content(ctx) : null,
  )
}
