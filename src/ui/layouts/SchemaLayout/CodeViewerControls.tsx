import { DbOptions } from '@src/core/database'
import { FileItem, FileSystemItem, itemName } from '@src/core/files/fileSystem'
import ActionMenu from '@src/ui/components/menus/ActionMenu'
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
  display,
  inset,
  padding,
  position,
  width,
} from '@src/ui/styles/classnames'
import React from 'react'
import DbOptionsForm from '../../components/DbOptionsForm'
import IconButton from '../../components/form/IconButton'
import ArrowLeftIcon from '../../components/icons/ArrowLeft'
import CloseIcon from '../../components/icons/Close'
import CopyIcon from '../../components/icons/Copy'
import FolderIcon from '../../components/icons/Folder'
import PencilIcon from '../../components/icons/Pencil'
import SettingsIcon from '../../components/icons/Settings'

type CodeViewerControlsProps = {
  root: FileSystemItem
  activeFile?: FileItem
  dbOptions: DbOptions
  onClickEdit: () => void
  onClickClose: () => void
  onChangeDbOptions: (dbOptions: DbOptions) => void
}

export default function CodeViewerControls({
  root,
  activeFile,
  dbOptions,
  onClickEdit,
  onClickClose,
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
        .then(() => success(`${itemName(activeFile)} copied to clipboard.`, { ttl: 600000 }))
        .catch((e) => {
          console.error(e)
          error('Failed to download project.')
        })
    }
  }

  const dbOptionsRef = React.useRef(null)
  useOnClickOutside(dbOptionsRef, closeDbOptions)

  console.log({ isDbOptionsOpen })

  return (
    <>
      <IconButton
        label="go back"
        icon={ArrowLeftIcon}
        iconProps={{ size: 6 }}
        onClick={onClickClose}
      />
      <IconButton
        className={classnames(display('hidden', 'xs:inline-block'))}
        label="copy current file code"
        icon={CopyIcon}
        iconProps={{ size: 6 }}
        onClick={handleClickCopy}
        onMouseOver={prefetchCopy}
        onTouchStartCapture={prefetchCopy}
        disabled={!activeFile}
      />
      <IconButton
        className={classnames(display('hidden', 'xs:inline-block'))}
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
        className={classnames(display('hidden', 'xs:inline-block'))}
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
      <ActionMenu
        className={classnames(display('xs:hidden', 'inline-block'))}
        items={[
          {
            label: 'Copy file',
            icon: CopyIcon,
            iconProps: { size: 5 },
            onClick: handleClickCopy,
          },
          {
            label: 'Download',
            icon: FolderIcon,
            iconProps: { size: 5 },
            onClick: handleClickDownload,
          },
          {
            label: 'Edit code',
            icon: PencilIcon,
            iconProps: { size: 5 },
            onClick: onClickEdit,
          },
        ]}
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
