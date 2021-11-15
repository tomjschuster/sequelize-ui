import { DirectoryItem } from '@src/core/files'
import { Framework } from '@src/core/framework'
import { Schema } from '@src/core/schema'
import { classnames } from '@src/ui/styles/classnames'
import React from 'react'
import { UseFileTreeResult } from '../FileTree'
import Toggle from '../form/Toggle'
import CodeIcon from '../icons/Code'
import CubeIcon from '../icons/Cube'
import { SchemaFlyoutMode, SchemaFlyoutModeType } from './types'

type SchemaCodeToggleProps = {
  mode: SchemaFlyoutMode
  fileTree: UseFileTreeResult
  root: DirectoryItem
  framework: Framework
  schema: Schema
  onChangeMode: (mode: SchemaFlyoutMode) => void
}
export default function SchemaCodeToggle({
  schema,
  framework,
  fileTree,
  root,
  mode,
  onChangeMode,
}: SchemaCodeToggleProps): React.ReactElement | null {
  const isEditing = [SchemaFlyoutModeType.EDIT_MODEL, SchemaFlyoutModeType.EDIT_SCHEMA].includes(
    mode.type,
  )

  const handleViewSchema = React.useCallback(() => {
    const path = fileTree.activeFile?.path
    const model = path && framework.modelFromPath(path, schema)

    const mode: SchemaFlyoutMode = model
      ? { type: SchemaFlyoutModeType.VIEW_MODEL, model }
      : { type: SchemaFlyoutModeType.VIEW_SCHEMA }

    onChangeMode(mode)
  }, [fileTree, framework, schema, onChangeMode])

  const handleViewCode = React.useCallback(() => {
    const path =
      mode.type === SchemaFlyoutModeType.VIEW_MODEL &&
      root &&
      framework &&
      framework.defaultModelFile &&
      framework.defaultModelFile(mode.model, root)

    if (path) fileTree.selectItem(path)

    onChangeMode({ type: SchemaFlyoutModeType.CODE })
  }, [mode, root, framework, fileTree, onChangeMode])

  return (
    <Toggle
      value={mode.type === SchemaFlyoutModeType.CODE}
      options={{ code: true, schema: false }}
      disabled={() => isEditing}
      display={(v) =>
        v ? (
          <span className={classnames('flex', 'items-center', 'justify-center', 'w-16')}>
            <CodeIcon />
            <span className={classnames('ml-1')}>Code</span>
          </span>
        ) : (
          <span className={classnames('flex', 'items-center', 'justify-center', 'w-16')}>
            <CubeIcon />
            <span className={classnames('ml-1')}>Schema</span>
          </span>
        )
      }
      onChange={(v) => (v ? handleViewCode() : handleViewSchema())}
    />
  )
}
