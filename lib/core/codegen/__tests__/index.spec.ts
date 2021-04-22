import { expect } from 'chai'
import forEach from 'mocha-each'
import { blank, indent, lines } from '..'

describe('codegen', () => {
  describe('blank', () => {
    it('returns an empty string', () => {
      expect(blank()).to.equal('')
    })
  })
  describe('lines', () => {
    const cases = [
      [[], {}, ''],
      [[[]], {}, ''],
      [['foo'], {}, 'foo'],
      [['foo', 'bar', 'baz'], {}, 'foo\nbar\nbaz'],
      [['foo', 'bar', ['baz']], {}, 'foo\nbar\nbaz'],
      [['foo', 'bar', 'baz'], {}, 'foo\nbar\nbaz'],
      [['foo', 'bar', 'baz'], { separator: ',' }, 'foo,\nbar,\nbaz'],
      [['foo', 'bar', 'baz'], { depth: 2 }, '  foo\n  bar\n  baz'],
      [['foo', 'bar', 'baz'], { prefix: '^' }, '^foo\n^bar\n^baz'],
      [['foo', 'bar', 'baz'], undefined, 'foo\nbar\nbaz'],
    ]
    forEach(cases).describe('', (value, opts, expected) => {
      it(`(${value}, ${JSON.stringify(opts)})=== ${expected}`, () => {
        expect(lines(value, opts)).to.equal(expected)
      })
    })
  })
  describe('indent', () => {
    const cases = [
      [undefined, 0, 'foo', 'foo'],
      [undefined, 0, 'foo\nbar', 'foo\nbar'],
      [undefined, 1, 'foo', ' foo'],
      [undefined, 1, 'foo\nbar', ' foo\n bar'],
      [undefined, 2, 'foo', '  foo'],
      [undefined, 2, 'foo\nbar', '  foo\n  bar'],
      [undefined, 2, 'foo\n  bar', '  foo\n    bar'],
      [',', 2, 'foo\n  bar', ',  foo\n,    bar'],
    ]
    forEach(cases).describe('', (prefix, level, value, expected) => {
      it(`(${level}, ${value}, ${prefix}) === ${expected}`, () => {
        expect(indent(level, value, prefix)).to.equal(expected)
      })
    })
  })
})
