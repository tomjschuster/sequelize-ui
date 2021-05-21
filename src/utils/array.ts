export function arrayToLookup<T>(array: T[], toKey: (value: T) => string): Record<string, T> {
  const lookup: Record<string, T> = {}

  for (const value of array) {
    lookup[toKey(value)] = value
  }

  return lookup
}

export function dedupBy<T>(array: T[], fn: (v: T) => string): T[] {
  const output: T[] = []
  const lookup: Record<string, boolean> = {}
  for (const v of array) {
    const key = fn(v)
    if (!lookup[key]) {
      lookup[key] = true
      output.push(v)
    }
  }
  return output
}
