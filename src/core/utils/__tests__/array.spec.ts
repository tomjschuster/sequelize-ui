import { arrayToLookup } from '../array'

fdescribe('array utils', () => {
  fdescribe('arrayToLookup', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cases: [array: unknown[], fn: (x: any) => string, expected: Record<string, unknown>][] = [
      [['foo', 'bar'], (x: string) => x, { foo: 'foo', bar: 'bar' }],
      [['foo', 'bar'], (x: string) => x.toUpperCase(), { FOO: 'foo', BAR: 'bar' }],
      [[1, 2], (x: number) => x + 1 + '', { '2': 1, '3': 2 }],
    ]
    fdescribe.each(cases)('', (array, fn, expected) => {
      fit(`(${JSON.stringify}, ${fn.toString()}) === ${JSON.stringify(expected)}`, () => {
        expect(arrayToLookup(array, fn)).toEqual(expected)
      })
    })
  })
})
