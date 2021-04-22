import { expect } from 'chai'
import forEach from 'mocha-each'
import {
  camelCase,
  nameEmpty,
  nameLongerThan,
  namesEq,
  namesEqSingular,
  nameStartsWithNumber,
  noCase,
  pascalCase,
  plural,
  sentenceCase,
  singular,
  snakeCase,
  titleCase,
  versionedName,
} from '../string'
// import { plural, singular } from 'pluralize'
describe('string utils', () => {
  describe('noCase', () => {
    const cases = [
      ['foo bar', 'foo bar'],
      ['foo_bar', 'foo bar'],
      ['fooBar', 'foo bar'],
      ['FooBar', 'foo bar'],
      ['FOO_BAR', 'foo bar'],
      ['foo-bar', 'foo bar'],
      [' !@#$%^&*()-_=+foo!@#$%^&*()-_=+bar!@#$%^&*()-_=+ ', 'foo bar'],
    ]

    forEach(cases).describe('', (a, expected) => {
      it(`(${a}) === ${expected}`, () => {
        expect(noCase(a)).to.equal(expected)
      })
    })
  })

  describe('sentenceCase', () => {
    const cases = [
      ['foo bar', 'Foo bar'],
      ['Foo bar', 'Foo bar'],
      ['foo_bar', 'Foo bar'],
      ['fooBar', 'Foo bar'],
      ['FooBar', 'Foo bar'],
      ['FOO_BAR', 'Foo bar'],
      ['foo-bar', 'Foo bar'],
      [' !@#$%^&*()-_=+foo!@#$%^&*()-_=+bar!@#$%^&*()-_=+ ', 'Foo bar'],
    ]

    forEach(cases).describe('', (a, expected) => {
      it(`(${a}) === ${expected}`, () => {
        expect(sentenceCase(a)).to.equal(expected)
      })
    })
  })

  describe('titleCase', () => {
    const cases = [
      ['foo bar', 'Foo Bar'],
      ['Foo bar', 'Foo Bar'],
      ['foo_bar', 'Foo Bar'],
      ['FOO_BAR', 'Foo Bar'],
      ['fooBar', 'Foo Bar'],
      ['FooBar', 'Foo Bar'],
      ['foo-bar', 'Foo Bar'],
      ['!@#$%^&*()-_=+foo!@#$%^&*()-_=+bar!@#$%^&*()-_=+', 'Foo Bar'],
    ]
    forEach(cases).describe('', (a, expected) => {
      it(`(${a}) === ${expected}`, () => {
        expect(titleCase(a)).to.equal(expected)
      })
    })
  })

  describe('snakeCase', () => {
    const cases = [
      ['foo bar', 'foo_bar'],
      ['Foo bar', 'foo_bar'],
      ['foo_bar', 'foo_bar'],
      ['fooBar', 'foo_bar'],
      ['FooBar', 'foo_bar'],
      ['FOO_BAR', 'foo_bar'],
      ['foo-bar', 'foo_bar'],
      [' !@#$%^&*()-_=+foo!@#$%^&*()-_=+bar!@#$%^&*()-_=+ ', 'foo_bar'],
    ]

    forEach(cases).describe('', (a, expected) => {
      it(`(${a}) === ${expected}`, () => {
        expect(snakeCase(a)).to.equal(expected)
      })
    })
  })

  describe('camelCase', () => {
    const cases = [
      ['foo bar', 'fooBar'],
      ['Foo bar', 'fooBar'],
      ['foo_bar', 'fooBar'],
      ['fooBar', 'fooBar'],
      ['FooBar', 'fooBar'],
      ['FOO_BAR', 'fooBar'],
      ['foo-bar', 'fooBar'],
      [' !@#$%^&*()-_=+foo!@#$%^&*()-_=+bar!@#$%^&*()-_=+ ', 'fooBar'],
    ]

    forEach(cases).describe('', (a, expected) => {
      it(`(${a}) === ${expected}`, () => {
        expect(camelCase(a)).to.equal(expected)
      })
    })
  })

  describe('pascalCase', () => {
    const cases = [
      ['foo bar', 'FooBar'],
      ['Foo bar', 'FooBar'],
      ['foo_bar', 'FooBar'],
      ['fooBar', 'FooBar'],
      ['FooBar', 'FooBar'],
      ['FOO_BAR', 'FooBar'],
      ['foo-bar', 'FooBar'],
      [' !@#$%^&*()-_=+foo!@#$%^&*()-_=+bar!@#$%^&*()-_=+ ', 'FooBar'],
    ]

    forEach(cases).describe('', (a, expected) => {
      it(`(${a}) === ${expected}`, () => {
        expect(pascalCase(a)).to.equal(expected)
      })
    })
  })

  describe('plural', () => {
    const cases = [
      ['whale', 'whales'],
      ['whales', 'whales'],
      ['shark', 'sharks'],
      ['sharks', 'sharks'],
      ['whale shark', 'whale sharks'],
      ['whale sharks', 'whale sharks'],
      ['goose', 'geese'],
      ['geese', 'geese'],
      ['gooses', 'gooses'],
      // to guarantee uniqueness between singular and plural
      ['moose', 'mooses'],
      ['asdf', 'asdfs'],
      ['asdfs', 'asdfs'],
    ]

    forEach(cases).describe('', (a, expected) => {
      it(`(${a}) === ${expected}`, () => {
        expect(plural(a)).to.equal(expected)
      })
    })
  })

  describe('singular', () => {
    const cases = [
      ['whale', 'whale'],
      ['whales', 'whale'],
      ['shark', 'shark'],
      ['sharks', 'shark'],
      ['whale shark', 'whale shark'],
      ['whale sharks', 'whale shark'],
      ['goose', 'goose'],
      ['geese', 'goose'],
      ['gooses', 'goose'],
      ['gooses', 'goose'],
      ['asdf', 'asdf'],
      ['asdfs', 'asdf'],
    ]

    forEach(cases).describe('', (a, expected) => {
      it(`(${a}) === ${expected}`, () => {
        expect(singular(a)).to.equal(expected)
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
    forEach(cases).describe('', (name, names, expected) => {
      it(`(${name}, ${JSON.stringify(names)}) === ${expected}`, () => {
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
    forEach(cases).describe('', (a, b, expected) => {
      it(`(${a}, ${b}) === ${expected}`, () => {
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
    forEach(cases).describe('', (a, b, expected) => {
      it(`(${a}, ${b}) === ${expected}`, () => {
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
    forEach(cases).describe('', (a, expected) => {
      it(`(${a}) === ${expected}`, () => {
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
    forEach(cases).describe('', (name, length, expected) => {
      it(`(${name}, ${length}) === ${expected}`, () => {
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
    forEach(cases).describe('', (a, expected) => {
      it(`(${a}) === ${expected}`, () => {
        expect(nameStartsWithNumber(a)).to.equal(expected)
      })
    })
  })
})
