import { DemoSchemaType, displayDemoSchemaType } from '@src/data/schemas'
import RouteLink from '@src/routing/RouteLink'
import { demoSchemaRoute } from '@src/routing/routes'
import { backgroundColor, classnames, fontSize, margin } from '@src/ui/styles/classnames'
import { panelAction, panelGrid } from '@src/ui/styles/utils'
import React from 'react'
import FilmIcon from '../../components/icons/Film'
import RssIcon from '../../components/icons/Rss'
import UserGroupIcon from '../../components/icons/UserGroup'

export default function DemoSchemaButtons(): React.ReactElement {
  return (
    <ul className={classnames(panelGrid)}>
      {Object.values(DemoSchemaType).map((schemaType) => (
        <li key={schemaType}>
          <RouteLink
            route={demoSchemaRoute(schemaType)}
            className={classnames(
              panelAction,
              fontSize('text-sm'),
              backgroundColor('hover:bg-yellow-50'),
            )}
          >
            <span className={classnames(margin('mr-2'))}>
              <DemoSchemaIcon schemaType={schemaType} />
            </span>
            {displayDemoSchemaType(schemaType)}
          </RouteLink>
        </li>
      ))}
    </ul>
  )
}

function DemoSchemaIcon({ schemaType }: { schemaType: DemoSchemaType }): React.ReactElement | null {
  switch (schemaType) {
    case DemoSchemaType.Blog:
      return <RssIcon size={6} />
    case DemoSchemaType.Employee:
      return <UserGroupIcon size={6} />
    case DemoSchemaType.Sakila:
      return <FilmIcon size={6} />
    default:
      return null
  }
}
