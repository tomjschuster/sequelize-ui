import { FileSystemItem, isDirectory, isFile, itemName } from '@src/core/files'
import React from 'react'
import { classnames } from 'tailwindcss-classnames'
import { FolderState } from './types'

type FileTreeProps = {
  root: FileSystemItem
  activePath?: string
  folderState: FolderState
  onSelect: (path: string) => void
}
function FileTree({ root, activePath, folderState, onSelect }: FileTreeProps): React.ReactElement {
  return (
    <>
      <ul>
        <li>
          <FileTreeItem
            item={root}
            folderState={folderState}
            onSelect={onSelect}
            activePath={activePath}
            path={itemName(root)}
          />
        </li>
      </ul>
    </>
  )
}

type FileTreeItemProps = {
  item: FileSystemItem
  folderState: FolderState
  activePath?: string
  path: string
  onSelect: (path: string) => void
}
function FileTreeItem({
  activePath,
  item,
  path,
  folderState,
  onSelect,
}: FileTreeItemProps): React.ReactElement {
  const active = activePath === path
  const handleClick = () => onSelect(path)

  return (
    <>
      <span className={classnames({ 'font-bold': active })} onClick={handleClick}>
        {itemName(item)}
      </span>
      {isDirectory(item) && item.files.length > 0 && folderState[path] && (
        <ul className="pl-8">
          {item.files
            .slice()
            .sort(compareItems)
            .map((item) => (
              <li key={itemName(item)}>
                <FileTreeItem
                  item={item}
                  onSelect={onSelect}
                  path={path + '/' + itemName(item)}
                  activePath={activePath}
                  folderState={folderState}
                />
              </li>
            ))}
        </ul>
      )}
    </>
  )
}

function compareItems(a: FileSystemItem, b: FileSystemItem): number {
  if (isDirectory(a) && isFile(b)) return -1
  if (isDirectory(b) && isFile(a)) return 1
  return itemName(a).localeCompare(itemName(b))
}

export default React.memo(FileTree)
