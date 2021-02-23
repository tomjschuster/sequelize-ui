import { DatabaseOptions, displaySqlDialect, SqlDialect } from '@sequelize-ui/core/database'
import { generateSequelizeProject } from '@sequelize-ui/core/frameworks/sequelize'
import schema from '@sequelize-ui/integration/fixtures/dvdSchema'
import { alpha } from '@sequelize-ui/integration/helpers/generators'
import { buildNpmProject, deleteNpmProject } from '@sequelize-ui/integration/helpers/npm'
import {
  createDatabase,
  DbConnection,
  dropDatabase,
  preinstall,
  validateDialect,
} from '@sequelize-ui/integration/helpers/sql'
import { expect } from 'chai'
import forEach from 'mocha-each'

const sqlDialect: SqlDialect = validateDialect(process.env.SQL_DIALECT)

type TestConfig = {
  dbOptions: DatabaseOptions
  tableName: string
  expectedTables: string[]
  expectedColumns: string[]
}

const snakePlural: TestConfig = {
  dbOptions: {
    sqlDialect,
    timestamps: true,
    caseStyle: 'snake',
    nounForm: 'plural',
  },
  tableName: 'customers',
  expectedTables: [
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
}

const snakeSingular: TestConfig = {
  dbOptions: {
    sqlDialect,
    timestamps: true,
    caseStyle: 'snake',
    nounForm: 'singular',
  },
  tableName: 'customer',
  expectedTables: [
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
}
const camelPlural: TestConfig = {
  dbOptions: {
    sqlDialect,
    timestamps: true,
    caseStyle: 'camel',
    nounForm: 'plural',
  },
  tableName: 'Customers',
  expectedTables: [
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
}

const camelSingular: TestConfig = {
  dbOptions: {
    sqlDialect,
    timestamps: true,
    caseStyle: 'camel',
    nounForm: 'singular',
  },
  tableName: 'Customer',
  expectedTables: [
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
}

const noTimestamps: TestConfig = {
  dbOptions: {
    sqlDialect,
    timestamps: false,
    caseStyle: 'snake',
    nounForm: 'plural',
  },
  tableName: 'customers',
  expectedTables: [
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
}

describe(`SQL tests (${displaySqlDialect(sqlDialect)})`, () => {
  const projectName = alpha(12)

  after(async () => {
    await deleteNpmProject(projectName)
    await dropDatabase(projectName, sqlDialect)
  })

  const cases: [label: string, config: TestConfig][] = [
    ['snake plural', snakePlural],
    ['snake singular', snakeSingular],
    ['camel plural', camelPlural],
    ['camel singular', camelSingular],
    ['no timestamps', noTimestamps],
  ]

  forEach(cases).describe(
    '%s',
    function (_label, { dbOptions, tableName, expectedTables, expectedColumns }) {
      this.timeout(60000)
      let client: DbConnection

      before(async () => {
        const project = generateSequelizeProject({
          schema: schema(projectName),
          dbOptions,
        })

        client = await createDatabase(projectName, sqlDialect)
        await buildNpmProject(project, preinstall(sqlDialect))
      })

      after(async () => {
        await client.close()
      })

      it('should create the correct tables with the correct names', async () => {
        const tables = await client.getTables()
        expect(tables).to.have.members(expectedTables)
      })

      it('should create the correct columns with the correct names', async () => {
        const tables = await client.getColumns(tableName)
        expect(tables).to.have.members(expectedColumns)
      })
    },
  )
})
