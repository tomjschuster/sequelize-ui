import {
  DirectoryItem,
  fileLanguage,
  FileSystemItem,
  isDirectory,
  isFile,
  itemName,
} from '@src/core/files/fileSystem'
import * as FileTree from '@src/core/files/fileTree'
import useToggle from '@src/ui/hooks/useToggle'
import {
  alignItems,
  backgroundColor,
  borderColor,
  borderWidth,
  classnames,
  cursor,
  display,
  fontSize,
  fontWeight,
  height,
  lineHeight,
  outlineStyle,
  overflow,
  TBackgroundColor,
  textColor,
  whitespace,
  width,
} from '@src/ui/styles/classnames'
import { focusById, scrollIntoViewIfNeededById } from '@src/utils/dom'
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
  const focusedPath = FileTree.focusedFilePath(fileTree)
  const { state: focused, setOn: setFocused, setOff: unsetFocused } = useToggle(true)

  React.useEffect(() => {
    if (focusedPath) {
      focusById(treeItemId(focusedPath))
      scrollIntoViewIfNeededById(treeItemLabelId(focusedPath))
    }
  }, [focusedPath])

  return (
    <ul
      role="tree"
      className={classnames(
        display('table'),
        whitespace('whitespace-nowrap'),
        overflow('overflow-auto'),
        textColor('text-gray-600', 'dark:text-gray-200'),
        backgroundColor('bg-gray-100', 'dark:bg-gray-800'),
        height('h-full'),
        width('w-full'),
      )}
      onKeyDown={onKeyDown}
      onFocus={setFocused}
      onBlur={unsetFocused}
    >
      <FileTreeListItem
        item={root}
        depth={1}
        index={1}
        fileTree={fileTree}
        focused={focused}
        onSelect={onSelect}
      />
    </ul>
  )
}

type FileTreeItemProps = {
  item: FileSystemItem
  path: string
  depth: number
  fileTree: FileTree.FileTree
  focused: boolean
  onSelect: (path: string) => void
}

function FileTreeItem({
  item,
  path,
  depth,
  fileTree,
  focused,
  onSelect,
}: FileTreeItemProps): React.ReactElement {
  const active = FileTree.isActive(fileTree, path)
  const pathFocused = FileTree.isFocused(fileTree, path)
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
        id={treeItemLabelId(path)}
        className={classnames(
          display('flex'),
          alignItems('items-center'),
          width('w-full'),
          fontSize('text-sm'),
          lineHeight('leading-relaxed'),
          cursor('cursor-pointer'),
          display('block'),
          borderColor('border-transparent', {
            'border-black': focused && pathFocused,
            'dark:border-gray-400': focused && pathFocused,
          }),
          borderWidth('border-2', { 'border-t': depth === 1 }),
          fontWeight({ 'font-semibold': active }),
          backgroundColor({
            'hover:bg-gray-200': !active,
            'bg-indigo-100': active,
            ['dark:hover:bg-gray-700' as TBackgroundColor]: !active,
            'dark:bg-indigo-900': active,
          }),
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
        <ul
          role="group"
          className={classnames(display({ hidden: !expanded, table: expanded }), width('w-full'))}
        >
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
                focused={focused}
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
  focused: boolean
  onSelect: (path: string) => void
}

function FileTreeListItem({
  item,
  parentPath,
  parent,
  depth,
  index,
  fileTree,
  focused,
  onSelect,
}: FileTreeListItemProps): React.ReactElement {
  const path = parentPath ? `${parentPath}/${itemName(item)}` : itemName(item)
  const pathFocused = FileTree.isFocused(fileTree, path)

  return (
    <li
      role="treeitem"
      id={treeItemId(path)}
      className={classnames(
        display('table-row'),
        width('w-full'),
        outlineStyle('focus:outline-none'),
      )}
      tabIndex={pathFocused ? 0 : -1}
      aria-selected={pathFocused}
      aria-level={depth}
      aria-setsize={parent?.files.length || 1}
      aria-posinset={index + 1}
      aria-expanded={FileTree.directoryIsExpanded(fileTree, path)}
      key={itemName(item)}
    >
      <FileTreeItem
        item={item}
        path={path}
        depth={depth}
        fileTree={fileTree}
        focused={focused}
        onSelect={onSelect}
      />
    </li>
  )
}

function compareItems(a: FileSystemItem, b: FileSystemItem): number {
  if (isDirectory(a) && isFile(b)) return -1
  if (isDirectory(b) && isFile(a)) return 1
  return itemName(a).localeCompare(itemName(b))
}

function treeItemId(path: string): string {
  return path.replace(/\W/g, '-')
}

function treeItemLabelId(path: string): string {
  return `${treeItemId(path)}-label`
}

export default React.memo(FileTreeView)
