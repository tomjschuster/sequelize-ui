import { DbOptions } from '@src/core/database'
import { ActiveFile, FileItem, FileSystemItem } from '@src/core/files'
import useIsOpen from '@src/ui/hooks/useIsOpen'
import useOnClickOutside from '@src/ui/hooks/useOnClickOutside'
import { useAlert } from '@src/ui/lib/alert'
import React from 'react'
import DbOptionsForm from '../DbOptionsForm'
import { ControlsAction } from '../Flyout'
import CloseIcon from '../icons/Close'
import CopyIcon from '../icons/Copy'
import FolderIcon from '../icons/Folder'
import PencilIcon from '../icons/Pencil'
import SettingsIcon from '../icons/Settings'
import * as Styles from './styles'

type CodeViewerControlsProps = {
  root: FileSystemItem
  activeFile: ActiveFile | undefined
  dbOptions: DbOptions
  onClickEdit: () => void
  onChangeDbOptions: (dbOptions: DbOptions) => void
}

export default function CodeViewerControls({
  root,
  activeFile,
  dbOptions,
  onClickEdit,
  onChangeDbOptions,
}: CodeViewerControlsProps): React.ReactElement {
  const { info, success, error } = useAlert()
  const { isOpen: isDbOptionsOpen, toggle: toggleDbOptions, close: closeDbOptions } = useIsOpen()

  const handleClickDownload = () => {
    download(root)
      .then(() => info(`Download started for ${root.name}.zip.`))
      .catch((e) => {
        console.error(e)
        error('Failed to copy to clipboard.')
      })
  }

  const handleClickCopy = () => {
    if (activeFile) {
      copyFile(activeFile.file)
        .then(() => success(`${activeFile.file.name} copied to clipboard.`))
        .catch((e) => {
          console.error(e)
          error('Failed to download project.')
        })
    }
  }

  const dbOptionsRef = React.useRef(null)
  useOnClickOutside(dbOptionsRef, closeDbOptions)

  return (
    <>
      <ControlsAction onClick={handleClickCopy} disabled={!activeFile}>
        <CopyIcon size={6} title="copy current file code" />
      </ControlsAction>
      <ControlsAction onClick={handleClickDownload}>
        <FolderIcon title="download project code" size={6} />
      </ControlsAction>
      <ControlsAction onClick={onClickEdit} overlayControl>
        <PencilIcon title="edit code" size={6} />
      </ControlsAction>
      <ControlsAction onClick={toggleDbOptions} overlayControl>
        <SettingsIcon size={6} title={isDbOptionsOpen ? 'close settings' : 'open settings'} />
      </ControlsAction>
      {isDbOptionsOpen && (
        <div ref={dbOptionsRef} className={Styles.dbFormOverlay}>
          <button className={Styles.closeDbForm} onClick={closeDbOptions}>
            <CloseIcon title="close settings" size={6} />
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
