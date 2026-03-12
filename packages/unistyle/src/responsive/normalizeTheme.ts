type AssignToBreakpointKey = (
  breakpoints: string[],
) => (
  value: (
    breakpoint: string,
    i: number,
    breakpoints: string[],
    result: Record<string, unknown>,
  ) => void,
) => Record<string, unknown>

const assignToBreakpointKey: AssignToBreakpointKey =
  (breakpoints) => (value) => {
    const result: Record<string, unknown> = {}
    breakpoints.forEach((item, i) => {
      result[item] = value(item, i, breakpoints, result)
    })
    return result
  }

const handleArrayCb = (arr: (string | number)[]) => (_: unknown, i: number) => {
  const currentValue = arr[i]
  const lastValue = arr[arr.length - 1]
  return currentValue ?? lastValue
}

const handleObjectCb =
  (obj: Record<string, unknown>) =>
  (bp: string, i: number, bps: string[], res: Record<string, unknown>) => {
    const currentValue = obj[bp]
    const previousValue = res[bps[i - 1]!]
    if (currentValue != null) return currentValue
    return previousValue
  }

const handleValueCb = (value: unknown) => () => value

const shouldNormalize = (props: Record<string, any>) =>
  Object.values(props).some(
    (item) => typeof item === 'object' || Array.isArray(item),
  )

export type NormalizeTheme = ({
  theme,
  breakpoints,
}: {
  theme: Record<string, unknown>
  breakpoints: string[]
}) => Record<string, unknown>

const normalizeTheme: NormalizeTheme = ({ theme, breakpoints }) => {
  if (!shouldNormalize(theme)) return theme

  const getBpValues = assignToBreakpointKey(breakpoints)
  const result: Record<string, unknown> = {}

  Object.entries(theme).forEach(([key, value]) => {
    if (value == null) return

    if (Array.isArray(value)) {
      result[key] = getBpValues(handleArrayCb(value as (string | number)[]))
    } else if (typeof value === 'object') {
      result[key] = getBpValues(handleObjectCb(value as Record<string, any>))
    } else {
      result[key] = getBpValues(handleValueCb(value))
    }
  })

  return result
}

export default normalizeTheme
