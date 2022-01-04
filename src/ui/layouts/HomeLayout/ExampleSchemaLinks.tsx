import { SchemaIconType, SchemaMeta } from '@src/api/meta'
import RouteLink from '@src/routing/RouteLink'
import { exampleSchemaRoute } from '@src/routing/routes'
import { backgroundColor, classnames, fontSize, margin } from '@src/ui/styles/classnames'
import { panelAction, panelGrid } from '@src/ui/styles/utils'
import React from 'react'
import FilmIcon from '../../components/icons/Film'
import RssIcon from '../../components/icons/Rss'
import UserGroupIcon from '../../components/icons/UserGroup'

type ExampleSchemaLinksProps = {
  exampleMeta: SchemaMeta[]
}

function ExampleSchemaLinks({ exampleMeta }: ExampleSchemaLinksProps): React.ReactElement {
  return (
    <ul className={classnames(panelGrid)}>
      {exampleMeta.map((meta) => {
        return (
          <li key={meta.slug}>
            <ExampleSchemaLink meta={meta} />
          </li>
        )
      })}
    </ul>
  )
}

type ExampleSchemaLinkProps = {
  meta: SchemaMeta
}

function ExampleSchemaLink({ meta }: ExampleSchemaLinkProps): React.ReactElement {
  return (
    <RouteLink
      route={exampleSchemaRoute(meta.slug)}
      prefetch={false}
      className={classnames(
        panelAction,
        fontSize('text-sm'),
        backgroundColor('hover:bg-yellow-50'),
      )}
    >
      <span className={classnames(margin('mr-2'))}>
        <ExampleSchemaIcon meta={meta} />
      </span>
      {meta.displayName}
    </RouteLink>
  )
}

function ExampleSchemaIcon({ meta: { icon } }: ExampleSchemaLinkProps): React.ReactElement {
  switch (icon) {
    case SchemaIconType.Rss:
      return <RssIcon size={6} />
    case SchemaIconType.UserGroup:
      return <UserGroupIcon size={6} />
    case SchemaIconType.Film:
      return <FilmIcon size={6} />
  }
}

export default React.memo(ExampleSchemaLinks)
