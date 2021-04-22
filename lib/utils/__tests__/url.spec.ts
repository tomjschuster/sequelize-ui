import { expect } from 'chai'
import forEach from 'mocha-each'
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

describe('url utils', () => {
  describe('qsValueToEnum', () => {
    const cases = [
      ['FOO', StringEnum, StringEnum.Foo],
      ['BAR', StringEnum, StringEnum.Bar],
      ['BAZ', StringEnum, StringEnum.Baz],
      ['', StringEnum, undefined],
      [undefined, StringEnum, undefined],
      [['0'], StringEnum, undefined],
    ]
    forEach(cases).describe('', (key, object, expected) => {
      it(`(StringEnum, ${key}) === ${expected}`, () => {
        expect(qsValueToEnum(object, key)).to.equal(expected)
      })
    })

    describe('qsValueToIntEnum', () => {
      const intCases = [
        ['0', IntEnum, IntEnum.Foo],
        ['1', IntEnum, IntEnum.Bar],
        ['2', IntEnum, IntEnum.Baz],
        ['3', IntEnum, undefined],
        ['', IntEnum, undefined],
        [undefined, IntEnum, undefined],
        [['0'], IntEnum, undefined],
      ]
      forEach(intCases).describe('', (key, object, expected) => {
        it(`(IntEnum, ${key}) === ${expected}`, () => {
          expect(qsValueToIntEnum(object, key)).to.equal(expected)
        })
      })
    })
  })
})
