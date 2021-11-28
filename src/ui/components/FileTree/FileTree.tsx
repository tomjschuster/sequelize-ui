import {
  fileLanguage,
  FileSystemItem,
  FolderState,
  isDirectory,
  isFile,
  itemName,
} from '@src/core/files'
import { classnames } from '@src/ui/styles/classnames'
import React from 'react'
import ChevronIcon, { ChevronDirection } from '../icons/Chevron'
import LanguageIcon from '../icons/Language'

type FileTreeProps = {
  root: FileSystemItem
  activePath?: string
  folderState: FolderState
  onSelect: (path: string) => void
}
function FileTree({ root, activePath, folderState, onSelect }: FileTreeProps): React.ReactElement {
  const path = itemName(root)
  const rootActive = path === activePath

  return (
    <ul role="tree" className={classnames('whitespace-nowrap', 'overflow-x-scroll')}>
      <li
        tabIndex={rootActive ? 0 : -1}
        role="treeitem"
        aria-level={1}
        aria-setsize={1}
        aria-posinset={1}
        aria-expanded={folderState[path]}
      >
        <FileTreeItem
          depth={1}
          item={root}
          folderState={folderState}
          onSelect={onSelect}
          activePath={activePath}
          path={itemName(root)}
        />
      </li>
    </ul>
  )
}

type FileTreeItemProps = {
  item: FileSystemItem
  folderState: FolderState
  activePath?: string
  path: string
  onSelect: (path: string) => void
  depth: number
}
function FileTreeItem({
  depth,
  activePath,
  item,
  path,
  folderState,
  onSelect,
}: FileTreeItemProps): React.ReactElement {
  const active = activePath === path
  const handleClick = () => onSelect(path)

  React.useEffect(() => {
    if (activePath) {
      const li = document.getElementById(pathId(activePath))
      if (li) li.scrollIntoView({ block: 'center', behavior: 'auto' })
    }
  }, [])

  const language = isFile(item) && fileLanguage(item)
  const chevronDirection = !isDirectory(item)
    ? undefined
    : folderState[path]
    ? ChevronDirection.Down
    : ChevronDirection.Right

  return (
    <>
      <span
        className={classnames(
          'flex',
          'items-center',
          'text-sm',
          'leading-loose',
          'w-full',
          'cursor-pointer',
          'block',
          { 'font-semibold': active, 'hover:bg-gray-200': !active, 'bg-indigo-100': active },
        )}
        style={{ paddingLeft: `calc(${depth} * 1rem)` }}
        onClick={handleClick}
      >
        {chevronDirection && (
          <span className="pr-1.5">
            <ChevronIcon direction={chevronDirection} />
          </span>
        )}
        {language && (
          <span className="pr-1.5">
            <LanguageIcon language={language} />
          </span>
        )}
        {itemName(item)}
      </span>
      {isDirectory(item) && item.files.length > 0 && (
        <ul role="group" className={classnames({ hidden: !folderState[path] })}>
          {item.files
            .slice()
            .sort(compareItems)
            .map((child, i) => {
              const newPath = path + '/' + itemName(child)
              const tabIndex = newPath === activePath ? 0 : -1

              return (
                <li
                  tabIndex={tabIndex}
                  role="treeitem"
                  aria-level={depth + 1}
                  aria-setsize={item.files.length}
                  aria-posinset={i + 1}
                  aria-expanded={isDirectory(child) ? folderState[newPath] : undefined}
                  id={pathId(newPath)}
                  key={itemName(child)}
                >
                  <FileTreeItem
                    depth={depth + 1}
                    item={child}
                    onSelect={onSelect}
                    path={newPath}
                    activePath={activePath}
                    folderState={folderState}
                  />
                </li>
              )
            })}
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

function pathId(path: string): string {
  return path.replace(/\W/g, '-')
}

export default React.memo(FileTree)
