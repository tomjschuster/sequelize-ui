import { ArrayOrString, blank, indent, lines, LinesOptions } from '..'

fdescribe('codegen', () => {
  fdescribe('blank', () => {
    it('returns an empty string', () => {
      expect(blank()).toEqual('')
    })
  })
  fdescribe('lines', () => {
    const cases: [value: ArrayOrString[], options: LinesOptions | undefined, expected: string][] = [
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
    fdescribe.each(cases)('', (value, opts, expected) => {
      it(`(${value}, ${JSON.stringify(opts)})=== ${expected}`, () => {
        expect(lines(value, opts)).toEqual(expected)
      })
    })
  })
  fdescribe('indent', () => {
    const cases: [level: number, value: string, prefix: string | undefined, expected: string][] = [
      [0, 'foo', undefined, 'foo'],
      [0, 'foo\nbar', undefined, 'foo\nbar'],
      [1, 'foo', undefined, ' foo'],
      [1, 'foo\nbar', undefined, ' foo\n bar'],
      [2, 'foo', undefined, '  foo'],
      [2, 'foo\nbar', undefined, '  foo\n  bar'],
      [2, 'foo\n  bar', undefined, '  foo\n    bar'],
      [2, 'foo\n  bar', ',', ',  foo\n,    bar'],
    ]
    fdescribe.each(cases)('', (level, value, prefix, expected) => {
      it(`(${level}, ${value}, ${prefix}) === ${expected}`, () => {
        expect(indent(level, value, prefix)).toEqual(expected)
      })
    })
  })
})
