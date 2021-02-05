import { expect } from 'chai'

import { SqlDialect, DatabaseOptions } from '../../src/database'
import { generateSequelizeProject } from '../../src/codegen/sequelize/project'
import schema from '../fixtures/dvdSchema'
import { createPostgresDatabase, getPostgresColumns, getPostgresTables } from '../helpers/postgres'
import { clearNpmProject, runNpmProject } from '../helpers/npm'
import { Client } from 'pg'
import { alpha } from '../helpers/generators'

describe('postgres tests', () => {
  describe('camel plural', async function () {
    this.timeout(30000)

    const database = alpha(12)
    const table = 'Customers'
    let client: Client

    const options: DatabaseOptions = {
      sqlDialect: SqlDialect.Postgres,
      timestamps: true,
      caseStyle: 'camel',
      nounForm: 'plural',
    }

    const project = generateSequelizeProject({ schema: schema(database), options })

    before(async () => {
      client = await createPostgresDatabase(database)
      await runNpmProject(project)
    })

    after(async () => {
      await client.end()
      await clearNpmProject(project)
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

      const tables = await getPostgresTables(client)
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

      const columns = await getPostgresColumns(client, table)
      expect(columns).to.have.members(expectedColumns)
    })
  })

  describe('camel singular', async function () {
    this.timeout(30000)

    const database = alpha(12)
    const table = 'Customer'
    let client: Client

    const options: DatabaseOptions = {
      sqlDialect: SqlDialect.Postgres,
      timestamps: true,
      caseStyle: 'camel',
      nounForm: 'singular',
    }

    const project = generateSequelizeProject({ schema: schema(database), options })

    before(async () => {
      client = await createPostgresDatabase(database)
      await runNpmProject(project)
    })

    after(async () => {
      await client.end()
      await clearNpmProject(project)
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

      const tables = await getPostgresTables(client)
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

      const columns = await getPostgresColumns(client, table)
      expect(columns).to.have.members(expectedColumns)
    })
  })

  describe('snake plural', async function () {
    this.timeout(30000)

    const database = alpha(12)
    const table = 'customers'
    let client: Client

    const options: DatabaseOptions = {
      sqlDialect: SqlDialect.Postgres,
      timestamps: true,
      caseStyle: 'snake',
      nounForm: 'plural',
    }

    const project = generateSequelizeProject({ schema: schema(database), options })

    before(async () => {
      client = await createPostgresDatabase(database)
      await runNpmProject(project)
    })

    after(async () => {
      await client.end()
      await clearNpmProject(project)
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

      const tables = await getPostgresTables(client)
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

      const columns = await getPostgresColumns(client, table)
      expect(columns).to.have.members(expectedColumns)
    })
  })

  describe('snake singular', async function () {
    this.timeout(30000)

    const database = alpha(12)
    const table = 'customer'
    let client: Client

    const options: DatabaseOptions = {
      sqlDialect: SqlDialect.Postgres,
      timestamps: true,
      caseStyle: 'snake',
      nounForm: 'singular',
    }

    const project = generateSequelizeProject({ schema: schema(database), options })

    before(async () => {
      client = await createPostgresDatabase(database)
      await runNpmProject(project)
    })

    after(async () => {
      await client.end()
      await clearNpmProject(project)
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

      const tables = await getPostgresTables(client)
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

      const columns = await getPostgresColumns(client, table)
      expect(columns).to.have.members(expectedColumns)
    })
  })
})
