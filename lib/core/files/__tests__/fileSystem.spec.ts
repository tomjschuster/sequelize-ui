import { expect } from 'chai'
import forEach from 'mocha-each'
import {
  directory,
  file,
  fileLanguage,
  findDirectory,
  findFile,
  findItem,
  isDirectory,
  isFile,
  itemName,
  Language,
  listPaths,
} from '../fileSystem'
import fileTree from '../__fixtures__/fileTree'

describe('files', () => {
  describe('itemName', () => {
    const cases = [
      [file('foo', 'contents'), 'foo'],
      [directory('bar', []), 'bar'],
    ]
    forEach(cases).describe('', (item, expected) => {
      it(`(${JSON.stringify(item)}) === ${expected}`, () => {
        expect(itemName(item)).to.equal(expected)
      })
    })
  })
  describe('isDirectory', () => {
    const cases = [
      [file('foo', 'contents'), false],
      [directory('bar', []), true],
    ]
    forEach(cases).describe('', (item, expected) => {
      it(`(${JSON.stringify(item)}) === ${expected}`, () => {
        expect(isDirectory(item)).to.equal(expected)
      })
    })
  })
  describe('isFile', () => {
    const cases = [
      [file('foo', 'contents'), true],
      [directory('bar', []), false],
    ]
    forEach(cases).describe('', (item, expected) => {
      it(`(${JSON.stringify(item)}) === ${expected}`, () => {
        expect(isFile(item)).to.equal(expected)
      })
    })
  })
  describe('fileLanguage', () => {
    const cases = [
      [file('foo.ts', 'contents'), Language.TypeScript],
      [file('foo.js', 'contents'), Language.JavaScript],
      [file('foo.json', 'contents'), Language.Json],
      [file('.gitignore', 'contents'), Language.Git],
      [file('foo.txt', 'contents'), undefined],
      [file('foo.', 'contents'), undefined],
      [file('foo', 'contents'), undefined],
    ]
    forEach(cases).describe('', (f, expected) => {
      it(`(${JSON.stringify(f)}) === ${expected}`, () => {
        expect(fileLanguage(f)).to.equal(expected)
      })
    })
  })
  describe('findItem', () => {
    const cases = [
      ['documents', 'documents'],
      ['documents/essay.docx', 'essay.docx'],
      ['documents/media', 'media'],
      ['documents/media/videos', 'videos'],
      ['documents/media/images/profile.jpg', 'profile.jpg'],
      ['documents/media/music/artists/silvio-rodriguez/ojala.mp3', 'ojala.mp3'],
      ['foo', undefined],
      ['documents/foo', undefined],
    ]
    forEach(cases).describe('', (path, expected) => {
      it(`(dir, ${path}) === ${expected}`, () => {
        expect(findItem(fileTree, path)?.name).to.equal(expected)
      })
    })
  })
  describe('findFile', () => {
    const cases = [
      ['documents', undefined],
      ['documents/essay.docx', 'essay.docx'],
      ['documents/media', undefined],
      ['documents/media/videos', undefined],
      ['documents/media/images/profile.jpg', 'profile.jpg'],
      ['documents/media/music/artists/silvio-rodriguez/ojala.mp3', 'ojala.mp3'],
      ['foo', undefined],
      ['documents/foo', undefined],
    ]
    forEach(cases).describe('', (path, expected) => {
      it(`(dir, ${path}) === ${expected}`, () => {
        expect(findFile(fileTree, path)?.name).to.equal(expected)
      })
    })
  })

  describe('findDirectory', () => {
    const cases = [
      ['documents', 'documents'],
      ['documents/essay.docx', undefined],
      ['documents/media', 'media'],
      ['documents/media/videos', 'videos'],
      ['documents/media/images/profile.jpg', undefined],
      ['documents/media/music/artists/silvio-rodriguez/ojala.mp3', undefined],
      ['foo', undefined],
      ['documents/foo', undefined],
    ]
    forEach(cases).describe('', (path, expected) => {
      it(`(dir, ${path}) === ${expected}`, () => {
        expect(findDirectory(fileTree, path)?.name).to.equal(expected)
      })
    })
  })

  describe('listPaths', () => {
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
    it('should return all paths', () => {
      expect(listPaths(fileTree).sort()).to.eql(expected)
    })
  })
})
