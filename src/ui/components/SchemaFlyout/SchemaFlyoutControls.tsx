import { DbOptions } from '@src/core/database'
import * as FileTree from '@src/core/files/fileTree'
import { ControlsAction } from '@src/ui/components/Flyout'
import { classnames } from '@src/ui/styles/classnames'
import React from 'react'
import Button from '../form/Button'
import CloseIcon from '../icons/Close'
import FloppyDiscIcon from '../icons/FloppyDisc'
import PencilIcon from '../icons/Pencil'
import CodeViewerControls from './CodeViewerControls'
import SchemaCodeToggle from './SchemaCodeToggle'
import { SchemaFlyoutState, SchemaFlyoutStateType } from './types'

type SchemaFlyoutControlsProps = {
  state: SchemaFlyoutState
  isEditing: boolean
  fileTree: FileTree.FileTree
  dbOptions: DbOptions
  onSelectCode: () => void
  onSelectSchema: () => void
  onChangeDbOptions: (options: DbOptions) => void
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
}

export default function SchemaFlyoutControls({
  state,
  isEditing,
  fileTree,
  dbOptions,
  onSelectCode,
  onSelectSchema,
  onChangeDbOptions,
  onEdit,
  onCancel,
  onSave,
}: SchemaFlyoutControlsProps): React.ReactElement | null {
  return (
    <div className={classnames('flex', 'p-2', 'items-center', 'justify-between', 'w-full')}>
      <div className={classnames('flex')}>
        {!isEditing && (
          <SchemaCodeToggle
            code={state.type === SchemaFlyoutStateType.CODE}
            disabled={isEditing}
            onSelectCode={onSelectCode}
            onSelectSchema={onSelectSchema}
          />
        )}
      </div>
      <div className={classnames('flex')}>
        <SchemaFlyoutControlsActions
          state={state}
          dbOptions={dbOptions}
          fileTree={fileTree}
          onChangeDbOptions={onChangeDbOptions}
          onEdit={onEdit}
          onCancel={onCancel}
          onSave={onSave}
        />
      </div>
    </div>
  )
}

type SchemaFlyoutControlsActionsProps = {
  state: SchemaFlyoutState
  fileTree: FileTree.FileTree
  dbOptions: DbOptions
  onChangeDbOptions: (options: DbOptions) => void
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
}

function SchemaFlyoutControlsActions({
  state,
  fileTree,
  dbOptions,
  onChangeDbOptions,
  onEdit,
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
      <ControlsAction onClick={onEdit}>
        <PencilIcon title="edit schema" size={6} />
      </ControlsAction>
    )
  }

  if (state.type === SchemaFlyoutStateType.VIEW_MODEL) {
    return (
      <ControlsAction onClick={onEdit}>
        <PencilIcon title="edit schema" size={6} />
      </ControlsAction>
    )
  }

  return (
    <>
      <Button className={classnames('hover:bg-blue-100', 'w-16', 'md:w-20')} onClick={onCancel}>
        <CloseIcon size={4} />
        <span className={classnames('ml-1', 'text-xs')}>Cancel</span>
      </Button>
      <Button
        className={classnames(
          'text-white',
          'bg-blue-600',
          'hover:bg-blue-400',
          'w-16',
          'md:w-20',
          'ml-2',
        )}
        onClick={onSave}
      >
        <FloppyDiscIcon />
        <span className={classnames('ml-1', 'text-xs')}>Save</span>
      </Button>
    </>
  )
}
