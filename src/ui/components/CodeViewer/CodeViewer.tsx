import { DbOptions, defaultDbOptions } from '@src/core/database'
import { FileItem, fileLanguage, FileSystemItem } from '@src/core/files'
import { Schema } from '@src/core/schema'
import Code from '@src/ui/components/Code'
import DbOptionsForm from '@src/ui/components/DbOptionsForm'
import FileTree, { useFileTree } from '@src/ui/components/FileTree'
import CloseIcon from '@src/ui/components/icons/Close'
import CopyIcon from '@src/ui/components/icons/Copy'
import FolderIcon from '@src/ui/components/icons/Folder'
import SettingsIcon from '@src/ui/components/icons/Settings'
import useGeneratedCode from '@src/ui/hooks/useGeneratedCode'
import useIsOpen from '@src/ui/hooks/useIsOpen'
import useOnClickOutside from '@src/ui/hooks/useOnClickOutside'
import React, { useRef, useState } from 'react'
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

  const dbOptionsRef = useRef(null)
  useOnClickOutside(dbOptionsRef, closeDbOptions)

  return (
    <div className={Styles.container}>
      <div className={Styles.grid}>
        <div className={Styles.titleCell}>
          <div className={Styles.titleSiteName}>
            <img
              className={Styles.titleLogo}
              src="https://sequelizeui.app/static/images/sequelize-ui-tiny-white.svg"
            />
            Sequelize UI
          </div>
          <h2>{root.name}</h2>
          <button className={Styles.close} onClick={onRequestClose}>
            <CloseIcon title="close" />
          </button>
        </div>
        <div className={Styles.controlsCell}>
          <div
            className={Styles.actions}
            onMouseDown={(evt) => evt.stopPropagation()}
            onTouchStart={(evt) => evt.stopPropagation()}
          >
            <button className={Styles.actionButton} onClick={toggleDbOptions}>
              <SettingsIcon title={isDbOptionsOpen ? 'close settings' : 'open settings'} />
            </button>
            <button className={Styles.actionButton} onClick={handleClickDownload}>
              <FolderIcon title="download project code" />
            </button>
            <button
              className={Styles.actionButton}
              onClick={handleClickCopy}
              disabled={!activeFile}
            >
              <CopyIcon title="copy current file code" />
            </button>
          </div>
          {isDbOptionsOpen && (
            <div ref={dbOptionsRef} className={Styles.dbFormOverlay}>
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
