import { hash } from './hash'

const MAX_CACHE = 10000

/** Shared stylesheet manager with deduplication. */
class StyleSheet {
  private cache = new Map<string, string>()
  private el: HTMLStyleElement | null = null
  private ssrRules: string[] = []
  private isSSR = typeof document === 'undefined'

  private getSheet(): CSSStyleSheet | null {
    if (this.isSSR) return null
    if (!this.el) {
      this.el = document.createElement('style')
      this.el.setAttribute('data-nova-styler', '')
      document.head.appendChild(this.el)
    }
    return this.el.sheet!
  }

  /** Insert a CSS rule and return the generated class name. */
  insert(css: string): string {
    const existing = this.cache.get(css)
    if (existing) return existing

    const className = `ns-${hash(css)}`
    this.cache.set(css, className)

    // Evict oldest entries if cache is too large
    if (this.cache.size > MAX_CACHE) {
      const toDelete = Math.floor(MAX_CACHE * 0.1)
      const iter = this.cache.keys()
      for (let i = 0; i < toDelete; i++) {
        const key = iter.next().value
        if (key) this.cache.delete(key)
      }
    }

    const rule = `.${className} { ${css} }`

    if (this.isSSR) {
      this.ssrRules.push(rule)
    } else {
      const sheet = this.getSheet()
      if (sheet) {
        try { sheet.insertRule(rule, sheet.cssRules.length) } catch {}
      }
    }

    return className
  }

  /** Insert a @keyframes rule. Returns the animation name. */
  insertKeyframes(name: string, css: string): string {
    const animName = `ns-kf-${hash(css)}`
    const rule = `@keyframes ${animName} { ${css} }`

    if (this.isSSR) {
      this.ssrRules.push(rule)
    } else {
      const sheet = this.getSheet()
      if (sheet) {
        try { sheet.insertRule(rule, sheet.cssRules.length) } catch {}
      }
    }

    return animName
  }

  /** Insert a global (unscoped) CSS rule. */
  insertGlobal(css: string): void {
    if (this.isSSR) {
      this.ssrRules.push(css)
    } else {
      const sheet = this.getSheet()
      if (sheet) {
        try { sheet.insertRule(css, sheet.cssRules.length) } catch {}
      }
    }
  }

  /** Get all SSR rules as a <style> string. */
  getSSRStyles(): string {
    return this.ssrRules.length > 0
      ? `<style data-nova-styler>${this.ssrRules.join('')}</style>`
      : ''
  }

  /** Reset all state. */
  reset(): void {
    this.cache.clear()
    this.ssrRules = []
    if (this.el) {
      this.el.remove()
      this.el = null
    }
  }
}

export const sheet = new StyleSheet()
export type { StyleSheet }
