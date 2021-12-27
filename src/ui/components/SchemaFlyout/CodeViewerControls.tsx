import { DbOptions } from '@src/core/database'
import { FileItem, FileSystemItem, itemName } from '@src/core/files/fileSystem'
import useOnClickOutside from '@src/ui/hooks/useOnClickOutside'
import useToggle from '@src/ui/hooks/useToggle'
import { useAlert } from '@src/ui/lib/alert'
import {
  backgroundColor,
  borderColor,
  borderRadius,
  borderWidth,
  boxShadow,
  classnames,
  inset,
  padding,
  position,
  width,
} from '@src/ui/styles/classnames'
import React from 'react'
import DbOptionsForm from '../DbOptionsForm'
import IconButton from '../form/IconButton'
import CloseIcon from '../icons/Close'
import CopyIcon from '../icons/Copy'
import FolderIcon from '../icons/Folder'
import PencilIcon from '../icons/Pencil'
import SettingsIcon from '../icons/Settings'

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
  const { state: isDbOptionsOpen, toggle: toggleDbOptions, setOff: closeDbOptions } = useToggle()

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
        onMouseOver={prefetchCopy}
        onTouchStartCapture={prefetchCopy}
        disabled={!activeFile}
      />
      <IconButton
        label="download project code"
        icon={FolderIcon}
        iconProps={{
          size: 6,
        }}
        onClick={handleClickDownload}
        onMouseOver={prefetchDownload}
        onTouchStartCapture={prefetchDownload}
      />
      <IconButton
        label="edit code"
        icon={PencilIcon}
        iconProps={{ size: 6 }}
        onClick={onClickEdit}
      />
      <IconButton
        label={isDbOptionsOpen ? 'close settings' : 'open settings'}
        icon={SettingsIcon}
        iconProps={{ size: 6 }}
        onClick={(evt) => {
          evt.stopPropagation()
          toggleDbOptions()
        }}
      />
      {isDbOptionsOpen && (
        <div
          ref={dbOptionsRef}
          className={classnames(
            position('absolute'),
            inset('top-full', 'right-0'),
            width('w-screen', 'md:w-auto', 'lg:w-auto'),
            padding('p-4', 'pt-10'),
            borderWidth('border'),
            borderColor('border-gray-900'),
            borderRadius('rounded-lg'),
            backgroundColor('bg-gray-50'),
            boxShadow('shadow-2xl'),
          )}
        >
          <IconButton
            label="close settings"
            className={classnames(position('absolute'), inset('right-1', 'top-1'))}
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

export function prefetchDownload(): void {
  import('@src/io/download')
}

/** Dynamically imported io copy */
async function copyFile(file: FileItem): Promise<void> {
  const { copyFile: copyFile_ } = await import('@src/io/copy')
  copyFile_(file)
}

export function prefetchCopy(): void {
  import('@src/io/copy')
}
