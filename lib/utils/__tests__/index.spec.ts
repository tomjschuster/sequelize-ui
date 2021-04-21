import { expect } from 'chai'
import forEach from 'mocha-each'
import { arrayToLookup, deepEmpty, keyFromEnum, qsValueToEnum, qsValueToIntEnum, toEnum } from '..'
import {
  nameEmpty,
  nameLongerThan,
  namesEq,
  namesEqSingular,
  nameStartsWithNumber,
  titleCase,
  versionedName,
} from '../string'

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
// export function keyFromEnum<T>(enumConst: { [key: string]: T }, value: T): string | undefined {
//   return Object.entries(enumConst).find(([_k, v]) => v === value)?.[0]
// }

describe('utils', () => {
  describe('enum', () => {
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
      forEach(intCases).describe(`(IntEnum, %s)`, (key, object, expected) => {
        it(`=== ${expected}`, () => {
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
      forEach(stringCases).describe(`(StringEnum, %s)`, (key, object, expected) => {
        it(`=== ${expected}`, () => {
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
      forEach(intCases).describe(`(IntEnum, %s)`, (object, value, expected) => {
        it(`=== ${expected}`, () => {
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
        forEach(intCases).describe(`(StringEnum, %s)`, (object, value, expected) => {
          it(`=== ${expected}`, () => {
            expect(keyFromEnum(object, value)).to.equal(expected)
          })
        })
      })
    })
  })

  describe('url', () => {
    describe('qsValueToEnum', () => {
      const cases = [
        ['FOO', StringEnum, StringEnum.Foo],
        ['BAR', StringEnum, StringEnum.Bar],
        ['BAZ', StringEnum, StringEnum.Baz],
        ['', StringEnum, undefined],
        [undefined, StringEnum, undefined],
        [['0'], StringEnum, undefined],
      ]
      forEach(cases).describe(`(IntEnum, %s)`, (key, object, expected) => {
        it(`=== ${expected}`, () => {
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
        forEach(intCases).describe(`(IntEnum, %s)`, (key, object, expected) => {
          it(`=== ${expected}`, () => {
            expect(qsValueToIntEnum(object, key)).to.equal(expected)
          })
        })
      })
    })
  })

  describe('string', () => {
    describe('titleCase', () => {
      const cases = [
        ['foo bar', 'Foo Bar'],
        ['foo_bar', 'Foo Bar'],
        ['fooBar', 'Foo Bar'],
        ['FooBar', 'Foo Bar'],
        ['foo-bar', 'Foo Bar'],
        ['!@#$%^&*()-_=+foo!@#$%^&*()-_=+bar!@#$%^&*()-_=+', 'Foo Bar'],
      ]
      forEach(cases).describe(`(%s)`, (a, expected) => {
        it(`=== ${expected}`, () => {
          expect(titleCase(a)).to.equal(expected)
        })
      })
    })
    describe('versionedName', () => {
      const cases = [
        ['foo', ['bar'], 'foo'],
        ['foo', ['foo (0)', 'bar'], 'foo'],
        ['foo', ['foo (-1)', 'bar'], 'foo'],
        ['foo', ['foo (a)', 'bar'], 'foo'],
        ['foo', ['foo', 'bar'], 'foo (1)'],
        ['foo', ['foo', 'foo (1)', 'bar'], 'foo (2)'],
        ['foo', ['foo', 'foo (1)', 'foo (2)', 'bar'], 'foo (3)'],
        ['foo', ['foo (1)', 'bar'], 'foo'],
      ]
      forEach(cases).describe(`(%s, [%s])`, (name, names, expected) => {
        it(`=== ${expected}`, () => {
          expect(versionedName(name, names)).to.equal(expected)
        })
      })
    })
    describe('namesEq', () => {
      const cases = [
        ['foo', 'foo', true],
        ['foo', 'Foo', true],
        ['foo', '!@#$%^&*()-_+=Foo!@#$%^&*()-_+=', true],
        [undefined, undefined, true],
        ['', '', true],
        ['foo', 'foos', false],
        ['foo', 'bar', false],
        ['foo', undefined, false],
        ['foo', '', false],
      ]
      forEach(cases).describe(`(%s, %s)`, (a, b, expected) => {
        it(`=== ${expected}`, () => {
          expect(namesEq(a, b)).to.equal(expected)
          expect(namesEq(b, a)).to.equal(expected)
        })
      })
    })
    describe('namesEqSingular', () => {
      const cases = [
        ['foo', 'foo', true],
        ['foo', 'foos', true],
        ['foo', 'foo  ', true],
        ['foo', 'foos ', true],
        ['foo', 'Foo', true],
        ['foo', 'Foos', true],
        ['foo', '!@#$%^&*()-_+=Foo!@#$%^&*()-_+=', true],
        ['foo', '!@#$%^&*()-_+=Foos!@#$%^&*()-_+=', true],
        [undefined, undefined, true],
        ['', '', true],
        ['foo', 'bar', false],
        ['foo', undefined, false],
        ['foo', '', false],
      ]
      forEach(cases).describe(`(%s, %s)`, (a, b, expected) => {
        it(`=== ${expected}`, () => {
          expect(namesEqSingular(a, b)).to.equal(expected)
          expect(namesEqSingular(b, a)).to.equal(expected)
        })
      })
    })
    describe('nameEmpty', () => {
      const cases = [
        ['', true],
        [undefined, true],
        [' ', true],
        ['!@#$%^&*()-_=+', true],
        ['foo', false],
      ]
      forEach(cases).describe(`(%s)`, (a, expected) => {
        it(`=== ${expected}`, () => {
          expect(nameEmpty(a)).to.equal(expected)
        })
      })
    })
    describe('nameLongerThan', () => {
      const cases = [
        ['', 0, false],
        ['', 1, false],
        [undefined, 0, false],
        [undefined, 1, false],
        ['foo', 0, true],
        ['foo', 2, true],
        ['foo', 3, false],
        ['foo!@#$%^&*()-_=+', 2, true],
        ['foo!@#$%^&*()-_=+', 3, false],
      ]
      forEach(cases).describe(`(%s, %s)`, (name, length, expected) => {
        it(`=== ${expected}`, () => {
          expect(nameLongerThan(name, length)).to.equal(expected)
        })
      })
    })
    describe('nameStartsWithANumber', () => {
      const cases = [
        ['', false],
        [undefined, false],
        ['foo', false],
        ['1foo', true],
        ['!@#$%^&*()-_=+1foo', true],
        ['!@#$%^&*()-_=+foo', false],
      ]
      forEach(cases).describe(`(%s)`, (a, expected) => {
        it(`=== ${expected}`, () => {
          expect(nameStartsWithNumber(a)).to.equal(expected)
        })
      })
    })
  })
  describe('array', () => {
    describe('arrayToLookup', () => {
      const cases = [
        [['foo', 'bar'], (x: string) => x, { foo: 'foo', bar: 'bar' }],
        [['foo', 'bar'], (x: string) => x.toUpperCase(), { FOO: 'foo', BAR: 'bar' }],
        [[1, 2], (x: number) => x + 1 + '', { 2: 1, 3: 2 }],
      ]
      forEach(cases).describe(`(%s, fn)`, (array, fn, expected) => {
        it(`=== ${JSON.stringify(expected)}`, () => {
          expect(arrayToLookup(array, fn)).to.eql(expected)
        })
      })
    })
    describe('object', () => {
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
  })
})
