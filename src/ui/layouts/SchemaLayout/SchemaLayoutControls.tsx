import { SchemaMeta } from '@src/api/meta'
import { DbOptions } from '@src/core/database'
import * as FileTree from '@src/core/files/fileTree'
import ArrowLeftIcon from '@src/ui/components/icons/ArrowLeft'
import ActionMenu from '@src/ui/components/menus/ActionMenu'
import {
  backgroundColor,
  borderColor,
  borderWidth,
  classnames,
  display,
  flex,
  fontWeight,
  justifyContent,
  margin,
  padding,
  position,
  width,
  zIndex,
} from '@src/ui/styles/classnames'
import { flexCenterBetween } from '@src/ui/styles/utils'
import React from 'react'
import Button from '../../components/form/Button'
import IconButton from '../../components/form/IconButton'
import CloseIcon from '../../components/icons/Close'
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
      <div className={classnames(display('flex'), flex('flex-1'), justifyContent('justify-end'))}>
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

const iconButtonMargin = margin('mr-1.5')

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
        <IconButton
          className={classnames(iconButtonMargin, display('hidden', '2xs:inline-block'))}
          label="close schema"
          icon={ArrowLeftIcon}
          iconProps={{ size: 6 }}
          onClick={onClose}
        />
        {!meta?.isExample && (
          <IconButton
            className={classnames(iconButtonMargin, display('hidden', '2xs:inline-block'))}
            label="delete schema"
            icon={TrashIcon}
            iconProps={{ size: 6 }}
            onClick={onDelete}
          />
        )}
        <IconButton
          className={classnames(iconButtonMargin, display('hidden', '2xs:inline-block'))}
          label="edit schema"
          icon={PencilIcon}
          iconProps={{ size: 6 }}
          onClick={onEdit}
        />
        <ActionMenu
          className={classnames(iconButtonMargin, display('2xs:hidden', 'inline-block'))}
          items={[
            {
              label: 'Go back',
              icon: ArrowLeftIcon,
              iconProps: { size: 5 },
              onClick: onClose,
            },
            {
              label: 'Edit',
              icon: PencilIcon,
              iconProps: { size: 5 },
              onClick: onEdit,
            },
            {
              label: 'Delete',
              icon: TrashIcon,
              iconProps: { size: 5 },
              hidden: !!meta?.isExample,
              onClick: onDelete,
            },
          ]}
        />
      </>
    )
  }

  if (state.type === SchemaLayoutStateType.VIEW_MODEL) {
    return (
      <>
        <IconButton
          className={classnames(iconButtonMargin, display('hidden', '2xs:inline-block'))}
          label="close model"
          icon={ArrowLeftIcon}
          iconProps={{ size: 6 }}
          onClick={onClose}
        />
        {!meta?.isExample && (
          <IconButton
            className={classnames(iconButtonMargin, display('hidden', '2xs:inline-block'))}
            label="delete model"
            icon={TrashIcon}
            iconProps={{ size: 6 }}
            onClick={onDelete}
          />
        )}
        <IconButton
          className={classnames(iconButtonMargin, display('hidden', '2xs:inline-block'))}
          label="edit model"
          icon={PencilIcon}
          iconProps={{ size: 6 }}
          onClick={onEdit}
        />
        <ActionMenu
          className={classnames(iconButtonMargin, display('2xs:hidden', 'inline-block'))}
          items={[
            {
              label: 'Go back',
              icon: ArrowLeftIcon,
              iconProps: { size: 5 },
              onClick: onClose,
            },
            {
              label: 'Edit',
              icon: PencilIcon,
              iconProps: { size: 5 },
              onClick: onEdit,
            },
            {
              label: 'Delete',
              icon: TrashIcon,
              iconProps: { size: 5 },
              hidden: !!meta?.isExample,
              onClick: onDelete,
            },
          ]}
        />
      </>
    )
  }

  return (
    <div
      className={classnames(
        display('flex'),
        flex('flex-1'),
        justifyContent('justify-evenly', '2xs:justify-end'),
        padding('p-1'),
      )}
    >
      <Button
        className={classnames(width('w-16', 'xs:w-20'))}
        icon={CloseIcon}
        iconProps={{ size: 4 }}
        size="text-xs"
        onClick={onCancel}
      >
        Cancel
      </Button>

      {!meta?.isExample && (
        <Button
          color="red"
          className={classnames(
            fontWeight('font-bold'),
            width('w-16', 'xs:w-20'),
            margin('2xs:ml-4'),
          )}
          icon={TrashIcon}
          size="text-xs"
          onClick={onDelete}
        >
          Delete
        </Button>
      )}
      <Button
        color="blue"
        className={classnames(
          fontWeight('font-bold'),
          width('w-16', 'xs:w-20'),
          margin('2xs:ml-4'),
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
        padding('p-0.5'),
        backgroundColor('bg-white', 'dark:bg-gray-800'),
        borderColor('border-gray-900', 'dark:border-gray-500'),
        borderWidth('border-b'),
        zIndex('z-10'),
      )}
    >
      {children}
    </div>
  )
}
