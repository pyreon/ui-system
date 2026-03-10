import { h } from '@pyreon/core'
import type { Props, VNodeChild } from '@pyreon/core'

export interface TextProps {
  /** HTML tag. Default: 'span', or 'p' if paragraph=true. */
  tag?: string
  /** Render as paragraph. */
  paragraph?: boolean
  /** Text content via prop. */
  label?: string
  /** Children take priority over label. */
  children?: VNodeChild
  /** CSS class. */
  class?: string
  /** Inline style. */
  style?: string
  [key: string]: unknown
}

/**
 * Text — simple text rendering component.
 *
 * @example
 * h(Text, { paragraph: true }, "Hello world")
 * h(Text, { tag: 'h1', class: 'title' }, "Heading")
 */
export function Text(props: TextProps): VNodeChild {
  const {
    tag,
    paragraph,
    label,
    children,
    class: className,
    style,
    ...rest
  } = props

  const renderTag = tag ?? (paragraph ? 'p' : 'span')
  const content = children ?? label ?? null

  const htmlProps: Record<string, unknown> = {}
  for (const key of Object.keys(rest)) {
    if (key.startsWith('on') || key.startsWith('data-') || key.startsWith('aria-') || ['id', 'role', 'title', 'ref', 'key'].includes(key)) {
      htmlProps[key] = rest[key]
    }
  }
  if (className) htmlProps.class = className
  if (style) htmlProps.style = style

  return h(renderTag, htmlProps as Props, content)
}
