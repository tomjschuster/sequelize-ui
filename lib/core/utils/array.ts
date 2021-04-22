export function arrayToLookup<T>(array: T[], toKey: (value: T) => string): Record<string, T> {
  const lookup: Record<string, T> = {}

  for (const value of array) {
    lookup[toKey(value)] = value
  }

  return lookup
}
