import { expect } from 'chai'
import forEach from 'mocha-each'
import { deepEmpty } from '../object'

describe('object utils', () => {
  describe('deepEmpty', () => {
    const cases = [
      [[], true],
      [{}, true],
      [[null, undefined, '', [], {}], true],
      [{ foo: undefined }, true],
      [{ foo: null }, true],
      [{ foo: '' }, true],
      [{ foo: [] }, true],
      [{ foo: {} }, true],
      [{ foo: undefined, bar: { baz: [undefined, null, ''] } }, true],
      [{ foo: Symbol('foo') }, false],
      [{ foo: () => void 0 }, false],
      [{ foo: [0] }, false],
      [{ foo: 'foo' }, false],
      [[Symbol('foo')], false],
      [[() => void 0], false],
      [[[0]], false],
      [['foo'], false],
    ]
    forEach(cases).describe('', (object, expected) => {
      it(`(${JSON.stringify(object)})=== ${expected}`, () => {
        expect(deepEmpty(object)).to.eql(expected)
      })
    })
  })
})
