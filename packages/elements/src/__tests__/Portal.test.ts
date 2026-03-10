import { describe, expect, it } from 'vitest'
import { h } from '@pyreon/core'
import type { VNode } from '@pyreon/core'
import { Portal } from '../Portal'

const asVNode = (v: unknown) => v as VNode

describe('Portal', () => {
  describe('stub behavior', () => {
    it('returns children when provided', () => {
      const child = h('div', { class: 'modal' }, 'Modal content')
      const result = Portal({ children: child })
      expect(result).toBe(child)
    })

    it('returns null when children not provided', () => {
      const result = Portal({})
      expect(result).toBeNull()
    })

    it('returns null when children is undefined', () => {
      const result = Portal({ children: undefined })
      expect(result).toBeNull()
    })

    it('returns string children', () => {
      const result = Portal({ children: 'text content' })
      expect(result).toBe('text content')
    })

    it('returns number children', () => {
      const result = Portal({ children: 42 })
      expect(result).toBe(42)
    })

    it('returns VNode children', () => {
      const child = h('span', null, 'inner')
      const result = Portal({ children: child })
      const vnode = asVNode(result)
      expect(vnode.type).toBe('span')
      expect(vnode.children).toContain('inner')
    })

    it('ignores target prop (stub does not use it)', () => {
      const target = {} as HTMLElement
      const child = h('div', null, 'content')
      const result = Portal({ target, children: child })
      expect(result).toBe(child)
    })

    it('ignores tag prop (stub does not use it)', () => {
      const child = h('div', null, 'content')
      const result = Portal({ tag: 'section', children: child })
      expect(result).toBe(child)
    })

    it('returns children regardless of target and tag props', () => {
      const target = {} as HTMLElement
      const child = h('div', null, 'content')
      const result = Portal({ target, tag: 'aside', children: child })
      expect(result).toBe(child)
    })
  })

  describe('null fallback scenarios', () => {
    it('returns null when all props are omitted', () => {
      const result = Portal({})
      expect(result).toBeNull()
    })

    it('returns null when only target is provided', () => {
      const result = Portal({ target: {} as HTMLElement })
      expect(result).toBeNull()
    })

    it('returns null when only tag is provided', () => {
      const result = Portal({ tag: 'div' })
      expect(result).toBeNull()
    })

    it('returns null when target and tag are provided but no children', () => {
      const result = Portal({ target: {} as HTMLElement, tag: 'div' })
      expect(result).toBeNull()
    })
  })

  describe('children types', () => {
    it('handles null children by returning null', () => {
      const result = Portal({ children: null })
      expect(result).toBeNull()
    })

    it('handles false children by returning false', () => {
      const result = Portal({ children: false })
      expect(result).toBe(false)
    })

    it('handles 0 children by returning 0', () => {
      const result = Portal({ children: 0 })
      expect(result).toBe(0)
    })

    it('handles empty string children by returning empty string', () => {
      const result = Portal({ children: '' })
      expect(result).toBe('')
    })

    it('handles nested VNode children', () => {
      const nested = h('div', null,
        h('span', null, 'level 1'),
        h('span', null, 'level 2'),
      )
      const result = Portal({ children: nested })
      const vnode = asVNode(result)
      expect(vnode.type).toBe('div')
      expect(vnode.children).toHaveLength(2)
    })
  })
})
