import { directory } from '../fileSystem'
import { create, empty } from '../fileTree'
import root from './__fixtures__/fileTree'

describe('files/fileTree', () => {
  it('empty', () => {
    const fileTree = empty()
    expect(fileTree.root).toEqual(directory('', []))
    expect(fileTree.state.activePath).toBeUndefined()
    expect(fileTree.state.focusedPath).toEqual('')
    expect(fileTree.state.directoryState).toEqual(new Map())
  })

  describe('create', () => {
    it('no default path', () => {
      const fileTree = create(root)
      expect(fileTree.root).toEqual(root)
      expect(fileTree.state.activePath).toBe('documents/media/images/profile.jpg')
      expect(fileTree.state.focusedPath).toBe('documents/media/images/profile.jpg')
      expect(fileTree.state.directoryState).toEqual(
        new Map([
          ['documents', true],
          ['documents/media', true],
          ['documents/media/images', true],
          ['documents/media/music', false],
          ['documents/media/music/artists', false],
          ['documents/media/music/artists/chico-buarque', false],
          ['documents/media/music/artists/silvio-rodriguez', false],
          ['documents/media/videos', false],
        ]),
      )
    })

    it('with default path', () => {
      const fileTree = create(
        root,
        'documents/media/music/artists/chico-buarque/apesar-de-voce.mp3',
      )
      expect(fileTree.root).toEqual(root)
      expect(fileTree.state.activePath).toBe(
        'documents/media/music/artists/chico-buarque/apesar-de-voce.mp3',
      )
      expect(fileTree.state.focusedPath).toBe(
        'documents/media/music/artists/chico-buarque/apesar-de-voce.mp3',
      )
      expect(fileTree.state.directoryState).toEqual(
        new Map([
          ['documents', true],
          ['documents/media', true],
          ['documents/media/images', false],
          ['documents/media/music', true],
          ['documents/media/music/artists', true],
          ['documents/media/music/artists/chico-buarque', true],
          ['documents/media/music/artists/silvio-rodriguez', false],
          ['documents/media/videos', false],
        ]),
      )
    })
  })

  // it('updateRoot', () => {
  //   const fileTree = updateRoot(
  //     {
  //       focusedPath: 'documents',
  //       folderState: {
  //         documents: true,
  //         'documents/media': false,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/videos': false,
  //       },
  //     },
  //     root,
  //   )

  //   expect(fileTree).toEqual({
  //     focusedPath: 'documents',
  //     folderState: {
  //       documents: true,
  //       'documents/media': false,
  //       'documents/media/images': false,
  //       'documents/media/music': false,
  //       'documents/media/music/artists': false,
  //       'documents/media/music/artists/chico-buarque': false,
  //       'documents/media/music/artists/silvio-rodriguez': false,
  //       'documents/media/videos': false,
  //     },
  //   })
  // })

  // describe('selectFileTreeItem', () => {
  //   it('directory', () => {
  //     const fileTree = {
  //       focusedPath: 'documents/media',
  //       folderState: {
  //         documents: false,
  //         'documents/media': false,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     }

  //     const selected = selectItem(fileTree, root, 'documents/media')

  //     expect(selected).toEqual({
  //       focusedPath: 'documents/media',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     })
  //   })

  //   it('file', () => {
  //     const fileTree = create(root)
  //     const selected = selectItem(fileTree, root, 'documents/media/images/profile.jpg')

  //     expect(selected).toEqual({
  //       activeFile: { path: 'documents/media/images/profile.jpg', file: profileImage },
  //       focusedPath: 'documents/media/images/profile.jpg',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': true,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     })
  //   })
  // })

  // it('expandDirectory', () => {
  //   const fileTree = create(root)
  //   const expanded = expandDirectory(fileTree, 'documents')

  //   expect(expanded).toEqual({
  //     focusedPath: 'documents',
  //     folderState: {
  //       documents: true,
  //       'documents/media': false,
  //       'documents/media/images': false,
  //       'documents/media/music': false,
  //       'documents/media/music/artists': false,
  //       'documents/media/music/artists/chico-buarque': false,
  //       'documents/media/music/artists/silvio-rodriguez': false,
  //       'documents/media/videos': false,
  //     },
  //   })
  // })

  // it('collapseDirectory', () => {
  //   const fileTree = {
  //     focusedPath: 'documents',
  //     folderState: {
  //       documents: true,
  //       'documents/media': false,
  //       'documents/media/images': false,
  //       'documents/media/music': false,
  //       'documents/media/music/artists': false,
  //       'documents/media/music/artists/chico-buarque': false,
  //       'documents/media/music/artists/silvio-rodriguez': false,
  //       'documents/media/videos': false,
  //     },
  //   }

  //   const collapsed = collapseDirectory(fileTree, 'documents')

  //   expect(collapsed).toEqual({
  //     focusedPath: 'documents',
  //     folderState: {
  //       documents: false,
  //       'documents/media': false,
  //       'documents/media/images': false,
  //       'documents/media/music': false,
  //       'documents/media/music/artists': false,
  //       'documents/media/music/artists/chico-buarque': false,
  //       'documents/media/music/artists/silvio-rodriguez': false,
  //       'documents/media/videos': false,
  //     },
  //   })
  // })

  // describe('focusOnParent', () => {
  //   it('root', () => {
  //     const fileTree = {
  //       focusedPath: 'documents',
  //       folderState: {
  //         documents: false,
  //         'documents/media': false,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     }

  //     const focused = focusOnParent(fileTree, root)

  //     expect(focused).toEqual({
  //       focusedPath: 'documents',
  //       folderState: {
  //         documents: false,
  //         'documents/media': false,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     })
  //   })

  //   it('directory', () => {
  //     const fileTree = {
  //       focusedPath: 'documents/media/images',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     }

  //     const focused = focusOnParent(fileTree, root)

  //     expect(focused).toEqual({
  //       focusedPath: 'documents/media',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     })
  //   })

  //   it('file', () => {
  //     const fileTree = {
  //       focusedPath: 'documents/media/images/profile.jpg',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': true,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     }

  //     const focused = focusOnParent(fileTree, root)

  //     expect(focused).toEqual({
  //       focusedPath: 'documents/media/images',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': true,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     })
  //   })
  // })

  // describe('focusOnNext', () => {
  //   it('sibling directory', () => {
  //     const fileTree = {
  //       focusedPath: 'documents/media/images',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     }

  //     const focused = focusOnNext(fileTree, root)

  //     expect(focused).toEqual({
  //       focusedPath: 'documents/media/music',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     })
  //   })

  //   it('sibling file', () => {
  //     const fileTree = {
  //       focusedPath: 'documents/media/music/artists/chico-buarque/apesar-de-voce.mp3',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': true,
  //         'documents/media/music/artists': true,
  //         'documents/media/music/artists/chico-buarque': true,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     }

  //     const focused = focusOnNext(fileTree, root)

  //     expect(focused).toEqual({
  //       focusedPath: 'documents/media/music/artists/chico-buarque/pedro-pedreiro.mp3',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': true,
  //         'documents/media/music/artists': true,
  //         'documents/media/music/artists/chico-buarque': true,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     })
  //   })

  //   it('child file', () => {
  //     const fileTree = {
  //       focusedPath: 'documents/media/music/artists/chico-buarque',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': true,
  //         'documents/media/music/artists': true,
  //         'documents/media/music/artists/chico-buarque': true,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     }

  //     const focused = focusOnNext(fileTree, root)

  //     expect(focused).toEqual({
  //       focusedPath: 'documents/media/music/artists/chico-buarque/apesar-de-voce.mp3',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': true,
  //         'documents/media/music/artists': true,
  //         'documents/media/music/artists/chico-buarque': true,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     })
  //   })

  //   it('parent sibling directory', () => {
  //     const fileTree = {
  //       focusedPath: 'documents/media/music/artists/chico-buarque/pedro-pedreiro.mp3',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': true,
  //         'documents/media/music/artists': true,
  //         'documents/media/music/artists/chico-buarque': true,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     }

  //     const focused = focusOnNext(fileTree, root)

  //     expect(focused).toEqual({
  //       focusedPath: 'documents/media/music/artists/silvio-rodriguez',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': true,
  //         'documents/media/music/artists': true,
  //         'documents/media/music/artists/chico-buarque': true,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     })
  //   })
  // })

  // describe('focusOnPrevious', () => {
  //   it('sibling directory', () => {
  //     const fileTree = {
  //       focusedPath: 'documents/media/music',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     }

  //     const focused = focusOnPrevious(fileTree, root)

  //     expect(focused).toEqual({
  //       focusedPath: 'documents/media/images',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     })
  //   })

  //   it('sibling file', () => {
  //     const fileTree = {
  //       focusedPath: 'documents/media/music/artists/chico-buarque/pedro-pedreiro.mp3',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': true,
  //         'documents/media/music/artists': true,
  //         'documents/media/music/artists/chico-buarque': true,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     }

  //     const focused = focusOnPrevious(fileTree, root)

  //     expect(focused).toEqual({
  //       focusedPath: 'documents/media/music/artists/chico-buarque/apesar-de-voce.mp3',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': true,
  //         'documents/media/music/artists': true,
  //         'documents/media/music/artists/chico-buarque': true,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     })
  //   })

  //   it('parent', () => {
  //     const fileTree = {
  //       focusedPath: 'documents/media/music/artists/chico-buarque/apesar-de-voce.mp3',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': true,
  //         'documents/media/music/artists': true,
  //         'documents/media/music/artists/chico-buarque': true,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     }

  //     const focused = focusOnPrevious(fileTree, root)

  //     expect(focused).toEqual({
  //       focusedPath: 'documents/media/music/artists/chico-buarque',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': true,
  //         'documents/media/music/artists': true,
  //         'documents/media/music/artists/chico-buarque': true,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     })
  //   })

  //   it('sibling directory last child', () => {
  //     const fileTree = {
  //       focusedPath: 'documents/media/music/artists/silvio-rodriguez',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': true,
  //         'documents/media/music/artists': true,
  //         'documents/media/music/artists/chico-buarque': true,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     }

  //     const focused = focusOnPrevious(fileTree, root)

  //     expect(focused).toEqual({
  //       focusedPath: 'documents/media/music/artists/chico-buarque/pedro-pedreiro.mp3',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': true,
  //         'documents/media/music/artists': true,
  //         'documents/media/music/artists/chico-buarque': true,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     })
  //   })
  // })

  // it('focusOnFirst', () => {
  //   const fileTree = create(root)
  //   const focused = focusOnFirst(fileTree, root)

  //   expect(focused).toEqual({
  //     focusedPath: 'documents',
  //     folderState: {
  //       documents: false,
  //       'documents/media': false,
  //       'documents/media/images': false,
  //       'documents/media/music': false,
  //       'documents/media/music/artists': false,
  //       'documents/media/music/artists/chico-buarque': false,
  //       'documents/media/music/artists/silvio-rodriguez': false,
  //       'documents/media/videos': false,
  //     },
  //   })
  // })

  // describe('focusOnLast', () => {
  //   it('collapsed directory', () => {
  //     const fileTree = create(root)
  //     const focused = focusOnLast(fileTree, root)

  //     expect(focused).toEqual({
  //       focusedPath: 'documents',
  //       folderState: {
  //         documents: false,
  //         'documents/media': false,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     })
  //   })

  //   it('expanded directory', () => {
  //     const fileTree = {
  //       focusedPath: 'documents',
  //       folderState: {
  //         documents: true,
  //         'documents/media': false,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     }

  //     const focused = focusOnLast(fileTree, root)

  //     expect(focused).toEqual({
  //       focusedPath: 'documents/essay.docx',
  //       folderState: {
  //         documents: true,
  //         'documents/media': false,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     })
  //   })
  // })

  // describe('focusByChar', () => {
  //   it('one match', () => {
  //     const fileTree = {
  //       focusedPath: 'documents',
  //       folderState: {
  //         documents: true,
  //         'documents/media': false,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     }

  //     const focusedOnce = focusByChar(fileTree, root, 'd')
  //     const focusedTwice = focusByChar(focusedOnce, root, 'd')

  //     expect(focusedOnce).toEqual({
  //       focusedPath: 'documents',
  //       folderState: {
  //         documents: true,
  //         'documents/media': false,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     })

  //     expect(focusedTwice).toEqual({
  //       focusedPath: 'documents',
  //       folderState: {
  //         documents: true,
  //         'documents/media': false,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     })
  //   })

  //   it('multiple matches', () => {
  //     const fileTree = {
  //       focusedPath: 'documents',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     }

  //     const focusedOnce = focusByChar(fileTree, root, 'm')
  //     const focusedTwice = focusByChar(focusedOnce, root, 'm')
  //     const focusedThrice = focusByChar(focusedTwice, root, 'm')

  //     expect(focusedOnce).toEqual({
  //       focusedPath: 'documents/media',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     })

  //     expect(focusedTwice).toEqual({
  //       focusedPath: 'documents/media/music',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     })

  //     expect(focusedThrice).toEqual({
  //       focusedPath: 'documents/media',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     })
  //   })
  // })

  // describe('expandSiblings', () => {
  //   it('on directory', () => {
  //     const fileTree = {
  //       focusedPath: 'documents/media/images',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     }

  //     const expanded = expandSiblings(fileTree, root)

  //     expect(expanded).toEqual({
  //       focusedPath: 'documents/media/images',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': true,
  //         'documents/media/music': true,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': true,
  //       },
  //     })
  //   })

  //   it('on file', () => {
  //     const fileTree = {
  //       focusedPath: 'documents/essay.docx',
  //       folderState: {
  //         documents: true,
  //         'documents/media': false,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     }

  //     const expanded = expandSiblings(fileTree, root)

  //     expect(expanded).toEqual({
  //       focusedPath: 'documents/essay.docx',
  //       folderState: {
  //         documents: true,
  //         'documents/media': true,
  //         'documents/media/images': false,
  //         'documents/media/music': false,
  //         'documents/media/music/artists': false,
  //         'documents/media/music/artists/chico-buarque': false,
  //         'documents/media/music/artists/silvio-rodriguez': false,
  //         'documents/media/videos': false,
  //       },
  //     })
  //   })
  // })
})
