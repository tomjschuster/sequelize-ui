export function arrayToLookup<T>(array: T[], toKey: (value: T) => string): Map<string, T> {
  const lookup: Map<string, T> = new Map()

  for (const value of array) {
    lookup.set(toKey(value), value)
  }

  return lookup
}

export function dedup<T extends string | number | boolean>(array: T[]): T[] {
  return dedupBy(array, (x) => x.toString())
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

export function intersperse<T>(array: T[], value: T): T[] {
  if (array.length <= 1) return array

  const output: T[] = new Array(array.length * 2 - 1)

  for (let i = 0; i < array.length; i++) {
    output[i * 2] = array[i]
    if (i !== array.length - 1) output[i * 2 + 1] = value
  }

  return output
}
