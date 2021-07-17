import { DbOptions, defaultDbOptions } from '@src/core/database'
import { FileItem, fileLanguage, FileSystemItem } from '@src/core/files'
import { Schema } from '@src/core/schema'
import Code from '@src/ui/components/Code'
import FileTree, { useFileTree } from '@src/ui/components/FileTree'
import useGeneratedCode from '@src/ui/hooks/useGeneratedCode'
import React, { useState } from 'react'
import { classnames } from 'tailwindcss-classnames'
import DbOptionsForm from '../DbOptionsForm'

type CodeViewerProps = {
  schema: Schema
}

export default function CodeViewer({ schema }: CodeViewerProps): React.ReactElement | null {
  const [dbOptions, setDbOptions] = useState<DbOptions>(defaultDbOptions)
  const { root } = useGeneratedCode({ schema, dbOptions })

  if (!root) return null

  return (
    <CodeViewerContent
      schema={schema}
      root={root}
      dbOptions={dbOptions}
      onChangeDbOptions={setDbOptions}
    />
  )
}

type CodeViewerContentProps = {
  schema: Schema
  root: FileSystemItem
  dbOptions: DbOptions
  onChangeDbOptions: (dbOptions: DbOptions) => void
}
function CodeViewerContent({
  schema,
  root,
  dbOptions,
  onChangeDbOptions,
}: CodeViewerContentProps): React.ReactElement {
  const { activeFile, folderState, selectItem } = useFileTree({ root, cacheKey: schema.id })
  const handleClickDownload = () => download(root)
  const handleClickCopy = async () => activeFile && copyFile(activeFile.file)

  return (
    <div
      className={classnames(
        'h-screen',
        'w-screen',
        'fixed',
        'top-0',
        'left-0',
        'bg-white',
        'overflow-y-scroll',
        'z-10',
      )}
    >
      <div>
        <button onClick={handleClickDownload}>Download</button>
        <button onClick={handleClickCopy}>Copy File</button>
      </div>
      <div className={classnames('flex', 'flex-col', 'xl:flex-row', 'h-full')}>
        <div
          className={classnames('flex', 'flex-col', 'lg:flex-row', 'flex-grow-1', 'flex-shrink-0')}
        >
          <div className={classnames('width-96', 'p-5')}>
            <FileTree
              root={root}
              onSelect={selectItem}
              activePath={activeFile?.path}
              folderState={folderState}
            />
          </div>
          <div className={classnames('flex-1')}>
            <Code
              content={activeFile?.file.content || ''}
              language={activeFile && fileLanguage(activeFile.file)}
            />
          </div>
        </div>
        <div className={classnames('flex-shrink-0')}>
          <DbOptionsForm dbOptions={dbOptions} onChange={onChangeDbOptions} />
        </div>
      </div>
    </div>
  )
}

/** Dynamically imported io download */
async function download(item: FileSystemItem): Promise<void> {
  const { download: _download } = await import('@src/io/download')
  _download(item)
}

/** Dynamically imported io copy */
async function copyFile(file: FileItem): Promise<void> {
  const { copyFile: copyFile_ } = await import('@src/io/copy')
  copyFile_(file)
}
