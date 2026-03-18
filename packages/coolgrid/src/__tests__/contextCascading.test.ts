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
      return mockUseContext(...args)
    },
  }
})

const asVNode = (v: unknown) => v as VNode

describe("Context cascading: Container -> Row -> Col", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default: unistyle theme context returns empty theme
    mockUseContext.mockReturnValue({ theme: {} })
  })

  it("Container pushes context with grid config", async () => {
    const Container = (await import("../Container")).default
    // Container calls useContext once (for unistyle theme)
    Container({ columns: 12, gap: 16, gutter: 8, padding: 4, children: "test" })

    expect(mockPushContext).toHaveBeenCalledTimes(1)
    const frame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
    const config = Array.from(frame.values())[0] as Record<string, unknown>

    expect(config.columns).toBe(12)
    expect(config.gap).toBe(16)
    expect(config.gutter).toBe(8)
    expect(config.padding).toBe(4)
  })

  it("Row reads Container context and pushes its own", async () => {
    const Row = (await import("../Row")).default

    // Row calls useContext twice:
    // 1st: ContainerContext (grid config from parent)
    // 2nd: unistyle context (theme) inside useGridContext
    mockUseContext
      .mockReturnValueOnce({
        columns: 12,
        gap: 16,
        gutter: 8,
        padding: 4,
      })
      .mockReturnValueOnce({ theme: {} })

    Row({ children: "test" })

    const frame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
    const rowConfig = Array.from(frame.values())[0] as Record<string, unknown>

    expect(rowConfig.columns).toBe(12)
    expect(rowConfig.gap).toBe(16)
    expect(rowConfig.gutter).toBe(8)
    expect(rowConfig.padding).toBe(4)
  })

  it("Row can override Container values", async () => {
    const Row = (await import("../Row")).default

    // 1st call: ContainerContext, 2nd call: unistyle theme
    mockUseContext.mockReturnValueOnce({ columns: 12, gap: 8 }).mockReturnValueOnce({ theme: {} })

    Row({ columns: 24, gap: 32, children: "test" })

    const frame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
    const rowConfig = Array.from(frame.values())[0] as Record<string, unknown>

    expect(rowConfig.columns).toBe(24)
    expect(rowConfig.gap).toBe(32)
  })

  it("Col reads Row context and passes $coolgrid", async () => {
    const Col = (await import("../Col")).default

    // Col calls useContext twice:
    // 1st: RowContext, 2nd: unistyle theme inside useGridContext
    mockUseContext.mockReturnValueOnce({ columns: 12, gap: 20 }).mockReturnValueOnce({ theme: {} })

    const result = asVNode(Col({ size: 4, children: "test" }))
    expect(result.props.$coolgrid).toBeDefined()
    expect(result.props.$coolgrid.size).toBe(4)
  })

  it("Col does not push context", async () => {
    const Col = (await import("../Col")).default

    Col({ size: 6, children: "test" })
    expect(mockPushContext).not.toHaveBeenCalled()
  })

  it("Container registers cleanup", async () => {
    const Container = (await import("../Container")).default
    Container({ children: "test" })

    expect(mockOnUnmount).toHaveBeenCalledTimes(1)
    const cleanup = mockOnUnmount.mock.calls[0]?.[0] as () => void
    cleanup()
    expect(mockPopContext).toHaveBeenCalledTimes(1)
  })

  it("Row registers cleanup", async () => {
    const Row = (await import("../Row")).default
    Row({ children: "test" })

    expect(mockOnUnmount).toHaveBeenCalledTimes(1)
    const cleanup = mockOnUnmount.mock.calls[0]?.[0] as () => void
    cleanup()
    expect(mockPopContext).toHaveBeenCalledTimes(1)
  })
})
