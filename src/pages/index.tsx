import { createSchema, listSchemas } from '@src/api/schema'
import {
  DatabaseCaseStyle,
  DatabaseNounForm,
  DatabaseOptions,
  SqlDialect,
} from '@src/core/database'
import { DirectoryItem } from '@src/core/files'
import { Framework } from '@src/core/framework'
import { Schema } from '@src/core/schema'
import { DemoSchemaType, displayDemoSchemaType, getDemoSchema } from '@src/data/schemas'
import CodeViewer from '@src/ui/components/CodeViewer'
import DbOptionsForm from '@src/ui/components/DbOptionsForm'
import Radio from '@src/ui/components/form/Radio'
import Layout from '@src/ui/components/Layout'
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

type DemoSchemaState = {
  type: DemoSchemaType
  schema: Schema
}

function IndexPageDemoContent(): React.ReactElement {
  const router = useRouter()
  const [demoSchema, setDemoSchema] = useState<DemoSchemaState | undefined>()
  const [dbOptions, setDbOptions] = useState<DatabaseOptions>(defaultDbOptions)
  const [framework, setFramework] = useState<Framework | undefined>()

  const root: DirectoryItem | undefined =
    demoSchema && framework?.generate({ schema: demoSchema.schema, dbOptions })

  useEffect(() => {
    import('@src/frameworks/sequelize').then(({ SequelizeFramework }) => {
      setFramework(SequelizeFramework)
    })
  }, [])

  const handleChangeSchemaType = async (type: DemoSchemaType) => {
    const schema = await getDemoSchema(type)
    setDemoSchema({ type, schema })
  }

  const handleClickFork = async () => {
    if (demoSchema) {
      const schema = await createSchema(demoSchema.schema)
      router.push(`/schema?id=${schema.id}`)
    }
  }

  return (
    <>
      <Radio
        value={demoSchema?.type}
        options={DemoSchemaType}
        display={displayDemoSchemaType}
        onChange={handleChangeSchemaType}
      />
      {demoSchema && <button onClick={handleClickFork}>Fork</button>}
      {root && <DbOptionsForm dbOptions={dbOptions} onChange={setDbOptions} />}
      {root && demoSchema && <CodeViewer cacheKey={demoSchema.type} root={root} />}
    </>
  )
}
