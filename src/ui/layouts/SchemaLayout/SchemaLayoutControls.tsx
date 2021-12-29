import { DbOptions } from '@src/core/database'
import * as FileTree from '@src/core/files/fileTree'
import { Schema } from '@src/core/schema'
import { isDemoSchema } from '@src/data/schemas'
import {
  backgroundColor,
  borderColor,
  borderWidth,
  classnames,
  display,
  fontWeight,
  margin,
  padding,
  position,
  textColor,
  width,
} from '@src/ui/styles/classnames'
import { flexCenterBetween } from '@src/ui/styles/utils'
import React from 'react'
import Button from '../../components/form/Button'
import IconButton from '../../components/form/IconButton'
import CloseIcon from '../../components/icons/Close'
import CloseCircleIcon from '../../components/icons/CloseCircle'
import FloppyDiscIcon from '../../components/icons/FloppyDisc'
import PencilIcon from '../../components/icons/Pencil'
import TrashIcon from '../../components/icons/Trash'
import CodeViewerControls from './CodeViewerControls'
import SchemaCodeToggle from './SchemaCodeToggle'
import { SchemaLayoutState, SchemaLayoutStateType } from './types'

type SchemaLayoutControlsProps = {
  state: SchemaLayoutState
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
  onClose: () => void
}

export default function SchemaLayoutControls({
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
  onClose,
}: SchemaLayoutControlsProps): React.ReactElement | null {
  return (
    <SchemaLayoutControlsWrapper>
      <div className={classnames(display('flex'))}>
        {!isEditing && (
          <SchemaCodeToggle
            code={state.type === SchemaLayoutStateType.CODE}
            disabled={isEditing}
            onSelectCode={onSelectCode}
            onSelectSchema={onSelectSchema}
          />
        )}
      </div>
      <div className={classnames(display('flex'))}>
        <SchemaLayoutControlsActions
          state={state}
          schema={schema}
          dbOptions={dbOptions}
          fileTree={fileTree}
          onChangeDbOptions={onChangeDbOptions}
          onEdit={onEdit}
          onDelete={onDelete}
          onCancel={onCancel}
          onSave={onSave}
          onClose={onClose}
        />
      </div>
    </SchemaLayoutControlsWrapper>
  )
}

type SchemaLayoutControlsActionsProps = {
  state: SchemaLayoutState
  schema: Schema
  fileTree: FileTree.FileTree
  dbOptions: DbOptions
  onChangeDbOptions: (options: DbOptions) => void
  onEdit: () => void
  onDelete: () => void
  onCancel: () => void
  onSave: () => void
  onClose: () => void
}

function SchemaLayoutControlsActions({
  state,
  schema,
  fileTree,
  dbOptions,
  onChangeDbOptions,
  onEdit,
  onDelete,
  onCancel,
  onSave,
  onClose,
}: SchemaLayoutControlsActionsProps): React.ReactElement | null {
  if (state.type === SchemaLayoutStateType.CODE) {
    return (
      <CodeViewerControls
        root={FileTree.rootItem(fileTree)}
        activeFile={FileTree.activeFileItem(fileTree)}
        dbOptions={dbOptions}
        onClickEdit={onEdit}
        onClickClose={onClose}
        onChangeDbOptions={onChangeDbOptions}
      />
    )
  }

  if (state.type === SchemaLayoutStateType.VIEW_SCHEMA) {
    return (
      <>
        {!isDemoSchema(schema) && (
          <IconButton
            label="delete schema"
            icon={TrashIcon}
            iconProps={{ size: 6 }}
            onClick={onDelete}
          />
        )}
        <IconButton
          label="edit schema"
          icon={PencilIcon}
          iconProps={{ size: 6 }}
          onClick={onEdit}
        />
        <IconButton
          label="close schema"
          icon={CloseCircleIcon}
          iconProps={{ size: 6 }}
          onClick={onClose}
        />
      </>
    )
  }

  if (state.type === SchemaLayoutStateType.VIEW_MODEL) {
    return (
      <>
        {!isDemoSchema(schema) && (
          <IconButton
            label="delete schema"
            icon={TrashIcon}
            iconProps={{ size: 6 }}
            onClick={onDelete}
          />
        )}
        <IconButton
          label="edit schema"
          icon={PencilIcon}
          iconProps={{ size: 6 }}
          onClick={onEdit}
        />

        <IconButton
          label="close schema"
          icon={CloseCircleIcon}
          iconProps={{ size: 6 }}
          onClick={onClose}
        />
      </>
    )
  }

  return (
    <div className={classnames(display('flex'), padding('p-1', 'pb-0.5'))}>
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
    </div>
  )
}

type SchemaLayoutControlsWrapperProps = { children: React.ReactNode }

export function SchemaLayoutControlsWrapper({
  children,
}: SchemaLayoutControlsWrapperProps): React.ReactElement {
  return (
    <div
      className={classnames(
        flexCenterBetween,
        position('relative'),
        width('w-full'),
        padding('p-1', 'pt-0'),
        margin('mt-1'),
        backgroundColor('bg-white'),
        borderColor('border-gray-900'),
        borderWidth('border-b'),
      )}
    >
      {children}
    </div>
  )
}
