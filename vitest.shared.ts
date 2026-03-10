import { createVitestConfig } from "@vitus-labs/tools-vitest"

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
