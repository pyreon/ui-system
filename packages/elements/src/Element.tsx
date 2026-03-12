import { h, Fragment } from '@pyreon/core'
import type { Props, VNodeChild } from '@pyreon/core'

export type AlignX = 'left' | 'center' | 'right'
export type AlignY = 'top' | 'center' | 'bottom'
export type Direction = 'inline' | 'rows'

const ALIGN_X_MAP: Record<AlignX, string> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
}

const ALIGN_Y_MAP: Record<AlignY, string> = {
  top: 'flex-start',
  center: 'center',
  bottom: 'flex-end',
}

export interface ElementProps {
  /** HTML tag to render. Default: 'div'. */
  tag?: string
  /** Content before the main content slot. */
  beforeContent?: VNodeChild
  /** Main content. */
  children?: VNodeChild
  /** Content after the main content slot. */
  afterContent?: VNodeChild
  /** Layout direction. Default: 'inline'. */
  direction?: Direction
  /** Horizontal alignment. */
  alignX?: AlignX
  /** Vertical alignment. */
  alignY?: AlignY
  /** Gap between slots in px. */
  gap?: number
  /** Whether the element is block-level. Default: false. */
  block?: boolean
  /** Additional class name(s). */
  class?: string
  /** Inline styles. */
  style?: string | Record<string, string | number>
  /** Equalize before/after slot widths. */
  equalCols?: boolean
  /** Any other HTML attributes. */
  [key: string]: unknown
}

/**
 * Element — foundational layout component with 3-section layout.
 *
 * Renders: [beforeContent] [children] [afterContent]
 * in a flex container with configurable alignment and direction.
 *
 * @example
 * h(Element, { tag: 'button', beforeContent: icon, gap: 8 }, "Click me")
 */
export function Element(props: ElementProps): VNodeChild {
  const {
    tag = 'div',
    beforeContent,
    children,
    afterContent,
    direction = 'inline',
    alignX,
    alignY,
    gap,
    block,
    equalCols,
    class: className,
    style,
    ...rest
  } = props

  const isRow = direction === 'rows'
  const hasBefore = beforeContent != null
  const hasAfter = afterContent != null
  const hasMultiSlots = hasBefore || hasAfter

  // Build wrapper style
  const wrapperStyle: Record<string, string> = {
    display: block ? 'flex' : 'inline-flex',
    'flex-direction': isRow ? 'column' : 'row',
    'align-items': isRow
      ? (alignX ? ALIGN_X_MAP[alignX] : 'stretch')
      : (alignY ? ALIGN_Y_MAP[alignY] : 'center'),
  }

  if (alignX && !isRow) {
    wrapperStyle['justify-content'] = ALIGN_X_MAP[alignX]
  }
  if (alignY && isRow) {
    wrapperStyle['justify-content'] = ALIGN_Y_MAP[alignY]
  }
  if (gap) {
    wrapperStyle.gap = `${gap}px`
  }

  const styleStr = typeof style === 'string'
    ? `${cssFromObj(wrapperStyle)}${style}`
    : cssFromObj({ ...wrapperStyle, ...(style as Record<string, string | number> | undefined) })

  // Filter out our custom props from rest
  const htmlProps: Record<string, unknown> = {}
  for (const key of Object.keys(rest)) {
    if (isHtmlAttr(key)) htmlProps[key] = rest[key]
  }

  if (className) htmlProps.class = className
  htmlProps.style = styleStr

  if (!hasMultiSlots) {
    // Single content — no wrapper needed
    return h(tag, htmlProps as Props, children)
  }

  // Build slots
  const equalStyle = equalCols ? 'flex: 1; min-width: 0;' : undefined
  const slots: VNodeChild[] = []

  if (hasBefore) {
    slots.push(h('span', { style: equalStyle ?? 'flex-shrink: 0;' } as Props, beforeContent))
  }

  slots.push(h('span', { style: 'flex: 1; min-width: 0;' } as Props, children))

  if (hasAfter) {
    slots.push(h('span', { style: equalStyle ?? 'flex-shrink: 0;' } as Props, afterContent))
  }

  return h(tag, htmlProps as Props, ...slots)
}

function cssFromObj(obj: Record<string, string | number>): string {
  let s = ''
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== '') s += `${k}: ${v}; `
  }
  return s
}

function isHtmlAttr(key: string): boolean {
  if (key.startsWith('on') || key.startsWith('data-') || key.startsWith('aria-')) return true
  const html = new Set(['id', 'role', 'tabindex', 'title', 'href', 'src', 'alt', 'type', 'name', 'value', 'disabled', 'hidden', 'draggable', 'ref', 'key'])
  return html.has(key)
}
