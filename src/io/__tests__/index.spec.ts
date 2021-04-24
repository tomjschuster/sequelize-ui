import { directory, file } from '@src/core/files'
import copy from 'copy-to-clipboard'
import { saveAs } from 'file-saver'
import Zip from 'jszip'
import { copyFile, download, FAILED_TO_CREATE_FOLDER_ERROR } from '..'

jest.mock('copy-to-clipboard', () => jest.fn())
jest.mock('file-saver', () => ({ saveAs: jest.fn() }))

const mockBlob = new Blob(['foo blob'])

const mockZip = {
  folder: jest.fn(() => ({ file: jest.fn(), generateAsync: () => Promise.resolve(mockBlob) })),
}

jest.mock('jszip', () => jest.fn(() => mockZip))

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
      expect(saveAs).toHaveBeenCalledWith('foo contents', 'foo title')
    })

    it('should return a rejected promise when saveAs fails', () => {
      ;(saveAs as jest.Mock).mockImplementationOnce(() => {
        throw new Error('foo')
      })

      download(file('foo title', 'foo contents')).catch((e) => {
        expect(e).toEqual(new Error('foo'))
      })
    })

    it('should generate a zip file asynchronously', async () => {
      await download(directory('foo dir', [file('foo title', 'foo contents')]))
      expect(saveAs).toHaveBeenCalledWith(mockBlob, 'foo dir')
    })

    it('should return a rejected promise when folder create fails', async () => {
      // @ts-expect-error incompatible types
      ;(Zip as jest.Mock).mockReturnValueOnce({ folder: jest.fn() })

      download(directory('foo', [file('foo title', 'foo contents')])).catch((e) => {
        expect(e).toEqual(new Error(FAILED_TO_CREATE_FOLDER_ERROR))
      })
    })
  })
})
