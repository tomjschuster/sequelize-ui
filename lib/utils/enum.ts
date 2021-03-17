export function toEnum<V, T extends { [key: string]: V }>(object: T, x: V): T[keyof T] | undefined {
  const key: keyof T | undefined = Object.entries(object).find(([_key, v]) => v === x)?.[0]
  return key && object[key]
}
