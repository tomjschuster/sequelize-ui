import { DbOptions } from '@src/core/database'
import { FileItem, FileSystemItem, itemName } from '@src/core/files'
import useIsOpen from '@src/ui/hooks/useIsOpen'
import useOnClickOutside from '@src/ui/hooks/useOnClickOutside'
import { useAlert } from '@src/ui/lib/alert'
import { classnames } from '@src/ui/styles/classnames'
import React from 'react'
import DbOptionsForm from '../DbOptionsForm'
import IconButton from '../form/IconButton'
import CloseIcon from '../icons/Close'
import CopyIcon from '../icons/Copy'
import FolderIcon from '../icons/Folder'
import PencilIcon from '../icons/Pencil'
import SettingsIcon from '../icons/Settings'
import * as Styles from './styles'

type CodeViewerControlsProps = {
  root: FileSystemItem
  activeFile?: FileItem
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
      .then(() => info(`Download started for ${itemName(root)}.zip.`))
      .catch((e) => {
        console.error(e)
        error('Failed to copy to clipboard.')
      })
  }

  const handleClickCopy = () => {
    if (activeFile) {
      copyFile(activeFile)
        .then(() => success(`${itemName(activeFile)} copied to clipboard.`))
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
      <IconButton
        label="copy current file code"
        icon={CopyIcon}
        iconProps={{ size: 6 }}
        onClick={handleClickCopy}
        disabled={!activeFile}
      />
      <IconButton
        label="download project code"
        icon={FolderIcon}
        iconProps={{
          size: 6,
        }}
        onClick={handleClickDownload}
      />
      <IconButton
        label="edit code"
        icon={PencilIcon}
        iconProps={{ size: 6 }}
        onClick={onClickEdit}
      />
      <IconButton
        label={isDbOptionsOpen ? 'close settings' : 'open settings'}
        onClick={toggleDbOptions}
        icon={SettingsIcon}
        iconProps={{ size: 6 }}
        onMouseDown={(evt) => evt.stopPropagation()}
        onTouchStart={(evt) => evt.stopPropagation()}
      />
      {isDbOptionsOpen && (
        <div ref={dbOptionsRef} className={Styles.dbFormOverlay}>
          <IconButton
            label="close settings"
            className={classnames('absolute', 'right-1', 'top-1')}
            icon={CloseIcon}
            iconProps={{ size: 6 }}
            onClick={closeDbOptions}
          />
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
