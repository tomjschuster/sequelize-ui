import schemaApi from '@src/api/schema'
import { defaultDbOptions } from '@src/core/database'
import { emptySchema, Schema } from '@src/core/schema'
import withLayout from '@src/ui/hocs/withLayout'
import SchemaLayout from '@src/ui/layouts/SchemaLayout'
import { goTo } from '@src/ui/routing/navigation'
import { indexRoute, schemaRoute } from '@src/ui/routing/routes'
import React from 'react'

function SchemaPage(): React.ReactElement {
  const schema = React.useMemo(emptySchema, [])

  const handleChangeSchema = React.useCallback(async (schema: Schema) => {
    const created = await schemaApi.createSchema(schema)
    goTo(schemaRoute(created.id), { replace: true })
    return created
  }, [])

  const handleCancel = () => goTo(indexRoute())

  return (
    <SchemaLayout
      initiallyEditing
      schema={schema}
      dbOptions={defaultDbOptions}
      onChangeSchema={handleChangeSchema}
      onChangeDbOptions={() => Promise.resolve(defaultDbOptions)}
      onClickClose={handleCancel}
    />
  )
}

export default withLayout(() => ({
  compact: true,
  title: 'Sequelize UI | Create a Schema',
  metaDescription:
    'Generate a new Node.js project with TypeScript and Sequelize code for your data model. Configure for MySQL, Postgres, SQLite or SQL Server.',
}))(SchemaPage)
