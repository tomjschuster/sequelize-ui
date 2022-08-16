import blogSchema from '@src/api/schema/examples/blog'
import employee from '@src/api/schema/examples/employees'
import sakila from '@src/api/schema/examples/sakila'
import { AssociationTypeType, ThroughType } from '@src/core/schema'
import { now } from '@src/utils/dateTime'
import LocalStorageSchemaApi from '..'
import { SCHEMA_NOT_FOUND_ERROR } from '../../../api'

const schemaApi = new LocalStorageSchemaApi()

jest.mock('@src/utils/dateTime', () => {
  return {
    ...jest.requireActual('@src/utils/dateTime'),
    now: jest.fn(() => '2020-01-01T00:00:00Z'),
  }
})

describe('schema api', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('listSchemas', () => {
    it('should return an empty list when there is no storage', async () => {
      const schemas = await schemaApi.listSchemas()
      expect(schemas).toEqual([])
    })

    it('should return all created schemas', async () => {
      const schemaA = await schemaApi.createSchema(sakila)
      const schemaB = await schemaApi.createSchema(employee)
      const schemas = await schemaApi.listSchemas()
      expect(schemas).toEqual([schemaA, schemaB])
    })

    it('should return a rejected promise when localStorage.getItem throws', () => {
      jest.spyOn(console, 'error').mockImplementationOnce(() => undefined)
      ;(localStorage.getItem as jest.Mock).mockImplementationOnce(() => {
        throw new Error('foo')
      })
      schemaApi.listSchemas().catch((e) => {
        expect(e).toEqual(new Error('foo'))
      })
    })
  })

  describe('getSchema', () => {
    it('return a rejected promise when there is no storage', async () => {
      schemaApi.getSchema('foo').catch((e) => {
        expect(e).toEqual(new Error(SCHEMA_NOT_FOUND_ERROR))
      })
    })

    it('return a rejected promise when schema does not exist', async () => {
      await schemaApi.createSchema(sakila)
      schemaApi.getSchema('foo').catch((e) => {
        expect(e).toEqual(new Error(SCHEMA_NOT_FOUND_ERROR))
      })
    })

    it('returns schema when it exists', async () => {
      const expectedSchema = await schemaApi.createSchema(sakila)
      const schema = await schemaApi.getSchema(expectedSchema.id)
      expect(schema).toEqual(expectedSchema)
    })
  })

  describe('schemaApi.createSchema', () => {
    it('creates new storage with new schema when no storage', async () => {
      const mockDate = '2020-01-01T00:00:00Z'

      ;(now as jest.Mock).mockReturnValue(mockDate)
      const schema = await schemaApi.createSchema(sakila)

      const models = schema.models.map((m) => ({
        ...m,
        createdAt: mockDate,
        updatedAt: mockDate,
      }))

      expect(schema).toEqual({
        ...sakila,
        id: schema.id,
        createdAt: mockDate,
        updatedAt: mockDate,
        models,
      })

      expect(localStorage.length).toEqual(1)
    })

    it('increments the schema name when other schema has name', async () => {
      await schemaApi.createSchema(sakila)
      const schema = await schemaApi.createSchema(sakila)
      expect(schema.name).toEqual(`${sakila.name} (1)`)
    })

    it('should return a rejected promise when localStorage.setItem throws', () => {
      ;(localStorage.setItem as jest.Mock).mockImplementationOnce(() => {
        throw new Error('foo')
      })
      schemaApi.createSchema(sakila).catch((e) => {
        expect(e).toEqual(new Error('foo'))
      })
    })
  })

  describe('updateSchema', () => {
    it('return a rejected promise when there is no storage', async () => {
      schemaApi.updateSchema(sakila).catch((e) => {
        expect(e).toEqual(new Error(SCHEMA_NOT_FOUND_ERROR))
      })
    })

    it('returns an error when there is storage, but schema does not exist', async () => {
      await schemaApi.createSchema(sakila)
      schemaApi.updateSchema(employee).catch((e) => {
        expect(e).toEqual(new Error(SCHEMA_NOT_FOUND_ERROR))
      })
    })

    it('updates the schema when it exists', async () => {
      const existingSchema = await schemaApi.createSchema(sakila)

      const schema = await schemaApi.updateSchema({ ...existingSchema, name: 'foo' })
      expect(schema.name).toBe('foo')

      const persistedSchema = await schemaApi.getSchema(schema.id)
      expect(persistedSchema.name).toBe('foo')
    })

    it('removes targeting associations when removing a model', async () => {
      const existingSchema = await schemaApi.createSchema(blogSchema)

      // Assert the following to make sure test is valid
      // If schemas change, update test cases
      const post = existingSchema.models.find((m) => m.name === 'post')
      const user = existingSchema.models.find((m) => m.name === 'user')
      const postHasUserAssoc = post?.associations.some((a) => a.targetModelId === user?.id)
      expect(postHasUserAssoc).toBe(true)

      const schema = {
        ...existingSchema,
        models: existingSchema.models.filter((m) => m.id !== user?.id),
      }
      const updatedSchema = await schemaApi.updateSchema(schema)
      const updatedPost = updatedSchema.models.find((m) => m.id === post?.id)
      const updatedUser = updatedSchema.models.find((m) => m.id === user?.id)
      const updatedPostHasUserAssoc = updatedPost?.associations.some(
        (a) => a.targetModelId === user?.id,
      )

      expect(updatedUser).toBeUndefined()
      expect(updatedPostHasUserAssoc).toBe(false)
    })

    it('converts join models associations to join tables when removing a join model', async () => {
      const existingSchema = await schemaApi.createSchema(blogSchema)

      // Assert the following to make sure test is valid
      // If schemas change, update test cases
      const postCategory = existingSchema.models.find((m) => m.name === 'post category')
      const post = existingSchema.models.find((m) => m.name === 'post')
      const postModelManyToMany = post?.associations.find(
        (a) =>
          postCategory &&
          a.type.type === AssociationTypeType.ManyToMany &&
          a.type.through.type === ThroughType.ThroughModel &&
          a.type.through.modelId === postCategory.id,
      )
      expect(postModelManyToMany).toBeDefined()

      const schema = {
        ...existingSchema,
        models: existingSchema.models.filter((m) => m.id !== postCategory?.id),
      }

      const updatedSchema = await schemaApi.updateSchema(schema)
      const updatedPost = updatedSchema.models.find((m) => post && m.id === post.id)

      const modelTableManyToMany = updatedPost?.associations.find(
        (a) =>
          a.type.type === AssociationTypeType.ManyToMany &&
          a.type.through.type === ThroughType.ThroughTable &&
          a.type.through.table === 'category post',
      )

      expect(modelTableManyToMany).toBeDefined()
    })

    it('converts join models associations to join tables when removing a join model', async () => {
      const existingSchema = await schemaApi.createSchema(blogSchema)

      // Assert the following to make sure test is valid
      // If schemas change, update test cases
      const postCategory = existingSchema.models.find((m) => m.name === 'post category')
      const post = existingSchema.models.find((m) => m.name === 'post')
      const postModelManyToMany = post?.associations.find(
        (a) =>
          postCategory &&
          a.type.type === AssociationTypeType.ManyToMany &&
          a.type.through.type === ThroughType.ThroughModel &&
          a.type.through.modelId === postCategory.id,
      )
      expect(postModelManyToMany).toBeDefined()

      const schema = {
        ...existingSchema,
        models: existingSchema.models.filter((m) => m.id !== postCategory?.id),
      }

      const updatedSchema = await schemaApi.updateSchema(schema)
      const updatedPost = updatedSchema.models.find((m) => post && m.id === post.id)

      const modelTableManyToMany = updatedPost?.associations.find(
        (a) =>
          a.type.type === AssociationTypeType.ManyToMany &&
          a.type.through.type === ThroughType.ThroughTable &&
          a.type.through.table === 'category post',
      )

      expect(modelTableManyToMany).toBeDefined()
    })
  })

  describe('deleteSchema', () => {
    it('should have no effect when there is no storage', async () => {
      await schemaApi.deleteSchema('foo')
      expect(localStorage.length).toBe(0)
    })

    it('should return a rejected promise when schema does not exist', async () => {
      await schemaApi.createSchema(sakila)
      schemaApi.deleteSchema('foo').catch((e) => {
        expect(e).toEqual(new Error(SCHEMA_NOT_FOUND_ERROR))
      })
    })

    it('should remove a schema from storage', async () => {
      const expectedSchema = await schemaApi.createSchema(sakila)
      await schemaApi.deleteSchema(expectedSchema.id)
      schemaApi.getSchema(expectedSchema.id).catch((e) => {
        expect(e).toEqual(new Error(SCHEMA_NOT_FOUND_ERROR))
      })
    })
  })
})
