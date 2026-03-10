import { h } from '@pyreon/core'
import { pushContext, popContext, onUnmount } from '@pyreon/core'
import type { Props, VNode, VNodeChild } from '@pyreon/core'
import { RowContext, useContainerContext } from './config'
import type { GridConfig } from './config'

export interface RowProps extends Props {
  gap?: number
  columns?: number
  alignX?: 'left' | 'center' | 'right' | 'between' | 'around' | 'evenly'
  alignY?: 'top' | 'center' | 'bottom' | 'stretch'
  tag?: string
  class?: string
  style?: string
  children?: VNodeChild
}

const ALIGN_X: Record<string, string> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
}

const ALIGN_Y: Record<string, string> = {
  top: 'flex-start',
  center: 'center',
  bottom: 'flex-end',
  stretch: 'stretch',
}

export function Row(props: RowProps): VNode | null {
  const {
    gap: gapProp,
    columns: colProp,
    alignX,
    alignY,
    tag = 'div',
    class: className,
    style: extraStyle,
    children,
  } = props

  const parent = useContainerContext()
  const gap = gapProp ?? parent?.gap ?? 0
  const columns = colProp ?? parent?.columns ?? 12

  let style = "display: flex; flex-wrap: wrap; box-sizing: border-box;"
  if (gap) style += ` margin-left: ${-gap / 2}px; margin-right: ${-gap / 2}px;`
  if (alignX) style += ` justify-content: ${ALIGN_X[alignX] ?? alignX};`
  if (alignY) style += ` align-items: ${ALIGN_Y[alignY] ?? alignY};`
  if (extraStyle) style += ` ${extraStyle}`

  const config: GridConfig = {
    columns,
    containerWidth: parent?.containerWidth ?? '100%',
    gap,
    gutter: parent?.gutter ?? 0,
    padding: parent?.padding ?? 0,
  }

  // Provide row config to Col children
  const frame = new Map<symbol, unknown>([[RowContext.id, config]])
  pushContext(frame)
  onUnmount(() => popContext())

  const htmlProps: Record<string, unknown> = {}
  if (className) htmlProps.class = className
  htmlProps.style = style

  return h(tag, htmlProps as Props, children)
}
