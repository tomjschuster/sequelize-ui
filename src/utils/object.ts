export function deepEmpty(x: { [key: string]: unknown } | unknown[]): boolean {
  return Object.values(x).every(empty)
}

function empty(x: unknown): boolean {
  if (typeof x === 'string') return !x.trim()
  if (typeof x === 'object' && x !== null) return Object.values(x).every(empty)
  return x === null || x === undefined
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function deepDropKeys<T extends Object>(x: T, omit: string[]): T {
  const keys = new Set(omit)

  return Object.entries(x).reduce((acc, [key, value]) => {
    if (keys.has(key)) return acc
    acc[key as keyof T] = deepDropKeysValue(value, omit)
    return acc
  }, {} as T)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepDropKeysValue(x: any, omit: string[]): any {
  if (typeof x !== 'object' || x === null) return x
  if (Array.isArray(x)) return x.map((v) => deepDropKeysValue(v, omit))
  return deepDropKeys(x, omit)
}
