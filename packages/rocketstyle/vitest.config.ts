import path from "node:path"
import createConfig from "../../vitest.shared"

const config = createConfig({ name: "@pyreon/rocketstyle" })

export default {
  ...config,
  resolve: {
    ...config.resolve,
    alias: {
      ...(config.resolve?.alias as Record<string, string> | undefined),
      "~": path.resolve(__dirname, "src"),
    },
  },
}
