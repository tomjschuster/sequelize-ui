import CodeViewer from '@lib/components/CodeViewer'
import DemoSchemaSelector from '@lib/components/DemoSchemaSelector'
import Layout from '@lib/components/Layout'
import { DatabaseOptions, SqlDialect } from '@lib/core'
import { DemoSchemaType, getDemoSchema } from '@lib/data/schemas'
import { SequelizeFramework } from '@lib/frameworks'
import { qsValueToStringEnum } from '@lib/utils'
import { useRouter } from 'next/router'
import React from 'react'

const dbOptions: DatabaseOptions = {
  sqlDialect: SqlDialect.MariaDb,
  caseStyle: 'snake',
  nounForm: 'plural',
  timestamps: false,
}

function IndexPage(): React.ReactElement {
  const { query, push } = useRouter()

  const [schemaType, setSchemaType] = React.useState<DemoSchemaType>(DemoSchemaType.Sakila)

  React.useEffect(() => {
    if (schemaType !== qsValueToStringEnum(DemoSchemaType, query.schema)) {
      push(`/demo?schema=${schemaType}`, undefined, { shallow: true })
      return
    }
  }, [query, schemaType])

  const root = React.useMemo(
    () => SequelizeFramework.generate({ schema: getDemoSchema(schemaType), dbOptions }),
    [schemaType, dbOptions],
  )

  return (
    <Layout title="Demo | Sequelize UI">
      <DemoSchemaSelector schema={schemaType} onChange={setSchemaType} />
      <CodeViewer root={root} />
    </Layout>
  )
}

export default IndexPage
