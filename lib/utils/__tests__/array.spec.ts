import { expect } from 'chai'
import forEach from 'mocha-each'
import { arrayToLookup } from '../array'

describe('array utils', () => {
  describe('arrayToLookup', () => {
    const cases = [
      [['foo', 'bar'], (x: string) => x, { foo: 'foo', bar: 'bar' }],
      [['foo', 'bar'], (x: string) => x.toUpperCase(), { FOO: 'foo', BAR: 'bar' }],
      [[1, 2], (x: number) => x + 1 + '', { 2: 1, 3: 2 }],
    ]
    forEach(cases).describe('', (array, fn, expected) => {
      it(`(${JSON.stringify}, ${fn.toString()}) === ${JSON.stringify(expected)}`, () => {
        expect(arrayToLookup(array, fn)).to.eql(expected)
      })
    })
  })
})
