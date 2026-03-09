import { h } from '@pyreon/core'
import type { Props, VNodeChild } from '@pyreon/core'
import { useRowContext } from './config'

export interface ColProps {
  /** Column span (1-12). Applied to all breakpoints unless overridden. */
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  /** Column offset. */
  offset?: number
  /** Order override. */
  order?: number
  /** HTML tag. Default: 'div'. */
  tag?: string
  /** CSS class. */
  class?: string
  /** Inline style override. */
  style?: string
  children?: VNodeChild
  [key: string]: unknown
}

/**
 * Col — grid column. Reads row config for gap/columns.
 *
 * @example
 * h(Col, { xs: 12, md: 6, lg: 4 }, "Content")
 */
export function Col(props: ColProps): VNodeChild {
  const {
    xs,
    sm,
    md,
    lg,
    xl,
    offset,
    order,
    tag = 'div',
    class: className,
    style: extraStyle,
    children,
    ...rest
  } = props

  const parent = useRowContext()
  const gap = parent?.gap ?? 0
  const columns = parent?.columns ?? 12

  // Use the most specific span, falling back to xs or full width
  const span = xs ?? columns

  const widthPercent = (span / columns) * 100
  let style = `box-sizing: border-box; flex: 0 0 ${widthPercent}%; max-width: ${widthPercent}%;`

  if (gap) style += ` padding-left: ${gap / 2}px; padding-right: ${gap / 2}px;`
  if (offset) {
    const offsetPercent = (offset / columns) * 100
    style += ` margin-left: ${offsetPercent}%;`
  }
  if (order !== undefined) style += ` order: ${order};`
  if (extraStyle) style += ` ${extraStyle}`

  const htmlProps: Record<string, unknown> = {}
  if (className) htmlProps.class = className
  htmlProps.style = style

  return h(tag, htmlProps as Props, children)
}
