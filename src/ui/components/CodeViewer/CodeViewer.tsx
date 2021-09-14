import { DbOptions, defaultDbOptions } from '@src/core/database'
import { FileItem, fileLanguage, FileSystemItem } from '@src/core/files'
import { Schema } from '@src/core/schema'
import Code from '@src/ui/components/Code'
import FileTree, { useFileTree } from '@src/ui/components/FileTree'
import useGeneratedCode from '@src/ui/hooks/useGeneratedCode'
import useIsOpen from '@src/ui/hooks/useIsOpen'
import React, { useState } from 'react'
import DbOptionsForm from '../DbOptionsForm'
import * as Styles from './styles'

type CodeViewerProps = {
  schema: Schema
  onRequestClose: () => void
}

export default function CodeViewer({
  schema,
  onRequestClose,
}: CodeViewerProps): React.ReactElement | null {
  const [dbOptions, setDbOptions] = useState<DbOptions>(defaultDbOptions)
  const { root, defaultPath } = useGeneratedCode({ schema, dbOptions })

  if (!root) return null

  return (
    <CodeViewerContent
      schema={schema}
      root={root}
      dbOptions={dbOptions}
      defaultPath={defaultPath}
      onChangeDbOptions={setDbOptions}
      onRequestClose={onRequestClose}
    />
  )
}

type CodeViewerContentProps = {
  schema: Schema
  root: FileSystemItem
  dbOptions: DbOptions
  defaultPath: string | undefined
  onChangeDbOptions: (dbOptions: DbOptions) => void
  onRequestClose: () => void
}
function CodeViewerContent({
  schema,
  root,
  dbOptions,
  defaultPath,
  onChangeDbOptions,
  onRequestClose,
}: CodeViewerContentProps): React.ReactElement {
  const { isOpen: isDbOptionsOpen, toggle: toggleDbOptions, close: closeDbOptions } = useIsOpen()
  const { activeFile, folderState, selectItem } = useFileTree({
    root,
    cacheKey: schema.id,
    defaultPath,
  })
  const handleClickDownload = () => download(root)
  const handleClickCopy = async () => activeFile && copyFile(activeFile.file)

  return (
    <div className={Styles.container}>
      <div className={Styles.grid}>
        <div className={Styles.titleCell}>
          <div className={Styles.close} />
          <h2>{root.name}</h2>
          <button className={Styles.close} onClick={onRequestClose}>
            Close
          </button>
        </div>
        <div className={Styles.controlsCell}>
          <div className={Styles.actions}>
            <button onClick={toggleDbOptions}>DB Options</button>
            <button className={Styles.download} onClick={handleClickDownload}>
              Download
            </button>
            <button className={Styles.copy} onClick={handleClickCopy} disabled={!activeFile}>
              Copy File
            </button>
          </div>
          {/* <h3 className="pt-8 pb-2">Database options</h3> */}
          {isDbOptionsOpen && (
            <div className={Styles.dbFormOverlay}>
              <button className={Styles.closeDbForm} onClick={closeDbOptions}>
                Close
              </button>
              <DbOptionsForm dbOptions={dbOptions} onChange={onChangeDbOptions} />
            </div>
          )}
        </div>
        <div className={Styles.fileTreeCell}>
          <FileTree
            root={root}
            onSelect={selectItem}
            activePath={activeFile?.path}
            folderState={folderState}
          />
        </div>
        <div className={Styles.codeCell}>
          <Code
            content={activeFile?.file.content || ''}
            language={activeFile && fileLanguage(activeFile.file)}
          />
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
