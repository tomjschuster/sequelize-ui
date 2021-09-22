import { createSchema } from '@src/api/schema'
import { emptySchema } from '@src/core/schema'
import { editSchemaRoute, routeToUrl } from '@src/routing/routes'
import { useRouter } from 'next/router'
import React from 'react'
import * as Styles from './styles'

export default function SchemasZeroState(): React.ReactElement | null {
  const router = useRouter()
  const handleClickCreate = async () => {
    const schema = await createSchema(emptySchema())
    const route = editSchemaRoute(schema.id)
    router.push(routeToUrl(route))
  }
  return (
    <p className={Styles.text}>
      To get started, {/* TODO replace with link to /new */}
      <button type="button" className={Styles.createButton} onClick={handleClickCreate}>
        create a new schema
      </button>{' '}
      or select one of the demo schemas below.
    </p>
  )
}
