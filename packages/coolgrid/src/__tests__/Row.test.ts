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
    useContext: (...args: any[]) => {
      if (mockUseContext.mock.calls.length > 0) {
        return mockUseContext(...args)
      }
      return original.useContext(...args)
    },
  }
})

const asVNode = (v: unknown) => v as VNode

describe("Row", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // unistyle context returns empty theme, container context returns empty
    mockUseContext.mockReturnValue({})
  })

  it("returns a VNode", async () => {
    const Row = (await import("../Row")).default
    const result = asVNode(Row({ children: "test" }))
    expect(result).toBeDefined()
    expect(result.type).toBeDefined()
  })

  it("has correct displayName", async () => {
    const Row = (await import("../Row")).default
    expect(Row.displayName).toBe("@pyreon/coolgrid/Row")
  })

  it("has correct pkgName", async () => {
    const Row = (await import("../Row")).default
    expect(Row.pkgName).toBe("@pyreon/coolgrid")
  })

  it("has PYREON__COMPONENT static", async () => {
    const Row = (await import("../Row")).default
    expect(Row.PYREON__COMPONENT).toBe("@pyreon/coolgrid/Row")
  })

  it("passes $coolgrid prop with row values", async () => {
    const Row = (await import("../Row")).default
    const result = asVNode(Row({ gap: 16, children: "test" }))
    expect(result.props).toHaveProperty("$coolgrid")
    expect(result.props.$coolgrid).toHaveProperty("gap")
  })

  it("pushes RowContext", async () => {
    const Row = (await import("../Row")).default
    Row({ gap: 16, columns: 12, children: "test" })
    expect(mockPushContext).toHaveBeenCalledTimes(1)
    const frame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
    expect(frame).toBeInstanceOf(Map)
  })

  it("registers onUnmount to pop context", async () => {
    const Row = (await import("../Row")).default
    Row({ children: "test" })
    expect(mockOnUnmount).toHaveBeenCalledTimes(1)
    const cleanup = mockOnUnmount.mock.calls[0]?.[0] as () => void
    cleanup()
    expect(mockPopContext).toHaveBeenCalledTimes(1)
  })

  it("pushes context config with grid values", async () => {
    const Row = (await import("../Row")).default
    Row({ columns: 24, gap: 16, gutter: 8, children: "test" })
    const frame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
    const config = Array.from(frame.values())[0] as Record<string, unknown>
    expect(config.columns).toBe(24)
    expect(config.gap).toBe(16)
    expect(config.gutter).toBe(8)
  })

  it("passes contentAlignX to $coolgrid", async () => {
    const Row = (await import("../Row")).default
    const result = asVNode(Row({ contentAlignX: "center", children: "test" }))
    expect(result.props.$coolgrid.contentAlignX).toBe("center")
  })

  it("strips context keys from DOM props", async () => {
    const Row = (await import("../Row")).default
    const result = asVNode(
      Row({
        columns: 12,
        gap: 16,
        "data-testid": "row",
        children: "test",
      }),
    )
    expect(result.props["data-testid"]).toBe("row")
  })
})
