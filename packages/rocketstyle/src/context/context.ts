import type { VNode } from "@pyreon/core"
import { useContext } from "@pyreon/core"
import { Provider as CoreProvider, context } from "@pyreon/ui-core"
import { MODE_DEFAULT, THEME_MODES_INVERSED } from "~/constants"
import type { ComponentFn } from "~/types/utils"

type Theme = {
  rootSize: number
  breakpoints?: Record<string, number>
} & Record<string, unknown>

export type TProvider = {
  children: VNode | VNode[] | null
  theme?: Theme | undefined
  mode?: "light" | "dark" | undefined
  inversed?: boolean | undefined
  provider?: ComponentFn<any> | undefined
}

/**
 * Top-level theme and mode provider for rocketstyle components.
 * Reads the parent context, merges incoming props, and resolves
 * the active mode (with optional inversion for nested dark/light switching).
 *
 * In Pyreon, context is provided via pushContext/popContext instead of React.Provider.
 */
const Provider: ComponentFn<TProvider> = ({ provider = CoreProvider, inversed, ...props }) => {
  const ctx = useContext<TProvider>(context)

  const { theme, mode, provider: RocketstyleProvider, children } = { ...ctx, ...props, provider }

  let newMode = MODE_DEFAULT

  if (mode) {
    newMode = inversed ? THEME_MODES_INVERSED[mode] : mode
  }

  return RocketstyleProvider({
    mode: newMode,
    isDark: newMode === "dark",
    isLight: newMode === "light",
    theme,
    provider,
    children,
  })
}

export { context }

export default Provider
