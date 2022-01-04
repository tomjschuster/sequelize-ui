import { getExampleSchemaMeta, getSchemaMetaBySlug, SchemaMeta } from '@src/api/meta'
import { createSchema, getSchema } from '@src/api/schema'
import { Schema } from '@src/core/schema'
import { SequelizeFramework } from '@src/frameworks/sequelize'
import { goTo } from '@src/routing/navigation'
import { indexRoute, schemaRoute } from '@src/routing/routes'
import withLayout from '@src/ui/hocs/withLayout'
import SchemaLayout from '@src/ui/layouts/SchemaLayout'
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import React from 'react'

type SchemaPageProps = {
  schema: Schema
  meta: SchemaMeta
}

export function SchemaPage({ schema, meta }: SchemaPageProps): React.ReactElement {
  const handleChange = React.useCallback(async (schema: Schema) => {
    const created = await createSchema(schema, true)
    goTo(schemaRoute(created.id), { replace: true })
    return created
  }, [])

  const handleCancel = () => goTo(indexRoute())

  return (
    <SchemaLayout
      schema={schema}
      meta={meta}
      initialFramework={SequelizeFramework}
      onChange={handleChange}
      onClickClose={handleCancel}
    />
  )
}

export function getStaticPaths(): GetStaticPathsResult {
  const paths = getExampleSchemaMeta().map(({ slug }) => ({ params: { slug } }))

  return { paths, fallback: false }
}

export async function getStaticProps(
  context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<SchemaPageProps>> {
  const slug = context.params?.slug as 'string'
  const meta = getSchemaMetaBySlug(slug)

  if (!meta?.isExample) {
    throw new Error('Can only statically generate example schemas')
  }

  const schema = await getSchema(meta?.schemaId)

  return { props: { schema, meta } }
}
export default withLayout<SchemaPageProps>(({ meta }) => {
  return {
    compact: true,
    title: `${meta.displayName} sample database Sequelize code`,
    metaDescription: `A full Node.js project with TypeScript and Sequelize for the ${meta.displayName} sample database. Configure for MySQL, Postgres, SQLite or SQL Server.`,
  }
})(SchemaPage)
