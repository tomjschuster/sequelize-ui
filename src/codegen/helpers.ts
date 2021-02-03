export function indent(depth: number, value: string): string {
  return value
    .split('\n')
    .map((x, i) => (i !== 0 && x ? ' '.repeat(depth) + x : x))
    .join('\n')
}

export function blank(): string {
  return ''
}

type LinesOptions = {
  separator: string
  depth: number
}

const defaultLinesOptions: LinesOptions = {
  separator: '',
  depth: 0,
}
export function lines(
  xs: string[],
  { separator = '', depth = 0 }: LinesOptions = defaultLinesOptions,
): string {
  return indent(depth, xs.join(`${separator}\n`))
}
