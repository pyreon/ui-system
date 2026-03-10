import { describe, expect, it, vi } from 'vitest'
import { h, Fragment } from '@pyreon/core'
import type { VNode, VNodeChild } from '@pyreon/core'
import { Overlay } from '../Overlay'
import type { OverlayContext } from '../Overlay'

const asVNode = (v: unknown) => v as VNode

function captureContext(
  triggerResult: VNode | null = h('button', null, 'Trigger'),
): { ctx: OverlayContext; result: VNode } {
  let ctx: OverlayContext | undefined
  const result = asVNode(Overlay({
    trigger: (c) => {
      ctx = c
      return triggerResult
    },
    content: (c) => h('div', { id: 'content' }, 'Visible Content'),
  }))
  if (!ctx) throw new Error('Context was not captured')
  return { ctx, result }
}

describe('Overlay', () => {
  describe('basic rendering', () => {
    it('returns a Fragment', () => {
      const { result } = captureContext()
      expect(result.type).toBe(Fragment)
    })

    it('renders the trigger VNode as first child', () => {
      const { result } = captureContext()
      const trigger = asVNode(result.children[0])
      expect(trigger.type).toBe('button')
      expect(trigger.children).toContain('Trigger')
    })

    it('has a reactive function as second child for content', () => {
      const { result } = captureContext()
      expect(typeof result.children[1]).toBe('function')
    })
  })

  describe('overlay context (isOpen, open, close, toggle)', () => {
    it('starts closed (isOpen returns false)', () => {
      const { ctx } = captureContext()
      expect(ctx.isOpen()).toBe(false)
    })

    it('open() sets isOpen to true', () => {
      const { ctx } = captureContext()
      ctx.open()
      expect(ctx.isOpen()).toBe(true)
    })

    it('close() sets isOpen to false', () => {
      const { ctx } = captureContext()
      ctx.open()
      expect(ctx.isOpen()).toBe(true)
      ctx.close()
      expect(ctx.isOpen()).toBe(false)
    })

    it('toggle() flips isOpen from false to true', () => {
      const { ctx } = captureContext()
      expect(ctx.isOpen()).toBe(false)
      ctx.toggle()
      expect(ctx.isOpen()).toBe(true)
    })

    it('toggle() flips isOpen from true to false', () => {
      const { ctx } = captureContext()
      ctx.open()
      expect(ctx.isOpen()).toBe(true)
      ctx.toggle()
      expect(ctx.isOpen()).toBe(false)
    })

    it('multiple toggles work correctly', () => {
      const { ctx } = captureContext()
      ctx.toggle() // false -> true
      ctx.toggle() // true -> false
      ctx.toggle() // false -> true
      expect(ctx.isOpen()).toBe(true)
    })

    it('open() is idempotent', () => {
      const { ctx } = captureContext()
      ctx.open()
      ctx.open()
      expect(ctx.isOpen()).toBe(true)
    })

    it('close() is idempotent', () => {
      const { ctx } = captureContext()
      ctx.close()
      ctx.close()
      expect(ctx.isOpen()).toBe(false)
    })
  })

  describe('reactive content rendering', () => {
    it('content function returns null when closed', () => {
      const { result } = captureContext()
      const contentFn = result.children[1] as () => VNodeChild
      expect(contentFn()).toBeNull()
    })

    it('content function returns content VNode when open', () => {
      const { ctx, result } = captureContext()
      ctx.open()
      const contentFn = result.children[1] as () => VNodeChild
      const contentResult = asVNode(contentFn())
      expect(contentResult.type).toBe('div')
      expect(contentResult.props.id).toBe('content')
      expect(contentResult.children).toContain('Visible Content')
    })

    it('content function reflects toggle state changes', () => {
      const { ctx, result } = captureContext()
      const contentFn = result.children[1] as () => VNodeChild

      // Initially closed
      expect(contentFn()).toBeNull()

      // Open
      ctx.toggle()
      expect(contentFn()).not.toBeNull()

      // Close
      ctx.toggle()
      expect(contentFn()).toBeNull()
    })
  })

  describe('context passed to both trigger and content', () => {
    it('provides the same context to trigger and content', () => {
      let triggerCtx: OverlayContext | undefined
      let contentCtx: OverlayContext | undefined

      const result = asVNode(Overlay({
        trigger: (ctx) => {
          triggerCtx = ctx
          return h('button', null, 'Trigger')
        },
        content: (ctx) => {
          contentCtx = ctx
          return h('div', null, 'Content')
        },
      }))

      if (!triggerCtx) throw new Error('trigger ctx missing')

      // Open so content function runs
      triggerCtx.open()
      const contentFn = result.children[1] as () => VNodeChild
      contentFn() // This invokes the content render function

      if (!contentCtx) throw new Error('content ctx missing')

      expect(triggerCtx.isOpen).toBe(contentCtx.isOpen)
      expect(triggerCtx.open).toBe(contentCtx.open)
      expect(triggerCtx.close).toBe(contentCtx.close)
      expect(triggerCtx.toggle).toBe(contentCtx.toggle)
    })

    it('content render function can use close to close overlay', () => {
      let triggerCtx: OverlayContext | undefined
      let contentCtx: OverlayContext | undefined

      const result = asVNode(Overlay({
        trigger: (ctx) => {
          triggerCtx = ctx
          return h('button', null, 'Trigger')
        },
        content: (ctx) => {
          contentCtx = ctx
          return h('div', null, h('button', { onClick: ctx.close }, 'Close'))
        },
      }))

      if (!triggerCtx) throw new Error('trigger ctx missing')
      triggerCtx.open()
      expect(triggerCtx.isOpen()).toBe(true)

      // Invoke the reactive content function to trigger content render
      const contentFn = result.children[1] as () => VNodeChild
      contentFn()

      if (!contentCtx) throw new Error('content ctx missing')
      contentCtx.close()
      expect(triggerCtx.isOpen()).toBe(false)
    })
  })

  describe('trigger and content render functions', () => {
    it('calls trigger render function once', () => {
      const triggerFn = vi.fn((_ctx: OverlayContext) => h('button', null, 'Trigger'))
      Overlay({
        trigger: triggerFn,
        content: (_ctx) => h('div', null, 'Content'),
      })
      expect(triggerFn).toHaveBeenCalledTimes(1)
    })

    it('trigger can return null', () => {
      const { result } = captureContext(null)
      expect(result.children[0]).toBeNull()
    })

    it('content can return null', () => {
      let ctx: OverlayContext | undefined
      const result = asVNode(Overlay({
        trigger: (c) => {
          ctx = c
          return h('button', null, 'Trigger')
        },
        content: (_c) => null,
      }))

      if (!ctx) throw new Error('ctx missing')
      ctx.open()
      const contentFn = result.children[1] as () => VNodeChild
      expect(contentFn()).toBeNull()
    })
  })

  describe('each Overlay instance has independent state', () => {
    it('two overlays do not share state', () => {
      const { ctx: ctx1 } = captureContext()
      const { ctx: ctx2 } = captureContext()

      ctx1.open()
      expect(ctx1.isOpen()).toBe(true)
      expect(ctx2.isOpen()).toBe(false)

      ctx2.toggle()
      expect(ctx1.isOpen()).toBe(true)
      expect(ctx2.isOpen()).toBe(true)

      ctx1.close()
      expect(ctx1.isOpen()).toBe(false)
      expect(ctx2.isOpen()).toBe(true)
    })
  })
})
