import CodeViewer from '@lib/components/CodeViewer'
import Layout from '@lib/components/Layout'
import { DatabaseOptions, SqlDialect } from '@lib/core'
import employee from '@lib/data/schemas/employee'
import { SequelizeFramework } from '@lib/frameworks'
import React from 'react'

const dbOptions: DatabaseOptions = {
  sqlDialect: SqlDialect.MariaDb,
  caseStyle: 'snake',
  nounForm: 'plural',
  timestamps: false,
}

function IndexPage(): React.ReactElement {
  const root = React.useMemo(() => SequelizeFramework.generate({ schema: employee, dbOptions }), [
    employee,
    dbOptions,
  ])

  return (
    <Layout title="Home | Sequelize UI">
      <CodeViewer root={root} />
    </Layout>
  )
}

export default IndexPage
