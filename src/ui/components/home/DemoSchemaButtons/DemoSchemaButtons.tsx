import { DemoSchemaType, displayDemoSchemaType } from '@src/data/schemas'
import React from 'react'
import FilmIcon from '../../icons/Film'
import RssIcon from '../../icons/Rss'
import UserGroupIcon from '../../icons/Users'
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
      return <RssIcon />
    case DemoSchemaType.Employee:
      return <UserGroupIcon />
    case DemoSchemaType.Sakila:
      return <FilmIcon />
    default:
      return null
  }
}
