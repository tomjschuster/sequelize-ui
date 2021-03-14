import CodeViewer from '@lib/components/CodeViewer'
import Layout from '@lib/components/Layout'
import { DatabaseOptions, SqlDialect } from '@lib/core'
import employee from '@lib/data/schemas/employeeTemporalDataSet'
import sakila from '@lib/data/schemas/sakila'
import { SequelizeFramework } from '@lib/frameworks'
import { useRouter } from 'next/router'
import React from 'react'

const dbOptions: DatabaseOptions = {
  sqlDialect: SqlDialect.MariaDb,
  caseStyle: 'snake',
  nounForm: 'plural',
  timestamps: false,
}

function IndexPage(): React.ReactElement {
  const {
    query: { schema: schemaParam },
  } = useRouter()

  const schema = schemaParam === 'sakila' ? sakila : employee

  const root = React.useMemo(() => SequelizeFramework.generate({ schema, dbOptions }), [
    schema,
    dbOptions,
  ])

  return (
    <Layout title="Home | Sequelize UI">
      <CodeViewer root={root} />
    </Layout>
  )
}

export default IndexPage
