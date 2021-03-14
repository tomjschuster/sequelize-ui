import Code from '@lib/components/Code'
import FileTree, { useFileTree } from '@lib/components/FileTree'
import { fileLanguage, FileSystemItem } from '@lib/core'
import React from 'react'

type CodeViewerProps = {
  root: FileSystemItem
}

export default function CodeViewer({ root }: CodeViewerProps): React.ReactElement {
  const { activeFile, folderState, selectItem } = useFileTree({ root })

  return (
    <>
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
