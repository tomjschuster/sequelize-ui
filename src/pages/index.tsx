import { clearData, createSchema, listSchemas } from '@src/api/schema'
import { Schema } from '@src/core/schema'
import { DemoSchemaType, getDemoSchema, isDemoSchema } from '@src/data/schemas'
import { goTo } from '@src/routing/navigation'
import { viewSchemaRoute } from '@src/routing/routes'
import { classnames } from '@src/ui/classnames'
import { CodeViewerMode } from '@src/ui/components/CodeViewer/CodeViewer'
import DemoSchemaButtons from '@src/ui/components/home/DemoSchemaButtons'
import MySchemaLinks from '@src/ui/components/home/MySchemaLinks'
import SchemasError from '@src/ui/components/home/SchemasError'
import SchemasZeroState from '@src/ui/components/home/SchemasZeroState/SchemasZeroState'
import Layout from '@src/ui/components/Layout'
import useAsync from '@src/ui/hooks/useAsync'
import dynamic from 'next/dynamic'
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
  const [schema, setSchema] = React.useState<Schema>()
  const [codeViewerMode, setCodeViewerMode] = React.useState<CodeViewerMode>(CodeViewerMode.VIEW)
  const { data: schemas, error, refetch, loading } = useAsync({ getData: listSchemas })

  const handleClickClearData = async () => {
    await clearData()
    refetch()
  }

  const handleCancel = () => {
    setSchema(undefined)
    setCodeViewerMode(CodeViewerMode.VIEW)
  }

  const handleEdit = async () => {
    if (!schema) return
    if (isDemoSchema(schema)) {
      await createSchema(schema)
      refetch()
    }
    goTo(viewSchemaRoute(schema.id))
  }

  return (
    <>
      <Layout title="Home | Sequelize UI">
        <div className={classnames('p-6')}>
          <div className={classnames(sectionClassName, 'mb-6')}>
            <h2 className={sectionTitleClassName}>My Schemas</h2>
            <div className={mySchemaMinHeightContainerClassname}>
              <MySchemas
                schemas={schemas}
                loading={loading}
                error={error}
                onSelectSchema={setSchema}
                onClickClearData={handleClickClearData}
              />
            </div>
          </div>
          <div className={sectionClassName}>
            <h2 className={sectionTitleClassName}>Demo Schemas</h2>
            <DemoSchemas onSelectSchema={setSchema} />
          </div>
        </div>
      </Layout>
      {schema && (
        <CodeViewer
          schema={schema}
          onClickClose={() => setSchema(undefined)}
          onClickEdit={handleEdit}
          onClickSave={handleCancel}
          onClickCancel={handleCancel}
          mode={codeViewerMode}
        />
      )}
    </>
  )
}

type MySchemasProps = {
  schemas: Schema[] | undefined
  loading: boolean
  error: Error | undefined
  onSelectSchema: (schema: Schema | undefined) => void
  onClickClearData: () => void
}
function MySchemas({
  error,
  loading,
  schemas,
  onSelectSchema,
  onClickClearData,
}: MySchemasProps): React.ReactElement | null {
  if (error) return <SchemasError onClickClearData={onClickClearData} />
  if (loading) return null
  if (!schemas?.length) return <SchemasZeroState />
  return <MySchemaLinks schemas={schemas} onSelectSchema={onSelectSchema} />
}

type DemoSchemasProps = {
  onSelectSchema: (schema: Schema | undefined) => void
}
function DemoSchemas({ onSelectSchema }: DemoSchemasProps): React.ReactElement {
  const handleSelectDemoSchema = (schemaType: DemoSchemaType) =>
    getDemoSchema(schemaType).then(onSelectSchema)

  return <DemoSchemaButtons onClick={handleSelectDemoSchema} />
}
