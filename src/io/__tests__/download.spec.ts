/** @jest-environment jsdom */
import { directory, file } from '@src/core/files/fileSystem'
import { saveAs } from 'file-saver'
import Zip from 'jszip'
import { download, FAILED_TO_CREATE_FOLDER_ERROR } from '../download'

jest.mock('file-saver', () => ({ saveAs: jest.fn() }))

const mockBlob = new Blob(['foo blob'])

const mockZip = {
  folder: jest.fn(() => ({ file: jest.fn(), generateAsync: () => Promise.resolve(mockBlob) })),
}

jest.mock('jszip', () => jest.fn(() => mockZip))

describe('io', () => {
  describe('download', () => {
    it('should call saveAs with the file name and contents', async () => {
      await download(file('foo title', 'foo contents'))
      expect(saveAs).toHaveBeenCalledWith('foo contents', 'foo title')
    })

    it('should return a rejected promise when saveAs fails', () => {
      // @ts-expect-error only using partial overlap
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
      // @ts-expect-error only using partial overlap
      ;(Zip as jest.Mock).mockReturnValueOnce({ folder: jest.fn() })

      download(directory('foo', [file('foo title', 'foo contents')])).catch((e) => {
        expect(e).toEqual(new Error(FAILED_TO_CREATE_FOLDER_ERROR))
      })
    })
  })
})
