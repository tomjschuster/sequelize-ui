import { DemoSchemaType, displayDemoSchemaType } from '@src/data/schemas'
import { classnames } from '@src/ui/styles/classnames'
import { panelAction, panelGrid } from '@src/ui/styles/utils'
import React from 'react'
import FilmIcon from '../../components/icons/Film'
import RssIcon from '../../components/icons/Rss'
import UserGroupIcon from '../../components/icons/UserGroup'

type DemoSchemaButtonsProps = {
  onClick: (schemaType: DemoSchemaType) => void
  onMouseOver: (schemaType: DemoSchemaType) => void
}

export default function DemoSchemaButtons({
  onClick,
  onMouseOver,
}: DemoSchemaButtonsProps): React.ReactElement {
  return (
    <ul className={classnames(panelGrid)}>
      {Object.values(DemoSchemaType).map((schemaType) => (
        <li key={schemaType}>
          <button
            type="button"
            className={classnames(panelAction, 'text-sm', 'hover:bg-yellow-50')}
            onClick={onClick.bind(null, schemaType)}
            onMouseOver={onMouseOver.bind(null, schemaType)}
            onTouchStartCapture={onMouseOver.bind(null, schemaType)}
          >
            <span className={classnames('mr-2')}>
              <DemoSchemaIcon schemaType={schemaType} />
            </span>
            {displayDemoSchemaType(schemaType)}
          </button>
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
