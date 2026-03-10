import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { Context } from '@pyreon/core'

// Mock @pyreon/core before importing config
const mockCreateContext = vi.fn()
const mockUseContext = vi.fn()

vi.mock('@pyreon/core', () => ({
  createContext: mockCreateContext,
  useContext: mockUseContext,
}))

describe('config', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // createContext returns a Context-shaped object
    mockCreateContext.mockImplementation((defaultVal: unknown) => ({
      id: Symbol('test-context'),
      defaultValue: defaultVal,
    }))
  })

  describe('defaultGridConfig', () => {
    it('has correct default values', async () => {
      const { defaultGridConfig } = await import('../config')
      expect(defaultGridConfig).toEqual({
        columns: 12,
        containerWidth: '100%',
        gap: 0,
        gutter: 0,
        padding: 0,
      })
    })
  })

  describe('defaultBreakpoints', () => {
    it('has all standard breakpoints', async () => {
      const { defaultBreakpoints } = await import('../config')
      expect(defaultBreakpoints).toEqual({
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
      })
    })

    it('breakpoints are in ascending order', async () => {
      const { defaultBreakpoints } = await import('../config')
      const values = Object.values(defaultBreakpoints)
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeGreaterThan(values[i - 1] as number)
      }
    })
  })

  describe('defaultContainerWidths', () => {
    it('has widths for all breakpoints', async () => {
      const { defaultContainerWidths } = await import('../config')
      expect(defaultContainerWidths).toEqual({
        xs: '100%',
        sm: 540,
        md: 720,
        lg: 960,
        xl: 1140,
      })
    })

    it('xs is percentage, others are numbers', async () => {
      const { defaultContainerWidths } = await import('../config')
      expect(typeof defaultContainerWidths.xs).toBe('string')
      expect(typeof defaultContainerWidths.sm).toBe('number')
      expect(typeof defaultContainerWidths.md).toBe('number')
      expect(typeof defaultContainerWidths.lg).toBe('number')
      expect(typeof defaultContainerWidths.xl).toBe('number')
    })

    it('numeric widths are in ascending order', async () => {
      const { defaultContainerWidths } = await import('../config')
      const numericWidths = [
        defaultContainerWidths.sm,
        defaultContainerWidths.md,
        defaultContainerWidths.lg,
        defaultContainerWidths.xl,
      ] as number[]
      for (let i = 1; i < numericWidths.length; i++) {
        expect(numericWidths[i]).toBeGreaterThan(numericWidths[i - 1] as number)
      }
    })
  })

  describe('ContainerContext', () => {
    it('is created via createContext with null default', async () => {
      const { ContainerContext } = await import('../config')
      // createContext was called; the returned object has an id
      expect(ContainerContext).toHaveProperty('id')
    })
  })

  describe('RowContext', () => {
    it('is created via createContext with null default', async () => {
      const { RowContext } = await import('../config')
      expect(RowContext).toHaveProperty('id')
    })
  })

  describe('useContainerContext', () => {
    it('calls useContext with ContainerContext', async () => {
      const mockConfig = { columns: 12, containerWidth: '100%', gap: 0, gutter: 0, padding: 0 }
      mockUseContext.mockReturnValue(mockConfig)
      const { useContainerContext, ContainerContext } = await import('../config')
      const result = useContainerContext()
      expect(mockUseContext).toHaveBeenCalledWith(ContainerContext)
      expect(result).toBe(mockConfig)
    })

    it('returns null when no context is provided', async () => {
      mockUseContext.mockReturnValue(null)
      const { useContainerContext } = await import('../config')
      const result = useContainerContext()
      expect(result).toBeNull()
    })
  })

  describe('useRowContext', () => {
    it('calls useContext with RowContext', async () => {
      const mockConfig = { columns: 12, containerWidth: '100%', gap: 8, gutter: 0, padding: 0 }
      mockUseContext.mockReturnValue(mockConfig)
      const { useRowContext, RowContext } = await import('../config')
      const result = useRowContext()
      expect(mockUseContext).toHaveBeenCalledWith(RowContext)
      expect(result).toBe(mockConfig)
    })

    it('returns null when no context is provided', async () => {
      mockUseContext.mockReturnValue(null)
      const { useRowContext } = await import('../config')
      const result = useRowContext()
      expect(result).toBeNull()
    })
  })

  describe('GridConfig type contract', () => {
    it('defaultGridConfig satisfies GridConfig interface', async () => {
      const { defaultGridConfig } = await import('../config')
      expect(defaultGridConfig).toHaveProperty('columns')
      expect(defaultGridConfig).toHaveProperty('containerWidth')
      expect(defaultGridConfig).toHaveProperty('gap')
      expect(defaultGridConfig).toHaveProperty('gutter')
      expect(defaultGridConfig).toHaveProperty('padding')
      expect(typeof defaultGridConfig.columns).toBe('number')
      expect(typeof defaultGridConfig.gap).toBe('number')
      expect(typeof defaultGridConfig.gutter).toBe('number')
      expect(typeof defaultGridConfig.padding).toBe('number')
    })
  })
})
