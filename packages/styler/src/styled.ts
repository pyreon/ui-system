import { h } from '@pyreon/core'
import type { Props, ComponentFn } from '@pyreon/core'
import { sheet } from './sheet'
import { CSSResult, resolveCSS } from './css'
import type { Interpolation } from './css'

/** Set of known HTML attributes + events to forward to DOM elements. */
const HTML_PROPS = new Set([
  'id', 'class', 'className', 'style', 'title', 'role', 'tabIndex', 'tabindex',
  'href', 'src', 'alt', 'type', 'name', 'value', 'checked', 'disabled', 'readonly',
  'placeholder', 'for', 'htmlFor', 'action', 'method', 'target', 'rel',
  'width', 'height', 'min', 'max', 'step', 'pattern', 'required', 'autofocus',
  'autoComplete', 'autocomplete', 'hidden', 'draggable', 'contentEditable',
  'spellCheck', 'lang', 'dir', 'loading', 'crossOrigin', 'referrerPolicy',
  'ref', 'key', 'children',
])

function shouldForward(key: string): boolean {
  if (HTML_PROPS.has(key)) return true
  if (key.startsWith('on')) return true
  if (key.startsWith('data-') || key.startsWith('aria-')) return true
  return false
}

export interface StyledOptions {
  /** Custom prop filter. Return true to forward to DOM. */
  shouldForwardProp?: (prop: string) => boolean
}

type StyledTagFn = (
  strings: TemplateStringsArray,
  ...values: Interpolation[]
) => ComponentFn

/**
 * Create a styled Nova component.
 *
 * @example
 * const Button = styled('button')`
 *   background: ${props => props.primary ? 'blue' : 'gray'};
 *   color: white;
 *   padding: 8px 16px;
 * `
 *
 * // Usage: h(Button, { primary: true }, "Click me")
 */
export function styled(tag: string, options?: StyledOptions): StyledTagFn {
  const filter = options?.shouldForwardProp ?? shouldForward

  return (strings: TemplateStringsArray, ...values: Interpolation[]): ComponentFn => {
    const template = new CSSResult(strings, values)
    const isDynamic = values.some(v => typeof v === 'function')

    // Static fast path — compute class once
    let staticClass: string | undefined
    if (!isDynamic) {
      const css = resolveCSS(template)
      staticClass = css ? sheet.insert(css) : undefined
    }

    const Component: ComponentFn = (props: Props) => {
      // Resolve CSS (static or dynamic)
      let className: string | undefined
      if (staticClass) {
        className = staticClass
      } else {
        const css = resolveCSS(template, props as Record<string, unknown>)
        className = css ? sheet.insert(css) : undefined
      }

      // Merge className with any existing class prop
      const existingClass = props.class || props.className
      const finalClass = existingClass
        ? `${className ?? ''} ${existingClass}`.trim()
        : className

      // Filter props for DOM forwarding
      const domProps: Record<string, unknown> = {}
      for (const key in props) {
        if (key === 'class' || key === 'className' || key === 'children') continue
        if (filter(key)) {
          domProps[key] = props[key]
        }
      }

      if (finalClass) domProps.class = finalClass

      // Support `as` prop for polymorphic rendering
      const renderTag = (props as Record<string, unknown>).as as string ?? tag

      return h(renderTag, domProps as Props, ...(Array.isArray(props.children) ? props.children : props.children != null ? [props.children] : []))
    }

    return Component
  }
}

/** Proxy for styled.div`...`, styled.span`...` etc. */
const styledProxy = new Proxy(styled, {
  get(target, prop: string) {
    if (typeof prop === 'string') {
      return target(prop)
    }
    return undefined
  },
}) as typeof styled & Record<string, StyledTagFn>

export { styledProxy as styledElements }
