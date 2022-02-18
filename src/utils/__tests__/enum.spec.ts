import { keyFromEnum, toEnum } from '../enum'

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

describe('enum utils', () => {
  describe('toEnum', () => {
    const intCases: [key: unknown, obj: typeof IntEnum, expected: IntEnum | undefined][] = [
      [0, IntEnum, IntEnum.Foo],
      [1, IntEnum, IntEnum.Bar],
      [2, IntEnum, IntEnum.Baz],
      [3, IntEnum, undefined],
      ['', IntEnum, undefined],
      ['0', IntEnum, undefined],
      ['1', IntEnum, undefined],
      ['2', IntEnum, undefined],
      ['3', IntEnum, undefined],
    ]
    describe.each(intCases)('', (key, object, expected) => {
      it(`(IntEnum, ${key}) === ${expected}`, () => {
        expect(toEnum(object, key)).toEqual(expected)
      })
    })

    const stringCases: [key: unknown, obj: typeof StringEnum, expected: StringEnum | undefined][] =
      [
        ['FOO', StringEnum, StringEnum.Foo],
        ['BAR', StringEnum, StringEnum.Bar],
        ['BAZ', StringEnum, StringEnum.Baz],
        ['', StringEnum, undefined],
        [0, StringEnum, undefined],
        [1, StringEnum, undefined],
        [2, StringEnum, undefined],
        [3, StringEnum, undefined],
      ]
    describe.each(stringCases)('', (key, object, expected) => {
      it(`(StringEnum, ${key}) === ${expected}`, () => {
        expect(toEnum(object, key)).toEqual(expected)
      })
    })
  })
  describe('keyFromEnum', () => {
    const intCases: [
      obj: typeof IntEnum,
      value: number | undefined,
      expected: string | undefined,
    ][] = [
      [IntEnum, IntEnum.Foo, 'Foo'],
      [IntEnum, IntEnum.Bar, 'Bar'],
      [IntEnum, IntEnum.Baz, 'Baz'],
      [IntEnum, undefined, undefined],
      [IntEnum, 4, undefined],
    ]
    describe.each(intCases)('', (object, value, expected) => {
      it(`(IntEnum, ${value}) === ${expected}`, () => {
        expect(keyFromEnum(object, value)).toEqual(expected)
      })
    })

    describe('keyFromEnum', () => {
      const stringCases: [
        obj: typeof StringEnum,
        value: string | undefined,
        expected: string | undefined,
      ][] = [
        [StringEnum, StringEnum.Foo, 'Foo'],
        [StringEnum, StringEnum.Bar, 'Bar'],
        [StringEnum, StringEnum.Baz, 'Baz'],
        [StringEnum, undefined, undefined],
        [StringEnum, 'QUX', undefined],
      ]
      describe.each(stringCases)('', (object, value, expected) => {
        it(`(StringEnum, ${value}) === ${expected}`, () => {
          expect(keyFromEnum(object, value)).toEqual(expected)
        })
      })
    })
  })
})
