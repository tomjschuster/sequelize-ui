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
import usePrevious from '@lib/hooks/usePrevious'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'

type SchemaPageEditState =
  | { type: SchemaPageEditStateType.NotEditing }
  | { type: SchemaPageEditStateType.EditingSchema }
  | { type: SchemaPageEditStateType.EditingModel; id: Model['id'] }

enum SchemaPageEditStateType {
  NotEditing = 'NOT_EDITING',
  EditingSchema = 'EDITING_SCHEMA',
  EditingModel = 'EDITING_MODEL',
}

function SchemaPage(): React.ReactElement {
  const { push, replace, isReady, query } = useRouter()
  const [schema, setSchema] = useState<Schema | undefined>()
  const [error, setError] = useState<string | undefined>()
  const [editState, setEditState] = useState<SchemaPageEditState>({
    type: SchemaPageEditStateType.NotEditing,
  })

  const prevEditState = usePrevious(editState)
  const prevQuery = usePrevious(query)

  const handleUpdate = async (schema: Schema): Promise<void> => {
    const updatedSchema = await updateSchema(schema)
    setSchema(updatedSchema)
    setEditState({ type: SchemaPageEditStateType.NotEditing })
  }

  const handleEditSchema = () => setEditState({ type: SchemaPageEditStateType.EditingSchema })

  const handleEditModel = (id: Model['id']) =>
    setEditState({ type: SchemaPageEditStateType.EditingModel, id })

  const handleCancelEdit = () => setEditState({ type: SchemaPageEditStateType.NotEditing })

  useEffect(() => {
    if (!isReady) return

    if (typeof query.id !== 'string') {
      replace('/')
      return
    }

    if (!schema?.id) {
      getSchema(query.id)
        .then((schema) => {
          if (!schema) {
            replace('/')
            return
          }

          setSchema(schema)
        })
        .catch(() => setError('Sorry, something went wrong.'))
      return
    }

    if (
      prevEditState &&
      prevEditState.type !== SchemaPageEditStateType.NotEditing &&
      editState.type === SchemaPageEditStateType.NotEditing
    ) {
      push(`/schema?id=${schema.id}`, undefined, { shallow: true })
      return
    }

    if (
      !query.editingSchema &&
      !query.editingModel &&
      (prevQuery?.editingSchema || prevQuery?.editingModel)
    ) {
      setEditState({ type: SchemaPageEditStateType.NotEditing })
      return
    }

    if (
      prevEditState?.type !== SchemaPageEditStateType.EditingSchema &&
      editState.type === SchemaPageEditStateType.EditingSchema &&
      query.editingSchema !== '1'
    ) {
      push(`/schema?id=${schema.id}&editingSchema=1`, undefined, { shallow: true })
      return
    }

    if (editState.type !== SchemaPageEditStateType.EditingSchema && query.editingSchema === '1') {
      setEditState({ type: SchemaPageEditStateType.EditingSchema })
      return
    }
    if (
      prevEditState?.type !== SchemaPageEditStateType.EditingModel &&
      editState.type === SchemaPageEditStateType.EditingModel &&
      typeof query.editingModel !== 'string'
    ) {
      push(`/schema?id=${schema.id}&editingModel=${editState.id}`, undefined, { shallow: true })
      return
    }
    if (
      editState.type !== SchemaPageEditStateType.EditingModel &&
      typeof query.editingModel === 'string'
    ) {
      setEditState({ type: SchemaPageEditStateType.EditingModel, id: query.editingModel })
      return
    }
  }, [push, isReady, query, prevQuery, editState, prevEditState, schema?.id])

  return (
    <Layout title="Schema | Sequelize UI">
      <SchemaPageContent
        schema={schema}
        editState={editState}
        error={error}
        onEditSchema={handleEditSchema}
        onEditModel={handleEditModel}
        onUpdate={handleUpdate}
        onCancel={handleCancelEdit}
      />
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
  editState: SchemaPageEditState
  error?: string
  onEditSchema: () => void
  onEditModel: (id: Model['id']) => void
  onUpdate: (schema: Schema) => Promise<void>
  onCancel: () => void
}
function SchemaPageContent({
  schema,
  editState,
  error,
  onEditSchema,
  onEditModel,
  onUpdate,
  onCancel,
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

  const handleChange = async (model: Model): Promise<void> => {
    const updatedSchema = {
      ...schema,
      models: schema.models.map((m) => (m.id === model.id ? model : m)),
    }
    await onUpdate(updatedSchema)
  }

  return (
    <>
      <button onClick={handleClickViewCode}>{viewCode ? 'Hide Code' : 'View Code'}</button>
      <SchemaModule
        schema={schema}
        editing={editState.type === SchemaPageEditStateType.EditingSchema}
        onEdit={onEditSchema}
        onUpdate={onUpdate}
        onCancel={onCancel}
      />
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
              editing={
                editState.type === SchemaPageEditStateType.EditingModel && editState.id === model.id
              }
              disabled={
                editState.type === SchemaPageEditStateType.EditingSchema ||
                (editState.type === SchemaPageEditStateType.EditingModel &&
                  editState.id !== model.id)
              }
              onRequestEdit={onEditModel}
              onRequestCancel={onCancel}
              onChange={handleChange}
            />
          ))}
        </ul>
      ) : null}
    </>
  )
}

export default SchemaPage
