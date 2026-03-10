const FNV_OFFSET = 2166136261
const FNV_PRIME = 16777619

/** FNV-1a hash → base36 string for compact class names. */
export function hash(str: string): string {
  let h = FNV_OFFSET
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = (h * FNV_PRIME) >>> 0
  }
  return h.toString(36)
}
