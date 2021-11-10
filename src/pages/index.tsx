import { clearData, createSchema, listSchemas, updateSchema } from '@src/api/schema'
import { emptySchema, Schema } from '@src/core/schema'
import { DemoSchemaType, getDemoSchema, isDemoSchema } from '@src/data/schemas'
import DemoSchemaButtons from '@src/ui/components/home/DemoSchemaButtons'
import MySchemaLinks from '@src/ui/components/home/MySchemaLinks'
import SchemasError from '@src/ui/components/home/SchemasError'
import SchemasZeroState from '@src/ui/components/home/SchemasZeroState/SchemasZeroState'
import Layout from '@src/ui/components/Layout'
import useAsync from '@src/ui/hooks/useAsync'
import { classnames } from '@src/ui/styles/classnames'
import dynamic from 'next/dynamic'
import React from 'react'

const SchemaFlyout = dynamic(() => import('@src/ui/components/SchemaFlyout'))

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
  const { data: schemas, error, refetch, loading } = useAsync({ getData: listSchemas })

  const handleClickCreate = async () => {
    setSchema(emptySchema())
  }

  const handleClickClearData = async () => {
    await clearData()
    refetch()
  }

  const handleChange = async (schema: Schema) => {
    const updated = await (isDemoSchema(schema) ? createSchema(schema) : updateSchema(schema))
    setSchema(updated)
    refetch()
    return updated
  }

  const handleCancel = () => {
    setSchema(undefined)
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
                onClickCreate={handleClickCreate}
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
        <SchemaFlyout
          schema={schema}
          schemas={schemas || []}
          onChange={handleChange}
          onClickClose={handleCancel}
        />
      )}
    </>
  )
}

type MySchemasProps = {
  schemas: Schema[] | undefined
  loading: boolean
  error: Error | undefined
  onClickCreate: () => void
  onSelectSchema: (schema: Schema | undefined) => void
  onClickClearData: () => void
}
function MySchemas({
  error,
  loading,
  schemas,
  onClickCreate,
  onSelectSchema,
  onClickClearData,
}: MySchemasProps): React.ReactElement | null {
  if (error) return <SchemasError onClickClearData={onClickClearData} />
  if (loading) return null
  if (!schemas?.length) return <SchemasZeroState onClickCreate={onClickCreate} />

  return (
    <MySchemaLinks
      schemas={schemas}
      onSelectSchema={onSelectSchema}
      onClickCreate={onClickCreate}
    />
  )
}

type DemoSchemasProps = {
  onSelectSchema: (schema: Schema | undefined) => void
}
function DemoSchemas({ onSelectSchema }: DemoSchemasProps): React.ReactElement {
  const handleSelectDemoSchema = (schemaType: DemoSchemaType) =>
    getDemoSchema(schemaType).then(onSelectSchema)

  return <DemoSchemaButtons onClick={handleSelectDemoSchema} />
}
