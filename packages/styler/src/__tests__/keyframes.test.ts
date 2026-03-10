import { afterEach, describe, expect, it } from 'vitest'
import { keyframes } from '../keyframes'
import { sheet } from '../sheet'

describe('keyframes', () => {
  afterEach(() => {
    sheet.reset()
  })

  it('returns a string (animation name)', () => {
    const fadeIn = keyframes`
      from { opacity: 0; }
      to { opacity: 1; }
    `
    expect(typeof fadeIn).toBe('string')
  })

  it('returns a name with ns-kf- prefix', () => {
    const fadeIn = keyframes`
      from { opacity: 0; }
      to { opacity: 1; }
    `
    expect(fadeIn).toMatch(/^ns-kf-/)
  })

  it('is deterministic — same input produces same name', () => {
    const a = keyframes`from { opacity: 0; } to { opacity: 1; }`
    const b = keyframes`from { opacity: 0; } to { opacity: 1; }`
    expect(a).toBe(b)
  })

  it('different input produces different names', () => {
    const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`
    const slideIn = keyframes`from { transform: translateX(-100%); } to { transform: translateX(0); }`
    expect(fadeIn).not.toBe(slideIn)
  })

  it('supports interpolation values', () => {
    const from = 0
    const to = 1
    const anim = keyframes`
      from { opacity: ${from}; }
      to { opacity: ${to}; }
    `
    expect(anim).toMatch(/^ns-kf-/)
  })

  it('can be used in template literals for animation property', () => {
    const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`
    const animationValue = `${fadeIn} 0.3s ease-in`
    expect(animationValue).toContain(fadeIn)
    expect(animationValue).toContain('0.3s ease-in')
  })

  it('handles complex keyframe definitions', () => {
    const pulse = keyframes`
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    `
    expect(pulse).toMatch(/^ns-kf-/)
  })
})
