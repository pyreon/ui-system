type Css = (strings: TemplateStringsArray, ...values: any[]) => any

export type CreateMediaQueries = <
  B extends Record<string, number>,
  R extends number,
  C extends Css,
>(props: {
  breakpoints: B
  rootSize: R
  css: C
}) => Record<keyof B, (...args: any[]) => string>

const createMediaQueries: CreateMediaQueries = ({ breakpoints, rootSize, css }) =>
  Object.keys(breakpoints).reduce<Record<string, any>>((acc, key) => {
    const breakpointValue = (breakpoints as Record<string, number>)[key]

    if (breakpointValue === 0) {
      acc[key] = (...args: [TemplateStringsArray, ...any[]]) => css(...args)
    } else if (breakpointValue != null) {
      const emSize = breakpointValue / rootSize

      acc[key] = (...args: [TemplateStringsArray, ...any[]]) => css`
          @media only screen and (min-width: ${emSize}em) {
            ${css(...args)};
          }
        `
    }

    return acc
  }, {}) as any

export default createMediaQueries
