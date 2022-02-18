export function toEnum<T>(enumConst: { [key: string]: T }, x: unknown): T | undefined {
  const key: string | undefined = Object.entries(enumConst).find(([_key, v]) => v === x)?.[0]
  return key ? enumConst[key] : undefined
}

export function keyFromEnum<T>(enumConst: { [key: string]: T }, value: T): string | undefined {
  return Object.entries(enumConst).find(([_k, v]) => v === value)?.[0]
}
