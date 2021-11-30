import { DemoSchemaType, displayDemoSchemaType } from '@src/data/schemas'
import React from 'react'
import FilmIcon from '../../icons/Film'
import RssIcon from '../../icons/Rss'
import UserGroupIcon from '../../icons/UserGroup'
import * as Styles from './styles'

type DemoSchemaButtonsProps = {
  onClick: (schemaType: DemoSchemaType) => void
}

export default function DemoSchemaButtons({ onClick }: DemoSchemaButtonsProps): React.ReactElement {
  return (
    <ul className={Styles.container}>
      {Object.values(DemoSchemaType).map((schemaType) => (
        <li key={schemaType}>
          <button
            type="button"
            className={Styles.demoSchemaButton}
            onClick={onClick.bind(null, schemaType)}
          >
            <span className={Styles.demoSchemaIcon}>
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
