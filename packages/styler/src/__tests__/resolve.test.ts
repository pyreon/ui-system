import { describe, expect, it } from 'vitest'
import { css, CSSResult, resolveCSS } from '../css'

// Helper to create a TemplateStringsArray
const tsa = (strings: readonly string[]): TemplateStringsArray => {
  const arr = [...strings] as string[] & { raw: readonly string[] }
  arr.raw = strings
  return arr
}

describe('resolveCSS', () => {
  describe('primitive interpolations', () => {
    it('resolves strings', () => {
      const result = resolveCSS(new CSSResult(tsa(['color: ', ';']), ['red']))
      expect(result).toBe('color: red;')
    })

    it('resolves numbers', () => {
      const result = resolveCSS(new CSSResult(tsa(['flex: ', ';']), [1]))
      expect(result).toBe('flex: 1;')
    })

    it('resolves null as empty string', () => {
      const result = resolveCSS(new CSSResult(tsa(['a', 'b']), [null]))
      expect(result).toBe('ab')
    })

    it('resolves undefined as empty string', () => {
      const result = resolveCSS(new CSSResult(tsa(['a', 'b']), [undefined]))
      expect(result).toBe('ab')
    })

    it('resolves false as empty string', () => {
      const result = resolveCSS(new CSSResult(tsa(['a', 'b']), [false]))
      expect(result).toBe('ab')
    })

    it('resolves true as empty string', () => {
      const result = resolveCSS(new CSSResult(tsa(['a', 'b']), [true]))
      expect(result).toBe('ab')
    })
  })

  describe('function interpolations', () => {
    it('calls functions with props and uses return value', () => {
      const fn = (props: Record<string, unknown>) => props.color as string
      const result = resolveCSS(
        new CSSResult(tsa(['color: ', ';']), [fn]),
        { color: 'blue' },
      )
      expect(result).toBe('color: blue;')
    })

    it('resolves nested function results recursively', () => {
      const fn = () => () => 'red'
      const result = resolveCSS(new CSSResult(tsa(['color: ', ';']), [fn]))
      expect(result).toBe('color: red;')
    })

    it('handles functions returning null', () => {
      const fn = () => null
      const result = resolveCSS(new CSSResult(tsa(['a', 'b']), [fn]))
      expect(result).toBe('ab')
    })

    it('handles functions returning false (conditional)', () => {
      const fn = (props: Record<string, unknown>) =>
        props.active ? 'color: red;' : false
      const result = resolveCSS(
        new CSSResult(tsa(['', '']), [fn]),
        { active: false },
      )
      expect(result).toBe('')
    })

    it('uses empty object when no props provided', () => {
      const fn = (props: Record<string, unknown>) =>
        Object.keys(props).length === 0 ? 'empty' : 'has-props'
      const result = resolveCSS(new CSSResult(tsa(['', '']), [fn]))
      expect(result).toBe('empty')
    })
  })

  describe('CSSResult interpolations', () => {
    it('resolves nested CSSResult', () => {
      const inner = css`color: red;`
      const result = resolveCSS(new CSSResult(tsa(['', '']), [inner]))
      expect(result).toBe('color: red;')
    })

    it('resolves deeply nested CSSResults', () => {
      const inner1 = css`color: red;`
      const inner2 = css`${inner1} display: flex;`
      const result = resolveCSS(new CSSResult(tsa(['', '']), [inner2]))
      expect(result).toBe('color: red; display: flex;')
    })

    it('resolves CSSResult with function interpolations', () => {
      const inner = css`color: ${((p: Record<string, unknown>) => p.color) as any};`
      const result = resolveCSS(
        new CSSResult(tsa(['', '']), [inner]),
        { color: 'green' },
      )
      expect(result).toBe('color: green;')
    })
  })

  describe('combined patterns', () => {
    it('handles multiple interpolation types', () => {
      const result = resolveCSS(
        new CSSResult(
          tsa(['display: ', '; color: ', '; flex: ', ';']),
          ['flex', 'red', 1],
        ),
      )
      expect(result).toBe('display: flex; color: red; flex: 1;')
    })

    it('handles conditional CSS with logical AND (truthy)', () => {
      const condition = true
      const conditionalCss = condition && css`color: red;`
      const result = resolveCSS(new CSSResult(tsa(['', '']), [conditionalCss]))
      expect(result).toBe('color: red;')
    })

    it('handles conditional CSS with logical AND (falsy)', () => {
      const condition = false
      const conditionalCss = condition && css`color: red;`
      const result = resolveCSS(new CSSResult(tsa(['', '']), [conditionalCss]))
      expect(result).toBe('')
    })
  })
})

describe('normalizeCSS (via resolveCSS)', () => {
  const normalize = (raw: string) =>
    resolveCSS(new CSSResult(tsa([raw]), []))

  describe('comment stripping', () => {
    it('strips CSS block comments', () => {
      expect(normalize('/* comment */ color: red;')).toBe('color: red;')
    })

    it('strips multiple block comments', () => {
      expect(
        normalize('/* BASE */ color: red; /* HOVER */ font-size: 1rem;'),
      ).toBe('color: red; font-size: 1rem;')
    })

    it('strips multiline block comments', () => {
      expect(
        normalize('/* --------\n   BASE STATE\n   -------- */\nheight: 3rem;'),
      ).toBe('height: 3rem;')
    })

    it('strips JS-style line comments', () => {
      expect(normalize('// this is not valid CSS\ncolor: red;')).toBe(
        'color: red;',
      )
    })

    it('preserves :// in URLs', () => {
      expect(
        normalize('background: url(https://example.com/img.png);'),
      ).toContain('https://example.com/img.png')
    })

    it('strips line comments but preserves URL protocols', () => {
      const result = normalize(
        '// comment\nbackground: url(https://example.com/img.png);',
      )
      expect(result).toContain('https://example.com/img.png')
      expect(result).not.toContain('// comment')
    })

    it('handles unterminated block comment', () => {
      expect(normalize('color: red; /* never closed')).toBe('color: red;')
    })

    it('handles unterminated line comment', () => {
      expect(normalize('color: red;\n// trailing comment')).toBe('color: red;')
    })
  })

  describe('whitespace handling', () => {
    it('collapses whitespace', () => {
      expect(normalize('  color:  red;   font-size:  1rem;  ')).toBe(
        'color: red; font-size: 1rem;',
      )
    })

    it('converts tabs and newlines to spaces', () => {
      expect(normalize('color:\tred;\nfont-size:\t1rem;')).toBe(
        'color: red; font-size: 1rem;',
      )
    })

    it('collapses multiple spaces', () => {
      expect(normalize('color:    red;')).toBe('color: red;')
    })

    it('trims leading and trailing whitespace', () => {
      expect(normalize('   color: red;   ')).toBe('color: red;')
    })

    it('handles carriage returns', () => {
      expect(normalize('color: red;\r\nfont-size: 1rem;')).toBe(
        'color: red; font-size: 1rem;',
      )
    })
  })

  describe('edge cases', () => {
    it('returns empty string for empty input', () => {
      expect(normalize('')).toBe('')
    })

    it('returns empty string for whitespace-only input', () => {
      expect(normalize('   \n\t  ')).toBe('')
    })

    it('handles CSS with braces', () => {
      expect(normalize('.foo { color: red; }')).toBe('.foo { color: red; }')
    })

    it('handles @media rules', () => {
      const result = normalize(
        '@media (min-width: 48em) { color: blue; }',
      )
      expect(result).toContain('@media')
      expect(result).toContain('color: blue;')
    })
  })
})
