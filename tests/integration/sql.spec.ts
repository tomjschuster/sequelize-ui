import { expect } from 'chai'

import { SqlDialect, DatabaseOptions, displaySqlDialect } from '../../src/database'
import { generateSequelizeProject } from '../../src/codegen/sequelize/project'
import schema from '../fixtures/dvdSchema'
import { deleteNpmProject, runNpmProject } from '../helpers/npm'
import { createDatabase, DbClient, dropDatabase, validateDialect } from '../helpers/sql'
import { alpha } from '../helpers/generators'

const sqlDialect: SqlDialect = validateDialect()
const createTestDatabase = (db: string): Promise<DbClient> => createDatabase(db, sqlDialect)
const dropTestDatabase = (db: string): Promise<void> => dropDatabase(db, sqlDialect)

describe(`SQL tests (${displaySqlDialect(sqlDialect)})`, () => {
  const projectName = alpha(12)

  after(async () => {
    await deleteNpmProject(projectName)
    await dropTestDatabase(projectName)
  })

  describe('camel plural', async function () {
    this.timeout(30000)

    let client: DbClient

    const options: DatabaseOptions = {
      sqlDialect,
      timestamps: true,
      caseStyle: 'camel',
      nounForm: 'plural',
    }

    const table = 'Customers'

    const project = generateSequelizeProject({ schema: schema(projectName), options })

    before(async () => {
      client = await createTestDatabase(projectName)
      await runNpmProject(project)
    })

    after(async () => {
      await client.close()
    })

    it('should create pascal cased, plural table names', async () => {
      const expectedTables = [
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
      ]

      const tables = await client.getTables()
      expect(tables).to.have.members(expectedTables)
    })
    it('should create camel cased column names', async () => {
      const expectedColumns = [
        'customerId',
        'firstName',
        'lastName',
        'email',
        'createdAt',
        'updatedAt',
        'StoreStoreId',
      ]

      const columns = await client.getColumns(table)
      expect(columns).to.have.members(expectedColumns)
    })
  })

  describe('camel singular', async function () {
    this.timeout(30000)

    let client: DbClient

    const options: DatabaseOptions = {
      sqlDialect,
      timestamps: true,
      caseStyle: 'camel',
      nounForm: 'singular',
    }

    const table = 'Customer'

    const project = generateSequelizeProject({ schema: schema(projectName), options })

    before(async () => {
      client = await createTestDatabase(projectName)
      await runNpmProject(project)
    })

    after(async () => {
      await client.close()
    })

    it('should create pascal cased, plural table names', async () => {
      const expectedTables = [
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
      ]

      const tables = await client.getTables()
      expect(tables).to.have.members(expectedTables)
    })
    it('should create camel cased column names', async () => {
      const expectedColumns = [
        'customerId',
        'firstName',
        'lastName',
        'email',
        'createdAt',
        'updatedAt',
        'StoreStoreId',
      ]

      const columns = await client.getColumns(table)
      expect(columns).to.have.members(expectedColumns)
    })
  })

  describe('snake plural', async function () {
    this.timeout(30000)

    let client: DbClient

    const options: DatabaseOptions = {
      sqlDialect,
      timestamps: true,
      caseStyle: 'snake',
      nounForm: 'plural',
    }

    const table = 'customers'

    const project = generateSequelizeProject({ schema: schema(projectName), options })

    before(async () => {
      client = await createTestDatabase(projectName)
      await runNpmProject(project)
    })

    after(async () => {
      await client.close()
    })

    it('should create snake cased, plural table names', async () => {
      const expectedTables = [
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
      ]

      const tables = await client.getTables()
      expect(tables).to.have.members(expectedTables)
    })
    it('should create snake cased column names', async () => {
      const expectedColumns = [
        'customer_id',
        'first_name',
        'last_name',
        'email',
        'created_at',
        'updated_at',
        'store_store_id',
      ]

      const columns = await client.getColumns(table)
      expect(columns).to.have.members(expectedColumns)
    })
  })

  describe('snake singular', async function () {
    this.timeout(30000)

    let client: DbClient

    const options: DatabaseOptions = {
      sqlDialect,
      timestamps: true,
      caseStyle: 'snake',
      nounForm: 'singular',
    }

    const table = 'customer'

    const project = generateSequelizeProject({ schema: schema(projectName), options })

    before(async () => {
      client = await createTestDatabase(projectName)
      await runNpmProject(project)
    })

    after(async () => {
      await client.close()
    })

    it('should create snake cased, singular table names', async () => {
      const expectedTables = [
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
      ]

      const tables = await client.getTables()
      expect(tables).to.have.members(expectedTables)
    })
    it('should create snake cased column names', async () => {
      const expectedColumns = [
        'customer_id',
        'first_name',
        'last_name',
        'email',
        'created_at',
        'updated_at',
        'store_store_id',
      ]

      const columns = await client.getColumns(table)
      expect(columns).to.have.members(expectedColumns)
    })
  })

  describe('no timestamps', async function () {
    this.timeout(30000)

    let client: DbClient

    const options: DatabaseOptions = {
      sqlDialect,
      timestamps: false,
      caseStyle: 'snake',
      nounForm: 'plural',
    }

    const table = 'customers'

    const project = generateSequelizeProject({ schema: schema(projectName), options })

    before(async () => {
      client = await createTestDatabase(projectName)
      await runNpmProject(project)
    })

    after(async () => {
      await client.close()
    })

    it('should not create timestamp column names', async () => {
      const expectedColumns = ['customer_id', 'first_name', 'last_name', 'email', 'store_store_id']

      const columns = await client.getColumns(table)
      expect(columns).to.have.members(expectedColumns)
    })
  })
})
