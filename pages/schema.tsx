import { emptyModel, getSchema, updateSchema } from '@lib/api/schema'
import CodeViewer from '@lib/components/CodeViewer'
import Layout from '@lib/components/Layout'
import ModelModule from '@lib/components/ModelModule'
import SchemaModule from '@lib/components/SchemaModule'
import {
  DatabaseCaseStyle,
  DatabaseNounForm,
  DatabaseOptions,
  Model,
  Schema,
  SqlDialect,
} from '@lib/core'
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
  const handleClickViewCode = () => setViewCode((x) => !x)
  const handleClickAddModel = () =>
    onUpdate({ ...schema, models: [emptyModel(), ...schema.models] })

  const root = useMemo(() => SequelizeFramework.generate({ schema, dbOptions: defaultDbOptions }), [
    schema,
  ])

  const [editingModel, setEditingModel] = useState<Model['id'] | undefined>()
  const handleChange = async (model: Model): Promise<void> => {
    const updatedSchema = {
      ...schema,
      models: schema.models.map((m) => (m.id === model.id ? model : m)),
    }
    await onUpdate(updatedSchema)
    setEditingModel(undefined)
  }

  return (
    <>
      <button onClick={handleClickViewCode}>{viewCode ? 'Hide Code' : 'View Code'}</button>
      <SchemaModule schema={schema} onUpdate={onUpdate} />
      {viewCode && <CodeViewer cacheKey={schema.id} root={root} />}
      <h3>Models</h3>
      <button type="button" onClick={handleClickAddModel}>
        Add model
      </button>
      {schema.models.length ? (
        <ul>
          {schema.models.map((model) => (
            <ModelModule
              key={`model-module-${model.id}`}
              model={model}
              schema={schema}
              editing={editingModel === model.id}
              disabled={editingModel ? editingModel !== model.id : false}
              onRequestEdit={() => setEditingModel(model.id)}
              onRequestCancel={() => setEditingModel(undefined)}
              onChange={handleChange}
            />
          ))}
        </ul>
      ) : null}
    </>
  )
}

export default SchemaPage
