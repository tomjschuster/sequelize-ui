import { createSchema } from '@src/api/schema'
import { emptySchema, Schema } from '@src/core/schema'
import { goTo } from '@src/routing/navigation'
import { indexRoute, schemaRoute } from '@src/routing/routes'
import SchemaFlyout from '@src/ui/components/SchemaFlyout'
import React from 'react'

export default function SchemaPage(): React.ReactElement {
  const schema = React.useMemo(emptySchema, [])

  const handleChange = React.useCallback(async (schema: Schema) => {
    const created = await createSchema(schema)
    goTo(schemaRoute(created.id), { replace: true })
    return created
  }, [])

  const handleCancel = () => goTo(indexRoute())

  return (
    <SchemaFlyout
      schema={schema}
      schemas={[]}
      onChange={handleChange}
      onClickClose={handleCancel}
    />
  )
}
