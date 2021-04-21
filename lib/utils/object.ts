export function deepEmpty(x: { [key: string]: unknown } | unknown[]): boolean {
  return Object.values(x).every(empty)
}

function empty(x: unknown): boolean {
  if (typeof x === 'string') return !x.trim()
  if (typeof x === 'object' && x !== null) return Object.values(x).every(empty)
  return x === null || x === undefined
}
