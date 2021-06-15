import { deepEmpty } from '../object'

describe('object utils', () => {
  describe('deepEmpty', () => {
    const cases: [obj: { [key: string]: unknown } | unknown[], expected: boolean][] = [
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
    describe.each(cases)('', (object, expected) => {
      it(`(${JSON.stringify(object)})=== ${expected}`, () => {
        expect(deepEmpty(object)).toEqual(expected)
      })
    })
  })
})
