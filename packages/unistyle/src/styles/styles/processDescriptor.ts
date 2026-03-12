import type { BorderRadius } from '../shorthands/borderRadius'
import type { Edge } from '../shorthands/edge'
import type { Values } from '../../units/values'
import type { PropertyDescriptor } from './propertyMap'
import type { InnerTheme } from './types'

type Css = (strings: TemplateStringsArray, ...values: any[]) => string
type Calc = (...params: any[]) => ReturnType<Values>

const toCssDecl = (css: string, v: unknown) =>
  v == null ? '' : `${css}: ${v};`

const processSpecial = (
  d: Extract<PropertyDescriptor, { kind: 'special' }>,
  t: InnerTheme,
): string => {
  switch (d.id) {
    case 'fullScreen':
      if (!t.fullScreen) return ''
      return 'position: fixed; top: 0; left: 0; right: 0; bottom: 0;'

    case 'backgroundImage':
      if (!t.backgroundImage) return ''
      return `background-image: url(${t.backgroundImage});`

    case 'animation': {
      const parts = [t.keyframe, t.animation].filter(Boolean).join(' ')
      return parts ? `animation: ${parts};` : ''
    }

    case 'hideEmpty':
      if (!t.hideEmpty) return ''
      return '&:empty { display: none; }'

    case 'clearFix':
      if (!t.clearFix) return ''
      return '&::after { clear: both; content: ""; display: table; }'

    case 'extendCss':
      return (t.extendCss as string) ?? ''

    default:
      return ''
  }
}

const processDescriptor = (
  d: PropertyDescriptor,
  t: InnerTheme,
  _css: Css,
  calc: Calc,
  shorthand: ReturnType<Edge>,
  borderRadiusFn: ReturnType<BorderRadius>,
): string => {
  switch (d.kind) {
    case 'simple':
      return toCssDecl(d.css, t[d.key])

    case 'convert':
      return toCssDecl(d.css, calc(t[d.key]))

    case 'convert_fallback':
      return toCssDecl(d.css, calc(...d.keys.map((k) => t[k])))

    case 'edge':
      return (
        shorthand(d.property, {
          full: t[d.keys.full],
          x: t[d.keys.x],
          y: t[d.keys.y],
          top: t[d.keys.top],
          left: t[d.keys.left],
          bottom: t[d.keys.bottom],
          right: t[d.keys.right],
        }) ?? ''
      )

    case 'border_radius':
      return (
        borderRadiusFn({
          full: t[d.keys.full],
          top: t[d.keys.top],
          bottom: t[d.keys.bottom],
          left: t[d.keys.left],
          right: t[d.keys.right],
          topLeft: t[d.keys.topLeft],
          topRight: t[d.keys.topRight],
          bottomLeft: t[d.keys.bottomLeft],
          bottomRight: t[d.keys.bottomRight],
        }) ?? ''
      )

    case 'special':
      return processSpecial(d, t)
  }
}

export default processDescriptor
