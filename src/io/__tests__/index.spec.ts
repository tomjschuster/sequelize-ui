import { directory, file } from '@src/core/files'
import { default as copy } from 'copy-to-clipboard'
import * as FileSaver from 'file-saver'
import * as Zip from 'jszip'
import { copyFile, download, FAILED_TO_CREATE_FOLDER_ERROR } from '..'

jest.mock('copy-to-clipboard', () => jest.fn())
jest.mock('file-saver', () => ({ saveAs: jest.fn() }))
jest.mock('jszip', () => jest.fn())

describe('io', () => {
  describe('copyFile', () => {
    it('should call copy with the file contents', async () => {
      jest.spyOn(window, 'prompt').mockImplementation()
      copyFile(file('foo title', 'foo contents'))
      expect(copy).toHaveBeenCalledWith('foo contents')
    })
  })

  describe('download', () => {
    it('should call saveAs with the file name and contents', async () => {
      await download(file('foo title', 'foo contents'))
      expect(FileSaver.saveAs).toHaveBeenCalledWith('foo contents', 'foo title')
    })

    it('should return a rejected promise when saveAs fails', () => {
      jest.spyOn(FileSaver, 'saveAs').mockImplementationOnce(() => {
        throw new Error('foo')
      })

      download(file('foo title', 'foo contents')).catch((e) => {
        expect(e).toEqual(new Error('foo'))
      })
    })

    it('should generate a zip file asynchronously', async () => {
      const generateAsync = jest.fn(() => Promise.resolve(new Blob()))
      // @ts-expect-error incompatible type
      const mockZip = { folder: jest.fn(() => ({ file: jest.fn(), generateAsync })) } as Zip
      jest.spyOn(Zip, 'default').mockReturnValueOnce(mockZip)

      await download(directory('foo dir', [file('foo title', 'foo contents')]))
      expect(generateAsync).toHaveBeenCalledTimes(1)
    })

    it('should return a rejected promise when folder create fails', async () => {
      // @ts-expect-error incompatible type
      const mockZip = { folder: jest.fn() } as Zip
      jest.spyOn(Zip, 'default').mockReturnValueOnce(mockZip)

      download(directory('foo', [file('foo title', 'foo contents')])).catch((e) => {
        expect(e).toEqual(new Error(FAILED_TO_CREATE_FOLDER_ERROR))
      })
    })
  })
})
