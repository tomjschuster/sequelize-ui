import { createSchema, listSchemas } from '@src/api/schema'
import { Schema } from '@src/core/schema'
import { DemoSchemaType, displayDemoSchemaType } from '@src/data/schemas'
import Radio from '@src/ui/components/form/Radio'
import Layout from '@src/ui/components/Layout'
import useDemoSchema from '@src/ui/hooks/useDemoSchema'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const CodeViewer = dynamic(() => import('@src/ui/components/CodeViewer'))

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

function IndexPageDemoContent(): React.ReactElement {
  const router = useRouter()
  const { schema: demoSchema, type: demoSchemaType, setType: setDemoSchemaType } = useDemoSchema()

  const handleClickFork = async () => {
    if (demoSchema) {
      const schema = await createSchema(demoSchema)
      router.push(`/schema?id=${schema.id}`)
    }
  }

  const handleClose = () => setDemoSchemaType(undefined)

  return (
    <>
      <Radio
        value={demoSchemaType}
        options={DemoSchemaType}
        display={displayDemoSchemaType}
        onChange={setDemoSchemaType}
      />
      {demoSchema && <button onClick={handleClickFork}>Fork</button>}
      {demoSchema && <CodeViewer schema={demoSchema} onRequestClose={handleClose} />}
    </>
  )
}
