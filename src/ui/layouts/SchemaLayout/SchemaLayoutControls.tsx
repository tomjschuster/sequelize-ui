import { SchemaMeta } from '@src/api/meta'
import { DbOptions } from '@src/core/database'
import * as FileTree from '@src/core/files/fileTree'
import {
  backgroundColor,
  borderColor,
  borderWidth,
  classnames,
  display,
  fontWeight,
  margin,
  overflow,
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
  meta?: SchemaMeta
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
  meta,
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
      <div className={classnames(display('flex'), overflow('overflow-x-scroll'))}>
        <SchemaLayoutControlsActions
          state={state}
          meta={meta}
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
  meta?: SchemaMeta
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
  meta,
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
        {!meta?.isExample && (
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
        {!meta?.isExample && (
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
        size="text-xs"
        onClick={onCancel}
      >
        Cancel
      </Button>

      {!meta?.isExample && (
        <Button
          className={classnames(
            textColor('text-white'),
            fontWeight('font-bold'),
            width('w-16', 'md:w-20'),
            margin('ml-2'),
            backgroundColor('bg-red-600', 'hover:bg-red-400'),
          )}
          icon={TrashIcon}
          size="text-xs"
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
        size="text-xs"
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
