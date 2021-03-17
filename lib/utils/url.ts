import { ParsedQs } from 'qs'
import { toEnum } from './enum'

export function qsValueToStringEnum<T extends { [key: string]: string }>(
  value: T,
  qs: ParsedQs[keyof ParsedQs],
): T[keyof T] | undefined {
  if (typeof qs !== 'string') return undefined
  if (qs === undefined) return undefined
  return toEnum<string, T>(value, qs)
}

export function qsValueToIntEnum<T extends { [key: string]: number }>(
  value: T,
  qs: ParsedQs[keyof ParsedQs],
): T[keyof T] | undefined {
  if (typeof qs !== 'string') return undefined
  if (qs === undefined) return undefined
  const int = parseInt(qs)
  if (isNaN(int)) return undefined
  return toEnum<number, T>(value, int)
}
