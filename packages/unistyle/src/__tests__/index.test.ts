import { describe, it, expect } from 'vitest'
import * as unistyle from '../index'

describe('index exports', () => {
  it('exports defaultBreakpoints', () => {
    expect(unistyle.defaultBreakpoints).toBeDefined()
    expect(typeof unistyle.defaultBreakpoints).toBe('object')
  })

  it('exports getBreakpoint', () => {
    expect(unistyle.getBreakpoint).toBeDefined()
    expect(typeof unistyle.getBreakpoint).toBe('function')
  })

  it('exports sortBreakpoints', () => {
    expect(unistyle.sortBreakpoints).toBeDefined()
    expect(typeof unistyle.sortBreakpoints).toBe('function')
  })

  it('exports createMediaQueries', () => {
    expect(unistyle.createMediaQueries).toBeDefined()
    expect(typeof unistyle.createMediaQueries).toBe('function')
  })

  it('exports createBetweenQuery', () => {
    expect(unistyle.createBetweenQuery).toBeDefined()
    expect(typeof unistyle.createBetweenQuery).toBe('function')
  })

  it('exports makeResponsive', () => {
    expect(unistyle.makeResponsive).toBeDefined()
    expect(typeof unistyle.makeResponsive).toBe('function')
  })

  it('exports normalizeResponsive', () => {
    expect(unistyle.normalizeResponsive).toBeDefined()
    expect(typeof unistyle.normalizeResponsive).toBe('function')
  })

  it('exports stripUnit', () => {
    expect(unistyle.stripUnit).toBeDefined()
    expect(typeof unistyle.stripUnit).toBe('function')
  })

  it('exports value', () => {
    expect(unistyle.value).toBeDefined()
    expect(typeof unistyle.value).toBe('function')
  })

  it('exports values', () => {
    expect(unistyle.values).toBeDefined()
    expect(typeof unistyle.values).toBe('function')
  })
})
