import { DbOptions } from '@src/core/database'
import { DirectoryItem } from '@src/core/files'
import { Framework } from '@src/core/framework'
import { Schema } from '@src/core/schema'
import { emptyModelErrors, emptySchemaErrors } from '@src/core/validation/schema'
import { ControlsAction } from '@src/ui/components/Flyout'
import { classnames } from '@src/ui/styles/classnames'
import React from 'react'
import { UseFileTreeResult } from '../FileTree'
import Button from '../form/Button'
import CloseIcon from '../icons/Close'
import FloppyDiscIcon from '../icons/FloppyDisc'
import PencilIcon from '../icons/Pencil'
import CodeViewerControls from './CodeViewerControls'
import SchemaCodeToggle from './SchemaCodeToggle'
import { SchemaFlyoutMode, SchemaFlyoutModeType } from './types'

type SchemaFlyoutControlsProps = {
  mode: SchemaFlyoutMode
  schema: Schema
  root: DirectoryItem
  fileTree: UseFileTreeResult
  framework: Framework
  dbOptions: DbOptions
  onChangeDbOptions: (options: DbOptions) => void
  onChangeMode: (mode: SchemaFlyoutMode) => void
  onSave: () => void
}

export default function SchemaFlyoutControls({
  mode,
  schema,
  root,
  fileTree,
  framework,
  dbOptions,
  onChangeDbOptions,
  onChangeMode,
  onSave,
}: SchemaFlyoutControlsProps): React.ReactElement | null {
  if (!root || !framework) return null

  return (
    <div className={classnames('flex', 'p-2', 'items-center', 'justify-between', 'w-full')}>
      <div className={classnames('flex')}>
        <SchemaCodeToggle
          mode={mode}
          schema={schema}
          framework={framework}
          fileTree={fileTree}
          root={root}
          onChangeMode={onChangeMode}
        />
      </div>
      <div className={classnames('flex')}>
        <SchemaFlyoutControlsActions
          mode={mode}
          schema={schema}
          root={root}
          dbOptions={dbOptions}
          fileTree={fileTree}
          onChangeDbOptions={onChangeDbOptions}
          onChangeMode={onChangeMode}
          onSave={onSave}
        />
      </div>
    </div>
  )
}

type SchemaFlyoutControlsActionsProps = {
  mode: SchemaFlyoutMode
  schema: Schema
  root: DirectoryItem
  fileTree: UseFileTreeResult
  dbOptions: DbOptions
  onChangeDbOptions: (options: DbOptions) => void
  onChangeMode: (mode: SchemaFlyoutMode) => void
  onSave: () => void
}

function SchemaFlyoutControlsActions({
  mode,
  schema,
  root,
  fileTree,
  dbOptions,
  onChangeDbOptions,
  onChangeMode,
  onSave,
}: SchemaFlyoutControlsActionsProps): React.ReactElement | null {
  if (mode.type === SchemaFlyoutModeType.CODE) {
    return (
      <CodeViewerControls
        root={root}
        activeFile={fileTree.activeFile}
        dbOptions={dbOptions}
        onClickEdit={() => onChangeMode({ type: SchemaFlyoutModeType.VIEW_SCHEMA })}
        onChangeDbOptions={onChangeDbOptions}
      />
    )
  }

  if (mode.type === SchemaFlyoutModeType.VIEW_SCHEMA) {
    return (
      <ControlsAction
        onClick={() =>
          onChangeMode({
            type: SchemaFlyoutModeType.EDIT_SCHEMA,
            schema,
            errors: emptySchemaErrors,
          })
        }
      >
        <PencilIcon title="edit schema" />
      </ControlsAction>
    )
  }

  if (mode.type === SchemaFlyoutModeType.VIEW_MODEL) {
    return (
      <ControlsAction
        onClick={() =>
          onChangeMode({
            type: SchemaFlyoutModeType.EDIT_MODEL,
            model: mode.model,
            errors: emptyModelErrors,
          })
        }
      >
        <PencilIcon title="edit schema" />
      </ControlsAction>
    )
  }

  return (
    <>
      <Button
        className={classnames('hover:bg-blue-100', 'w-20', 'text-sm')}
        onClick={() =>
          mode.type === SchemaFlyoutModeType.EDIT_MODEL
            ? onChangeMode({ type: SchemaFlyoutModeType.VIEW_MODEL, model: mode.model })
            : onChangeMode({ type: SchemaFlyoutModeType.VIEW_SCHEMA })
        }
      >
        <CloseIcon size={4} />
        <span className={classnames('ml-1')}>Cancel</span>
      </Button>
      <Button
        className={classnames(
          'text-white',
          'bg-blue-600',
          'hover:bg-blue-400',
          'w-20',
          'text-sm',
          'ml-2',
        )}
        onClick={onSave}
      >
        <FloppyDiscIcon />
        <span className={classnames('ml-1')}>Save</span>
      </Button>
    </>
  )
}
