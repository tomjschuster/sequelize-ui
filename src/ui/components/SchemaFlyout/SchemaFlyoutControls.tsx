import { DbOptions } from '@src/core/database'
import * as FileTree from '@src/core/files/fileTree'
import { Schema } from '@src/core/schema'
import { isDemoSchema } from '@src/data/schemas'
import {
  backgroundColor,
  classnames,
  display,
  fontWeight,
  margin,
  padding,
  textColor,
  width,
} from '@src/ui/styles/classnames'
import { flexCenterBetween } from '@src/ui/styles/utils'
import React from 'react'
import Button from '../form/Button'
import IconButton from '../form/IconButton'
import CloseIcon from '../icons/Close'
import FloppyDiscIcon from '../icons/FloppyDisc'
import PencilIcon from '../icons/Pencil'
import TrashIcon from '../icons/Trash'
import CodeViewerControls from './CodeViewerControls'
import SchemaCodeToggle from './SchemaCodeToggle'
import { SchemaFlyoutState, SchemaFlyoutStateType } from './types'

type SchemaFlyoutControlsProps = {
  state: SchemaFlyoutState
  schema: Schema
  isEditing: boolean
  fileTree: FileTree.FileTree
  dbOptions: DbOptions
  onSelectCode: () => void
  onSelectSchema: () => void
  onChangeDbOptions: (options: DbOptions) => void
  onEdit: () => void
  onDelete: () => void
  onCancel: () => void
  onSave: () => void
}

export default function SchemaFlyoutControls({
  state,
  schema,
  isEditing,
  fileTree,
  dbOptions,
  onSelectCode,
  onSelectSchema,
  onChangeDbOptions,
  onEdit,
  onDelete,
  onCancel,
  onSave,
}: SchemaFlyoutControlsProps): React.ReactElement | null {
  return (
    <div className={classnames(flexCenterBetween, padding('p-2'), width('w-full'))}>
      <div className={classnames(display('flex'))}>
        {!isEditing && (
          <SchemaCodeToggle
            code={state.type === SchemaFlyoutStateType.CODE}
            disabled={isEditing}
            onSelectCode={onSelectCode}
            onSelectSchema={onSelectSchema}
          />
        )}
      </div>
      <div className={classnames(display('flex'))}>
        <SchemaFlyoutControlsActions
          state={state}
          schema={schema}
          dbOptions={dbOptions}
          fileTree={fileTree}
          onChangeDbOptions={onChangeDbOptions}
          onEdit={onEdit}
          onDelete={onDelete}
          onCancel={onCancel}
          onSave={onSave}
        />
      </div>
    </div>
  )
}

type SchemaFlyoutControlsActionsProps = {
  state: SchemaFlyoutState
  schema: Schema
  fileTree: FileTree.FileTree
  dbOptions: DbOptions
  onChangeDbOptions: (options: DbOptions) => void
  onEdit: () => void
  onDelete: () => void
  onCancel: () => void
  onSave: () => void
}

function SchemaFlyoutControlsActions({
  state,
  schema,
  fileTree,
  dbOptions,
  onChangeDbOptions,
  onEdit,
  onDelete,
  onCancel,
  onSave,
}: SchemaFlyoutControlsActionsProps): React.ReactElement | null {
  if (state.type === SchemaFlyoutStateType.CODE) {
    return (
      <CodeViewerControls
        root={FileTree.rootItem(fileTree)}
        activeFile={FileTree.activeFileItem(fileTree)}
        dbOptions={dbOptions}
        onClickEdit={onEdit}
        onChangeDbOptions={onChangeDbOptions}
      />
    )
  }

  if (state.type === SchemaFlyoutStateType.VIEW_SCHEMA) {
    return (
      <>
        <IconButton
          label="edit schema"
          icon={PencilIcon}
          iconProps={{ size: 6 }}
          onClick={onEdit}
        />
        {!isDemoSchema(schema) && (
          <IconButton
            label="delete schema"
            icon={TrashIcon}
            iconProps={{ size: 6 }}
            onClick={onDelete}
          />
        )}
      </>
    )
  }

  if (state.type === SchemaFlyoutStateType.VIEW_MODEL) {
    return (
      <>
        <IconButton
          label="edit schema"
          icon={PencilIcon}
          iconProps={{ size: 6 }}
          onClick={onEdit}
        />
        {!isDemoSchema(schema) && (
          <IconButton
            label="delete schema"
            icon={TrashIcon}
            iconProps={{ size: 6 }}
            onClick={onDelete}
          />
        )}
      </>
    )
  }

  return (
    <>
      <Button
        className={classnames(width('w-16', 'md:w-20'), backgroundColor('hover:bg-blue-100'))}
        icon={CloseIcon}
        iconProps={{ size: 4 }}
        onClick={onCancel}
      >
        Cancel
      </Button>

      {!isDemoSchema(schema) && (
        <Button
          className={classnames(
            textColor('text-white'),
            fontWeight('font-bold'),
            width('w-16', 'md:w-20'),
            margin('ml-2'),
            backgroundColor('bg-pink-500', 'hover:bg-red-400'),
          )}
          icon={TrashIcon}
          onClick={onDelete}
        >
          Delete
        </Button>
      )}
      <Button
        className={classnames(
          textColor('text-white'),
          fontWeight('font-bold'),
          width('w-16', 'md:w-20'),
          margin('ml-2'),
          backgroundColor('bg-blue-600', 'hover:bg-blue-400'),
        )}
        icon={FloppyDiscIcon}
        onClick={onSave}
      >
        Save
      </Button>
    </>
  )
}
