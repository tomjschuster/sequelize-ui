/** @jest-environment jsdom */
import { file } from '@src/core/files/fileSystem'
import copy from 'copy-to-clipboard'
import { copyFile } from '../copy'

jest.mock('copy-to-clipboard', () => jest.fn())

describe('io', () => {
  describe('copyFile', () => {
    it('should call copy with the file contents', async () => {
      jest.spyOn(window, 'prompt').mockImplementation()
      copyFile(file('foo title', 'foo contents'))
      expect(copy).toHaveBeenCalledWith('foo contents')
    })
  })
})
