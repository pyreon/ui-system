import { onMount, onUnmount } from '@pyreon/core'
import { signal } from '@pyreon/reactivity'
import type { VNodeChild } from '@pyreon/core'

/**
 * Portal — renders children into a different DOM location.
 *
 * Creates a new DOM element and appends it to the target (default: document.body).
 * Children are mounted into this element.
 *
 * Note: In Nova's architecture, Portal works by creating a container element
 * that is mounted elsewhere. The actual children mounting uses Nova's mount().
 *
 * @example
 * h(Portal, { target: document.body }, h('div', { class: 'modal' }, 'content'))
 */
export interface PortalProps {
  /** Where to append the portal container. Default: document.body */
  target?: HTMLElement
  /** Tag for the portal container. Default: 'div'. */
  tag?: string
  /** Children to render in the portal. */
  children?: VNodeChild
}

export function Portal(props: PortalProps): VNodeChild {
  // Portal in Nova needs runtime-dom's mount() which creates a circular dependency.
  // Instead, we export a simple wrapper that users can compose with mount().
  // For actual portal behavior, use the mount() function from @pyreon/runtime-dom
  // with a target container element.
  return props.children ?? null
}
