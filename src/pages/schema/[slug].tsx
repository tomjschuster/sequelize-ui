import { getExampleSchemaMeta, getSchemaMetaBySlug, SchemaMeta } from '@src/api/meta'
import schemaApi from '@src/api/schema'
import userPreferencesApi from '@src/api/userPreferences'
import { DbOptions, defaultDbOptions } from '@src/core/database'
import { Schema } from '@src/core/schema'
import { SequelizeFramework } from '@src/frameworks/sequelize'
import withLayout from '@src/ui/hocs/withLayout'
import useAsync from '@src/ui/hooks/useAsync'
import SchemaLayout from '@src/ui/layouts/SchemaLayout'
import { goTo } from '@src/ui/routing/navigation'
import { indexRoute, schemaRoute } from '@src/ui/routing/routes'
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import React from 'react'

type SchemaPageProps = {
  schema: Schema
  meta: SchemaMeta
}

export function SchemaPage({ schema, meta }: SchemaPageProps): React.ReactElement {
  const { data: dbOptions, refetch } = useAsync({ getData: userPreferencesApi.getDefaultDbOptions })

  const handleChangeDbOptions = React.useCallback(
    async (dbOptions: DbOptions) => {
      const updated = await userPreferencesApi.updateDefaultDbOptions(dbOptions)
      await refetch()
      return updated
    },
    [refetch],
  )

  const handleChangeSchema = React.useCallback(async (schema: Schema) => {
    const created = await schemaApi.createSchema(schema, true)
    goTo(schemaRoute(created.id), { replace: true })
    return created
  }, [])

  const handleCancel = () => goTo(indexRoute())

  return (
    <SchemaLayout
      schema={schema}
      meta={meta}
      dbOptions={dbOptions || defaultDbOptions}
      initialFramework={SequelizeFramework}
      onChangeSchema={handleChangeSchema}
      onChangeDbOptions={handleChangeDbOptions}
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

  const schema = await schemaApi.getSchema(meta?.schemaId)

  return { props: { schema, meta } }
}
export default withLayout<SchemaPageProps>(({ meta }) => {
  return {
    compact: true,
    title: `${meta.displayName} sample database Sequelize code | Sequelize UI`,
    metaDescription: `A full Node.js project with TypeScript and Sequelize for the ${meta.displayName} sample database. Configure for MySQL, Postgres, SQLite or SQL Server.`,
  }
})(SchemaPage)
