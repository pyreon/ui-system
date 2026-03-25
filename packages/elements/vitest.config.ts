import path from "node:path"
import createConfig from "../../vitest.shared"

const base = createConfig({ name: "@pyreon/elements" })
const baseResolve = (base as any).resolve ?? {}

export default {
  ...base,
  resolve: {
    ...baseResolve,
    alias: {
      ...baseResolve.alias,
      "~": path.resolve(import.meta.dirname, "src"),
    },
  },
}
