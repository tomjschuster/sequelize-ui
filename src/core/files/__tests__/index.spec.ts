import {
  directory,
  file,
  FileItem,
  fileLanguage,
  FileSystemItem,
  findDirectory,
  findFile,
  findItem,
  isDirectory,
  isFile,
  itemName,
  Language,
  listPaths,
} from '..'
import fileTree from '../__fixtures__/fileTree'

fdescribe('files', () => {
  fdescribe('itemName', () => {
    const cases: [item: FileSystemItem, expected: string][] = [
      [file('foo', 'contents'), 'foo'],
      [directory('bar', []), 'bar'],
    ]
    fdescribe.each(cases)('', (item, expected) => {
      fit(`(${JSON.stringify(item)}) === ${expected}`, () => {
        expect(itemName(item)).toEqual(expected)
      })
    })
  })
  fdescribe('isDirectory', () => {
    const cases: [item: FileSystemItem, expected: boolean][] = [
      [file('foo', 'contents'), false],
      [directory('bar', []), true],
    ]
    fdescribe.each(cases)('', (item, expected) => {
      fit(`(${JSON.stringify(item)}) === ${expected}`, () => {
        expect(isDirectory(item)).toEqual(expected)
      })
    })
  })
  fdescribe('isFile', () => {
    const cases: [item: FileSystemItem, expected: boolean][] = [
      [file('foo', 'contents'), true],
      [directory('bar', []), false],
    ]
    fdescribe.each(cases)('', (item, expected) => {
      fit(`(${JSON.stringify(item)}) === ${expected}`, () => {
        expect(isFile(item)).toEqual(expected)
      })
    })
  })
  fdescribe('fileLanguage', () => {
    const cases: [item: FileItem, expected: Language | undefined][] = [
      [file('foo.ts', 'contents'), Language.TypeScript],
      [file('foo.js', 'contents'), Language.JavaScript],
      [file('foo.json', 'contents'), Language.Json],
      [file('.gitignore', 'contents'), Language.Git],
      [file('foo.txt', 'contents'), undefined],
      [file('foo.', 'contents'), undefined],
      [file('foo', 'contents'), undefined],
    ]
    fdescribe.each(cases)('', (f, expected) => {
      fit(`(${JSON.stringify(f)}) === ${expected}`, () => {
        expect(fileLanguage(f)).toEqual(expected)
      })
    })
  })
  fdescribe('findItem', () => {
    const cases: [path: string, expected: string | undefined][] = [
      ['documents', 'documents'],
      ['documents/essay.docx', 'essay.docx'],
      ['documents/media', 'media'],
      ['documents/media/videos', 'videos'],
      ['documents/media/images/profile.jpg', 'profile.jpg'],
      ['documents/media/music/artists/silvio-rodriguez/ojala.mp3', 'ojala.mp3'],
      ['foo', undefined],
      ['documents/foo', undefined],
    ]
    fdescribe.each(cases)('', (path, expected) => {
      fit(`(dir, ${path}) === ${expected}`, () => {
        expect(findItem(fileTree, path)?.name).toEqual(expected)
      })
    })
  })
  fdescribe('findFile', () => {
    const cases: [path: string, expected: string | undefined][] = [
      ['documents', undefined],
      ['documents/essay.docx', 'essay.docx'],
      ['documents/media', undefined],
      ['documents/media/videos', undefined],
      ['documents/media/images/profile.jpg', 'profile.jpg'],
      ['documents/media/music/artists/silvio-rodriguez/ojala.mp3', 'ojala.mp3'],
      ['foo', undefined],
      ['documents/foo', undefined],
    ]
    fdescribe.each(cases)('', (path, expected) => {
      fit(`(dir, ${path}) === ${expected}`, () => {
        expect(findFile(fileTree, path)?.name).toEqual(expected)
      })
    })
  })

  fdescribe('findDirectory', () => {
    const cases: [path: string, expected: string | undefined][] = [
      ['documents', 'documents'],
      ['documents/essay.docx', undefined],
      ['documents/media', 'media'],
      ['documents/media/videos', 'videos'],
      ['documents/media/images/profile.jpg', undefined],
      ['documents/media/music/artists/silvio-rodriguez/ojala.mp3', undefined],
      ['foo', undefined],
      ['documents/foo', undefined],
    ]
    fdescribe.each(cases)('', (path, expected) => {
      fit(`(dir, ${path}) === ${expected}`, () => {
        expect(findDirectory(fileTree, path)?.name).toEqual(expected)
      })
    })
  })

  fdescribe('listPaths', () => {
    const expected = [
      'documents',
      'documents/essay.docx',
      'documents/media',
      'documents/media/images',
      'documents/media/images/profile.jpg',
      'documents/media/music',
      'documents/media/music/artists',
      'documents/media/music/artists/chico-buarque',
      'documents/media/music/artists/chico-buarque/pedro-pedreiro.mp3',
      'documents/media/music/artists/silvio-rodriguez',
      'documents/media/music/artists/silvio-rodriguez/ojala.mp3',
      'documents/media/videos',
    ].sort()
    fit('should return all paths', () => {
      expect(listPaths(fileTree).sort()).toEqual(expected)
    })
  })
})