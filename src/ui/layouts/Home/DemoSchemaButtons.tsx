import { DemoSchemaType, displayDemoSchemaType } from '@src/data/schemas'
import { classnames } from '@src/ui/styles/classnames'
import { button, buttonGrid } from '@src/ui/styles/utils'
import React from 'react'
import FilmIcon from '../../components/icons/Film'
import RssIcon from '../../components/icons/Rss'
import UserGroupIcon from '../../components/icons/UserGroup'

type DemoSchemaButtonsProps = {
  onClick: (schemaType: DemoSchemaType) => void
}

export default function DemoSchemaButtons({ onClick }: DemoSchemaButtonsProps): React.ReactElement {
  return (
    <ul className={classnames(buttonGrid)}>
      {Object.values(DemoSchemaType).map((schemaType) => (
        <li key={schemaType}>
          <button
            type="button"
            className={classnames(button, 'bg-white', 'hover:bg-yellow-50')}
            onClick={onClick.bind(null, schemaType)}
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
