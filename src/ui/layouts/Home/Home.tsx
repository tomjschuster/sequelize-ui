import { clearData, createSchema, deleteSchema, listSchemas, updateSchema } from '@src/api/schema'
import { emptySchema, isNewSchema, Schema } from '@src/core/schema'
import { DemoSchemaType, getDemoSchema, isDemoSchema } from '@src/data/schemas'
import useAsync from '@src/ui/hooks/useAsync'
import useSetOnce from '@src/ui/hooks/useSetOnce'
import { classnames } from '@src/ui/styles/classnames'
import { flexCenter, largeTitle, section } from '@src/ui/styles/utils'
import dynamic, { LoaderComponent } from 'next/dynamic'
import React from 'react'
import DemoSchemaButtons from './DemoSchemaButtons'
import MySchemaLinks from './MySchemaLinks'
import SchemasError from './SchemasError'
import SchemasZeroState from './SchemasZeroState'

const SchemaFlyout = dynamic(() => import('@src/ui/components/SchemaFlyout'))

const PreloadSchemaFlyout = dynamic(
  () =>
    import('@src/ui/components/SchemaFlyout').then(
      (m) => m.SchemaFlyoutPreloads,
    ) as LoaderComponent,
)

export default function Home(): React.ReactElement {
  const [schema, setSchema] = React.useState<Schema>()
  const { data: schemas, error, refetch, loading } = useAsync({ getData: listSchemas })
  const [preloaded, setPreloaded] = useSetOnce()

  const handleClickCreate = async () => {
    setSchema(emptySchema())
  }

  const handleClickClearData = async () => {
    await clearData()
    refetch()
  }

  const handleChange = async (schema: Schema) => {
    const shouldCreate = isDemoSchema(schema) || isNewSchema(schema)
    const updated = await (shouldCreate ? createSchema(schema) : updateSchema(schema))
    setSchema(updated)

    refetch()
    return updated
  }

  const handleDelete = async () => {
    if (!schema) return
    await deleteSchema(schema.id)
    refetch()
  }

  const handleCancel = () => {
    setSchema(undefined)
  }

  return (
    <>
      <div className={classnames('p-6')}>
        <div className={classnames(section, 'mb-6')}>
          <h2 className={largeTitle}>My Schemas</h2>
          <div className={classnames(flexCenter, 'w-full', 'min-h-20')}>
            <MySchemas
              schemas={schemas}
              loading={loading}
              error={error}
              onClickCreate={handleClickCreate}
              onSelectSchema={setSchema}
              onMouseOverSchema={setPreloaded}
              onClickClearData={handleClickClearData}
            />
          </div>
        </div>
        <div className={section}>
          <h2 className={largeTitle}>Demo Schemas</h2>
          <DemoSchemas onSelectSchema={setSchema} onMouseOverSchema={setPreloaded} />
        </div>
      </div>
      {preloaded && <PreloadSchemaFlyout />}
      {schema && (
        <SchemaFlyout
          schema={schema}
          schemas={schemas || []}
          onChange={handleChange}
          onDelete={handleDelete}
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
  onMouseOverSchema: () => void
  onClickClearData: () => void
}
function MySchemas({
  error,
  loading,
  schemas,
  onClickCreate,
  onSelectSchema,
  onMouseOverSchema,
  onClickClearData,
}: MySchemasProps): React.ReactElement | null {
  if (error) return <SchemasError onClickClearData={onClickClearData} />

  if (loading) return null

  if (!schemas?.length) {
    return <SchemasZeroState onClickCreate={onClickCreate} onMouseOver={onMouseOverSchema} />
  }

  return (
    <MySchemaLinks
      schemas={schemas}
      onSelectSchema={onSelectSchema}
      onMouseOverSchema={onMouseOverSchema}
      onClickCreate={onClickCreate}
    />
  )
}

type DemoSchemasProps = {
  onSelectSchema: (schema: Schema | undefined) => void
  onMouseOverSchema: () => void
}
function DemoSchemas({ onSelectSchema, onMouseOverSchema }: DemoSchemasProps): React.ReactElement {
  const handleSelectDemoSchema = React.useCallback(
    (schemaType: DemoSchemaType) => getDemoSchema(schemaType).then(onSelectSchema),
    [onSelectSchema],
  )

  const handleMouseOverDemoSchema = React.useCallback(
    (schemaType: DemoSchemaType) => {
      onMouseOverSchema()
      getDemoSchema(schemaType)
    },
    [onMouseOverSchema],
  )

  return (
    <DemoSchemaButtons onClick={handleSelectDemoSchema} onMouseOver={handleMouseOverDemoSchema} />
  )
}
