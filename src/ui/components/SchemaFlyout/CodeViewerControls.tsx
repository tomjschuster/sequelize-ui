import { DbOptions } from '@src/core/database'
import { FileItem, FileSystemItem } from '@src/core/files'
import { ActiveFile } from '@src/ui/components/FileTree'
import useIsOpen from '@src/ui/hooks/useIsOpen'
import useOnClickOutside from '@src/ui/hooks/useOnClickOutside'
import React from 'react'
import DbOptionsForm from '../DbOptionsForm'
import { ControlsAction } from '../Flyout'
import CloseIcon from '../icons/Close'
import CopyIcon from '../icons/Copy'
import FolderIcon from '../icons/Folder'
import SettingsIcon from '../icons/Settings'
import * as Styles from './styles'

type CodeViewerControlsProps = {
  root: FileSystemItem
  activeFile: ActiveFile | undefined
  dbOptions: DbOptions
  onChangeDbOptions: (dbOptions: DbOptions) => void
}

export default function CodeViewerControls({
  root,
  activeFile,
  dbOptions,
  onChangeDbOptions,
}: CodeViewerControlsProps): React.ReactElement {
  const { isOpen: isDbOptionsOpen, toggle: toggleDbOptions, close: closeDbOptions } = useIsOpen()

  const handleClickDownload = () => download(root)
  const handleClickCopy = async () => activeFile && copyFile(activeFile.file)

  const dbOptionsRef = React.useRef(null)
  useOnClickOutside(dbOptionsRef, closeDbOptions)

  return (
    <>
      <ControlsAction onClick={handleClickCopy} disabled={!activeFile}>
        <CopyIcon title="copy current file code" />
      </ControlsAction>
      <ControlsAction onClick={handleClickDownload}>
        <FolderIcon title="download project code" />
      </ControlsAction>
      <ControlsAction onClick={toggleDbOptions} overlayControl>
        <SettingsIcon title={isDbOptionsOpen ? 'close settings' : 'open settings'} />
      </ControlsAction>
      {isDbOptionsOpen && (
        <div ref={dbOptionsRef} className={Styles.dbFormOverlay}>
          <button className={Styles.closeDbForm} onClick={closeDbOptions}>
            <CloseIcon title="close settings" />
          </button>
          <DbOptionsForm dbOptions={dbOptions} onChange={onChangeDbOptions} />
        </div>
      )}
    </>
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
