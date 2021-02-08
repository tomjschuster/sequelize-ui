import { expect } from 'chai'
import forEach from 'mocha-each'
import { SqlDialect, DatabaseOptions, displaySqlDialect } from '../../src/database'
import { generateSequelizeProject } from '../../src/codegen/sequelize/project'
import schema from '../fixtures/dvdSchema'
import { deleteNpmProject, buildNpmProject } from '../helpers/npm'
import { createDatabase, DbClient, dropDatabase, validateDialect } from '../helpers/sql'
import { alpha } from '../helpers/generators'

const sqlDialect: SqlDialect = validateDialect()
const createTestDatabase = (db: string): Promise<DbClient> => createDatabase(db, sqlDialect)
const dropTestDatabase = (db: string): Promise<void> => dropDatabase(db, sqlDialect)

type TestConfig = {
  databaseOptions: DatabaseOptions
  tableName: string
  expectedTables: string[]
  expectedColumns: string[]
}

const snakePlural: TestConfig = {
  databaseOptions: {
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
    'store_store_id',
  ],
}

const snakeSingular: TestConfig = {
  databaseOptions: {
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
    'store_store_id',
  ],
}
const camelPlural: TestConfig = {
  databaseOptions: {
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
    'StoreStoreId',
  ],
}

const camelSingular: TestConfig = {
  databaseOptions: {
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
    'StoreStoreId',
  ],
}

const noTimestamps: TestConfig = {
  databaseOptions: {
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
  expectedColumns: ['customer_id', 'first_name', 'last_name', 'email', 'store_store_id'],
}

describe(`SQL tests (${displaySqlDialect(sqlDialect)})`, () => {
  const projectName = alpha(12)

  after(async () => {
    await deleteNpmProject(projectName)
    await dropTestDatabase(projectName)
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
    function (_label, { databaseOptions, tableName, expectedTables, expectedColumns }) {
      this.timeout(15000)
      let client: DbClient

      const project = generateSequelizeProject({
        schema: schema(projectName),
        options: databaseOptions,
      })

      before(async () => {
        client = await createTestDatabase(projectName)
        await buildNpmProject(project)
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
