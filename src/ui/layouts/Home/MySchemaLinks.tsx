import { Schema } from '@src/core/schema'
import PanelButton from '@src/ui/components/form/PanelButton'
import { classnames } from '@src/ui/styles/classnames'
import { panelAction, panelGrid } from '@src/ui/styles/utils'
import { now, TimeGranularity, timeSince } from '@src/utils/dateTime'
import React from 'react'
import ClockIcon from '../../components/icons/Clock'
import CollectionIcon from '../../components/icons/Collection'
import PlusCircleIcon from '../../components/icons/Plus'

type MySchemaButtonsProps = {
  schemas: Schema[]
  onClickCreate: () => void
  onSelectSchema: (schema: Schema) => void
}

export default function MySchemaButtons({
  schemas,
  onClickCreate,
  onSelectSchema,
}: MySchemaButtonsProps): React.ReactElement {
  return (
    <ul className={panelGrid}>
      <li>
        <PanelButton
          label="Create a new schema"
          className={classnames('hover:bg-green-50')}
          icon={PlusCircleIcon}
          iconProps={{ size: 6 }}
          onClick={onClickCreate}
        />
      </li>
      {schemas
        .slice()
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .map((schema) => (
          <li key={schema.id}>
            <MySchemaButton schema={schema} onClick={onSelectSchema} />
          </li>
        ))}
    </ul>
  )
}

type MySchemaButtonProps = {
  schema: Schema
  onClick: (schema: Schema) => void
}
function MySchemaButton({ schema, onClick }: MySchemaButtonProps): React.ReactElement {
  const modelCount = schema.models.length
  const handleClick = React.useCallback(() => onClick(schema), [onClick, schema])

  return (
    <button
      type="button"
      className={classnames(
        panelAction,
        'flex-wrap',
        'text-sm',
        'min-h-20',
        'h-full',
        'hover:bg-indigo-50',
      )}
      onClick={handleClick}
    >
      <span
        className={classnames(
          'font-bold',
          'overflow-ellipsis',
          'overflow-hidden',
          'w-full',
          'mb-2',
        )}
      >
        {schema.name || 'Untitled'}
      </span>
      <span className={classnames('flex', 'flex-col', 'w-full')}>
        <MySchemaButtonsMetaItem icon={<CollectionIcon size={3} />}>
          {modelCount} {modelCount === 1 ? 'model' : 'models'}
        </MySchemaButtonsMetaItem>
        <MySchemaButtonsMetaItem icon={<ClockIcon title="last updated" size={3} />}>
          {schema.createdAt === schema.updatedAt ? 'created' : 'updated'}{' '}
          {timeSince(now(), schema.updatedAt, TimeGranularity.MINUTES)} ago
        </MySchemaButtonsMetaItem>
      </span>
    </button>
  )
}

type MySchemaButtonsMetaItemProps = React.PropsWithChildren<{
  icon: React.ReactNode
}>
function MySchemaButtonsMetaItem({
  icon,
  children,
}: MySchemaButtonsMetaItemProps): React.ReactElement {
  return (
    <span className={classnames('flex', 'items-center', 'text-xs')}>
      <span className={classnames('mr-1')}>{icon}</span>
      {children}
    </span>
  )
}
