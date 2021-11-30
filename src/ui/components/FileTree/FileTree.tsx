import {
  fileLanguage,
  FileSystemItem,
  FolderState,
  isDirectory,
  isFile,
  itemName,
} from '@src/core/files'
import { classnames } from '@src/ui/styles/classnames'
import { focusById } from '@src/utils/dom'
import React from 'react'
import ChevronIcon, { ChevronDirection } from '../icons/Chevron'
import LanguageIcon from '../icons/Language'

type FileTreeProps = {
  root: FileSystemItem
  activePath?: string
  focusedPath: string
  folderState: FolderState
  onKeyDown: (evt: React.KeyboardEvent) => void
  onSelect: (path: string) => void
}
function FileTree({
  root,
  activePath,
  focusedPath,
  folderState,
  onSelect,
  onKeyDown,
}: FileTreeProps): React.ReactElement {
  const path = itemName(root)

  const [treeFocused, setTreeFocused] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (focusedPath) {
      focusById(pathId(focusedPath))
    }
  }, [focusedPath])

  React.useEffect(() => {
    if (activePath) {
      const li = document.getElementById(pathId(activePath))
      if (li) li.scrollIntoView({ block: 'center', behavior: 'auto' })
    }
  }, [])

  return (
    <ul
      role="tree"
      className={classnames('whitespace-nowrap', 'overflow-x-scroll')}
      onKeyDown={onKeyDown}
      onFocus={() => setTreeFocused(true)}
      onBlur={() => setTreeFocused(false)}
    >
      <li
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
          focusedPath={focusedPath}
          path={itemName(root)}
          treeFocused={treeFocused}
        />
      </li>
    </ul>
  )
}

type FileTreeItemProps = {
  item: FileSystemItem
  folderState: FolderState
  activePath?: string
  focusedPath: string
  path: string
  depth: number
  treeFocused: boolean
  onSelect: (path: string) => void
}
function FileTreeItem({
  depth,
  activePath,
  focusedPath,
  item,
  path,
  folderState,
  treeFocused,
  onSelect,
}: FileTreeItemProps): React.ReactElement {
  const active = activePath === path
  const focused = focusedPath === path
  const handleClick = () => onSelect(path)

  const language = isFile(item) && fileLanguage(item)

  const chevronDirection = !isDirectory(item)
    ? undefined
    : folderState[path]
    ? ChevronDirection.Down
    : ChevronDirection.Right

  return (
    <>
      <span
        tabIndex={focused ? 0 : -1}
        id={pathId(path)}
        className={classnames(
          'flex',
          'items-center',
          'text-sm',
          'leading-loose',
          'w-full',
          'cursor-pointer',
          'block',
          'border-transparent',
          'border',
          'border-b-2',
          'border-t-2',
          'focus-visible:outline-none',
          'focus:outline-none',
          {
            'font-semibold': active,
            'hover:bg-gray-200': !active,
            'bg-indigo-100': active,
            'border-black': focused && treeFocused,
          },
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
              const childPath = path + '/' + itemName(child)

              return (
                <li
                  role="treeitem"
                  aria-level={depth + 1}
                  aria-setsize={item.files.length}
                  aria-posinset={i + 1}
                  aria-expanded={isDirectory(child) ? folderState[childPath] : undefined}
                  key={itemName(child)}
                >
                  <FileTreeItem
                    depth={depth + 1}
                    item={child}
                    onSelect={onSelect}
                    path={childPath}
                    activePath={activePath}
                    focusedPath={focusedPath}
                    folderState={folderState}
                    treeFocused={treeFocused}
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
