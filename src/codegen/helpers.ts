export function indent(depth: number, value: string): string {
  return value
    .split('\n')
    .map((x, i) => (i !== 0 && x ? ' '.repeat(depth) + x : x))
    .join('\n')
}

export function blank(): string {
  return ''
}
