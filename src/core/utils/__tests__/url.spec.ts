import { qsValueToEnum, qsValueToIntEnum } from '../url'

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

fdescribe('url utils', () => {
  fdescribe('qsValueToEnum', () => {
    const cases: [
      key: string | string[] | undefined,
      obj: typeof StringEnum,
      expected: StringEnum | undefined,
    ][] = [
      ['FOO', StringEnum, StringEnum.Foo],
      ['BAR', StringEnum, StringEnum.Bar],
      ['BAZ', StringEnum, StringEnum.Baz],
      ['', StringEnum, undefined],
      [undefined, StringEnum, undefined],
      [['0'], StringEnum, undefined],
    ]
    fdescribe.each(cases)('', (key, object, expected) => {
      it(`(StringEnum, ${key}) === ${expected}`, () => {
        expect(qsValueToEnum(object, key)).toEqual(expected)
      })
    })

    fdescribe('qsValueToIntEnum', () => {
      const cases: [
        key: string | string[] | undefined,
        obj: typeof IntEnum,
        expected: IntEnum | undefined,
      ][] = [
        ['0', IntEnum, IntEnum.Foo],
        ['1', IntEnum, IntEnum.Bar],
        ['2', IntEnum, IntEnum.Baz],
        ['3', IntEnum, undefined],
        ['', IntEnum, undefined],
        [undefined, IntEnum, undefined],
        [['0'], IntEnum, undefined],
      ]
      fdescribe.each(cases)('', (key, object, expected) => {
        it(`(IntEnum, ${key}) === ${expected}`, () => {
          //@ts-expect-error Index signatures are incompatible. Type 'string' is not assignable to type 'number'
          expect(qsValueToIntEnum(object, key)).toEqual(expected)
        })
      })
    })
  })
})
