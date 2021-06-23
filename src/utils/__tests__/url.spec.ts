import { ParsedUrlQuery } from 'querystring'
import { getQsBoolean, getQsString, qsValueToEnum, qsValueToIntEnum } from '../url'

enum IntEnum {
  Foo,
  Bar,
  Baz,
}

enum StringEnum {
  Foo = 'FOO',
  Bar = 'BAR',
  Baz = 'BAZ',
}

describe('url utils', () => {
  describe('qsValueToEnum', () => {
    const cases: [
      obj: typeof StringEnum,
      key: string | string[] | undefined,
      expected: StringEnum | undefined,
    ][] = [
      [StringEnum, 'FOO', StringEnum.Foo],
      [StringEnum, 'BAR', StringEnum.Bar],
      [StringEnum, 'BAZ', StringEnum.Baz],
      [StringEnum, '', undefined],
      [StringEnum, undefined, undefined],
      [StringEnum, ['0'], undefined],
    ]
    it.each(cases)('(%o, %s) === %s', (object, key, expected) => {
      expect(qsValueToEnum(object, key)).toEqual(expected)
    })

    describe('qsValueToIntEnum', () => {
      const cases: [
        obj: typeof IntEnum,
        key: string | string[] | undefined,
        expected: IntEnum | undefined,
      ][] = [
        [IntEnum, '0', IntEnum.Foo],
        [IntEnum, '1', IntEnum.Bar],
        [IntEnum, '2', IntEnum.Baz],
        [IntEnum, '3', undefined],
        [IntEnum, '', undefined],
        [IntEnum, undefined, undefined],
        [IntEnum, ['0'], undefined],
      ]
      it.each(cases)('(%o, %s) === %s', (object, key, expected) => {
        //@ts-expect-error Index signatures are incompatible. Type 'string' is not assignable to type 'number'
        expect(qsValueToIntEnum(object, key)).toEqual(expected)
      })
    })

    describe('getQsString', () => {
      const cases: [key: string, query: ParsedUrlQuery, expected: string | undefined][] = [
        ['foo', {}, undefined],
        ['foo', { foo: undefined }, undefined],
        ['foo', { foo: 'bar' }, 'bar'],
        ['foo', { foo: ['bar'] }, 'bar'],
        ['foo', { foo: 'bar', baz: 'baz' }, 'bar'],
        ['foo', { bar: 'bar' }, undefined],
        ['foo', { bar: ['bar'] }, undefined],
        ['foo', { baz: undefined }, undefined],
      ]
      it.each(cases)('(%s, %o) === %s', (key, query, expected) => {
        expect(getQsString(key, query)).toEqual(expected)
      })
    })

    describe('getQsBoolean', () => {
      const cases: [key: string, query: ParsedUrlQuery, expected: boolean][] = [
        ['foo', {}, false],
        ['foo', { foo: undefined }, false],
        ['foo', { foo: '1' }, true],
        ['foo', { foo: ['1'] }, true],
        ['foo', { foo: '1', bar: 'bar' }, true],
        ['foo', { foo: '0' }, false],
        ['foo', { foo: ['0'] }, false],
        ['foo', { foo: 'bar' }, false],
        ['foo', { baz: undefined }, false],
      ]
      it.each(cases)('(%s, %o) === %s', (key, query, expected) => {
        expect(getQsBoolean(key, query)).toEqual(expected)
      })
    })
  })
})
