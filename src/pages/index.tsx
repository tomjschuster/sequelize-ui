import { clearData, createSchema, listSchemas } from '@src/api/schema'
import { DemoSchemaType, getDemoSchema } from '@src/data/schemas'
import { editSchemaRoute, routeToUrl } from '@src/routing/routes'
import { classnames } from '@src/ui/classnames'
import DemoSchemaButtons from '@src/ui/components/home/DemoSchemaButtons'
import MySchemaLinks from '@src/ui/components/home/MySchemaLinks'
import SchemasError from '@src/ui/components/home/SchemasError'
import SchemasZeroState from '@src/ui/components/home/SchemasZeroState/SchemasZeroState'
import Layout from '@src/ui/components/Layout'
import useAsync from '@src/ui/hooks/useAsync'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React from 'react'

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
          <DemoSchemas />
        </div>
      </div>
    </Layout>
  )
}
function MySchemas(): React.ReactElement | null {
  const { data: schemas, error, refetch, loading } = useAsync({ getData: listSchemas })

  const handleClickClearData = async () => {
    await clearData()
    refetch()
  }

  if (error) return <SchemasError onClickClearData={handleClickClearData} />
  if (loading) return null
  if (!schemas?.length) return <SchemasZeroState />
  return <MySchemaLinks schemas={schemas} />
}

function DemoSchemas(): React.ReactElement {
  const router = useRouter()
  const [demoSchemaType, setDemoSchemaType] = React.useState<DemoSchemaType>()
  const { data: demoSchema } = useAsync({ getData: getDemoSchema, variables: demoSchemaType })

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
