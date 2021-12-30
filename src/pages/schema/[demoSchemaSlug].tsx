import { createSchema } from '@src/api/schema'
import { Schema } from '@src/core/schema'
import {
  DemoSchemaType,
  displayDemoSchemaType,
  getDemoSchema,
  getDemoSchemaSlug,
  getDemoSchemaTypeBySlug,
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
    const created = await createSchema(schema, true)
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
    params: { demoSchemaSlug: getDemoSchemaSlug(type) },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps(
  context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<DemoSchemaPageProps>> {
  const slug = context.params?.demoSchemaSlug

  const demoSchemaType = typeof slug === 'string' ? getDemoSchemaTypeBySlug(slug) : undefined
  const schema = await getDemoSchema(demoSchemaType)

  return schema && demoSchemaType ? { props: { schema, demoSchemaType } } : { notFound: true }
}

export default withLayout<DemoSchemaPageProps>(({ demoSchemaType }) => {
  const name = displayDemoSchemaType(demoSchemaType)

  return {
    compact: true,
    title: `${name} sample database Sequelize code`,
    metaDescription: `A full Node.js project with TypeScript and Sequelize for the ${name} sample database. Configure for MySQL, Postgres, SQLite or SQL Server.`,
  }
})(DemoSchemaPage)
