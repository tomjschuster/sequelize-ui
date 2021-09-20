import { DemoSchemaType, displayDemoSchemaType } from '@src/data/schemas'
import { classnames } from '@src/ui/classnames'
import React from 'react'
import FilmIcon from '../../icons/Film'
import RssIcon from '../../icons/Rss'
import UserGroupIcon from '../../icons/Users'

type DemoSchemaButtonsProps = {
  onClick: (schemaType: DemoSchemaType) => void
}

export default function DemoSchemaButtons({ onClick }: DemoSchemaButtonsProps): React.ReactElement {
  return (
    <ul
      className={classnames(
        'grid',
        'md:grid-cols-3',
        'sm:grid-cols-2',
        'grid-cols-1',
        'gap-6',
        'max-w-screen-lg',
        'lg:w-5/6',
        'w-full',
        'pt-6',
      )}
    >
      {Object.values(DemoSchemaType).map((schemaType) => (
        <li key={schemaType}>
          <button
            type="button"
            className={classnames({
              'p-2': true,
              'w-full': true,
              border: true,
              'border-gray-500': true,
              'rounded-md': true,
              'flex-1': true,
              flex: true,
              'items-center': true,
              'hover:bg-green-200': true,
            })}
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
      return <RssIcon />
    case DemoSchemaType.Employee:
      return <UserGroupIcon />
    case DemoSchemaType.Sakila:
      return <FilmIcon />
    default:
      return null
  }
}
