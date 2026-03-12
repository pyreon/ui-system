import stripUnit from './stripUnit'

type CssUnits =
  | 'px' | 'rem' | '%' | 'em' | 'ex' | 'cm' | 'mm' | 'in'
  | 'pt' | 'pc' | 'ch' | 'vh' | 'vw' | 'vmin' | 'vmax'

const isNotValue = (value: unknown) => !value && value !== 0

export type Value = (
  param: string | number | null | undefined,
  rootSize?: number,
  outputUnit?: CssUnits,
) => string | number | null

const value: Value = (param, rootSize = 16, outputUnit = 'rem') => {
  if (isNotValue(param)) return null as any

  const [val, unit] = stripUnit(param as string, true)
  if (isNotValue(val)) return null
  if (val === 0 || typeof val === 'string') return param

  const canConvert = rootSize && !Number.isNaN(val)
  if (canConvert && !unit && outputUnit === 'px') return `${val}${outputUnit}`
  if (canConvert && !unit) return `${val / rootSize}rem`
  if (canConvert && unit === 'px' && outputUnit === 'rem')
    return `${val / rootSize}rem`
  if (unit) return param

  return `${val}${outputUnit}`
}

export default value
