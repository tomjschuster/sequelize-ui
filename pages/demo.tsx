import CodeViewer from '@lib/components/CodeViewer'
import EnumRadio from '@lib/components/EnumRadio'
import Layout from '@lib/components/Layout'
import {
  DatabaseCaseStyle,
  DatabaseNounForm,
  displayDatabaseCaseStyle,
  displayDatabaseNounForm,
  displaySqlDialect,
  SqlDialect,
} from '@lib/core'
import { DemoSchemaType, displayDemoSchemaType, getDemoSchema } from '@lib/data/schemas'
import { SequelizeFramework } from '@lib/frameworks'
import useEnumQueryString from '@lib/hooks/useEnumQueryString'
import React, { useMemo, useState } from 'react'

function IndexPage(): React.ReactElement {
  const [schemaType, setSchemaType] = useEnumQueryString<DemoSchemaType>({
    enumConst: DemoSchemaType,
    key: 'schema',
    defaultValue: DemoSchemaType.Sakila,
  })

  const [sqlDialect, setSqlDialect] = useState<SqlDialect>(SqlDialect.Postgres)
  const [nounForm, setNounForm] = useState<DatabaseNounForm>(DatabaseNounForm.Singular)
  const [caseStyle, setCaseStyle] = useState<DatabaseCaseStyle>(DatabaseCaseStyle.Snake)
  const [timestamps, setTimestamps] = useState<boolean>(true)

  const dbOptions = useMemo(() => ({ sqlDialect, nounForm, caseStyle, timestamps }), [
    schemaType,
    sqlDialect,
    nounForm,
    caseStyle,
    timestamps,
  ])

  const schema = useMemo(() => getDemoSchema(schemaType), [schemaType])

  const root = React.useMemo(() => SequelizeFramework.generate({ schema, dbOptions }), [
    schema,
    dbOptions,
  ])

  return (
    <Layout title="Demo | Sequelize UI">
      <EnumRadio
        value={schemaType}
        enumConst={DemoSchemaType}
        display={displayDemoSchemaType}
        onChange={setSchemaType}
      />
      <EnumRadio
        value={sqlDialect}
        enumConst={SqlDialect}
        display={displaySqlDialect}
        onChange={setSqlDialect}
      />
      <EnumRadio
        value={caseStyle}
        enumConst={DatabaseCaseStyle}
        display={displayDatabaseCaseStyle}
        onChange={setCaseStyle}
      />
      <EnumRadio
        value={nounForm}
        enumConst={DatabaseNounForm}
        display={displayDatabaseNounForm}
        onChange={setNounForm}
      />
      <EnumRadio
        value={timestamps}
        enumConst={{ true: true, false: false }}
        display={(x) => (x ? 'timestamps' : 'no timestamps')}
        onChange={setTimestamps}
      />
      <CodeViewer cacheKey={schemaType} root={root} />
    </Layout>
  )
}

export default IndexPage
