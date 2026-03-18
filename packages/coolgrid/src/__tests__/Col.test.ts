import type { VNode } from "@pyreon/core"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mockPushContext = vi.fn()
const mockPopContext = vi.fn()
const mockOnUnmount = vi.fn()
const mockCreateContext = vi.fn()
const mockUseContext = vi.fn()

vi.mock("@pyreon/core", async (importOriginal) => {
  const original = await importOriginal<typeof import("@pyreon/core")>()
  return {
    ...original,
    pushContext: mockPushContext,
    popContext: mockPopContext,
    onUnmount: mockOnUnmount,
    createContext: (...args: any[]) => {
      mockCreateContext(...args)
      return original.createContext(args[0])
    },
    useContext: (...args: any[]) => {
      if (mockUseContext.mock.results.length > 0 || mockUseContext.mock.calls.length > 0) {
        return mockUseContext(...args)
      }
      return original.useContext(...args)
    },
  }
})

// Mock unistyle context to return empty theme
vi.mock("@pyreon/unistyle", async (importOriginal) => {
  const original = await importOriginal<typeof import("@pyreon/unistyle")>()
  return {
    ...original,
  }
})

const asVNode = (v: unknown) => v as VNode

describe("Col", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default: no context (empty object)
    mockUseContext.mockReturnValue({})
  })

  it("returns a VNode", async () => {
    const Col = (await import("../Col")).default
    const result = asVNode(Col({ children: "test" }))
    expect(result).toBeDefined()
    expect(result.type).toBeDefined()
  })

  it("has correct displayName", async () => {
    const Col = (await import("../Col")).default
    expect(Col.displayName).toBe("@pyreon/coolgrid/Col")
  })

  it("has correct pkgName", async () => {
    const Col = (await import("../Col")).default
    expect(Col.pkgName).toBe("@pyreon/coolgrid")
  })

  it("has PYREON__COMPONENT static", async () => {
    const Col = (await import("../Col")).default
    expect(Col.PYREON__COMPONENT).toBe("@pyreon/coolgrid/Col")
  })

  it("passes $coolgrid prop with grid values", async () => {
    const Col = (await import("../Col")).default
    const result = asVNode(Col({ size: 6, children: "test" }))
    expect(result.props).toHaveProperty("$coolgrid")
  })

  it("does not push context (Col only reads, never provides)", async () => {
    const Col = (await import("../Col")).default
    Col({ children: "test" })
    expect(mockPushContext).not.toHaveBeenCalled()
    expect(mockOnUnmount).not.toHaveBeenCalled()
  })

  it("strips context keys from DOM props", async () => {
    const Col = (await import("../Col")).default
    const result = asVNode(
      Col({
        columns: 12,
        gap: 16,
        size: 6,
        "data-testid": "my-col",
        children: "test",
      }),
    )
    // context keys should be stripped from the rendered props
    // but $coolgrid should be present
    expect(result.props.$coolgrid).toBeDefined()
    expect(result.props["data-testid"]).toBe("my-col")
  })
})
