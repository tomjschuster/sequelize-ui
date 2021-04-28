import {
  DatabaseCaseStyle,
  DatabaseNounForm,
  DatabaseOptions,
  SqlDialect,
} from '@src/core/database'
import DbOptionsForm from '@src/ui/components/DbOptionsForm'
import Layout from '@src/ui/components/Layout'
import ModelModule from '@src/ui/components/ModelModule'
import SchemaModule from '@src/ui/components/SchemaModule'
import useSchemaState, { SchemaEditStateType } from '@src/ui/hooks/useEditSchema'
import useGeneratedCode from '@src/ui/hooks/useGeneratedCode'
import dynamic from 'next/dynamic'
import React, { useCallback, useState } from 'react'

const CodeViewer = dynamic(() => import('@src/ui/components/CodeViewer'))

function SchemaPage(): React.ReactElement {
  return (
    <Layout title="Schema | Sequelize UI">
      <SchemaPageContent />
    </Layout>
  )
}

const defaultDbOptions: DatabaseOptions = {
  sqlDialect: SqlDialect.Postgres,
  caseStyle: DatabaseCaseStyle.Snake,
  nounForm: DatabaseNounForm.Singular,
  timestamps: true,
}

function SchemaPageContent(): React.ReactElement {
  const {
    schema,
    schemas,
    editState,
    error,
    edit,
    update,
    destroy,
    addModel,
    editModel,
    updateModel,
    deleteModel,
    cancel,
  } = useSchemaState()

  const [dbOptions, setDbOptions] = useState<DatabaseOptions>(defaultDbOptions)
  const { root } = useGeneratedCode({ schema, dbOptions })
  const [viewCode, setViewCode] = useState<boolean>(false)
  const handleClickViewCode = useCallback(() => setViewCode((x) => !x), [])

  if (error) return <p>{error}</p>
  if (schema === undefined) return <p>Loading Schemas</p>

  return (
    <>
      <button onClick={handleClickViewCode}>{viewCode ? 'Hide Code' : 'View Code'}</button>
      <SchemaModule
        schema={schema}
        schemas={schemas || []}
        editing={editState.type === SchemaEditStateType.EditingSchema}
        onEdit={edit}
        onUpdate={update}
        onCancel={cancel}
      />

      <button onClick={destroy}>Delete</button>
      {viewCode && root && (
        <>
          <DbOptionsForm dbOptions={dbOptions} onChange={setDbOptions} />
          <CodeViewer cacheKey={schema.id} root={root} />
        </>
      )}
      <h3>Models</h3>
      <button type="button" onClick={addModel}>
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
                editState.type === SchemaEditStateType.EditingModel && editState.id === model.id
              }
              disabled={
                editState.type === SchemaEditStateType.EditingSchema ||
                (editState.type === SchemaEditStateType.EditingModel && editState.id !== model.id)
              }
              onRequestEdit={editModel}
              onRequestDelete={deleteModel}
              onRequestCancel={cancel}
              onChange={updateModel}
            />
          ))}
        </ul>
      ) : null}
    </>
  )
}

export default SchemaPage
