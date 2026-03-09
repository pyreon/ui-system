import { h, Fragment } from '@pyreon/core'
import type { Props, VNodeChild, ComponentFn } from '@pyreon/core'

export interface ListProps<T = unknown> {
  /** Data array to iterate over. */
  data: T[]
  /** Render function for each item. */
  children: (item: T, meta: ItemMeta) => VNodeChild
  /** Optional key extractor. */
  keyFn?: (item: T, index: number) => string | number
  /** Optional wrapper tag (e.g., 'ul'). */
  tag?: string
  /** Class for the wrapper. */
  class?: string
  /** Style for the wrapper. */
  style?: string
  [key: string]: unknown
}

export interface ItemMeta {
  index: number
  first: boolean
  last: boolean
  odd: boolean
  even: boolean
}

/**
 * List — data-driven list renderer with positional metadata.
 *
 * @example
 * h(List, { data: items, tag: 'ul' }, (item, { index, first, last }) =>
 *   h('li', { key: item.id }, item.name)
 * )
 */
export function List<T>(props: ListProps<T>): VNodeChild {
  const {
    data,
    children: renderItem,
    keyFn,
    tag,
    class: className,
    style,
    ...rest
  } = props

  const items = data.map((item, index) => {
    const meta: ItemMeta = {
      index,
      first: index === 0,
      last: index === data.length - 1,
      odd: index % 2 !== 0,
      even: index % 2 === 0,
    }
    return renderItem(item, meta)
  })

  if (!tag) {
    return h(Fragment, null, ...items)
  }

  const wrapperProps: Record<string, unknown> = {}
  if (className) wrapperProps.class = className
  if (style) wrapperProps.style = style
  for (const key of Object.keys(rest)) {
    if (key.startsWith('on') || key.startsWith('data-') || key.startsWith('aria-') || ['id', 'role', 'ref', 'key'].includes(key)) {
      wrapperProps[key] = rest[key]
    }
  }

  return h(tag, wrapperProps as Props, ...items)
}
