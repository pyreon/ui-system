import { createContext, useContext } from '@pyreon/core'
import type { Context } from '@pyreon/core'

export interface GridConfig {
  columns: number
  containerWidth: string | number
  gap: number
  gutter: number
  padding: number
}

export const defaultGridConfig: GridConfig = {
  columns: 12,
  containerWidth: '100%',
  gap: 0,
  gutter: 0,
  padding: 0,
}

export const defaultBreakpoints: Record<string, number> = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
}

export const defaultContainerWidths: Record<string, string | number> = {
  xs: '100%',
  sm: 540,
  md: 720,
  lg: 960,
  xl: 1140,
}

// Grid context: Container → Row → Col cascading config
export const ContainerContext: Context<GridConfig | null> = createContext<GridConfig | null>(null)
export const RowContext: Context<GridConfig | null> = createContext<GridConfig | null>(null)

export function useContainerContext(): GridConfig | null {
  return useContext(ContainerContext)
}

export function useRowContext(): GridConfig | null {
  return useContext(RowContext)
}
