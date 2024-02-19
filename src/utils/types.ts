export type EmptyObject = Record<string, never>
export type Override<A, B> = Omit<A, keyof B> & B
export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>
