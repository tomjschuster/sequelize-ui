/** @jest-environment node */
import { DbOptions, SqlDialect } from '@src/core/database'
import { Framework } from '@src/core/framework'
import { SequelizeFramework } from '@src/frameworks/sequelize'
import {
  DbConnection,
  alpha,
  buildProject,
  createDatabase,
  destroyProject,
  dropDatabase,
  preinstall,
  validateDialect,
} from '@src/test-utils'
import { cases, columnCaseToColumn } from '../cases'
import schemaCases from '../schemaCases'

const SQL_DIALECT = process.env.SQL_DIALECT
const KEEP_ASSETS: boolean = process.env.KEEP_ASSETS === 'true'

const frameworks: Framework[] = [SequelizeFramework]

const sqlDialects: SqlDialect[] =
  SQL_DIALECT === 'all'
    ? [
        SqlDialect.Sqlite,
        SqlDialect.Postgres,
        SqlDialect.MySql,
        SqlDialect.MariaDb,
        SqlDialect.MsSql,
      ]
    : [validateDialect(SQL_DIALECT || SqlDialect.Sqlite)]

describe.each(frameworks)('$name migrations', (framework: Framework) => {
  const projectName = alpha(12)
  const projectType = framework.projectType()

  describe.each(sqlDialects)('%s', (sqlDialect) => {
    describe.each(schemaCases)('$schema.name', ({ schema, tableColumns }) => {
      afterAll(async () => {
        !KEEP_ASSETS && (await destroyProject(projectType, projectName))
        !KEEP_ASSETS && (await dropDatabase(projectName, sqlDialect))
      }, 10000)

      describe.each(cases)(
        '%s',
        (key, options) => {
          const expectedTableColumns = tableColumns[key]
          if (!expectedTableColumns) return
          const dbOptions: DbOptions = { ...options, sqlDialect }
          const expectedTables = Object.keys(expectedTableColumns).sort()

          let client: DbConnection

          beforeAll(async () => {
            const directory = framework.generate({
              schema: { ...schema, name: projectName },
              dbOptions,
            })
            client = await createDatabase(projectName, sqlDialect)
            await buildProject(projectType, directory, preinstall(sqlDialect, projectType))
          }, 60000)

          afterAll(async () => {
            await client.close()
          })

          it('should create the correct tables with the correct names', async () => {
            const tables = (await client.getTables()).sort()
            expect(tables).toEqual(expectedTables)
          })

          it.each(expectedTables)(
            'should create the correct columns with the correct names for %s',
            async (table) => {
              const expectedColumns = expectedTableColumns[table]
                .map((c) => columnCaseToColumn(c, sqlDialect))
                .filter((c) => c)
                .sort()

              const columns = (await client.getColumns(table)).sort()
              expect(columns).toEqual(expectedColumns)
            },
          )
        },
        60000,
      )
    })
  })
})
