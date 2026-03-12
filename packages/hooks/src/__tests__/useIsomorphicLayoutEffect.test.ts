import { describe, it, expect } from 'vitest'
import { onMount } from '@pyreon/core'
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect'

describe('useIsomorphicLayoutEffect', () => {
  it('is onMount in a browser environment', () => {
    expect(useIsomorphicLayoutEffect).toBe(onMount)
  })
})
