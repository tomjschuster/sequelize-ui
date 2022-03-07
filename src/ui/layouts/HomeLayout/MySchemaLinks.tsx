import { Schema } from '@src/core/schema'
import { PanelLink } from '@src/ui/components/form/PanelButton'
import RouteLink from '@src/ui/routing/RouteLink'
import { newSchemaRoute, schemaRoute } from '@src/ui/routing/routes'
import {
  alignItems,
  backgroundColor,
  classnames,
  display,
  flexDirection,
  flexWrap,
  fontSize,
  fontWeight,
  height,
  inset,
  margin,
  minHeight,
  outlineStyle,
  overflow,
  position,
  textOverflow,
  toClassname,
  width,
} from '@src/ui/styles/classnames'
import { breakWords, flexCenter, panelAction, panelGrid } from '@src/ui/styles/utils'
import { now, TimeGranularity, timeSince } from '@src/utils/dateTime'
import React from 'react'
import ClockIcon from '../../components/icons/Clock'
import CollectionIcon from '../../components/icons/Collection'
import PlusCircleIcon from '../../components/icons/Plus'

type MySchemaLinksProps = {
  schemas: Schema[]
}

export default function MySchemaLinks({ schemas }: MySchemaLinksProps): React.ReactElement {
  return (
    <ul className={panelGrid}>
      <li>
        <PanelLink
          route={newSchemaRoute()}
          label="Create a new schema"
          className={classnames(
            backgroundColor('hover:bg-green-50', toClassname('hover:dark:bg-green-900')),
          )}
          icon={PlusCircleIcon}
          iconProps={{ size: 6 }}
        />
      </li>
      {schemas
        .slice()
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .map((schema) => (
          <li key={schema.id}>
            <MySchemaButton schema={schema} />
          </li>
        ))}
    </ul>
  )
}

type MySchemaButtonProps = {
  schema: Schema
}
function MySchemaButton({ schema }: MySchemaButtonProps): React.ReactElement {
  const modelCount = schema.models.length

  return (
    <div
      className={classnames(
        panelAction,
        flexCenter,
        outlineStyle('focus-within:outline'),
        flexWrap('flex-wrap'),
        position('relative'),
        fontSize('text-sm'),
        minHeight('min-h-20'),
        height('h-full'),
        backgroundColor('hover:bg-indigo-50', toClassname('hover:dark:bg-indigo-900')),
      )}
    >
      <h3 className={classnames(breakWords)}>
        <RouteLink
          route={schemaRoute(schema.id)}
          prefetch={false}
          className={classnames(
            fontWeight('font-bold'),
            overflow('overflow-hidden'),
            textOverflow('text-ellipsis'),
            width('w-full'),
            margin('mb-2'),
            position('after:absolute'),
            inset('after:top-0', 'after:bottom-0', 'after:left-0', 'after:right-0'),
            outlineStyle('outline-none'),
          )}
        >
          {schema.name || 'Untitled'}
        </RouteLink>
      </h3>
      <span className={classnames(display('flex'), flexDirection('flex-col'), width('w-full'))}>
        <MySchemaLinksMetaItem icon={<CollectionIcon size={3} />}>
          {modelCount} {modelCount === 1 ? 'model' : 'models'}
        </MySchemaLinksMetaItem>
        <MySchemaLinksMetaItem icon={<ClockIcon size={3} />}>
          {schema.createdAt === schema.updatedAt ? 'created' : 'updated'}{' '}
          {timeSince(now(), schema.updatedAt, TimeGranularity.MINUTES)} ago
        </MySchemaLinksMetaItem>
      </span>
    </div>
  )
}

type MySchemaLinksMetaItemProps = React.PropsWithChildren<{
  icon: React.ReactNode
}>
function MySchemaLinksMetaItem({ icon, children }: MySchemaLinksMetaItemProps): React.ReactElement {
  return (
    <span className={classnames(display('flex'), alignItems('items-center'), fontSize('text-xs'))}>
      <span className={classnames(margin('mr-1'))}>{icon}</span>
      {children}
    </span>
  )
}
