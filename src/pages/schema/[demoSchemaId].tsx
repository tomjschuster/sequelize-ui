import { createSchema } from '@src/api/schema'
import { Schema } from '@src/core/schema'
import {
  DemoSchemaType,
  displayDemoSchemaType,
  getDemoSchema,
  getDemoSchemaId,
  getDemoSchemaType,
} from '@src/data/schemas'
import { SequelizeFramework } from '@src/frameworks/sequelize'
import { goTo } from '@src/routing/navigation'
import { indexRoute, schemaRoute } from '@src/routing/routes'
import withLayout from '@src/ui/hocs/withLayout'
import SchemaLayout from '@src/ui/layouts/SchemaLayout'
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import React from 'react'

type DemoSchemaPageProps = {
  demoSchemaType: DemoSchemaType
  schema: Schema
}

function DemoSchemaPage({ schema }: DemoSchemaPageProps): React.ReactElement {
  const handleChange = React.useCallback(async (schema: Schema) => {
    const created = await createSchema(schema)
    goTo(schemaRoute(created.id), { replace: true })
    return created
  }, [])

  const handleCancel = () => goTo(indexRoute())

  return (
    <SchemaLayout
      schema={schema}
      initialFramework={SequelizeFramework}
      onChange={handleChange}
      onClickClose={handleCancel}
    />
  )
}

export function getStaticPaths(): GetStaticPathsResult {
  const paths = Object.values(DemoSchemaType).map((type) => ({
    params: { demoSchemaId: getDemoSchemaId(type) },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps(
  context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<DemoSchemaPageProps>> {
  const schemaId = context.params?.demoSchemaId

  const demoSchemaType = typeof schemaId === 'string' ? getDemoSchemaType(schemaId) : undefined
  const schema = await getDemoSchema(demoSchemaType)

  return schema && demoSchemaType ? { props: { schema, demoSchemaType } } : { notFound: true }
}

export default withLayout<DemoSchemaPageProps>(({ demoSchemaType }) => ({
  compact: true,
  title: `Example Sequelize ${displayDemoSchemaType(demoSchemaType)} code`,
  metaDescription:
    'Use Sequelize UI to quickly generate Sequelize TypeScript code online. Customize your data model and database settings, then export your Node.js project.',
}))(DemoSchemaPage)
