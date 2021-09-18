import { createSchema, listSchemas } from '@src/api/schema'
import { Schema } from '@src/core/schema'
import { DemoSchemaType, displayDemoSchemaType } from '@src/data/schemas'
import { editSchemaRoute, routeToUrl } from '@src/routing/routes'
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
    <div className="w-full flex flex-col items-center ">
      <h2 className="text-lg">Your Schemas</h2>
      <ul className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {schemas.map((s) => (
          <li key={s.id}>
            <Link href={`/schema?id=${s.id}`}>
              <a className="text-sm p-4 border border-black rounded h-24 w-48 flex items-center break-words break-all justify-center">
                {s.name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default IndexPage

function IndexPageDemoContent(): React.ReactElement {
  const router = useRouter()
  const { schema: demoSchema, type: demoSchemaType, setType: setDemoSchemaType } = useDemoSchema()

  const handleEdit = async () => {
    if (demoSchema) {
      const schema = await createSchema(demoSchema)
      const route = editSchemaRoute(schema.id)
      router.push(routeToUrl(route))
    }
  }

  const handleClose = () => setDemoSchemaType(undefined)

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-lg">Demo Schemas</h2>
      <Radio
        value={demoSchemaType}
        options={DemoSchemaType}
        display={displayDemoSchemaType}
        onChange={setDemoSchemaType}
      />
      {demoSchema && (
        <CodeViewer schema={demoSchema} onClickClose={handleClose} onClickEdit={handleEdit} />
      )}
    </div>
  )
}
