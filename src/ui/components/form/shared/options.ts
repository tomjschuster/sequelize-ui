import { keyFromEnum } from '@src/utils/enum'

export type Options<T> = { [key: string]: T } | Option<T>[]

type Option<T> = [key: string, value: T]

export function optionsToList<T>(options: Options<T>): Option<T>[] {
  return Array.isArray(options) ? options : Object.entries(options)
}

export function lookupOptionValue<T>(options: Options<T>, key: string): T | undefined {
  return Array.isArray(options) ? options.find(([k]) => k === key)?.[1] : options[key]
}

export function lookupOptionKey<T>(options: Options<T>, value: T): string | undefined {
  return Array.isArray(options)
    ? options.find(([_, v]) => v === value)?.[0]
    : keyFromEnum<T>(options, value)
}
