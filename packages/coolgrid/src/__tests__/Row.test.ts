import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { GridConfig } from '../config'

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

let Row: typeof import('../Row').Row

// Helper to set up container context
function setContainerContext(config: GridConfig | null) {
  mockUseContext.mockReturnValue(config)
}

describe('Row', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    mockCreateContext.mockImplementation((_default: unknown) => ({
      id: Symbol.for('test-ctx'),
      defaultValue: _default,
    }))
    mockH.mockReturnValue({ type: 'div', props: {}, children: [] })
    setContainerContext(null)

    const rowModule = await import('../Row')
    Row = rowModule.Row
  })

  describe('default rendering', () => {
    it('renders a div by default', () => {
      Row({})
      expect(mockH).toHaveBeenCalledWith(
        'div',
        expect.objectContaining({ style: expect.any(String) }),
        undefined,
      )
    })

    it('applies flex-wrap and box-sizing', () => {
      Row({})
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('display: flex')
      expect(style).toContain('flex-wrap: wrap')
      expect(style).toContain('box-sizing: border-box')
    })

    it('does not apply negative margins when gap is 0', () => {
      Row({})
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).not.toContain('margin-left:')
      expect(style).not.toContain('margin-right:')
    })
  })

  describe('gap prop', () => {
    it('applies negative margins for gap', () => {
      Row({ gap: 16 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('margin-left: -8px')
      expect(style).toContain('margin-right: -8px')
    })

    it('calculates negative margins as gap/2', () => {
      Row({ gap: 24 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('margin-left: -12px')
      expect(style).toContain('margin-right: -12px')
    })

    it('overrides container gap when provided', () => {
      setContainerContext({
        columns: 12,
        containerWidth: '100%',
        gap: 32,
        gutter: 0,
        padding: 0,
      })
      Row({ gap: 8 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('margin-left: -4px')
      expect(style).toContain('margin-right: -4px')
    })

    it('inherits gap from container context', () => {
      setContainerContext({
        columns: 12,
        containerWidth: '100%',
        gap: 20,
        gutter: 0,
        padding: 0,
      })
      Row({})
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('margin-left: -10px')
      expect(style).toContain('margin-right: -10px')
    })
  })

  describe('columns prop', () => {
    it('overrides container columns when provided', () => {
      setContainerContext({
        columns: 12,
        containerWidth: '100%',
        gap: 0,
        gutter: 0,
        padding: 0,
      })
      Row({ columns: 24 })
      // Verify the config pushed to RowContext
      const frame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
      const config = Array.from(frame.values())[0] as GridConfig
      expect(config.columns).toBe(24)
    })

    it('inherits columns from container context', () => {
      setContainerContext({
        columns: 16,
        containerWidth: '100%',
        gap: 0,
        gutter: 0,
        padding: 0,
      })
      Row({})
      const frame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
      const config = Array.from(frame.values())[0] as GridConfig
      expect(config.columns).toBe(16)
    })

    it('defaults to 12 when no context and no prop', () => {
      Row({})
      const frame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
      const config = Array.from(frame.values())[0] as GridConfig
      expect(config.columns).toBe(12)
    })
  })

  describe('alignX prop', () => {
    it('maps left to flex-start', () => {
      Row({ alignX: 'left' })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('justify-content: flex-start')
    })

    it('maps center to center', () => {
      Row({ alignX: 'center' })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('justify-content: center')
    })

    it('maps right to flex-end', () => {
      Row({ alignX: 'right' })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('justify-content: flex-end')
    })

    it('maps between to space-between', () => {
      Row({ alignX: 'between' })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('justify-content: space-between')
    })

    it('maps around to space-around', () => {
      Row({ alignX: 'around' })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('justify-content: space-around')
    })

    it('maps evenly to space-evenly', () => {
      Row({ alignX: 'evenly' })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('justify-content: space-evenly')
    })

    it('does not add justify-content when alignX is not set', () => {
      Row({})
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).not.toContain('justify-content')
    })
  })

  describe('alignY prop', () => {
    it('maps top to flex-start', () => {
      Row({ alignY: 'top' })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('align-items: flex-start')
    })

    it('maps center to center', () => {
      Row({ alignY: 'center' })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('align-items: center')
    })

    it('maps bottom to flex-end', () => {
      Row({ alignY: 'bottom' })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('align-items: flex-end')
    })

    it('maps stretch to stretch', () => {
      Row({ alignY: 'stretch' })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('align-items: stretch')
    })

    it('does not add align-items when alignY is not set', () => {
      Row({})
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).not.toContain('align-items')
    })
  })

  describe('tag prop', () => {
    it('uses custom tag', () => {
      Row({ tag: 'section' })
      expect(mockH).toHaveBeenCalledWith(
        'section',
        expect.any(Object),
        undefined,
      )
    })
  })

  describe('class prop', () => {
    it('passes class to h()', () => {
      Row({ class: 'my-row' })
      const props = mockH.mock.calls[0]?.[1]
      expect(props?.class).toBe('my-row')
    })

    it('does not set class when not provided', () => {
      Row({})
      const props = mockH.mock.calls[0]?.[1]
      expect(props?.class).toBeUndefined()
    })
  })

  describe('style prop', () => {
    it('appends extra style', () => {
      Row({ style: 'background: red;' })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('background: red;')
      expect(style).toContain('display: flex')
    })
  })

  describe('children', () => {
    it('passes children to h()', () => {
      const child = [{ type: 'div', props: {}, children: [] }]
      Row({ children: child })
      expect(mockH).toHaveBeenCalledWith('div', expect.any(Object), child)
    })
  })

  describe('context management', () => {
    it('pushes RowContext with config', () => {
      Row({ gap: 16, columns: 24 })
      expect(mockPushContext).toHaveBeenCalledTimes(1)
      const frame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
      expect(frame).toBeInstanceOf(Map)
      const config = Array.from(frame.values())[0] as GridConfig
      expect(config.gap).toBe(16)
      expect(config.columns).toBe(24)
    })

    it('inherits containerWidth from parent context', () => {
      setContainerContext({
        columns: 12,
        containerWidth: 960,
        gap: 0,
        gutter: 8,
        padding: 4,
      })
      Row({})
      const frame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
      const config = Array.from(frame.values())[0] as GridConfig
      expect(config.containerWidth).toBe(960)
      expect(config.gutter).toBe(8)
      expect(config.padding).toBe(4)
    })

    it('defaults containerWidth to 100% when no parent', () => {
      Row({})
      const frame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
      const config = Array.from(frame.values())[0] as GridConfig
      expect(config.containerWidth).toBe('100%')
      expect(config.gutter).toBe(0)
      expect(config.padding).toBe(0)
    })

    it('registers onUnmount callback to pop context', () => {
      Row({})
      expect(mockOnUnmount).toHaveBeenCalledTimes(1)
      const cleanupFn = mockOnUnmount.mock.calls[0]?.[0] as () => void
      cleanupFn()
      expect(mockPopContext).toHaveBeenCalledTimes(1)
    })
  })

  describe('return value', () => {
    it('returns the VNode from h()', () => {
      const vnode = { type: 'div', props: {}, children: [] }
      mockH.mockReturnValue(vnode)
      const result = Row({})
      expect(result).toBe(vnode)
    })
  })

  describe('combined props', () => {
    it('builds correct style with all props set', () => {
      Row({
        gap: 20,
        alignX: 'center',
        alignY: 'bottom',
        tag: 'nav',
        class: 'grid-row',
        style: 'min-height: 100px;',
      })

      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('display: flex')
      expect(style).toContain('flex-wrap: wrap')
      expect(style).toContain('box-sizing: border-box')
      expect(style).toContain('margin-left: -10px')
      expect(style).toContain('margin-right: -10px')
      expect(style).toContain('justify-content: center')
      expect(style).toContain('align-items: flex-end')
      expect(style).toContain('min-height: 100px;')

      expect(mockH).toHaveBeenCalledWith(
        'nav',
        expect.objectContaining({ class: 'grid-row' }),
        undefined,
      )
    })
  })

  describe('standalone Row (no Container)', () => {
    it('works without container context using defaults', () => {
      Row({ columns: 6, gap: 8 })
      const frame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
      const config = Array.from(frame.values())[0] as GridConfig
      expect(config.columns).toBe(6)
      expect(config.gap).toBe(8)
      expect(config.containerWidth).toBe('100%')
      expect(config.gutter).toBe(0)
      expect(config.padding).toBe(0)
    })
  })
})
