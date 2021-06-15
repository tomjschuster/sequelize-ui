import { DbCaseStyle, DbNounForm, DbOptions, SqlDialect } from '@src/core/database'
import { Framework } from '@src/core/framework'
import { SequelizeFramework } from '@src/frameworks/sequelize'
import {
  alpha,
  buildProject,
  createDatabase,
  DbConnection,
  destroyProject,
  dropDatabase,
  preinstall,
  validateDialect,
} from '@src/test-utils'
import { dvdSchema } from './__fixtures__'

const SQL_DIALECT = process.env.SQL_DIALECT
const KEEP_ASSETS: boolean = process.env.KEEP_ASSETS === 'true'

type DbTestConfig = {
  dbOptions: DbOptions
  tableName: string
  expectedTables: string[]
  expectedColumns: string[]
}

const snakePlural = (sqlDialect: SqlDialect): DbTestConfig => ({
  dbOptions: {
    sqlDialect,
    prefixPks: null,
    timestamps: true,
    caseStyle: DbCaseStyle.Snake,
    nounForm: DbNounForm.Plural,
    migrations: true,
  },
  tableName: 'customers',
  expectedTables: [
    'SequelizeMeta',
    'actors',
    'categories',
    'customers',
    'films',
    'film_actors',
    'film_categories',
    'languages',
    'inventories',
    'rentals',
    'staffs',
    'stores',
  ],
  expectedColumns: [
    'customer_id',
    'first_name',
    'last_name',
    'email',
    'created_at',
    'updated_at',
    'store_id',
  ],
})

const snakeSingular = (sqlDialect: SqlDialect): DbTestConfig => ({
  dbOptions: {
    sqlDialect,
    prefixPks: null,
    timestamps: true,
    caseStyle: DbCaseStyle.Snake,
    nounForm: DbNounForm.Singular,
    migrations: true,
  },
  tableName: 'customer',
  expectedTables: [
    'SequelizeMeta',
    'actor',
    'category',
    'customer',
    'film',
    'film_actor',
    'film_category',
    'language',
    'inventory',
    'rental',
    'staff',
    'store',
  ],
  expectedColumns: [
    'customer_id',
    'first_name',
    'last_name',
    'email',
    'created_at',
    'updated_at',
    'store_id',
  ],
})

const camelPlural = (sqlDialect: SqlDialect): DbTestConfig => ({
  dbOptions: {
    sqlDialect,
    prefixPks: null,
    timestamps: true,
    caseStyle: DbCaseStyle.Camel,
    nounForm: DbNounForm.Plural,
    migrations: true,
  },
  tableName: 'Customers',
  expectedTables: [
    'SequelizeMeta',
    'Actors',
    'Categories',
    'Customers',
    'FilmActors',
    'FilmCategories',
    'Films',
    'Languages',
    'Inventories',
    'Rentals',
    'Staffs',
    'Stores',
  ],
  expectedColumns: [
    'customerId',
    'firstName',
    'lastName',
    'email',
    'createdAt',
    'updatedAt',
    'storeId',
  ],
})

const camelSingular = (sqlDialect: SqlDialect): DbTestConfig => ({
  dbOptions: {
    sqlDialect,
    prefixPks: null,
    timestamps: true,
    caseStyle: DbCaseStyle.Camel,
    nounForm: DbNounForm.Singular,
    migrations: true,
  },
  tableName: 'Customer',
  expectedTables: [
    'SequelizeMeta',
    'Actor',
    'Category',
    'Customer',
    'FilmActor',
    'FilmCategory',
    'Film',
    'Language',
    'Inventory',
    'Rental',
    'Staff',
    'Store',
  ],
  expectedColumns: [
    'customerId',
    'firstName',
    'lastName',
    'email',
    'createdAt',
    'updatedAt',
    'storeId',
  ],
})

const noTimestamps = (sqlDialect: SqlDialect): DbTestConfig => ({
  dbOptions: {
    sqlDialect,
    prefixPks: null,
    timestamps: false,
    caseStyle: DbCaseStyle.Snake,
    nounForm: DbNounForm.Plural,
    migrations: true,
  },
  tableName: 'customers',
  expectedTables: [
    'SequelizeMeta',
    'actors',
    'categories',
    'customers',
    'films',
    'film_actors',
    'film_categories',
    'languages',
    'inventories',
    'rentals',
    'staffs',
    'stores',
  ],
  expectedColumns: ['customer_id', 'first_name', 'last_name', 'email', 'store_id'],
})

const noPrefixPks = (sqlDialect: SqlDialect): DbTestConfig => ({
  dbOptions: {
    sqlDialect,
    prefixPks: false,
    timestamps: true,
    caseStyle: DbCaseStyle.Snake,
    nounForm: DbNounForm.Plural,
    migrations: true,
  },
  tableName: 'customers',
  expectedTables: [
    'SequelizeMeta',
    'actors',
    'categories',
    'customers',
    'films',
    'film_actors',
    'film_categories',
    'languages',
    'inventories',
    'rentals',
    'staffs',
    'stores',
  ],
  expectedColumns: [
    'id',
    'first_name',
    'last_name',
    'email',
    'store_id',
    'created_at',
    'updated_at',
  ],
})

const frameworks: [label: string, framework: Framework][] = [['Sequelize', SequelizeFramework]]

const sqlDialects: SqlDialect[] =
  SQL_DIALECT === 'all'
    ? Object.values(SqlDialect)
    : [validateDialect(SQL_DIALECT || SqlDialect.Sqlite)]

describe.each(sqlDialects)('SQL tests %s', (sqlDialect) => {
  const projectName = alpha(12)

  describe.each(frameworks)('%s', (_label, framework: Framework) => {
    const projectType = framework.projectType()

    afterAll(async () => {
      !KEEP_ASSETS && (await destroyProject(projectType, projectName))
      !KEEP_ASSETS && (await dropDatabase(projectName, sqlDialect))
    }, 10000)

    const cases: [label: string, config: DbTestConfig][] = [
      ['snake plural', snakePlural(sqlDialect)],
      ['snake singular', snakeSingular(sqlDialect)],
      ['camel plural', camelPlural(sqlDialect)],
      ['camel singular', camelSingular(sqlDialect)],
      ['no timestamps', noTimestamps(sqlDialect)],
      ['no prefix pks', noPrefixPks(sqlDialect)],
    ]

    describe.each(cases)(
      '%s',
      (_label, { dbOptions, tableName, expectedTables, expectedColumns }) => {
        let client: DbConnection

        beforeAll(async () => {
          const schema = dvdSchema(projectName)
          const directory = framework.generate({ schema, dbOptions })
          client = await createDatabase(projectName, sqlDialect)
          await buildProject(projectType, directory, preinstall(sqlDialect, projectType))
        }, 30000)

        afterAll(async () => {
          await client.close()
        })

        it('should create the correct tables with the correct names', async () => {
          const tables = await client.getTables()
          expect(tables.sort()).toEqual(expectedTables.sort())
        })

        it('should create the correct columns with the correct names', async () => {
          const columns = await client.getColumns(tableName)
          expect(columns.sort()).toEqual(expectedColumns.sort())
        })
      },
      60000,
    )
  })
})
