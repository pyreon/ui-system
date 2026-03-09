import { h } from '@pyreon/core'
import { pushContext, popContext, onUnmount } from '@pyreon/core'
import type { Props, VNode, VNodeChild } from '@pyreon/core'
import { ContainerContext } from './config'
import type { GridConfig } from './config'

export interface ContainerProps extends Props {
  maxWidth?: string | number
  columns?: number
  gap?: number
  gutter?: number
  padding?: number
  tag?: string
  class?: string
  style?: string
  children?: VNodeChild
}

export function Container(props: ContainerProps): VNode | null {
  const {
    maxWidth = '100%',
    columns = 12,
    gap = 0,
    gutter = 0,
    padding = 0,
    tag = 'div',
    class: className,
    style: extraStyle,
    children,
  } = props

  const width = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth

  let style = `max-width: ${width}; margin-left: auto; margin-right: auto; box-sizing: border-box;`
  if (gutter) style += ` padding-left: ${gutter}px; padding-right: ${gutter}px;`
  if (extraStyle) style += ` ${extraStyle}`

  const config: GridConfig = {
    columns,
    containerWidth: maxWidth,
    gap,
    gutter,
    padding,
  }

  // Provide grid config to descendant Row/Col components
  const frame = new Map<symbol, unknown>([[ContainerContext.id, config]])
  pushContext(frame)
  onUnmount(() => popContext())

  const htmlProps: Record<string, unknown> = {}
  if (className) htmlProps.class = className
  htmlProps.style = style

  return h(tag, htmlProps as Props, children)
}
