import { DemoSchemaType, displayDemoSchemaType, getDemoSchemaId } from '@src/data/schemas'
import { backgroundColor, classnames, fontSize, margin } from '@src/ui/styles/classnames'
import { panelAction, panelGrid } from '@src/ui/styles/utils'
import Link from 'next/link'
import React from 'react'
import FilmIcon from '../../components/icons/Film'
import RssIcon from '../../components/icons/Rss'
import UserGroupIcon from '../../components/icons/UserGroup'

type DemoSchemaButtonsProps = {
  onMouseOver: (schemaType: DemoSchemaType) => void
}

export default function DemoSchemaButtons({
  onMouseOver,
}: DemoSchemaButtonsProps): React.ReactElement {
  return (
    <ul className={classnames(panelGrid)}>
      {Object.values(DemoSchemaType).map((schemaType) => (
        <li key={schemaType}>
          <Link href={`/?schema=${getDemoSchemaId(schemaType)}`}>
            <a
              className={classnames(
                panelAction,
                fontSize('text-sm'),
                backgroundColor('hover:bg-yellow-50'),
              )}
              onMouseOver={onMouseOver.bind(null, schemaType)}
              onTouchStartCapture={onMouseOver.bind(null, schemaType)}
            >
              <span className={classnames(margin('mr-2'))}>
                <DemoSchemaIcon schemaType={schemaType} />
              </span>
              {displayDemoSchemaType(schemaType)}
            </a>
          </Link>
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
