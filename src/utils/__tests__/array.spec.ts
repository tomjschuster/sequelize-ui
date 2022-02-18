import { arrayToLookup, dedupBy, intersperse } from '../array'

describe('array utils', () => {
  describe('arrayToLookup', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cases: [array: unknown[], fn: (x: any) => string, expected: Map<string, unknown>][] = [
      [
        ['foo', 'bar'],
        (x: string) => x,
        new Map([
          ['foo', 'foo'],
          ['bar', 'bar'],
        ]),
      ],
      [
        ['foo', 'bar'],
        (x: string) => x.toUpperCase(),
        new Map([
          ['FOO', 'foo'],
          ['BAR', 'bar'],
        ]),
      ],
      [
        [1, 2],
        (x: number) => x + 1 + '',
        new Map([
          ['2', 1],
          ['3', 2],
        ]),
      ],
    ]
    it.each(cases)('arrayToLookup(%o, %o) === %o}', (array, fn, expected) => {
      expect(arrayToLookup(array, fn)).toEqual(expected)
    })
  })

  describe('dedupBy', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cases: [array: unknown[], fn: (x: any) => string, expected: unknown[]][] = [
      [[1, 2, 3, 2, 1], (n) => n.toString(), [1, 2, 3]],
      [[{ id: 'foo' }, { id: 'bar' }, { id: 'foo' }], (n) => n.id, [{ id: 'foo' }, { id: 'bar' }]],
    ]

    it.each(cases)('dedupBy(%o, %o) === %o', (array, fn, expected) => {
      expect(dedupBy(array, fn)).toEqual(expected)
    })
  })

  describe('intersperse', () => {
    const cases: [array: number[], value: number, expected: number[]][] = [
      [[], 0, []],
      [[1], 0, [1]],
      [[1, 2], 0, [1, 0, 2]],
      [[1, 2, 3], 0, [1, 0, 2, 0, 3]],
    ]
    it.each(cases)('intersperse([%s], %s) === [%s]}', (array, value, expected) => {
      expect(intersperse(array, value)).toEqual(expected)
    })
  })
})
