import { DbOptions } from '@src/core/database'
import * as FileTree from '@src/core/files/fileTree'
import { classnames } from '@src/ui/styles/classnames'
import React from 'react'
import Button from '../form/Button'
import IconButton from '../form/IconButton'
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
      <IconButton label="edit schema" icon={PencilIcon} iconProps={{ size: 6 }} onClick={onEdit} />
    )
  }

  if (state.type === SchemaFlyoutStateType.VIEW_MODEL) {
    return (
      <IconButton label="edit schema" icon={PencilIcon} iconProps={{ size: 6 }} onClick={onEdit} />
    )
  }

  return (
    <>
      <Button
        className={classnames('hover:bg-blue-100', 'w-16', 'md:w-20')}
        icon={CloseIcon}
        iconProps={{ size: 4 }}
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        className={classnames(
          'text-white',
          'bg-blue-600',
          'hover:bg-blue-400',
          'w-16',
          'md:w-20',
          'ml-2',
          'font-bold',
        )}
        icon={FloppyDiscIcon}
        onClick={onSave}
      >
        Save
      </Button>
    </>
  )
}
