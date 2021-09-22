import { clearData, createSchema, listSchemas } from '@src/api/schema'
import { Schema } from '@src/core/schema'
import { editSchemaRoute, routeToUrl } from '@src/routing/routes'
import { classnames } from '@src/ui/classnames'
import DemoSchemaButtons from '@src/ui/components/home/DemoSchemaButtons'
import MySchemaLinks from '@src/ui/components/home/MySchemaLinks'
import SchemasError from '@src/ui/components/home/SchemasError'
import SchemasZeroState from '@src/ui/components/home/SchemasZeroState/SchemasZeroState'
import Layout from '@src/ui/components/Layout'
import useDemoSchema from '@src/ui/hooks/useDemoSchema'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

const CodeViewer = dynamic(() => import('@src/ui/components/CodeViewer'))

const sectionClassName = classnames('w-full', 'flex', 'flex-col', 'items-center')
const sectionTitleClassName = classnames('text-2xl', 'mb-4')
const mySchemaMinHeightContainerClassname = classnames(
  'min-h-20',
  'flex',
  'items-center',
  'w-full',
  'justify-center',
)

export default function IndexPage(): React.ReactElement {
  return (
    <Layout title="Home | Sequelize UI">
      <div className={classnames('p-6')}>
        <div className={classnames(sectionClassName, 'mb-6')}>
          <h2 className={sectionTitleClassName}>My Schemas</h2>
          <div className={mySchemaMinHeightContainerClassname}>
            <MySchemas />
          </div>
        </div>
        <div className={sectionClassName}>
          <h2 className={sectionTitleClassName}>Demo Schemas</h2>
          <Demo />
        </div>
      </div>
    </Layout>
  )
}

function MySchemas(): React.ReactElement | null {
  const { schemas, error, reload, loading } = useLoadSchemas()

  const handleClickClearData = async () => {
    await clearData()
    reload()
  }

  if (error) return <SchemasError onClickClearData={handleClickClearData} />
  if (loading) return null
  if (schemas.length === 0) return <SchemasZeroState />
  return <MySchemaLinks schemas={schemas} />
}

function Demo(): React.ReactElement {
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
    <>
      <DemoSchemaButtons onClick={setDemoSchemaType} />
      {demoSchema && (
        <CodeViewer schema={demoSchema} onClickClose={handleClose} onClickEdit={handleEdit} />
      )}
    </>
  )
}

type UseLoadSchemasResult = {
  schemas: Schema[]
  loading: boolean
  error: string | undefined
  reload: () => void
}
function useLoadSchemas(): UseLoadSchemasResult {
  const [schemas, setSchemas] = useState<Schema[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | undefined>()

  const load = useCallback(() => {
    setLoading(true)
    setError(undefined)
    listSchemas()
      .then(setSchemas)
      .catch((e) => {
        console.error(e)
        setError(e.message || 'Sorry, something went wrong.')
      })
      .then(() => setLoading(false))
  }, [])

  useEffect(load, [])

  return { schemas, loading, error, reload: load }
}
