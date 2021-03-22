import { getSchema } from '@lib/api/schema'
import CodeViewer from '@lib/components/CodeViewer'
import Layout from '@lib/components/Layout'
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

  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({})
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
      <ul className="p-4 border-solid ">
        {schema.models.map((m, i) => (
          <li
            onClick={() => setExpanded((x) => ({ ...x, [m.id]: !x[m.id] }))}
            key={m.name}
            className={`p-2 border-solid border-black border ${i === 0 ? '' : ' border-t-0'}`}
          >
            {m.name}
            {expanded[m.id] && (
              <ul className="list-disc pl-8 ">
                {m.fields.map((f) => (
                  <li key={f.name}>{f.name}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}

export default SchemaPage
