import { ParsedQs } from 'qs'
import { ParsedUrlQuery } from 'querystring'
import { toEnum } from './enum'

export function qsValueToEnum<T>(
  enumConst: { [key: string]: T },
  qs: ParsedQs[keyof ParsedQs],
): T | undefined {
  if (typeof qs !== 'string') return undefined
  return toEnum<T>(enumConst, qs)
}

export function qsValueToIntEnum<T extends number>(
  enumConst: { [key: string]: T },
  qs: ParsedQs[keyof ParsedQs],
): T | undefined {
  if (typeof qs !== 'string') return undefined
  const int = parseInt(qs)
  if (isNaN(int)) return undefined
  return toEnum<T>(enumConst, int)
}

export function getQsString(key: string, query: ParsedUrlQuery): string | undefined {
  const value = query[key]
  return Array.isArray(value) ? value[0] : value
}

export function getQsBoolean(key: string, query: ParsedUrlQuery): boolean {
  return getQsString(key, query) === '1'
}
