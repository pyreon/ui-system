import { createContext, useContext } from '@pyreon/core'
import type { Context } from '@pyreon/core'

/** Default theme type — users can augment via module declaration. */
export interface DefaultTheme {}

export const ThemeContext: Context<DefaultTheme> = createContext<DefaultTheme>({} as DefaultTheme)

export function useTheme<T = DefaultTheme>(): T {
  return useContext(ThemeContext) as T
}
