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

fdescribe('string utils', () => {
  fdescribe('noCase', () => {
    const cases: [a: string, expected: string][] = [
      ['foo bar', 'foo bar'],
      ['foo_bar', 'foo bar'],
      ['fooBar', 'foo bar'],
      ['FooBar', 'foo bar'],
      ['FOO_BAR', 'foo bar'],
      ['foo-bar', 'foo bar'],
      [' !@#$%^&*()-_=+foo!@#$%^&*()-_=+bar!@#$%^&*()-_=+ ', 'foo bar'],
    ]

    fdescribe.each(cases)('', (a, expected) => {
      fit(`(${a}) === ${expected}`, () => {
        expect(noCase(a)).toEqual(expected)
      })
    })
  })

  fdescribe('sentenceCase', () => {
    const cases: [a: string, expected: string][] = [
      ['foo bar', 'Foo bar'],
      ['Foo bar', 'Foo bar'],
      ['foo_bar', 'Foo bar'],
      ['fooBar', 'Foo bar'],
      ['FooBar', 'Foo bar'],
      ['FOO_BAR', 'Foo bar'],
      ['foo-bar', 'Foo bar'],
      [' !@#$%^&*()-_=+foo!@#$%^&*()-_=+bar!@#$%^&*()-_=+ ', 'Foo bar'],
    ]

    fdescribe.each(cases)('', (a, expected) => {
      fit(`(${a}) === ${expected}`, () => {
        expect(sentenceCase(a)).toEqual(expected)
      })
    })
  })

  fdescribe('titleCase', () => {
    const cases: [a: string, expected: string][] = [
      ['foo bar', 'Foo Bar'],
      ['Foo bar', 'Foo Bar'],
      ['foo_bar', 'Foo Bar'],
      ['FOO_BAR', 'Foo Bar'],
      ['fooBar', 'Foo Bar'],
      ['FooBar', 'Foo Bar'],
      ['foo-bar', 'Foo Bar'],
      ['!@#$%^&*()-_=+foo!@#$%^&*()-_=+bar!@#$%^&*()-_=+', 'Foo Bar'],
    ]
    fdescribe.each(cases)('', (a, expected) => {
      fit(`(${a}) === ${expected}`, () => {
        expect(titleCase(a)).toEqual(expected)
      })
    })
  })

  fdescribe('snakeCase', () => {
    const cases: [a: string, expected: string][] = [
      ['foo bar', 'foo_bar'],
      ['Foo bar', 'foo_bar'],
      ['foo_bar', 'foo_bar'],
      ['fooBar', 'foo_bar'],
      ['FooBar', 'foo_bar'],
      ['FOO_BAR', 'foo_bar'],
      ['foo-bar', 'foo_bar'],
      [' !@#$%^&*()-_=+foo!@#$%^&*()-_=+bar!@#$%^&*()-_=+ ', 'foo_bar'],
    ]

    fdescribe.each(cases)('', (a, expected) => {
      fit(`(${a}) === ${expected}`, () => {
        expect(snakeCase(a)).toEqual(expected)
      })
    })
  })

  fdescribe('camelCase', () => {
    const cases: [a: string, expected: string][] = [
      ['foo bar', 'fooBar'],
      ['Foo bar', 'fooBar'],
      ['foo_bar', 'fooBar'],
      ['fooBar', 'fooBar'],
      ['FooBar', 'fooBar'],
      ['FOO_BAR', 'fooBar'],
      ['foo-bar', 'fooBar'],
      [' !@#$%^&*()-_=+foo!@#$%^&*()-_=+bar!@#$%^&*()-_=+ ', 'fooBar'],
    ]

    fdescribe.each(cases)('', (a, expected) => {
      fit(`(${a}) === ${expected}`, () => {
        expect(camelCase(a)).toEqual(expected)
      })
    })
  })

  fdescribe('pascalCase', () => {
    const cases: [a: string, expected: string][] = [
      ['foo bar', 'FooBar'],
      ['Foo bar', 'FooBar'],
      ['foo_bar', 'FooBar'],
      ['fooBar', 'FooBar'],
      ['FooBar', 'FooBar'],
      ['FOO_BAR', 'FooBar'],
      ['foo-bar', 'FooBar'],
      [' !@#$%^&*()-_=+foo!@#$%^&*()-_=+bar!@#$%^&*()-_=+ ', 'FooBar'],
    ]

    fdescribe.each(cases)('', (a, expected) => {
      fit(`(${a}) === ${expected}`, () => {
        expect(pascalCase(a)).toEqual(expected)
      })
    })
  })

  fdescribe('plural', () => {
    const cases: [a: string, expected: string][] = [
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

    fdescribe.each(cases)('', (a, expected) => {
      fit(`(${a}) === ${expected}`, () => {
        expect(plural(a)).toEqual(expected)
      })
    })
  })

  fdescribe('singular', () => {
    const cases: [a: string, expected: string][] = [
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

    fdescribe.each(cases)('', (a, expected) => {
      fit(`(${a}) === ${expected}`, () => {
        expect(singular(a)).toEqual(expected)
      })
    })
  })

  fdescribe('versionedName', () => {
    const cases: [name: string, names: string[], expected: string][] = [
      ['foo', ['bar'], 'foo'],
      ['foo', ['foo (0)', 'bar'], 'foo'],
      ['foo', ['foo (-1)', 'bar'], 'foo'],
      ['foo', ['foo (a)', 'bar'], 'foo'],
      ['foo', ['foo', 'bar'], 'foo (1)'],
      ['foo', ['foo', 'foo (1)', 'bar'], 'foo (2)'],
      ['foo', ['foo', 'foo (1)', 'foo (2)', 'bar'], 'foo (3)'],
      ['foo', ['foo (1)', 'bar'], 'foo'],
    ]
    fdescribe.each(cases)('', (name, names, expected) => {
      fit(`(${name}, ${JSON.stringify(names)}) === ${expected}`, () => {
        expect(versionedName(name, names)).toEqual(expected)
      })
    })
  })
  fdescribe('namesEq', () => {
    const cases: [a: string | undefined, b: string | undefined, expected: boolean][] = [
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
    fdescribe.each(cases)('', (a, b, expected) => {
      fit(`(${a}, ${b}) === ${expected}`, () => {
        expect(namesEq(a, b)).toEqual(expected)
        expect(namesEq(b, a)).toEqual(expected)
      })
    })
  })
  fdescribe('namesEqSingular', () => {
    const cases: [a: string | undefined, b: string | undefined, expected: boolean][] = [
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
    fdescribe.each(cases)('', (a, b, expected) => {
      fit(`(${a}, ${b}) === ${expected}`, () => {
        expect(namesEqSingular(a, b)).toEqual(expected)
        expect(namesEqSingular(b, a)).toEqual(expected)
      })
    })
  })
  fdescribe('nameEmpty', () => {
    const cases: [a: string | undefined, expected: boolean][] = [
      ['', true],
      [undefined, true],
      [' ', true],
      ['!@#$%^&*()-_=+', true],
      ['foo', false],
    ]
    fdescribe.each(cases)('', (a, expected) => {
      fit(`(${a}) === ${expected}`, () => {
        expect(nameEmpty(a)).toEqual(expected)
      })
    })
  })
  fdescribe('nameLongerThan', () => {
    const cases: [name: string | undefined, length: number, expected: boolean][] = [
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
    fdescribe.each(cases)('', (name, length, expected) => {
      fit(`(${name}, ${length}) === ${expected}`, () => {
        expect(nameLongerThan(name, length)).toEqual(expected)
      })
    })
  })
  fdescribe('nameStartsWithANumber', () => {
    const cases: [a: string | undefined, expected: boolean][] = [
      ['', false],
      [undefined, false],
      ['foo', false],
      ['1foo', true],
      ['!@#$%^&*()-_=+1foo', true],
      ['!@#$%^&*()-_=+foo', false],
    ]
    fdescribe.each(cases)('', (a, expected) => {
      fit(`(${a}) === ${expected}`, () => {
        expect(nameStartsWithNumber(a)).toEqual(expected)
      })
    })
  })
})
