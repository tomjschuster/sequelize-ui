import RouteLink from '@src/routing/RouteLink'
import { newSchemaRoute } from '@src/routing/routes'
import {
  backgroundColor,
  classnames,
  fontSize,
  fontWeight,
  lineHeight,
} from '@src/ui/styles/classnames'
import { inlineButton } from '@src/ui/styles/utils'
import React from 'react'

export default function SchemasZeroState(): React.ReactElement | null {
  return (
    <p className={classnames(fontSize('text-lg'), lineHeight('leading-loose'))}>
      To get started,{' '}
      <RouteLink
        route={newSchemaRoute()}
        className={classnames(
          inlineButton(),
          fontSize('text-sm'),
          fontWeight('font-bold'),
          backgroundColor('hover:bg-green-100'),
        )}
      >
        create a new schema
      </RouteLink>{' '}
      or select one of the example schemas below.
    </p>
  )
}
