import { deepEmpty } from '../object'

fdescribe('object utils', () => {
  fdescribe('deepEmpty', () => {
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
    fdescribe.each(cases)('', (object, expected) => {
      fit(`(${JSON.stringify(object)})=== ${expected}`, () => {
        expect(deepEmpty(object)).toEqual(expected)
      })
    })
  })
})
