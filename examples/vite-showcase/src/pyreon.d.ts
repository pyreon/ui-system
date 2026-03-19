import type { styles } from "@pyreon/unistyle"

type Theme = Parameters<typeof styles>[0]["theme"]
type ThemeWithPseudo = Theme & {
  hover?: Theme & Record<string, unknown>
  focus?: Theme & Record<string, unknown>
  active?: Theme & Record<string, unknown>
}

declare module "@pyreon/rocketstyle" {
  interface StylesDefault extends ThemeWithPseudo {
    [key: string]: unknown
  }
}
