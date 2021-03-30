import { getSchema, updateSchema } from '@lib/api/schema'
import CodeViewer from '@lib/components/CodeViewer'
import Layout from '@lib/components/Layout'
import ModelList from '@lib/components/ModelList'
import SchemaForm from '@lib/components/SchemaForm'
import { DatabaseCaseStyle, DatabaseNounForm, DatabaseOptions, Schema, SqlDialect } from '@lib/core'
import { SequelizeFramework } from '@lib/frameworks'
import useDidMount from '@lib/hooks/useDidMount'
import { useRouter } from 'next/router'
import { parse } from 'qs'
import React, { useEffect, useMemo, useState } from 'react'

function SchemaPage(): React.ReactElement {
  const didMount = useDidMount()
  const { push } = useRouter()
  const [schema, setSchema] = useState<Schema | undefined>()
  const [error, setError] = useState<string | undefined>()

  const handleUpdate = async (schema: Schema): Promise<void> => {
    const updatedSchema = await updateSchema(schema)
    setSchema(updatedSchema)
  }

  useEffect(() => {
    const query = parse(window.location.search.slice(1))
    if (!didMount) return

    const schemaId = query.id
    if (!schemaId || typeof schemaId !== 'string') {
      console.log('NO ID', query)
      push('/')
      return
    }

    getSchema(schemaId)
      .then((schema) => {
        if (!schema) {
          push('/')
          return
        }

        setSchema(schema)
      })
      .catch(() => setError('Sorry, something went wrong.'))
  }, [didMount])

  return (
    <Layout title="Schema | Sequelize UI">
      <SchemaPageContent schema={schema} error={error} onUpdate={handleUpdate} />
    </Layout>
  )
}

const defaultDbOptions: DatabaseOptions = {
  sqlDialect: SqlDialect.Postgres,
  caseStyle: DatabaseCaseStyle.Snake,
  nounForm: DatabaseNounForm.Singular,
  timestamps: true,
}

type SchemaPageContentProps = {
  schema?: Schema
  onUpdate: (schema: Schema) => Promise<void>
  error?: string
}
function SchemaPageContent({
  schema,
  error,
  onUpdate,
}: SchemaPageContentProps): React.ReactElement {
  if (error) return <p>{error}</p>
  if (schema === undefined) return <p>Loading Schemas</p>

  const [viewCode, setViewCode] = useState<boolean>(false)
  const [editing, setEditing] = useState<boolean>(false)
  const handleClickViewCode = () => setViewCode((x) => !x)
  const handleClickEdit = () => setEditing(true)
  const handleSubmit = async (schema: Schema): Promise<void> => {
    await onUpdate(schema)
    setEditing(false)
  }

  const root = useMemo(() => SequelizeFramework.generate({ schema, dbOptions: defaultDbOptions }), [
    schema,
  ])

  return editing ? (
    <SchemaForm schema={schema} onSubmit={handleSubmit} />
  ) : (
    <>
      <h2>{schema.name} schema</h2>
      <button onClick={handleClickViewCode}>{viewCode ? 'Hide Code' : 'View Code'}</button>
      <button onClick={handleClickEdit}>Edit</button>
      {viewCode && <CodeViewer cacheKey={schema.id} root={root} />}
      <h3>Model</h3>
      <ModelList schema={schema} />
    </>
  )
}

export default SchemaPage
