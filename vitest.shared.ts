import { createVitestConfig } from "@vitus-labs/tools-vitest"
import tildeResolve from "./vitest.tilde-plugin"

type Options = {
  name: string
  define?: Record<string, unknown>
}

export default ({ name, define }: Options) => {
  const config = createVitestConfig({
    environment: "jsdom",
  })

  return {
    ...config,
    ...(define ? { define } : {}),
    plugins: [...(config.plugins ?? []), tildeResolve()],
    oxc: {
      jsx: {
        runtime: "automatic",
        importSource: "@pyreon/core",
      },
    },
    resolve: {
      ...config.resolve,
      conditions: ["bun", "source"],
    },
    test: {
      ...config.test,
      name,
      include: ["src/__tests__/**/*.test.{ts,tsx}"],
    },
  }
}
