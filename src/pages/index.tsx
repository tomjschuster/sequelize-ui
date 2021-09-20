import { createSchema, listSchemas } from '@src/api/schema'
import { Schema } from '@src/core/schema'
import { editSchemaRoute, routeToUrl } from '@src/routing/routes'
import { classnames } from '@src/ui/classnames'
import DemoSchemaButtons from '@src/ui/components/home/DemoSchemaButtons'
import MySchemaLinks from '@src/ui/components/home/MySchemaLinks'
import Layout from '@src/ui/components/Layout'
import useDemoSchema from '@src/ui/hooks/useDemoSchema'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const CodeViewer = dynamic(() => import('@src/ui/components/CodeViewer'))

const sectionClassName = classnames('w-full', 'flex', 'flex-col', 'items-center', 'p-6')
const sectionTitleClassName = classnames('text-2xl')

export default function IndexPage(): React.ReactElement {
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
    <div className={sectionClassName}>
      <h2 className={sectionTitleClassName}>My Schemas</h2>
      <MySchemaLinks schemas={schemas} />
    </div>
  )
}

function IndexPageDemoContent(): React.ReactElement {
  const router = useRouter()
  const { schema: demoSchema, setType: setDemoSchemaType } = useDemoSchema()

  const handleEdit = async () => {
    if (demoSchema) {
      const schema = await createSchema(demoSchema)
      const route = editSchemaRoute(schema.id)
      router.push(routeToUrl(route))
    }
  }

  const handleClose = () => setDemoSchemaType(undefined)

  return (
    <div className={sectionClassName}>
      <h2 className={sectionTitleClassName}>Demo Schemas</h2>
      <DemoSchemaButtons onClick={setDemoSchemaType} />
      {demoSchema && (
        <CodeViewer schema={demoSchema} onClickClose={handleClose} onClickEdit={handleEdit} />
      )}
    </div>
  )
}
