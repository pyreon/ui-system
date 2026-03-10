import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { GridConfig } from '../config'

/**
 * These tests verify the context cascading behavior of Container → Row → Col
 * by examining the arguments passed to pushContext and h().
 *
 * Since we're testing Pyreon components (not React), we call each component
 * function directly with props and examine:
 * - What config is pushed to context (via pushContext)
 * - What style/props are passed to h() for rendering
 * - How parent context flows to child components
 */

const mockH = vi.fn()
const mockPushContext = vi.fn()
const mockPopContext = vi.fn()
const mockOnUnmount = vi.fn()
const mockCreateContext = vi.fn()
const mockUseContext = vi.fn()

vi.mock('@pyreon/core', () => ({
  h: mockH,
  pushContext: mockPushContext,
  popContext: mockPopContext,
  onUnmount: mockOnUnmount,
  createContext: mockCreateContext,
  useContext: mockUseContext,
}))

let Container: typeof import('../Container').Container
let Row: typeof import('../Row').Row
let Col: typeof import('../Col').Col

describe('Context cascading: Container → Row → Col', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    mockCreateContext.mockImplementation((_default: unknown) => ({
      id: Symbol.for('test-ctx'),
      defaultValue: _default,
    }))
    mockH.mockReturnValue({ type: 'div', props: {}, children: [] })
    mockUseContext.mockReturnValue(null)

    const containerModule = await import('../Container')
    const rowModule = await import('../Row')
    const colModule = await import('../Col')
    Container = containerModule.Container
    Row = rowModule.Row
    Col = colModule.Col
  })

  it('Container pushes grid config with columns, gap, gutter, padding', () => {
    Container({ columns: 12, gap: 16, gutter: 8, padding: 4, maxWidth: 960 })

    expect(mockPushContext).toHaveBeenCalledTimes(1)
    const frame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
    const config = Array.from(frame.values())[0] as GridConfig

    expect(config).toEqual({
      columns: 12,
      containerWidth: 960,
      gap: 16,
      gutter: 8,
      padding: 4,
    })
  })

  it('Row inherits columns and gap from Container context', () => {
    // Simulate Container having pushed its context
    const containerConfig: GridConfig = {
      columns: 12,
      containerWidth: 960,
      gap: 16,
      gutter: 8,
      padding: 4,
    }
    mockUseContext.mockReturnValue(containerConfig)

    Row({})

    // Row should push its own context inheriting from container
    const frame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
    const rowConfig = Array.from(frame.values())[0] as GridConfig

    expect(rowConfig.columns).toBe(12)
    expect(rowConfig.gap).toBe(16)
    expect(rowConfig.containerWidth).toBe(960)
    expect(rowConfig.gutter).toBe(8)
    expect(rowConfig.padding).toBe(4)
  })

  it('Row overrides Container columns when specified', () => {
    const containerConfig: GridConfig = {
      columns: 12,
      containerWidth: '100%',
      gap: 0,
      gutter: 0,
      padding: 0,
    }
    mockUseContext.mockReturnValue(containerConfig)

    Row({ columns: 24 })

    const frame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
    const rowConfig = Array.from(frame.values())[0] as GridConfig
    expect(rowConfig.columns).toBe(24)
  })

  it('Row overrides Container gap when specified', () => {
    const containerConfig: GridConfig = {
      columns: 12,
      containerWidth: '100%',
      gap: 16,
      gutter: 0,
      padding: 0,
    }
    mockUseContext.mockReturnValue(containerConfig)

    Row({ gap: 32 })

    const frame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
    const rowConfig = Array.from(frame.values())[0] as GridConfig
    expect(rowConfig.gap).toBe(32)

    // Row style should use the overridden gap
    const style = mockH.mock.calls[0]?.[1]?.style as string
    expect(style).toContain('margin-left: -16px')
    expect(style).toContain('margin-right: -16px')
  })

  it('Col reads gap and columns from Row context', () => {
    const rowConfig: GridConfig = {
      columns: 12,
      containerWidth: '100%',
      gap: 20,
      gutter: 0,
      padding: 0,
    }
    mockUseContext.mockReturnValue(rowConfig)

    Col({ xs: 4 })

    const style = mockH.mock.calls[0]?.[1]?.style as string
    // Width: 4/12 * 100 = 33.333...%
    const expected = ((4 / 12) * 100).toString()
    expect(style).toContain(`flex: 0 0 ${expected}%`)
    // Gap padding: 20/2 = 10px
    expect(style).toContain('padding-left: 10px')
    expect(style).toContain('padding-right: 10px')
  })

  it('Col uses full width when no xs and custom columns from Row', () => {
    const rowConfig: GridConfig = {
      columns: 24,
      containerWidth: '100%',
      gap: 0,
      gutter: 0,
      padding: 0,
    }
    mockUseContext.mockReturnValue(rowConfig)

    Col({})

    const style = mockH.mock.calls[0]?.[1]?.style as string
    // span = xs ?? columns = 24, width = 24/24 * 100 = 100%
    expect(style).toContain('flex: 0 0 100%')
  })

  it('Container registers cleanup on unmount', () => {
    Container({})
    expect(mockOnUnmount).toHaveBeenCalledTimes(1)
    const cleanup = mockOnUnmount.mock.calls[0]?.[0] as () => void
    cleanup()
    expect(mockPopContext).toHaveBeenCalledTimes(1)
  })

  it('Row registers cleanup on unmount', () => {
    Row({})
    expect(mockOnUnmount).toHaveBeenCalledTimes(1)
    const cleanup = mockOnUnmount.mock.calls[0]?.[0] as () => void
    cleanup()
    expect(mockPopContext).toHaveBeenCalledTimes(1)
  })

  it('Col does not push or pop context', () => {
    Col({ xs: 6 })
    // Col only reads context, doesn't push/pop
    // (pushContext from config module init doesn't count)
    // In our mocked setup, Col itself does not call pushContext
    expect(mockPushContext).not.toHaveBeenCalled()
    expect(mockOnUnmount).not.toHaveBeenCalled()
  })

  describe('full cascading simulation', () => {
    it('Container → Row → Col with all config flowing through', () => {
      // Step 1: Container pushes config
      Container({ columns: 12, gap: 16, gutter: 8, padding: 4, maxWidth: 960 })
      const containerFrame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
      const containerConfig = Array.from(containerFrame.values())[0] as GridConfig

      expect(containerConfig).toEqual({
        columns: 12,
        containerWidth: 960,
        gap: 16,
        gutter: 8,
        padding: 4,
      })

      // Step 2: Row reads container config and pushes row config
      vi.clearAllMocks()
      mockH.mockReturnValue({ type: 'div', props: {}, children: [] })
      mockUseContext.mockReturnValue(containerConfig)

      Row({})
      const rowFrame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
      const rowConfig = Array.from(rowFrame.values())[0] as GridConfig

      expect(rowConfig).toEqual({
        columns: 12,
        containerWidth: 960,
        gap: 16,
        gutter: 8,
        padding: 4,
      })

      // Row should have negative margins for gap
      const rowStyle = mockH.mock.calls[0]?.[1]?.style as string
      expect(rowStyle).toContain('margin-left: -8px')
      expect(rowStyle).toContain('margin-right: -8px')

      // Step 3: Col reads row config
      vi.clearAllMocks()
      mockH.mockReturnValue({ type: 'div', props: {}, children: [] })
      mockUseContext.mockReturnValue(rowConfig)

      Col({ xs: 4 })
      const colStyle = mockH.mock.calls[0]?.[1]?.style as string
      const widthPercent = (4 / 12) * 100

      expect(colStyle).toContain(`flex: 0 0 ${widthPercent}%`)
      expect(colStyle).toContain(`max-width: ${widthPercent}%`)
      expect(colStyle).toContain('padding-left: 8px')
      expect(colStyle).toContain('padding-right: 8px')
    })

    it('Row overriding Container values cascades to Col', () => {
      // Container with defaults
      const containerConfig: GridConfig = {
        columns: 12,
        containerWidth: '100%',
        gap: 8,
        gutter: 0,
        padding: 0,
      }

      // Row overrides to 24 columns and 32 gap
      mockUseContext.mockReturnValue(containerConfig)
      Row({ columns: 24, gap: 32 })

      const rowFrame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
      const rowConfig = Array.from(rowFrame.values())[0] as GridConfig

      expect(rowConfig.columns).toBe(24)
      expect(rowConfig.gap).toBe(32)

      // Col reads the Row's overridden config
      vi.clearAllMocks()
      mockH.mockReturnValue({ type: 'div', props: {}, children: [] })
      mockUseContext.mockReturnValue(rowConfig)

      Col({ xs: 6 })
      const colStyle = mockH.mock.calls[0]?.[1]?.style as string
      // 6/24 = 25%
      expect(colStyle).toContain('flex: 0 0 25%')
      // gap 32/2 = 16px
      expect(colStyle).toContain('padding-left: 16px')
      expect(colStyle).toContain('padding-right: 16px')
    })

    it('Col offset respects Row columns', () => {
      const rowConfig: GridConfig = {
        columns: 24,
        containerWidth: '100%',
        gap: 0,
        gutter: 0,
        padding: 0,
      }
      mockUseContext.mockReturnValue(rowConfig)

      Col({ xs: 6, offset: 3 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      // offset 3/24 = 12.5%
      expect(style).toContain('margin-left: 12.5%')
    })

    it('standalone Row + Col without Container', () => {
      // Row without container context
      mockUseContext.mockReturnValue(null)
      Row({ columns: 6, gap: 12 })

      const rowFrame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
      const rowConfig = Array.from(rowFrame.values())[0] as GridConfig

      expect(rowConfig.columns).toBe(6)
      expect(rowConfig.gap).toBe(12)
      expect(rowConfig.containerWidth).toBe('100%')

      // Col reads from standalone Row
      vi.clearAllMocks()
      mockH.mockReturnValue({ type: 'div', props: {}, children: [] })
      mockUseContext.mockReturnValue(rowConfig)

      Col({ xs: 2 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      const percent = (2 / 6) * 100
      expect(style).toContain(`${percent}%`)
      expect(style).toContain('padding-left: 6px')
      expect(style).toContain('padding-right: 6px')
    })
  })
})
