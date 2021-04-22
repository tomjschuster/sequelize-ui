import { expect } from 'chai'
import forEach from 'mocha-each'
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
    const intCases = [
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
    forEach(intCases).describe('', (key, object, expected) => {
      it(`(IntEnum, ${key}) === ${expected}`, () => {
        expect(toEnum(object, key)).to.equal(expected)
      })
    })

    const stringCases = [
      ['FOO', StringEnum, StringEnum.Foo],
      ['BAR', StringEnum, StringEnum.Bar],
      ['BAZ', StringEnum, StringEnum.Baz],
      ['', StringEnum, undefined],
      ['0', IntEnum, undefined],
      ['1', IntEnum, undefined],
      ['2', IntEnum, undefined],
      ['3', IntEnum, undefined],
    ]
    forEach(stringCases).describe('', (key, object, expected) => {
      it(`(StringEnum, ${key}) === ${expected}`, () => {
        expect(toEnum(object, key)).to.equal(expected)
      })
    })
  })
  describe('keyFromEnum', () => {
    const intCases = [
      [IntEnum, IntEnum.Foo, 'Foo'],
      [IntEnum, IntEnum.Bar, 'Bar'],
      [IntEnum, IntEnum.Baz, 'Baz'],
      [IntEnum, undefined, undefined],
      [IntEnum, 4, undefined],
    ]
    forEach(intCases).describe('', (object, value, expected) => {
      it(`(IntEnum, ${value}) === ${expected}`, () => {
        expect(keyFromEnum(object, value)).to.equal(expected)
      })
    })

    describe('keyFromEnum', () => {
      const intCases = [
        [StringEnum, StringEnum.Foo, 'Foo'],
        [StringEnum, StringEnum.Bar, 'Bar'],
        [StringEnum, StringEnum.Baz, 'Baz'],
        [StringEnum, undefined, undefined],
        [StringEnum, 'QUX', undefined],
      ]
      forEach(intCases).describe('', (object, value, expected) => {
        it(`(StringEnum, ${value}) === ${expected}`, () => {
          expect(keyFromEnum(object, value)).to.equal(expected)
        })
      })
    })
  })
})
