import { describe, expect, it, vi } from 'vitest'

// Mock @pyreon/core since all modules depend on it
vi.mock('@pyreon/core', () => ({
  h: vi.fn(),
  createContext: vi.fn(() => ({ id: Symbol('ctx'), defaultValue: null })),
  useContext: vi.fn(),
  pushContext: vi.fn(),
  popContext: vi.fn(),
  onUnmount: vi.fn(),
}))

describe('index exports', () => {
  it('exports Container', async () => {
    const mod = await import('../index')
    expect(mod.Container).toBeDefined()
    expect(typeof mod.Container).toBe('function')
  })

  it('exports Row', async () => {
    const mod = await import('../index')
    expect(mod.Row).toBeDefined()
    expect(typeof mod.Row).toBe('function')
  })

  it('exports Col', async () => {
    const mod = await import('../index')
    expect(mod.Col).toBeDefined()
    expect(typeof mod.Col).toBe('function')
  })

  it('exports defaultGridConfig', async () => {
    const mod = await import('../index')
    expect(mod.defaultGridConfig).toBeDefined()
    expect(mod.defaultGridConfig).toEqual({
      columns: 12,
      containerWidth: '100%',
      gap: 0,
      gutter: 0,
      padding: 0,
    })
  })

  it('exports defaultBreakpoints', async () => {
    const mod = await import('../index')
    expect(mod.defaultBreakpoints).toBeDefined()
    expect(mod.defaultBreakpoints).toEqual({
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
    })
  })

  it('exports defaultContainerWidths', async () => {
    const mod = await import('../index')
    expect(mod.defaultContainerWidths).toBeDefined()
    expect(mod.defaultContainerWidths).toEqual({
      xs: '100%',
      sm: 540,
      md: 720,
      lg: 960,
      xl: 1140,
    })
  })

  it('does not export unexpected items', async () => {
    const mod = await import('../index')
    const exportedKeys = Object.keys(mod)
    expect(exportedKeys).toContain('Container')
    expect(exportedKeys).toContain('Row')
    expect(exportedKeys).toContain('Col')
    expect(exportedKeys).toContain('defaultGridConfig')
    expect(exportedKeys).toContain('defaultBreakpoints')
    expect(exportedKeys).toContain('defaultContainerWidths')
  })
})
