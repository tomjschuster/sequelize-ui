import { getSchema } from '@lib/api/schema'
import CodeViewer from '@lib/components/CodeViewer'
import Layout from '@lib/components/Layout'
import ModelList from '@lib/components/ModelList'
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
      <SchemaPageContent schema={schema} error={error} />
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
  error?: string
}
function SchemaPageContent({ schema, error }: SchemaPageContentProps): React.ReactElement {
  if (error) return <p>{error}</p>
  if (schema === undefined) return <p>Loading Schemas</p>

  const [viewCode, setViewCode] = useState<boolean>(false)
  const handleClickViewCode = () => setViewCode((x) => !x)

  const root = useMemo(() => SequelizeFramework.generate({ schema, dbOptions: defaultDbOptions }), [
    schema,
  ])

  return (
    <>
      <h2>{schema.name} schema</h2>
      <button onClick={handleClickViewCode}>{viewCode ? 'Hide Code' : 'View Code'}</button>
      {viewCode && <CodeViewer cacheKey={schema.id} root={root} />}
      <h3>Model</h3>
      <ModelList schema={schema} />
    </>
  )
}

export default SchemaPage
