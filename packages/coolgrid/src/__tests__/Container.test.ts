import type { VNode } from "@pyreon/core"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mockPushContext = vi.fn()
const mockPopContext = vi.fn()
const mockOnUnmount = vi.fn()
const mockUseContext = vi.fn()

vi.mock("@pyreon/core", async (importOriginal) => {
  const original = await importOriginal<typeof import("@pyreon/core")>()
  return {
    ...original,
    pushContext: (...args: any[]) => {
      mockPushContext(...args)
    },
    popContext: (...args: any[]) => {
      mockPopContext(...args)
    },
    onUnmount: (...args: any[]) => {
      mockOnUnmount(...args)
    },
    useContext: (ctx: any) => {
      if (mockUseContext.mock.calls.length > 0) {
        return mockUseContext(ctx)
      }
      return original.useContext(ctx)
    },
  }
})

const asVNode = (v: unknown) => v as VNode

describe("Container", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // unistyle context returns empty theme
    mockUseContext.mockReturnValue({ theme: {} })
  })

  it("returns a VNode", async () => {
    const Container = (await import("../Container")).default
    const result = asVNode(Container({ children: "test" }))
    expect(result).toBeDefined()
    expect(result.type).toBeDefined()
  })

  it("has correct displayName", async () => {
    const Container = (await import("../Container")).default
    expect(Container.displayName).toBe("@pyreon/coolgrid/Container")
  })

  it("has correct pkgName", async () => {
    const Container = (await import("../Container")).default
    expect(Container.pkgName).toBe("@pyreon/coolgrid")
  })

  it("has PYREON__COMPONENT static", async () => {
    const Container = (await import("../Container")).default
    expect(Container.PYREON__COMPONENT).toBe("@pyreon/coolgrid/Container")
  })

  it("passes $coolgrid prop with width and extraStyles", async () => {
    const Container = (await import("../Container")).default
    const result = asVNode(Container({ children: "test" }))
    expect(result.props).toHaveProperty("$coolgrid")
    expect(result.props.$coolgrid).toHaveProperty("width")
  })

  it("pushes ContainerContext", async () => {
    const Container = (await import("../Container")).default
    Container({ columns: 12, gap: 16, children: "test" })
    expect(mockPushContext).toHaveBeenCalledTimes(1)
    const frame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
    expect(frame).toBeInstanceOf(Map)
  })

  it("registers onUnmount to pop context", async () => {
    const Container = (await import("../Container")).default
    Container({ children: "test" })
    expect(mockOnUnmount).toHaveBeenCalledTimes(1)
    const cleanup = mockOnUnmount.mock.calls[0]?.[0] as () => void
    cleanup()
    expect(mockPopContext).toHaveBeenCalledTimes(1)
  })

  it("pushes context config with grid values", async () => {
    const Container = (await import("../Container")).default
    Container({ columns: 24, gap: 16, gutter: 8, children: "test" })
    const frame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
    const config = Array.from(frame.values())[0] as Record<string, unknown>
    expect(config.columns).toBe(24)
    expect(config.gap).toBe(16)
    expect(config.gutter).toBe(8)
  })

  it("uses width prop to override containerWidth", async () => {
    const Container = (await import("../Container")).default
    const result = asVNode(Container({ width: 960, children: "test" }))
    expect((result.props.$coolgrid as Record<string, unknown>).width).toBe(960)
  })

  it("accepts width as function", async () => {
    const Container = (await import("../Container")).default
    const widthFn = (_containerWidth: any) => 800
    const result = asVNode(Container({ width: widthFn as any, children: "test" }))
    expect((result.props.$coolgrid as Record<string, unknown>).width).toBe(800)
  })

  it("strips context keys from DOM props", async () => {
    const Container = (await import("../Container")).default
    const result = asVNode(
      Container({
        columns: 12,
        gap: 16,
        "data-testid": "container",
        children: "test",
      }),
    )
    expect(result.props["data-testid"]).toBe("container")
  })
})
