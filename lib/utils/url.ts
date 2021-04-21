import { ParsedQs } from 'qs'
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
