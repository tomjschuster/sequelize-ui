import { createSchema } from '@src/api/schema'
import { Schema } from '@src/core/schema'
import {
  DemoSchemaType,
  getDemoSchema,
  getDemoSchemaId,
  getDemoSchemaType,
} from '@src/data/schemas'
import { goTo } from '@src/routing/navigation'
import { indexRoute, schemaRoute } from '@src/routing/routes'
import SchemaFlyout from '@src/ui/components/SchemaFlyout'
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import React from 'react'

type DemoSchemaPageProps = {
  schema: Schema
}

export default function DemoSchemaPage({ schema }: DemoSchemaPageProps): React.ReactElement {
  const handleChange = React.useCallback(async (schema: Schema) => {
    const created = await createSchema(schema)
    goTo(schemaRoute(created.id), { replace: true })
    return created
  }, [])

  const handleCancel = () => goTo(indexRoute())

  return (
    <SchemaFlyout
      schema={schema}
      schemas={[]}
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

  return schema ? { props: { schema } } : { notFound: true }
}
