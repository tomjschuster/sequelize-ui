import { getSchemaMetaById } from '@src/api/meta'
import schemaApi from '@src/api/schema'
import { SCHEMA_NOT_FOUND_ERROR } from '@src/api/schema/api'
import { emptySchema, isNewSchema, Schema } from '@src/core/schema'
import { goTo } from '@src/routing/navigation'
import { indexRoute, parseSchemaId } from '@src/routing/routes'
import withLayout from '@src/ui/hocs/withLayout'
import useAsync from '@src/ui/hooks/useAsync'
import SchemaLayout from '@src/ui/layouts/SchemaLayout'
import { useAlert } from '@src/ui/lib/alert'
import { useRouter } from 'next/router'
import React from 'react'

function SchemaPage(): React.ReactElement {
  const [schema, setSchema] = React.useState<Schema>(emptySchema)
  const { error } = useAlert()
  const router = useRouter()
  const schemaId = parseSchemaId(router.query)

  React.useEffect(() => {
    if (router.isReady && !schemaId) {
      goTo(indexRoute())
    }
  }, [router.isReady, schemaId])

  const meta = React.useMemo(
    () => (schemaId ? getSchemaMetaById(schemaId) || undefined : undefined),
    [schemaId],
  )

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const getData = React.useCallback(() => schemaApi.getSchema(schemaId!), [schemaId])

  const handleError = React.useCallback(
    (e: unknown) => {
      if (e instanceof Error && e.message === SCHEMA_NOT_FOUND_ERROR) {
        error(`Schema with id "${schemaId}" not found.`, { ttl: 6000 })
        goTo(indexRoute())
      }
    },
    [schemaId, error],
  )

  const { refetch } = useAsync({
    getData,
    skip: !schemaId,
    onLoad: setSchema,
    onError: handleError,
  })

  const handleChange = async (schema: Schema) => {
    if (isNewSchema(schema)) return schema
    const updated = await schemaApi.updateSchema(schema)
    setSchema(updated)
    refetch()
    return updated
  }

  const handleDelete = async () => {
    if (isNewSchema(schema)) return
    schema && (await schemaApi.deleteSchema(schema.id))
    goTo(indexRoute())
  }

  const handleCancel = () => goTo(indexRoute())

  return (
    <SchemaLayout
      schema={schema}
      meta={meta}
      onChange={handleChange}
      onDelete={handleDelete}
      onClickClose={handleCancel}
    />
  )
}

export default withLayout(() => ({
  compact: true,
  title: 'Sequelize UI | Schema',
  metaDescription:
    'A full Node.js project with TypeScript and Sequelize. Configure for MySQL, Postgres, SQLite or SQL Server.',
}))(SchemaPage)
