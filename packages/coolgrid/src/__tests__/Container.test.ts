import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { GridConfig } from '../config'

// Track calls to @pyreon/core functions
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

// We need config to be loaded with the mock in place
let Container: typeof import('../Container').Container
let ContainerContext: typeof import('../config').ContainerContext

describe('Container', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    // createContext returns a Context-like object
    mockCreateContext.mockImplementation((_default: unknown) => ({
      id: Symbol.for('container-ctx'),
      defaultValue: _default,
    }))
    mockH.mockReturnValue({ type: 'div', props: {}, children: [] })

    // Re-import to get fresh module with mocks applied
    const configModule = await import('../config')
    const containerModule = await import('../Container')
    Container = containerModule.Container
    ContainerContext = configModule.ContainerContext
  })

  describe('default props', () => {
    it('renders a div by default', () => {
      Container({})
      expect(mockH).toHaveBeenCalledWith(
        'div',
        expect.objectContaining({ style: expect.any(String) }),
        undefined, // no children
      )
    })

    it('uses default maxWidth of 100%', () => {
      Container({})
      const callArgs = mockH.mock.calls[0]
      const style = callArgs?.[1]?.style as string
      expect(style).toContain('max-width: 100%')
    })

    it('applies auto margins and box-sizing', () => {
      Container({})
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('margin-left: auto')
      expect(style).toContain('margin-right: auto')
      expect(style).toContain('box-sizing: border-box')
    })

    it('does not add gutter padding when gutter is 0', () => {
      Container({})
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).not.toContain('padding-left')
      expect(style).not.toContain('padding-right')
    })
  })

  describe('maxWidth prop', () => {
    it('converts numeric maxWidth to px', () => {
      Container({ maxWidth: 960 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('max-width: 960px')
    })

    it('uses string maxWidth as-is', () => {
      Container({ maxWidth: '80rem' })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('max-width: 80rem')
    })

    it('handles percentage string', () => {
      Container({ maxWidth: '50%' })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('max-width: 50%')
    })
  })

  describe('gutter prop', () => {
    it('adds padding when gutter is set', () => {
      Container({ gutter: 16 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('padding-left: 16px')
      expect(style).toContain('padding-right: 16px')
    })

    it('does not add padding when gutter is 0', () => {
      Container({ gutter: 0 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).not.toContain('padding-left')
      expect(style).not.toContain('padding-right')
    })
  })

  describe('tag prop', () => {
    it('uses custom tag', () => {
      Container({ tag: 'section' })
      expect(mockH).toHaveBeenCalledWith(
        'section',
        expect.any(Object),
        undefined,
      )
    })

    it('uses div when tag is not specified', () => {
      Container({})
      expect(mockH).toHaveBeenCalledWith('div', expect.any(Object), undefined)
    })
  })

  describe('class prop', () => {
    it('passes class to h()', () => {
      Container({ class: 'my-container' })
      const props = mockH.mock.calls[0]?.[1]
      expect(props?.class).toBe('my-container')
    })

    it('does not set class when not provided', () => {
      Container({})
      const props = mockH.mock.calls[0]?.[1]
      expect(props?.class).toBeUndefined()
    })
  })

  describe('style prop', () => {
    it('appends extra style', () => {
      Container({ style: 'background: red;' })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('background: red;')
      // Should still contain the base styles
      expect(style).toContain('max-width: 100%')
    })
  })

  describe('children', () => {
    it('passes children to h()', () => {
      const child = { type: 'span', props: {}, children: ['hello'] }
      Container({ children: child })
      expect(mockH).toHaveBeenCalledWith(
        'div',
        expect.any(Object),
        child,
      )
    })
  })

  describe('context management', () => {
    it('pushes ContainerContext with grid config', () => {
      Container({ columns: 12, gap: 16, gutter: 8, padding: 4, maxWidth: 960 })
      expect(mockPushContext).toHaveBeenCalledTimes(1)
      const frame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
      expect(frame).toBeInstanceOf(Map)

      // Extract the config from the map
      const entries = Array.from(frame.entries())
      expect(entries).toHaveLength(1)
      const [_contextId, config] = entries[0] as [symbol, GridConfig]
      expect(config).toEqual({
        columns: 12,
        containerWidth: 960,
        gap: 16,
        gutter: 8,
        padding: 4,
      })
    })

    it('uses default values in context config', () => {
      Container({})
      const frame = mockPushContext.mock.calls[0]?.[0] as Map<symbol, unknown>
      const config = Array.from(frame.values())[0] as GridConfig
      expect(config).toEqual({
        columns: 12,
        containerWidth: '100%',
        gap: 0,
        gutter: 0,
        padding: 0,
      })
    })

    it('registers onUnmount callback to pop context', () => {
      Container({})
      expect(mockOnUnmount).toHaveBeenCalledTimes(1)
      expect(mockOnUnmount).toHaveBeenCalledWith(expect.any(Function))

      // Call the cleanup function and verify popContext is called
      const cleanupFn = mockOnUnmount.mock.calls[0]?.[0] as () => void
      cleanupFn()
      expect(mockPopContext).toHaveBeenCalledTimes(1)
    })

    it('pushContext is called before h() rendering', () => {
      const callOrder: string[] = []
      mockPushContext.mockImplementation(() => {
        callOrder.push('pushContext')
      })
      mockH.mockImplementation(() => {
        callOrder.push('h')
        return { type: 'div', props: {}, children: [] }
      })

      Container({})
      expect(callOrder).toEqual(['pushContext', 'h'])
    })
  })

  describe('return value', () => {
    it('returns the VNode from h()', () => {
      const vnode = { type: 'div', props: {}, children: [] }
      mockH.mockReturnValue(vnode)
      const result = Container({})
      expect(result).toBe(vnode)
    })
  })

  describe('combined props', () => {
    it('builds correct style with all props set', () => {
      Container({
        maxWidth: 1200,
        gutter: 24,
        class: 'grid-container',
        style: 'color: blue;',
        tag: 'main',
      })

      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('max-width: 1200px')
      expect(style).toContain('margin-left: auto')
      expect(style).toContain('margin-right: auto')
      expect(style).toContain('box-sizing: border-box')
      expect(style).toContain('padding-left: 24px')
      expect(style).toContain('padding-right: 24px')
      expect(style).toContain('color: blue;')

      expect(mockH).toHaveBeenCalledWith(
        'main',
        expect.objectContaining({ class: 'grid-container' }),
        undefined,
      )
    })
  })
})
