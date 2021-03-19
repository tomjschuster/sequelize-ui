import CodeViewer from '@lib/components/CodeViewer'
import DbOptionsForm from '@lib/components/DbOptionsForm'
import EnumRadio from '@lib/components/EnumRadio'
import Layout from '@lib/components/Layout'
import { DatabaseCaseStyle, DatabaseNounForm, DatabaseOptions, SqlDialect } from '@lib/core'
import { DemoSchemaType, displayDemoSchemaType, getDemoSchema } from '@lib/data/schemas'
import { SequelizeFramework } from '@lib/frameworks'
import useEnumQueryString from '@lib/hooks/useEnumQueryString'
import React, { useState } from 'react'

const defaultDbOptions: DatabaseOptions = {
  sqlDialect: SqlDialect.Postgres,
  caseStyle: DatabaseCaseStyle.Snake,
  nounForm: DatabaseNounForm.Singular,
  timestamps: true,
}

function IndexPage(): React.ReactElement {
  const [schemaType, setSchemaType] = useEnumQueryString<DemoSchemaType>({
    enumConst: DemoSchemaType,
    key: 'schema',
    defaultValue: DemoSchemaType.Sakila,
  })

  const [dbOptions, setDbOptions] = useState<DatabaseOptions>(defaultDbOptions)

  const root = React.useMemo(() => {
    const schema = getDemoSchema(schemaType)
    return SequelizeFramework.generate({ schema, dbOptions })
  }, [schemaType, dbOptions])

  return (
    <Layout title="Demo | Sequelize UI">
      <EnumRadio
        value={schemaType}
        enumConst={DemoSchemaType}
        display={displayDemoSchemaType}
        onChange={setSchemaType}
      />
      <DbOptionsForm dbOptions={dbOptions} onChange={setDbOptions} />
      <CodeViewer cacheKey={schemaType} root={root} />
    </Layout>
  )
}

export default IndexPage
