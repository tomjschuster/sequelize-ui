import { expect } from 'chai'
import forEach from 'mocha-each'
import {
  nameEmpty,
  nameLongerThan,
  namesEq,
  namesEqSingular,
  nameStartsWithNumber,
  titleCase,
  versionedName,
} from '../string'

describe('string utils', () => {
  describe('titleCase', () => {
    const cases = [
      ['foo bar', 'Foo Bar'],
      ['foo_bar', 'Foo Bar'],
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
