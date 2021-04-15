export function deepEmpty(x: { [key: string]: unknown } | unknown[]): boolean {
  return Object.values(x).reduce<boolean>((acc, v) => {
    if (!acc) return acc
    if (typeof v === 'string') return !v.trim()
    if (Array.isArray(v)) return v.every(deepEmpty)
    if (typeof v === 'object' && v !== null) return deepEmpty(Object.values(v))
    return v === null || v === undefined || v == false
  }, true)
}
