import { fileLanguage, FileSystemItem } from '@src/core/files'
import { copyFile, download } from '@src/core/io'
import Code from '@src/ui/components/Code'
import FileTree, { useFileTree } from '@src/ui/components/FileTree'
import React from 'react'

type CodeViewerProps = {
  root: FileSystemItem
  cacheKey?: string
}

export default function CodeViewer({ root, cacheKey }: CodeViewerProps): React.ReactElement {
  const { activeFile, folderState, selectItem } = useFileTree({ root, cacheKey })
  const handleClickDownload = () => download(root)
  const handleClickCopy = () => activeFile && copyFile(activeFile.file)
  return (
    <>
      <button onClick={handleClickDownload}>Download</button>
      <button onClick={handleClickCopy}>Copy File</button>
      <FileTree
        root={root}
        onSelect={selectItem}
        activePath={activeFile?.path}
        folderState={folderState}
      />
      <Code
        content={activeFile?.file.content || ''}
        language={activeFile && fileLanguage(activeFile.file)}
      />
    </>
  )
}
