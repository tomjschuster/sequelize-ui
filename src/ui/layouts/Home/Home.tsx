import { clearData, createSchema, deleteSchema, listSchemas, updateSchema } from '@src/api/schema'
import { emptySchema, isNewSchema, Schema } from '@src/core/schema'
import { DemoSchemaType, getDemoSchema, getDemoSchemaType, isDemoSchema } from '@src/data/schemas'
import useAsync from '@src/ui/hooks/useAsync'
import useSetOnce from '@src/ui/hooks/useSetOnce'
import { useAlert } from '@src/ui/lib/alert'
import { classnames, margin, minHeight, padding, width } from '@src/ui/styles/classnames'
import { flexCenter, section, title } from '@src/ui/styles/utils'
import dynamic, { LoaderComponent } from 'next/dynamic'
import { useRouter } from 'next/router'
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
  const { error: alertError } = useAlert()
  const [preloaded, setPreloaded] = useSetOnce()
  const router = useRouter()

  /**
   * @TODO
   * 1. Abstract router query logic
   * 2. Handle list params
   * 3. Handle not found param
   */
  React.useEffect(() => {
    const schemaId = router.query?.schema
    if (
      typeof schemaId === 'string' &&
      schemaId !== schema?.id &&
      !(schemaId === 'new' && schema && isNewSchema(schema))
    ) {
      const demoSchemaType = getDemoSchemaType(schemaId)
      const savedSchema = demoSchemaType ? undefined : schemas?.find((s) => s.id === schemaId)

      if (demoSchemaType) {
        getDemoSchema(demoSchemaType).then(setSchema)
        return
      }

      if (savedSchema) {
        setSchema(savedSchema)
        return
      }

      if (schemaId === 'new' && (!schema || !isNewSchema(schema))) {
        setSchema(emptySchema())
        return
      }

      alertError(`Schema with id ${schemaId} not found.`)

      if (schema) {
        setSchema(undefined)
      }

      router.replace('/')
      return
    }

    if (!(typeof schemaId === 'string') && schema) {
      setSchema(undefined)
    }
  }, [schemas, schema, router, alertError])

  // @TODO make create buttons be links
  const handleClickCreate = async () => {
    router.push('/?schema=new')
  }

  const handleClickClearData = async () => {
    await clearData()
    refetch()
  }

  const handleChange = async (schema: Schema) => {
    const shouldCreate = isDemoSchema(schema) || isNewSchema(schema)
    const updated = await (shouldCreate ? createSchema(schema) : updateSchema(schema))
    setSchema(updated)
    if (shouldCreate) router.replace(`/?schema=${updated.id}`)

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
    // @TODO preserve other params
    router.push('/')
  }

  return (
    <>
      <div aria-hidden={!!schema} className={classnames(padding('p-6'))}>
        <div className={classnames(section, margin('mb-6'))}>
          <h2 className={title}>My Schemas</h2>
          <div className={classnames(flexCenter, width('w-full'), minHeight('min-h-20'))}>
            <MySchemas
              schemas={schemas}
              loading={loading}
              error={error}
              onClickCreate={handleClickCreate}
              onMouseOverSchema={setPreloaded}
              onClickClearData={handleClickClearData}
            />
          </div>
        </div>
        <div className={section}>
          <h2 className={title}>Demo Schemas</h2>
          <DemoSchemas onMouseOverSchema={setPreloaded} />
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
  onMouseOverSchema: () => void
  onClickClearData: () => void
}
function MySchemas({
  error,
  loading,
  schemas,
  onClickCreate,
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
      onMouseOverSchema={onMouseOverSchema}
      onClickCreate={onClickCreate}
    />
  )
}

type DemoSchemasProps = {
  onMouseOverSchema: () => void
}
function DemoSchemas({ onMouseOverSchema }: DemoSchemasProps): React.ReactElement {
  const handleMouseOverDemoSchema = React.useCallback(
    (schemaType: DemoSchemaType) => {
      onMouseOverSchema()
      getDemoSchema(schemaType)
    },
    [onMouseOverSchema],
  )

  return <DemoSchemaButtons onMouseOver={handleMouseOverDemoSchema} />
}
