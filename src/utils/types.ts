export type EmptyObject = Record<string, never>
export type Override<A, B> = Omit<A, keyof B> & B
