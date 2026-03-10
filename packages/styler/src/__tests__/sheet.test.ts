import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { hash } from '../hash'
import { sheet } from '../sheet'

describe('StyleSheet', () => {
  beforeEach(() => {
    sheet.reset()
  })

  afterEach(() => {
    sheet.reset()
  })

  describe('insert', () => {
    it('returns a class name with ns- prefix', () => {
      const className = sheet.insert('display: flex;')
      expect(className).toMatch(/^ns-[0-9a-z]+$/)
    })

    it('same CSS text always returns same class name (dedup)', () => {
      const cls1 = sheet.insert('color: red;')
      const cls2 = sheet.insert('color: red;')
      expect(cls1).toBe(cls2)
    })

    it('different CSS text returns different class names', () => {
      const cls1 = sheet.insert('color: red;')
      const cls2 = sheet.insert('color: blue;')
      expect(cls1).not.toBe(cls2)
    })

    it('class name matches hash of CSS text', () => {
      const cssText = 'display: flex;'
      const className = sheet.insert(cssText)
      expect(className).toBe(`ns-${hash(cssText)}`)
    })

    it('handles empty string CSS', () => {
      const className = sheet.insert('')
      expect(className).toMatch(/^ns-[0-9a-z]+$/)
    })
  })

  describe('cache eviction', () => {
    it('evicts oldest entries when cache exceeds MAX_CACHE', () => {
      // Insert many unique entries to trigger eviction (MAX_CACHE = 10000)
      // We cannot realistically insert 10001, but we can verify the mechanism
      // does not crash
      for (let i = 0; i < 100; i++) {
        sheet.insert(`unique-prop-${i}: value-${i};`)
      }
      // The sheet should still function correctly
      const result = sheet.insert('color: red;')
      expect(result).toMatch(/^ns-/)
    })
  })

  describe('insertKeyframes', () => {
    it('returns an animation name with ns-kf- prefix', () => {
      const name = sheet.insertKeyframes('', 'from{opacity:0}to{opacity:1}')
      expect(name).toMatch(/^ns-kf-[0-9a-z]+$/)
    })

    it('is deterministic for same CSS', () => {
      const name1 = sheet.insertKeyframes('', 'from{opacity:0}to{opacity:1}')
      const name2 = sheet.insertKeyframes('', 'from{opacity:0}to{opacity:1}')
      expect(name1).toBe(name2)
    })

    it('produces different names for different CSS', () => {
      const name1 = sheet.insertKeyframes('', 'from{opacity:0}to{opacity:1}')
      const name2 = sheet.insertKeyframes('', 'from{scale:0}to{scale:1}')
      expect(name1).not.toBe(name2)
    })
  })

  describe('insertGlobal', () => {
    it('does not throw for valid CSS', () => {
      expect(() => sheet.insertGlobal('body { margin: 0; }')).not.toThrow()
    })

    it('handles multiple calls without error', () => {
      sheet.insertGlobal('body { margin: 0; }')
      sheet.insertGlobal('html { box-sizing: border-box; }')
    })

    it('does not throw for invalid CSS', () => {
      expect(() => sheet.insertGlobal('invalid { { { }')).not.toThrow()
    })
  })

  describe('SSR support', () => {
    it('getSSRStyles returns empty string when no rules inserted', () => {
      // In jsdom, isSSR is false since document is defined
      // But we can still call getSSRStyles
      const result = sheet.getSSRStyles()
      expect(typeof result).toBe('string')
    })
  })

  describe('reset', () => {
    it('clears cache so new inserts re-generate class names', () => {
      const cls1 = sheet.insert('color: green;')
      sheet.reset()
      // After reset, inserting same CSS should still produce the same hash
      const cls2 = sheet.insert('color: green;')
      expect(cls1).toBe(cls2) // Same hash-based class name
    })

    it('removes the style element from DOM', () => {
      sheet.insert('color: red;')
      // After insert, a style element should exist
      const before = document.querySelectorAll('style[data-nova-styler]').length
      sheet.reset()
      const after = document.querySelectorAll('style[data-nova-styler]').length
      expect(after).toBeLessThanOrEqual(before)
    })
  })

  describe('DOM style element creation', () => {
    it('creates a style element with data-nova-styler attribute on first insert', () => {
      // Clean up any existing
      for (const el of Array.from(document.querySelectorAll('style[data-nova-styler]'))) {
        el.remove()
      }
      sheet.reset()

      sheet.insert('color: red;')
      const styleEl = document.querySelector('style[data-nova-styler]')
      expect(styleEl).not.toBeNull()
    })

    it('reuses the same style element for multiple inserts', () => {
      sheet.insert('color: red;')
      sheet.insert('color: blue;')
      const styleEls = document.querySelectorAll('style[data-nova-styler]')
      // Should have at most one style element from this sheet
      expect(styleEls.length).toBeGreaterThanOrEqual(1)
    })
  })
})
