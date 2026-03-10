import { describe, expect, it, vi } from 'vitest'
import { h, Fragment } from '@pyreon/core'
import type { VNode, VNodeChild } from '@pyreon/core'
import { List } from '../List'
import type { ItemMeta } from '../List'

const asVNode = (v: unknown) => v as VNode

describe('List', () => {
  describe('basic rendering without wrapper tag', () => {
    it('renders items as Fragment when no tag provided', () => {
      const result = asVNode(List({
        data: ['a', 'b', 'c'],
        children: (item) => h('span', null, item as string),
      }))
      expect(result.type).toBe(Fragment)
      expect(result.children).toHaveLength(3)
    })

    it('renders each item via the render function', () => {
      const result = asVNode(List({
        data: ['hello', 'world'],
        children: (item) => h('span', null, item as string),
      }))
      const child0 = asVNode(result.children[0])
      expect(child0.type).toBe('span')
      expect(child0.children).toContain('hello')

      const child1 = asVNode(result.children[1])
      expect(child1.type).toBe('span')
      expect(child1.children).toContain('world')
    })

    it('renders empty Fragment for empty data', () => {
      const result = asVNode(List({
        data: [],
        children: (item) => h('span', null, String(item)),
      }))
      expect(result.type).toBe(Fragment)
      expect(result.children).toHaveLength(0)
    })
  })

  describe('rendering with wrapper tag', () => {
    it('wraps items in the specified tag', () => {
      const result = asVNode(List({
        data: ['a', 'b'],
        children: (item) => h('li', null, item as string),
        tag: 'ul',
      }))
      expect(result.type).toBe('ul')
      expect(result.children).toHaveLength(2)
    })

    it('passes class to wrapper', () => {
      const result = asVNode(List({
        data: ['a'],
        children: (item) => h('li', null, item as string),
        tag: 'ol',
        class: 'list-class',
      }))
      expect(result.props.class).toBe('list-class')
    })

    it('passes style to wrapper', () => {
      const result = asVNode(List({
        data: ['a'],
        children: (item) => h('li', null, item as string),
        tag: 'ul',
        style: 'color: red;',
      }))
      expect(result.props.style).toBe('color: red;')
    })

    it('passes data- attributes to wrapper', () => {
      const result = asVNode(List({
        data: ['a'],
        children: (item) => h('li', null, item as string),
        tag: 'ul',
        'data-testid': 'my-list',
      }))
      expect(result.props['data-testid']).toBe('my-list')
    })

    it('passes aria- attributes to wrapper', () => {
      const result = asVNode(List({
        data: ['a'],
        children: (item) => h('li', null, item as string),
        tag: 'ul',
        'aria-label': 'items',
      }))
      expect(result.props['aria-label']).toBe('items')
    })

    it('passes on-prefixed event handlers to wrapper', () => {
      const handler = () => {}
      const result = asVNode(List({
        data: ['a'],
        children: (item) => h('li', null, item as string),
        tag: 'ul',
        onClick: handler,
      }))
      expect(result.props.onClick).toBe(handler)
    })

    it('passes id to wrapper', () => {
      const result = asVNode(List({
        data: ['a'],
        children: (item) => h('li', null, item as string),
        tag: 'ul',
        id: 'list-id',
      }))
      expect(result.props.id).toBe('list-id')
    })

    it('passes role to wrapper', () => {
      const result = asVNode(List({
        data: ['a'],
        children: (item) => h('li', null, item as string),
        tag: 'ul',
        role: 'navigation',
      }))
      expect(result.props.role).toBe('navigation')
    })

    it('passes ref to wrapper', () => {
      const ref = {}
      const result = asVNode(List({
        data: ['a'],
        children: (item) => h('li', null, item as string),
        tag: 'ul',
        ref,
      }))
      expect(result.props.ref).toBe(ref)
    })

    it('passes key to wrapper', () => {
      const result = asVNode(List({
        data: ['a'],
        children: (item) => h('li', null, item as string),
        tag: 'ul',
        key: 'list-key',
      }))
      expect(result.key).toBe('list-key')
    })

    it('filters out custom props from wrapper', () => {
      const result = asVNode(List({
        data: ['a'],
        children: (item) => h('li', null, item as string),
        tag: 'ul',
        customProp: 'should-not-appear',
      }))
      expect(result.props.customProp).toBeUndefined()
    })

    it('does not set class/style on wrapper when not provided', () => {
      const result = asVNode(List({
        data: ['a'],
        children: (item) => h('li', null, item as string),
        tag: 'ul',
      }))
      expect(result.props.class).toBeUndefined()
      expect(result.props.style).toBeUndefined()
    })
  })

  describe('positional metadata (ItemMeta)', () => {
    it('provides correct index', () => {
      const metas: ItemMeta[] = []
      List({
        data: ['a', 'b', 'c'],
        children: (_item, meta) => {
          metas.push(meta)
          return h('span', null, '')
        },
      })
      expect(metas).toHaveLength(3)
      expect(metas[0]?.index).toBe(0)
      expect(metas[1]?.index).toBe(1)
      expect(metas[2]?.index).toBe(2)
    })

    it('provides correct first flag', () => {
      const metas: ItemMeta[] = []
      List({
        data: ['a', 'b', 'c'],
        children: (_item, meta) => {
          metas.push(meta)
          return h('span', null, '')
        },
      })
      expect(metas).toHaveLength(3)
      expect(metas[0]?.first).toBe(true)
      expect(metas[1]?.first).toBe(false)
      expect(metas[2]?.first).toBe(false)
    })

    it('provides correct last flag', () => {
      const metas: ItemMeta[] = []
      List({
        data: ['a', 'b', 'c'],
        children: (_item, meta) => {
          metas.push(meta)
          return h('span', null, '')
        },
      })
      expect(metas).toHaveLength(3)
      expect(metas[0]?.last).toBe(false)
      expect(metas[1]?.last).toBe(false)
      expect(metas[2]?.last).toBe(true)
    })

    it('provides correct odd flag (0-indexed, so index 0 is even)', () => {
      const metas: ItemMeta[] = []
      List({
        data: ['a', 'b', 'c', 'd'],
        children: (_item, meta) => {
          metas.push(meta)
          return h('span', null, '')
        },
      })
      expect(metas).toHaveLength(4)
      expect(metas[0]?.odd).toBe(false)
      expect(metas[1]?.odd).toBe(true)
      expect(metas[2]?.odd).toBe(false)
      expect(metas[3]?.odd).toBe(true)
    })

    it('provides correct even flag (0-indexed, so index 0 is even)', () => {
      const metas: ItemMeta[] = []
      List({
        data: ['a', 'b', 'c', 'd'],
        children: (_item, meta) => {
          metas.push(meta)
          return h('span', null, '')
        },
      })
      expect(metas).toHaveLength(4)
      expect(metas[0]?.even).toBe(true)
      expect(metas[1]?.even).toBe(false)
      expect(metas[2]?.even).toBe(true)
      expect(metas[3]?.even).toBe(false)
    })

    it('handles single-item data (first and last are both true)', () => {
      const metas: ItemMeta[] = []
      List({
        data: ['only'],
        children: (_item, meta) => {
          metas.push(meta)
          return h('span', null, '')
        },
      })
      expect(metas).toHaveLength(1)
      expect(metas[0]?.first).toBe(true)
      expect(metas[0]?.last).toBe(true)
      expect(metas[0]?.index).toBe(0)
      expect(metas[0]?.even).toBe(true)
      expect(metas[0]?.odd).toBe(false)
    })

    it('passes the correct item to the render function', () => {
      const items: unknown[] = []
      List({
        data: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }],
        children: (item, _meta) => {
          items.push(item)
          return h('span', null, '')
        },
      })
      expect(items[0]).toEqual({ id: 1, name: 'Alice' })
      expect(items[1]).toEqual({ id: 2, name: 'Bob' })
    })
  })

  describe('render function output', () => {
    it('uses render function return values as children', () => {
      const result = asVNode(List({
        data: [1, 2, 3],
        children: (item, meta) =>
          h('div', { key: meta.index }, `Item ${item}`),
      }))
      const child0 = asVNode(result.children[0])
      expect(child0.type).toBe('div')
      expect(child0.children).toContain('Item 1')
      expect(child0.key).toBe(0)
    })

    it('supports returning null from render function', () => {
      const result = asVNode(List({
        data: [1, 2, 3],
        children: (item) => (item as number) % 2 === 0 ? h('span', null, String(item)) : null,
      }))
      expect(result.children[0]).toBeNull()
      expect(asVNode(result.children[1]).type).toBe('span')
      expect(result.children[2]).toBeNull()
    })
  })

  describe('object data arrays', () => {
    it('renders object data with destructured properties', () => {
      interface User { id: number; name: string }
      const result = asVNode(List<User>({
        data: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }],
        children: (user) => h('span', { key: user.id }, user.name),
      }))
      expect(result.children).toHaveLength(2)
      const child0 = asVNode(result.children[0])
      expect(child0.children).toContain('Alice')
      expect(child0.key).toBe(1)
    })
  })

  describe('various tag types', () => {
    it('renders with nav tag', () => {
      const result = asVNode(List({
        data: ['a'],
        children: (item) => h('a', null, item as string),
        tag: 'nav',
      }))
      expect(result.type).toBe('nav')
    })

    it('renders with div tag', () => {
      const result = asVNode(List({
        data: ['a'],
        children: (item) => h('span', null, item as string),
        tag: 'div',
      }))
      expect(result.type).toBe('div')
    })

    it('renders with ol tag', () => {
      const result = asVNode(List({
        data: ['a'],
        children: (item) => h('li', null, item as string),
        tag: 'ol',
      }))
      expect(result.type).toBe('ol')
    })
  })
})
