import { describe, expect, it } from 'vitest'
import { h, Fragment } from '@pyreon/core'
import type { VNode } from '@pyreon/core'
import { Element } from '../Element'

// Helper to cast VNodeChild to VNode for inspection
const asVNode = (v: unknown) => v as VNode

describe('Element', () => {
  describe('basic rendering', () => {
    it('renders with default tag div', () => {
      const result = asVNode(Element({ children: 'hello' }))
      expect(result.type).toBe('div')
      expect(result.children).toContain('hello')
    })

    it('renders with custom tag', () => {
      const result = asVNode(Element({ tag: 'section', children: 'content' }))
      expect(result.type).toBe('section')
    })

    it('renders button tag', () => {
      const result = asVNode(Element({ tag: 'button', children: 'click' }))
      expect(result.type).toBe('button')
    })

    it('renders with no children', () => {
      const result = asVNode(Element({}))
      expect(result.type).toBe('div')
    })

    it('renders children as content', () => {
      const child = h('span', null, 'inner')
      const result = asVNode(Element({ children: child }))
      expect(result.children).toContain(child)
    })
  })

  describe('style computation', () => {
    it('defaults to inline-flex display', () => {
      const result = asVNode(Element({ children: 'test' }))
      const style = result.props.style as string
      expect(style).toContain('display: inline-flex')
    })

    it('uses flex display when block is true', () => {
      const result = asVNode(Element({ block: true, children: 'test' }))
      const style = result.props.style as string
      expect(style).toContain('display: flex')
      expect(style).not.toContain('inline-flex')
    })

    it('defaults to row flex-direction for inline direction', () => {
      const result = asVNode(Element({ children: 'test' }))
      const style = result.props.style as string
      expect(style).toContain('flex-direction: row')
    })

    it('uses column flex-direction for rows direction', () => {
      const result = asVNode(Element({ direction: 'rows', children: 'test' }))
      const style = result.props.style as string
      expect(style).toContain('flex-direction: column')
    })

    it('defaults to center align-items for inline direction', () => {
      const result = asVNode(Element({ children: 'test' }))
      const style = result.props.style as string
      expect(style).toContain('align-items: center')
    })

    it('defaults to stretch align-items for rows direction', () => {
      const result = asVNode(Element({ direction: 'rows', children: 'test' }))
      const style = result.props.style as string
      expect(style).toContain('align-items: stretch')
    })

    it('sets gap when provided', () => {
      const result = asVNode(Element({ gap: 16, children: 'test' }))
      const style = result.props.style as string
      expect(style).toContain('gap: 16px')
    })

    it('does not set gap when not provided', () => {
      const result = asVNode(Element({ children: 'test' }))
      const style = result.props.style as string
      expect(style).not.toContain('gap:')
    })
  })

  describe('alignment', () => {
    it('sets alignX as justify-content for inline direction', () => {
      const result = asVNode(Element({ alignX: 'center', children: 'test' }))
      const style = result.props.style as string
      expect(style).toContain('justify-content: center')
    })

    it('sets alignX=left as flex-start for inline direction', () => {
      const result = asVNode(Element({ alignX: 'left', children: 'test' }))
      const style = result.props.style as string
      expect(style).toContain('justify-content: flex-start')
    })

    it('sets alignX=right as flex-end for inline direction', () => {
      const result = asVNode(Element({ alignX: 'right', children: 'test' }))
      const style = result.props.style as string
      expect(style).toContain('justify-content: flex-end')
    })

    it('sets alignY as align-items for inline direction', () => {
      const result = asVNode(Element({ alignY: 'top', children: 'test' }))
      const style = result.props.style as string
      expect(style).toContain('align-items: flex-start')
    })

    it('sets alignY=bottom for inline direction', () => {
      const result = asVNode(Element({ alignY: 'bottom', children: 'test' }))
      const style = result.props.style as string
      expect(style).toContain('align-items: flex-end')
    })

    it('sets alignY=center for inline direction', () => {
      const result = asVNode(Element({ alignY: 'center', children: 'test' }))
      const style = result.props.style as string
      expect(style).toContain('align-items: center')
    })

    it('sets alignX as align-items for rows direction', () => {
      const result = asVNode(Element({ direction: 'rows', alignX: 'center', children: 'test' }))
      const style = result.props.style as string
      expect(style).toContain('align-items: center')
    })

    it('sets alignX=left as flex-start align-items for rows direction', () => {
      const result = asVNode(Element({ direction: 'rows', alignX: 'left', children: 'test' }))
      const style = result.props.style as string
      expect(style).toContain('align-items: flex-start')
    })

    it('sets alignX=right as flex-end align-items for rows direction', () => {
      const result = asVNode(Element({ direction: 'rows', alignX: 'right', children: 'test' }))
      const style = result.props.style as string
      expect(style).toContain('align-items: flex-end')
    })

    it('sets alignY as justify-content for rows direction', () => {
      const result = asVNode(Element({ direction: 'rows', alignY: 'top', children: 'test' }))
      const style = result.props.style as string
      expect(style).toContain('justify-content: flex-start')
    })

    it('sets alignY=bottom as flex-end justify-content for rows direction', () => {
      const result = asVNode(Element({ direction: 'rows', alignY: 'bottom', children: 'test' }))
      const style = result.props.style as string
      expect(style).toContain('justify-content: flex-end')
    })

    it('sets alignY=center as center justify-content for rows direction', () => {
      const result = asVNode(Element({ direction: 'rows', alignY: 'center', children: 'test' }))
      const style = result.props.style as string
      expect(style).toContain('justify-content: center')
    })

    it('does not set justify-content for alignX on rows direction', () => {
      const result = asVNode(Element({ direction: 'rows', alignX: 'center', children: 'test' }))
      const style = result.props.style as string
      // alignX on rows sets align-items, not justify-content
      expect(style).not.toContain('justify-content')
    })

    it('does not set justify-content for alignY on inline direction', () => {
      const result = asVNode(Element({ alignY: 'center', children: 'test' }))
      const style = result.props.style as string
      // alignY on inline sets align-items, not justify-content
      expect(style).not.toContain('justify-content')
    })
  })

  describe('style merging', () => {
    it('merges string style with computed wrapper style', () => {
      const result = asVNode(Element({ style: 'color: red;', children: 'test' }))
      const style = result.props.style as string
      expect(style).toContain('display: inline-flex')
      expect(style).toContain('color: red;')
    })

    it('merges object style with computed wrapper style', () => {
      const result = asVNode(Element({
        style: { color: 'blue', 'font-size': '14px' },
        children: 'test',
      }))
      const style = result.props.style as string
      expect(style).toContain('display: inline-flex')
      expect(style).toContain('color: blue')
      expect(style).toContain('font-size: 14px')
    })
  })

  describe('HTML attribute filtering', () => {
    it('passes through id', () => {
      const result = asVNode(Element({ id: 'my-el', children: 'test' }))
      expect(result.props.id).toBe('my-el')
    })

    it('passes through role', () => {
      const result = asVNode(Element({ role: 'button', children: 'test' }))
      expect(result.props.role).toBe('button')
    })

    it('passes through data- attributes', () => {
      const result = asVNode(Element({ 'data-testid': 'el', children: 'test' }))
      expect(result.props['data-testid']).toBe('el')
    })

    it('passes through aria- attributes', () => {
      const result = asVNode(Element({ 'aria-label': 'label', children: 'test' }))
      expect(result.props['aria-label']).toBe('label')
    })

    it('passes through on-prefixed event handlers', () => {
      const handler = () => {}
      const result = asVNode(Element({ onClick: handler, children: 'test' }))
      expect(result.props.onClick).toBe(handler)
    })

    it('passes through tabindex', () => {
      const result = asVNode(Element({ tabindex: 0, children: 'test' }))
      expect(result.props.tabindex).toBe(0)
    })

    it('passes through title', () => {
      const result = asVNode(Element({ title: 'tooltip', children: 'test' }))
      expect(result.props.title).toBe('tooltip')
    })

    it('passes through href', () => {
      const result = asVNode(Element({ tag: 'a', href: '/link', children: 'test' }))
      expect(result.props.href).toBe('/link')
    })

    it('passes through disabled', () => {
      const result = asVNode(Element({ tag: 'button', disabled: true, children: 'test' }))
      expect(result.props.disabled).toBe(true)
    })

    it('passes through ref', () => {
      const ref = {}
      const result = asVNode(Element({ ref, children: 'test' }))
      expect(result.props.ref).toBe(ref)
    })

    it('passes through key', () => {
      const result = asVNode(Element({ key: 'my-key', children: 'test' }))
      expect(result.key).toBe('my-key')
    })

    it('filters out custom props (non-HTML attributes)', () => {
      const result = asVNode(Element({
        beforeContent: h('span', null, 'x'),
        afterContent: h('span', null, 'y'),
        children: 'test',
        direction: 'inline',
        alignX: 'center',
        alignY: 'center',
        gap: 8,
        block: true,
        equalCols: true,
        customProp: 'should-not-appear',
      }))
      expect(result.props.direction).toBeUndefined()
      expect(result.props.alignX).toBeUndefined()
      expect(result.props.alignY).toBeUndefined()
      expect(result.props.gap).toBeUndefined()
      expect(result.props.block).toBeUndefined()
      expect(result.props.equalCols).toBeUndefined()
      expect(result.props.customProp).toBeUndefined()
    })

    it('sets class prop when provided', () => {
      const result = asVNode(Element({ class: 'my-class', children: 'test' }))
      expect(result.props.class).toBe('my-class')
    })

    it('does not set class prop when not provided', () => {
      const result = asVNode(Element({ children: 'test' }))
      expect(result.props.class).toBeUndefined()
    })
  })

  describe('single content (no beforeContent/afterContent)', () => {
    it('renders children directly without span wrappers', () => {
      const result = asVNode(Element({ children: 'hello' }))
      expect(result.type).toBe('div')
      expect(result.children).toContain('hello')
      // Should not have span wrapper children
      const spanChildren = result.children.filter(
        (c) => c && typeof c === 'object' && 'type' in (c as VNode) && (c as VNode).type === 'span'
      )
      expect(spanChildren).toHaveLength(0)
    })

    it('renders VNode children directly', () => {
      const child = h('strong', null, 'bold')
      const result = asVNode(Element({ children: child }))
      expect(result.children).toContain(child)
    })
  })

  describe('three-section layout (beforeContent and/or afterContent)', () => {
    it('wraps beforeContent, children, and afterContent in spans', () => {
      const before = h('span', null, 'Before')
      const after = h('span', null, 'After')
      const result = asVNode(Element({
        beforeContent: before,
        children: 'Main',
        afterContent: after,
      }))
      expect(result.type).toBe('div')
      // Should have 3 span children
      expect(result.children).toHaveLength(3)

      const beforeSlot = asVNode(result.children[0])
      expect(beforeSlot.type).toBe('span')
      expect(beforeSlot.children).toContain(before)

      const contentSlot = asVNode(result.children[1])
      expect(contentSlot.type).toBe('span')
      expect(contentSlot.children).toContain('Main')

      const afterSlot = asVNode(result.children[2])
      expect(afterSlot.type).toBe('span')
      expect(afterSlot.children).toContain(after)
    })

    it('renders only beforeContent + content without afterContent', () => {
      const before = h('span', null, 'Before')
      const result = asVNode(Element({
        beforeContent: before,
        children: 'Main',
      }))
      expect(result.children).toHaveLength(2)

      const beforeSlot = asVNode(result.children[0])
      expect(beforeSlot.type).toBe('span')
      expect(beforeSlot.children).toContain(before)

      const contentSlot = asVNode(result.children[1])
      expect(contentSlot.type).toBe('span')
      expect(contentSlot.children).toContain('Main')
    })

    it('renders only afterContent + content without beforeContent', () => {
      const after = h('span', null, 'After')
      const result = asVNode(Element({
        children: 'Main',
        afterContent: after,
      }))
      expect(result.children).toHaveLength(2)

      const contentSlot = asVNode(result.children[0])
      expect(contentSlot.type).toBe('span')
      expect(contentSlot.children).toContain('Main')

      const afterSlot = asVNode(result.children[1])
      expect(afterSlot.type).toBe('span')
      expect(afterSlot.children).toContain(after)
    })

    it('applies flex-shrink: 0 style to before/after slots by default', () => {
      const before = h('span', null, 'Before')
      const after = h('span', null, 'After')
      const result = asVNode(Element({
        beforeContent: before,
        children: 'Main',
        afterContent: after,
      }))

      const beforeSlot = asVNode(result.children[0])
      expect(beforeSlot.props.style).toBe('flex-shrink: 0;')

      const contentSlot = asVNode(result.children[1])
      expect(contentSlot.props.style).toBe('flex: 1; min-width: 0;')

      const afterSlot = asVNode(result.children[2])
      expect(afterSlot.props.style).toBe('flex-shrink: 0;')
    })

    it('applies flex: 1 style to before/after slots when equalCols is true', () => {
      const before = h('span', null, 'Before')
      const after = h('span', null, 'After')
      const result = asVNode(Element({
        beforeContent: before,
        children: 'Main',
        afterContent: after,
        equalCols: true,
      }))

      const beforeSlot = asVNode(result.children[0])
      expect(beforeSlot.props.style).toBe('flex: 1; min-width: 0;')

      const contentSlot = asVNode(result.children[1])
      expect(contentSlot.props.style).toBe('flex: 1; min-width: 0;')

      const afterSlot = asVNode(result.children[2])
      expect(afterSlot.props.style).toBe('flex: 1; min-width: 0;')
    })
  })

  describe('combined props', () => {
    it('renders with tag, direction, alignment, gap, block, and class together', () => {
      const result = asVNode(Element({
        tag: 'nav',
        direction: 'rows',
        alignX: 'center',
        alignY: 'bottom',
        gap: 12,
        block: true,
        class: 'nav-class',
        'data-testid': 'nav',
        beforeContent: h('span', null, 'logo'),
        children: 'content',
        afterContent: h('span', null, 'actions'),
      }))

      expect(result.type).toBe('nav')
      expect(result.props.class).toBe('nav-class')
      expect(result.props['data-testid']).toBe('nav')

      const style = result.props.style as string
      expect(style).toContain('display: flex')
      expect(style).toContain('flex-direction: column')
      expect(style).toContain('align-items: center')
      expect(style).toContain('justify-content: flex-end')
      expect(style).toContain('gap: 12px')

      expect(result.children).toHaveLength(3)
    })
  })
})
