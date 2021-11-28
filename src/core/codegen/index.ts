export function indent(depth: number, value: string, prefix = ''): string {
  return value
    .split('\n')
    .map((x) => prefix + ' '.repeat(depth) + x)
    .join('\n')
}

export function blank(): string {
  return ''
}

export type LinesOptions = {
  separator?: string
  depth?: number
  prefix?: string
}

export type Line = NestedArray<string | null>

const defaultLinesOptions: LinesOptions = {
  separator: '',
  depth: 0,
}
export function lines(
  xs: Line,
  { separator = '', depth = 0, prefix = '' }: LinesOptions = defaultLinesOptions,
): string {
  return indent(
    depth,
    flatten<string | null>(xs)
      .filter((x): x is string => x !== null)
      .filter((_, i, arr) => !consecutiveBlank(arr, i))
      .join(`${separator}\n`),
    prefix,
  )
}

function consecutiveBlank(arr: Array<string | unknown>, i: number): boolean {
  const prev = arr[i - 1]
  const curr = arr[i]

  if (prev === undefined || curr === undefined) {
    return false
  }

  return isBlank(prev) && isBlank(curr)
}

type NestedArray<T> = Array<NestedArray<T> | T>
function flatten<T>(xs: NestedArray<T>): T[] {
  const output: T[] = []
  for (const x of xs) {
    if (Array.isArray(x)) {
      output.push(...flatten(x))
    } else {
      output.push(x)
    }
  }

  return output
}

function isBlank(value: unknown): boolean {
  return typeof value === 'string' ? value.trim() === '' : false
}
