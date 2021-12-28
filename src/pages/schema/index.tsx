import { deleteSchema, getSchema, updateSchema } from '@src/api/schema'
import { Schema } from '@src/core/schema'
import { goTo } from '@src/routing/navigation'
import { indexRoute, parseSchemaId } from '@src/routing/routes'
import Flyout from '@src/ui/components/Flyout'
import SchemaFlyout from '@src/ui/components/SchemaFlyout'
import useAsync from '@src/ui/hooks/useAsync'
import { useRouter } from 'next/router'
import React from 'react'

export default function SchemaPage(): React.ReactElement {
  const [schema, setSchema] = React.useState<Schema>()
  const router = useRouter()
  // TODO: Navigate home with error message when no id
  const schemaId = parseSchemaId(router.query)

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const getData = React.useCallback(() => getSchema(schemaId!), [schemaId])

  const { refetch } = useAsync({ getData, skip: !schemaId, onLoad: setSchema })

  const handleChange = async (schema: Schema) => {
    const updated = await updateSchema(schema)
    setSchema(updated)
    refetch()
    return updated
  }

  const handleDelete = async () => {
    schema && (await deleteSchema(schema.id))
    goTo(indexRoute())
  }

  const handleCancel = () => goTo(indexRoute())

  return schema ? (
    <SchemaFlyout
      schema={schema}
      schemas={[]}
      onChange={handleChange}
      onDelete={handleDelete}
      onClickClose={handleCancel}
    />
  ) : (
    <Flyout title="" onClickClose={handleCancel} controls={<></>} />
  )
}
