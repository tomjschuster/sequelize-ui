import { Schema } from '@src/core/schema'
import { routeToUrl, viewSchemaRoute } from '@src/routing/routes'
import { now, TimeGranularity, timeSince } from '@src/utils/dateTime'
import Link from 'next/link'
import React from 'react'
import ClockIcon from '../../icons/Clock'
import CollectionIcon from '../../icons/Collection'
import * as Styles from './styles'

type MySchemaLinksProps = {
  schemas: Schema[]
}

export default function MySchemaLinks({ schemas }: MySchemaLinksProps): React.ReactElement {
  return (
    <ul className={Styles.containerClassName}>
      {schemas.map((schema) => (
        <li key={schema.id}>
          <MySchemaLink schema={schema} />
        </li>
      ))}
    </ul>
  )
}

type MySchemaLinkProps = {
  schema: Schema
}
function MySchemaLink({ schema }: MySchemaLinkProps): React.ReactElement {
  const modelCount = schema.models.flatMap((m) => m.associations).length

  return (
    <Link href={routeToUrl(viewSchemaRoute(schema.id))}>
      <a className={Styles.linkClassName}>
        <span className={Styles.linkTextClassName}>{schema.name}</span>
        <span className={Styles.linkMetaClassName}>
          <MySchemaLinkMetaItem icon={<CollectionIcon />}>
            {modelCount} {modelCount === 1 ? 'model' : 'models'}
          </MySchemaLinkMetaItem>
          <MySchemaLinkMetaItem icon={<ClockIcon title="last updated" />}>
            updated {timeSince(now(), schema.updatedAt, TimeGranularity.MINUTES)} ago
          </MySchemaLinkMetaItem>
        </span>
      </a>
    </Link>
  )
}

type MySchemaLinkMetaItemProps = React.PropsWithChildren<{
  icon: React.ReactNode
}>
function MySchemaLinkMetaItem({ icon, children }: MySchemaLinkMetaItemProps): React.ReactElement {
  return (
    <span className={Styles.linkMetaItemClassName}>
      <span className={Styles.linkMetaIconClassName}>{icon}</span>
      {children}
    </span>
  )
}
