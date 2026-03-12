import { signal } from '@pyreon/reactivity'
import Collapse from '../Collapse'

// Mock scrollHeight
const mockScrollHeight = (value: number) => {
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get() {
      return value
    },
  })
}

const fireTransitionEnd = (el: HTMLElement) => {
  const event = new Event('transitionend', { bubbles: true })
  Object.defineProperty(event, 'target', { value: el })
  el.dispatchEvent(event)
}

/**
 * Helper: call Collapse and wire up mock elements to the refs.
 * Collapse creates a wrapper div (wrapperRef) and inner content div (contentRef).
 * We manually assign mock elements to the refs so the animation logic runs.
 */
const setupCollapse = (props: Record<string, unknown>) => {
  const wrapperEl = document.createElement('div')
  const contentEl = document.createElement('div')

  // Mock offsetHeight for reflow forcing
  Object.defineProperty(wrapperEl, 'offsetHeight', {
    configurable: true,
    get() {
      return 0
    },
  })

  const vnode = Collapse(props as any)

  // Wire up refs: the wrapper div has ref={wrapperRef}, inner div has ref={contentRef}
  // In the VNode tree: <div ref={wrapperRef}><Show><div ref={contentRef}>...</div></Show></div>
  if (vnode && vnode.props) {
    const vnodeProps = vnode.props as Record<string, unknown>
    // wrapperRef is on the outer div
    if (typeof vnodeProps.ref === 'function') {
      ;(vnodeProps.ref as (el: HTMLElement | null) => void)(wrapperEl)
    } else if (vnodeProps.ref && typeof vnodeProps.ref === 'object') {
      ;(vnodeProps.ref as { current: HTMLElement | null }).current = wrapperEl
    }
  }

  // Find contentRef in children (Show > div)
  if (vnode?.children) {
    const children = Array.isArray(vnode.children) ? vnode.children : [vnode.children]
    for (const child of children) {
      if (child && typeof child === 'object' && 'type' in (child as object)) {
        const showNode = child as any
        // Show's children contain <div ref={contentRef}>
        const showChildren = showNode.props?.children ?? showNode.children
        if (showChildren) {
          const sc = Array.isArray(showChildren) ? showChildren : [showChildren]
          for (const s of sc) {
            if (s && typeof s === 'object' && 'props' in s) {
              const ref = s.props?.ref
              if (ref && typeof ref === 'object') {
                ref.current = contentEl
              } else if (typeof ref === 'function') {
                ref(contentEl)
              }
            }
          }
        }
      }
    }
  }

  return { vnode, wrapperEl, contentEl }
}

