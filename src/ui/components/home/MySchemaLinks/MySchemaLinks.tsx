import { Schema } from '@src/core/schema'
import { now, TimeGranularity, timeSince } from '@src/utils/dateTime'
import React from 'react'
import ClockIcon from '../../icons/Clock'
import CollectionIcon from '../../icons/Collection'
import PlusCircleIcon from '../../icons/Plus'
import * as Styles from './styles'

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
    <ul className={Styles.container}>
      <li>
        <NewSchemaButton onClick={onClickCreate} />
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
    <button type="button" className={Styles.schemaButton} onClick={handleClick}>
      <span className={Styles.buttonText}>{schema.name || 'Untitled'}</span>
      <span className={Styles.meta}>
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
    <span className={Styles.metaItem}>
      <span className={Styles.metaIcon}>{icon}</span>
      {children}
    </span>
  )
}

type NewSchemaButtonProps = {
  onClick: () => void
}
function NewSchemaButton({ onClick }: NewSchemaButtonProps): React.ReactElement {
  return (
    <button type="button" className={Styles.newButton} onClick={onClick}>
      <span className={Styles.newSchemaIcon}>
        <PlusCircleIcon size={6} />
      </span>
      Create a new schema
    </button>
  )
}
