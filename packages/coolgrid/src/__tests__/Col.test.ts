import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { GridConfig } from '../config'

const mockH = vi.fn()
const mockCreateContext = vi.fn()
const mockUseContext = vi.fn()

vi.mock('@pyreon/core', () => ({
  h: mockH,
  createContext: mockCreateContext,
  useContext: mockUseContext,
  pushContext: vi.fn(),
  popContext: vi.fn(),
  onUnmount: vi.fn(),
}))

let Col: typeof import('../Col').Col

// Helper to set up row context
function setRowContext(config: GridConfig | null) {
  mockUseContext.mockReturnValue(config)
}

describe('Col', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    mockCreateContext.mockImplementation((_default: unknown) => ({
      id: Symbol.for('test-ctx'),
      defaultValue: _default,
    }))
    mockH.mockReturnValue({ type: 'div', props: {}, children: [] })
    setRowContext(null)

    const colModule = await import('../Col')
    Col = colModule.Col
  })

  describe('default rendering', () => {
    it('renders a div by default', () => {
      Col({})
      expect(mockH).toHaveBeenCalledWith(
        'div',
        expect.objectContaining({ style: expect.any(String) }),
        undefined,
      )
    })

    it('defaults to full width (12/12 = 100%) when no span set', () => {
      Col({})
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('flex: 0 0 100%')
      expect(style).toContain('max-width: 100%')
    })

    it('applies box-sizing', () => {
      Col({})
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('box-sizing: border-box')
    })
  })

  describe('xs prop (span)', () => {
    it('calculates width as percentage of columns', () => {
      Col({ xs: 6 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('flex: 0 0 50%')
      expect(style).toContain('max-width: 50%')
    })

    it('handles span of 1 out of 12', () => {
      Col({ xs: 1 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      const expected = ((1 / 12) * 100).toString()
      expect(style).toContain(`flex: 0 0 ${expected}%`)
    })

    it('handles span of 12 out of 12 (full width)', () => {
      Col({ xs: 12 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('flex: 0 0 100%')
      expect(style).toContain('max-width: 100%')
    })

    it('handles span of 4 out of 12 (one-third)', () => {
      Col({ xs: 4 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      const expected = ((4 / 12) * 100).toString()
      expect(style).toContain(`flex: 0 0 ${expected}%`)
    })

    it('handles span of 3 out of 12 (one-quarter)', () => {
      Col({ xs: 3 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('flex: 0 0 25%')
    })
  })

  describe('with Row context', () => {
    it('uses gap from row context for padding', () => {
      setRowContext({
        columns: 12,
        containerWidth: '100%',
        gap: 16,
        gutter: 0,
        padding: 0,
      })
      Col({ xs: 6 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('padding-left: 8px')
      expect(style).toContain('padding-right: 8px')
    })

    it('uses columns from row context for width calculation', () => {
      setRowContext({
        columns: 24,
        containerWidth: '100%',
        gap: 0,
        gutter: 0,
        padding: 0,
      })
      Col({ xs: 6 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      const expected = (6 / 24) * 100
      expect(style).toContain(`flex: 0 0 ${expected}%`)
    })

    it('defaults span to full columns when xs not set', () => {
      setRowContext({
        columns: 24,
        containerWidth: '100%',
        gap: 0,
        gutter: 0,
        padding: 0,
      })
      Col({})
      const style = mockH.mock.calls[0]?.[1]?.style as string
      // span = 24, columns = 24 => 100%
      expect(style).toContain('flex: 0 0 100%')
    })

    it('does not add gap padding when gap is 0', () => {
      setRowContext({
        columns: 12,
        containerWidth: '100%',
        gap: 0,
        gutter: 0,
        padding: 0,
      })
      Col({ xs: 6 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).not.toContain('padding-left')
      expect(style).not.toContain('padding-right')
    })
  })

  describe('offset prop', () => {
    it('adds margin-left as percentage', () => {
      Col({ xs: 6, offset: 3 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('margin-left: 25%')
    })

    it('calculates offset based on columns', () => {
      setRowContext({
        columns: 24,
        containerWidth: '100%',
        gap: 0,
        gutter: 0,
        padding: 0,
      })
      Col({ xs: 6, offset: 6 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      const expected = (6 / 24) * 100
      expect(style).toContain(`margin-left: ${expected}%`)
    })

    it('does not add margin-left when offset is not set', () => {
      Col({ xs: 6 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).not.toContain('margin-left')
    })

    it('does not add margin-left when offset is 0', () => {
      Col({ xs: 6, offset: 0 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).not.toContain('margin-left')
    })
  })

  describe('order prop', () => {
    it('sets order in style', () => {
      Col({ xs: 6, order: 2 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('order: 2')
    })

    it('handles order 0', () => {
      Col({ xs: 6, order: 0 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('order: 0')
    })

    it('handles negative order', () => {
      Col({ xs: 6, order: -1 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('order: -1')
    })

    it('does not set order when not provided', () => {
      Col({ xs: 6 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).not.toMatch(/\border:/)
    })
  })

  describe('tag prop', () => {
    it('uses custom tag', () => {
      Col({ tag: 'article' })
      expect(mockH).toHaveBeenCalledWith(
        'article',
        expect.any(Object),
        undefined,
      )
    })
  })

  describe('class prop', () => {
    it('passes class to h()', () => {
      Col({ class: 'my-col' })
      const props = mockH.mock.calls[0]?.[1]
      expect(props?.class).toBe('my-col')
    })

    it('does not set class when not provided', () => {
      Col({})
      const props = mockH.mock.calls[0]?.[1]
      expect(props?.class).toBeUndefined()
    })
  })

  describe('style prop', () => {
    it('appends extra style', () => {
      Col({ xs: 6, style: 'background: green;' })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('background: green;')
      expect(style).toContain('flex: 0 0 50%')
    })
  })

  describe('children', () => {
    it('passes children to h()', () => {
      const child = 'Hello World'
      Col({ children: child })
      expect(mockH).toHaveBeenCalledWith('div', expect.any(Object), child)
    })
  })

  describe('return value', () => {
    it('returns the VNodeChild from h()', () => {
      const vnode = { type: 'div', props: {}, children: [] }
      mockH.mockReturnValue(vnode)
      const result = Col({})
      expect(result).toBe(vnode)
    })
  })

  describe('width calculations', () => {
    it('1/12 = 8.333...%', () => {
      Col({ xs: 1 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      const percent = (1 / 12) * 100
      expect(style).toContain(`${percent}%`)
    })

    it('2/12 = 16.666...%', () => {
      Col({ xs: 2 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      const percent = (2 / 12) * 100
      expect(style).toContain(`${percent}%`)
    })

    it('6/12 = 50%', () => {
      Col({ xs: 6 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('50%')
    })

    it('8/12 = 66.666...%', () => {
      Col({ xs: 8 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      const percent = (8 / 12) * 100
      expect(style).toContain(`${percent}%`)
    })

    it('handles custom column count from context', () => {
      setRowContext({
        columns: 6,
        containerWidth: '100%',
        gap: 0,
        gutter: 0,
        padding: 0,
      })
      Col({ xs: 2 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      const percent = (2 / 6) * 100
      expect(style).toContain(`${percent}%`)
    })
  })

  describe('combined props', () => {
    it('builds correct style with all props set', () => {
      setRowContext({
        columns: 12,
        containerWidth: '100%',
        gap: 20,
        gutter: 0,
        padding: 0,
      })

      Col({
        xs: 4,
        offset: 2,
        order: 3,
        tag: 'aside',
        class: 'grid-col',
        style: 'color: red;',
      })

      const style = mockH.mock.calls[0]?.[1]?.style as string
      const widthPercent = (4 / 12) * 100
      const offsetPercent = (2 / 12) * 100

      expect(style).toContain('box-sizing: border-box')
      expect(style).toContain(`flex: 0 0 ${widthPercent}%`)
      expect(style).toContain(`max-width: ${widthPercent}%`)
      expect(style).toContain('padding-left: 10px')
      expect(style).toContain('padding-right: 10px')
      expect(style).toContain(`margin-left: ${offsetPercent}%`)
      expect(style).toContain('order: 3')
      expect(style).toContain('color: red;')

      expect(mockH).toHaveBeenCalledWith(
        'aside',
        expect.objectContaining({ class: 'grid-col' }),
        undefined,
      )
    })
  })

  describe('standalone Col (no Row context)', () => {
    it('defaults to 12 columns when no row context', () => {
      Col({ xs: 6 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).toContain('flex: 0 0 50%')
    })

    it('defaults gap to 0 when no row context', () => {
      Col({ xs: 6 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      expect(style).not.toContain('padding-left')
      expect(style).not.toContain('padding-right')
    })
  })

  describe('breakpoint props (sm, md, lg, xl)', () => {
    // The current implementation only uses xs for span calculation.
    // The sm/md/lg/xl props are accepted but not used for inline style.
    // These tests document that behavior.
    it('accepts sm prop without error', () => {
      expect(() => Col({ sm: 6 })).not.toThrow()
    })

    it('accepts md prop without error', () => {
      expect(() => Col({ md: 4 })).not.toThrow()
    })

    it('accepts lg prop without error', () => {
      expect(() => Col({ lg: 3 })).not.toThrow()
    })

    it('accepts xl prop without error', () => {
      expect(() => Col({ xl: 2 })).not.toThrow()
    })

    it('uses xs when multiple breakpoints are provided', () => {
      Col({ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      // xs=12 should be used as span
      expect(style).toContain('flex: 0 0 100%')
    })

    it('falls back to full width when only sm is set (xs is undefined)', () => {
      Col({ sm: 6 })
      const style = mockH.mock.calls[0]?.[1]?.style as string
      // xs is undefined, span = xs ?? columns = 12
      expect(style).toContain('flex: 0 0 100%')
    })
  })
})