describe('Collapse', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockScrollHeight(200)
  })

  afterEach(() => vi.useRealTimers())

  it('returns a VNode', () => {
    const show = signal(true)
    const child = { type: 'div', props: {}, children: ['Hello'], key: undefined }
    const vnode = Collapse({ show, children: child } as any)
    expect(vnode).not.toBeNull()
  })

  it('fires onEnter callback when entering', () => {
    const show = signal(false)
    const onEnter = vi.fn()

    setupCollapse({ show, onEnter, children: { type: 'div', props: {}, children: ['Hello'], key: undefined } })

    show.set(true)
    expect(onEnter).toHaveBeenCalledTimes(1)
  })

  it('fires onAfterEnter after transitionend', () => {
    const show = signal(false)
    const onAfterEnter = vi.fn()

    const { wrapperEl } = setupCollapse({
      show,
      onAfterEnter,
      children: { type: 'div', props: {}, children: ['Hello'], key: undefined },
    })

    show.set(true)
    expect(onAfterEnter).not.toHaveBeenCalled()

    fireTransitionEnd(wrapperEl)
    expect(onAfterEnter).toHaveBeenCalledTimes(1)
  })

  it('fires onLeave callback when leaving', () => {
    const show = signal(true)
    const onLeave = vi.fn()

    setupCollapse({
      show,
      onLeave,
      children: { type: 'div', props: {}, children: ['Hello'], key: undefined },
    })

    show.set(false)
    expect(onLeave).toHaveBeenCalledTimes(1)
  })

  it('fires onAfterLeave after transitionend', () => {
    const show = signal(true)
    const onAfterLeave = vi.fn()

    const { wrapperEl } = setupCollapse({
      show,
      onAfterLeave,
      children: { type: 'div', props: {}, children: ['Hello'], key: undefined },
    })

    show.set(false)
    expect(onAfterLeave).not.toHaveBeenCalled()

    fireTransitionEnd(wrapperEl)
    expect(onAfterLeave).toHaveBeenCalledTimes(1)
  })

  it('animates height from 0 to scrollHeight on enter', () => {
    const show = signal(false)

    const { wrapperEl } = setupCollapse({
      show,
      children: { type: 'div', props: {}, children: ['Hello'], key: undefined },
    })

    show.set(true)

    expect(wrapperEl.style.height).toBe('200px')
    expect(wrapperEl.style.transition).toBe('height 300ms ease')
  })

  it('switches to height:auto after enter animation completes', () => {
    const show = signal(false)

    const { wrapperEl } = setupCollapse({
      show,
      children: { type: 'div', props: {}, children: ['Hello'], key: undefined },
    })

    show.set(true)
    fireTransitionEnd(wrapperEl)

    expect(wrapperEl.style.height).toBe('auto')
    expect(wrapperEl.style.overflow).toBe('')
    expect(wrapperEl.style.transition).toBe('')
  })

  it('animates height to 0 on leave', () => {
    const show = signal(true)

    const { wrapperEl } = setupCollapse({
      show,
      children: { type: 'div', props: {}, children: ['Hello'], key: undefined },
    })

    show.set(false)

    expect(wrapperEl.style.height).toBe('0px')
    expect(wrapperEl.style.overflow).toBe('hidden')
  })

  it('uses custom transition property', () => {
    const show = signal(false)

    const { wrapperEl } = setupCollapse({
      show,
      transition: 'height 500ms ease-in-out',
      children: { type: 'div', props: {}, children: ['Hello'], key: undefined },
    })

    show.set(true)

    expect(wrapperEl.style.transition).toBe('height 500ms ease-in-out')
  })

  it('appear=true animates on initial mount', async () => {
    const show = signal(true)
    const onEnter = vi.fn()

    const { wrapperEl } = setupCollapse({
      show,
      appear: true,
      onEnter,
      children: { type: 'div', props: {}, children: ['Hello'], key: undefined },
    })

    // appear defers via queueMicrotask so all refs are wired first
    await Promise.resolve()

    expect(onEnter).toHaveBeenCalledTimes(1)
    expect(wrapperEl.style.height).toBe('200px')
  })

  it('custom timeout completes leave when transitionend does not fire', () => {
    const show = signal(true)
    const onAfterLeave = vi.fn()

    setupCollapse({
      show,
      timeout: 800,
      onAfterLeave,
      children: { type: 'div', props: {}, children: ['Hello'], key: undefined },
    })

    show.set(false)
    expect(onAfterLeave).not.toHaveBeenCalled()

    vi.advanceTimersByTime(800)

    expect(onAfterLeave).toHaveBeenCalledTimes(1)
  })

  it('interrupts leave and starts entering when toggled back to show', () => {
    const show = signal(true)
    const onEnter = vi.fn()
    const onLeave = vi.fn()

    const { wrapperEl } = setupCollapse({
      show,
      onEnter,
      onLeave,
      children: { type: 'div', props: {}, children: ['Hello'], key: undefined },
    })

    // Start leaving
    show.set(false)
    expect(onLeave).toHaveBeenCalledTimes(1)

    // Toggle back
    show.set(true)
    expect(onEnter).toHaveBeenCalledTimes(1)
    expect(wrapperEl.style.height).toBe('200px')
  })
})
