import {
  DirectoryItem,
  fileLanguage,
  FileSystemItem,
  isDirectory,
  isFile,
  itemName,
} from '@src/core/files/fileSystem'
import * as FileTree from '@src/core/files/fileTree'
import { classnames } from '@src/ui/styles/classnames'
import { focusById } from '@src/utils/dom'
import React from 'react'
import ChevronIcon, { ChevronDirection } from '../icons/Chevron'
import LanguageIcon from '../icons/Language'

type FileTreeProps = {
  fileTree: FileTree.FileTree
  onKeyDown: (evt: React.KeyboardEvent) => void
  onSelect: (path: string) => void
}

function FileTreeView({ fileTree, onSelect, onKeyDown }: FileTreeProps): React.ReactElement {
  const root = FileTree.rootItem(fileTree)
  const activePath = FileTree.activeFilePath(fileTree)
  const focusedPath = FileTree.focusedFilePath(fileTree)

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
    >
      <FileTreeListItem item={root} depth={1} index={1} fileTree={fileTree} onSelect={onSelect} />
    </ul>
  )
}

type FileTreeItemProps = {
  item: FileSystemItem
  path: string
  depth: number
  fileTree: FileTree.FileTree
  onSelect: (path: string) => void
}

function FileTreeItem({
  item,
  path,
  depth,
  fileTree,
  onSelect,
}: FileTreeItemProps): React.ReactElement {
  const active = FileTree.isActive(fileTree, path)
  const focused = FileTree.isFocused(fileTree, path)
  const expanded = FileTree.directoryIsExpanded(fileTree, path)
  const language = isFile(item) && fileLanguage(item)

  const handleClick = () => onSelect(path)

  const chevronDirection = !isDirectory(item)
    ? undefined
    : expanded
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
          'w-full',
          'text-sm',
          'leading-relaxed',
          'cursor-pointer',
          'block',
          'border-transparent',
          'border-2',
          'focus-visible:outline-none',
          'focus:outline-none',
          {
            'font-semibold': active,
            'hover:bg-gray-200': !active,
            'bg-indigo-100': active,
            'border-t': depth === 1,
            'focus:border-black': focused,
          },
        )}
        style={{ paddingLeft: depth === 1 ? '0.25rem' : `calc(${depth - 1} * 0.75rem + 0.25rem)` }}
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
        <ul role="group" className={classnames({ hidden: !expanded })}>
          {item.files
            .slice()
            .sort(compareItems)
            .map((child, i) => (
              <FileTreeListItem
                key={itemName(child)}
                item={child}
                parentPath={path}
                parent={item}
                depth={depth + 1}
                index={i}
                fileTree={fileTree}
                onSelect={onSelect}
              />
            ))}
        </ul>
      )}
    </>
  )
}

type FileTreeListItemProps = {
  item: FileSystemItem
  parentPath?: string
  parent?: DirectoryItem
  depth: number
  index: number
  fileTree: FileTree.FileTree
  onSelect: (path: string) => void
}

function FileTreeListItem({
  item,
  parentPath,
  parent,
  depth,
  index,
  fileTree,
  onSelect,
}: FileTreeListItemProps): React.ReactElement {
  const path = parentPath ? `${parentPath}/${itemName(item)}` : itemName(item)

  return (
    <li
      role="treeitem"
      aria-level={depth}
      aria-setsize={parent?.files.length || 1}
      aria-posinset={index + 1}
      aria-expanded={FileTree.directoryIsExpanded(fileTree, path)}
      key={itemName(item)}
    >
      <FileTreeItem item={item} path={path} depth={depth} fileTree={fileTree} onSelect={onSelect} />
    </li>
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

export default React.memo(FileTreeView)
