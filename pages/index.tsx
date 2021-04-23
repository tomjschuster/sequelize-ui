import { createSchema, listSchemas } from '@lib/api/schema'
import {
  DatabaseCaseStyle,
  DatabaseNounForm,
  DatabaseOptions,
  SqlDialect,
} from '@lib/core/database'
import { Schema } from '@lib/core/schema'
import { DemoSchemaType, displayDemoSchemaType, getDemoSchema } from '@lib/data/schemas'
import { SequelizeFramework } from '@lib/frameworks'
import CodeViewer from '@lib/ui/components/CodeViewer'
import DbOptionsForm from '@lib/ui/components/DbOptionsForm'
import Radio from '@lib/ui/components/form/Radio'
import Layout from '@lib/ui/components/Layout'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

function IndexPage(): React.ReactElement {
  const [schemas, setSchemas] = useState<Schema[] | undefined>()
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    listSchemas()
      .then(setSchemas)
      .catch((e) => setError(e.message || 'Sorry, something went wrong.'))
  }, [])

  return (
    <Layout title="Home | Sequelize UI">
      <IndexPageSchemaContent schemas={schemas} error={error} />
      <IndexPageDemoContent />
    </Layout>
  )
}

type IndexPageSchemaPropsContent = {
  schemas?: Schema[]
  error?: string
}
function IndexPageSchemaContent({
  schemas,
  error,
}: IndexPageSchemaPropsContent): React.ReactElement {
  if (error) return <p>{error}</p>
  if (schemas === undefined) return <p>Loading Schemas</p>
  if (schemas.length === 0) return <p>You have no schemas</p>

  return (
    <ul>
      {schemas.map((s) => (
        <li key={s.id}>
          <Link href={`/schema?id=${s.id}`}>{s.name}</Link>
        </li>
      ))}
    </ul>
  )
}

export default IndexPage

const defaultDbOptions: DatabaseOptions = {
  sqlDialect: SqlDialect.Postgres,
  caseStyle: DatabaseCaseStyle.Snake,
  nounForm: DatabaseNounForm.Singular,
  timestamps: true,
}

function IndexPageDemoContent(): React.ReactElement {
  const router = useRouter()

  const [schemaType, setSchemaType] = useState<DemoSchemaType>(DemoSchemaType.Sakila)

  const [dbOptions, setDbOptions] = useState<DatabaseOptions>(defaultDbOptions)

  const demoSchema = React.useMemo(() => getDemoSchema(schemaType), [schemaType])

  const root = React.useMemo(() => SequelizeFramework.generate({ schema: demoSchema, dbOptions }), [
    schemaType,
    dbOptions,
  ])

  const handleClickFork = async () => {
    const schema = await createSchema(demoSchema)
    router.push(`/schema?id=${schema.id}`)
  }

  return (
    <>
      <Radio
        value={schemaType}
        options={DemoSchemaType}
        display={displayDemoSchemaType}
        onChange={setSchemaType}
      />
      <button onClick={handleClickFork}>Fork</button>
      <DbOptionsForm dbOptions={dbOptions} onChange={setDbOptions} />
      <CodeViewer cacheKey={schemaType} root={root} />
    </>
  )
}
