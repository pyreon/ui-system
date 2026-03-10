import { describe, expect, it } from 'vitest'
import { h } from '@pyreon/core'
import type { VNode } from '@pyreon/core'
import { Text } from '../Text'

const asVNode = (v: unknown) => v as VNode

describe('Text', () => {
  describe('default rendering', () => {
    it('renders with default span tag', () => {
      const result = asVNode(Text({ children: 'Hello' }))
      expect(result.type).toBe('span')
      expect(result.children).toContain('Hello')
    })

    it('renders with no content when no children or label', () => {
      const result = asVNode(Text({}))
      expect(result.type).toBe('span')
      expect(result.children).toContain(null)
    })
  })

  describe('content fallback chain', () => {
    it('renders children as content', () => {
      const result = asVNode(Text({ children: 'child content' }))
      expect(result.children).toContain('child content')
    })

    it('renders label when children not provided', () => {
      const result = asVNode(Text({ label: 'label text' }))
      expect(result.children).toContain('label text')
    })

    it('prefers children over label', () => {
      const result = asVNode(Text({ children: 'child', label: 'label' }))
      expect(result.children).toContain('child')
      expect(result.children).not.toContain('label')
    })

    it('renders null when neither children nor label provided', () => {
      const result = asVNode(Text({}))
      expect(result.children).toContain(null)
    })

    it('renders VNode children', () => {
      const child = h('strong', null, 'bold')
      const result = asVNode(Text({ children: child }))
      expect(result.children).toContain(child)
    })
  })

  describe('tag prop', () => {
    it('renders with custom tag', () => {
      const result = asVNode(Text({ tag: 'h1', children: 'Heading' }))
      expect(result.type).toBe('h1')
    })

    it('renders with h2 tag', () => {
      const result = asVNode(Text({ tag: 'h2', children: 'Sub heading' }))
      expect(result.type).toBe('h2')
    })

    it('renders with div tag', () => {
      const result = asVNode(Text({ tag: 'div', children: 'Block text' }))
      expect(result.type).toBe('div')
    })

    it('renders with strong tag', () => {
      const result = asVNode(Text({ tag: 'strong', children: 'Bold' }))
      expect(result.type).toBe('strong')
    })

    it('renders with em tag', () => {
      const result = asVNode(Text({ tag: 'em', children: 'Italic' }))
      expect(result.type).toBe('em')
    })
  })

  describe('paragraph prop', () => {
    it('renders as p tag when paragraph is true', () => {
      const result = asVNode(Text({ paragraph: true, children: 'Paragraph text' }))
      expect(result.type).toBe('p')
    })

    it('renders as span when paragraph is false', () => {
      const result = asVNode(Text({ paragraph: false, children: 'Inline text' }))
      expect(result.type).toBe('span')
    })

    it('tag prop takes precedence over paragraph', () => {
      const result = asVNode(Text({ tag: 'h1', paragraph: true, children: 'Heading' }))
      expect(result.type).toBe('h1')
    })

    it('renders as span when paragraph is undefined', () => {
      const result = asVNode(Text({ children: 'text' }))
      expect(result.type).toBe('span')
    })
  })

  describe('HTML attribute filtering', () => {
    it('passes through id', () => {
      const result = asVNode(Text({ id: 'text-id', children: 'text' }))
      expect(result.props.id).toBe('text-id')
    })

    it('passes through role', () => {
      const result = asVNode(Text({ role: 'heading', children: 'text' }))
      expect(result.props.role).toBe('heading')
    })

    it('passes through title', () => {
      const result = asVNode(Text({ title: 'tooltip', children: 'text' }))
      expect(result.props.title).toBe('tooltip')
    })

    it('passes through data- attributes', () => {
      const result = asVNode(Text({ 'data-testid': 'txt', children: 'text' }))
      expect(result.props['data-testid']).toBe('txt')
    })

    it('passes through aria- attributes', () => {
      const result = asVNode(Text({ 'aria-label': 'label', children: 'text' }))
      expect(result.props['aria-label']).toBe('label')
    })

    it('passes through on-prefixed event handlers', () => {
      const handler = () => {}
      const result = asVNode(Text({ onClick: handler, children: 'text' }))
      expect(result.props.onClick).toBe(handler)
    })

    it('passes through ref', () => {
      const ref = {}
      const result = asVNode(Text({ ref, children: 'text' }))
      expect(result.props.ref).toBe(ref)
    })

    it('passes through key', () => {
      const result = asVNode(Text({ key: 'k', children: 'text' }))
      expect(result.key).toBe('k')
    })

    it('filters out custom props', () => {
      const result = asVNode(Text({
        paragraph: true,
        label: 'lbl',
        children: 'text',
        customProp: 'no',
      }))
      expect(result.props.paragraph).toBeUndefined()
      expect(result.props.label).toBeUndefined()
      expect(result.props.customProp).toBeUndefined()
    })
  })

  describe('class and style props', () => {
    it('sets class when provided', () => {
      const result = asVNode(Text({ class: 'title', children: 'text' }))
      expect(result.props.class).toBe('title')
    })

    it('does not set class when not provided', () => {
      const result = asVNode(Text({ children: 'text' }))
      expect(result.props.class).toBeUndefined()
    })

    it('sets style when provided', () => {
      const result = asVNode(Text({ style: 'color: red;', children: 'text' }))
      expect(result.props.style).toBe('color: red;')
    })

    it('does not set style when not provided', () => {
      const result = asVNode(Text({ children: 'text' }))
      expect(result.props.style).toBeUndefined()
    })
  })
})
