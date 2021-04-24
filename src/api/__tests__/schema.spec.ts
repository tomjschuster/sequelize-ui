import employeeTemporalDataSet from '@src/data/schemas/employeeTemporalDataSet'
import sakila from '@src/data/schemas/sakila'
import {
  clearSchemas,
  createSchema,
  deleteSchema,
  emptyAssociation,
  emptyField,
  emptyModel,
  getSchema,
  listSchemas,
  SCHEMA_NOT_FOUND_ERROR,
  updateSchema,
} from '../schema'

// TODO mock local storage failing to test error cases

describe('schema api', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('listSchemas', () => {
    it('should return an empty list when there is no storage', async () => {
      const schemas = await listSchemas()
      expect(schemas).toEqual([])
      expect(localStorage.length).toBe(0)
    })

    it('should return all created schemas', async () => {
      const schemaA = await createSchema(sakila)
      const schemaB = await createSchema(employeeTemporalDataSet)
      const schemas = await listSchemas()
      expect(schemas).toEqual([schemaA, schemaB])
    })
  })

  describe('getSchema', () => {
    it('return a rejected promise when there is no storage', async () => {
      getSchema('foo').catch((e) => {
        expect(e).toEqual(new Error(SCHEMA_NOT_FOUND_ERROR))
      })
    })

    it('return a rejected promise when schema does not exist', async () => {
      await createSchema(sakila)
      getSchema('foo').catch((e) => {
        expect(e).toEqual(new Error(SCHEMA_NOT_FOUND_ERROR))
      })
    })

    it('returns schema when it exists', async () => {
      const expectedSchema = await createSchema(sakila)
      const schema = await getSchema(expectedSchema.id)
      expect(schema).toEqual(expectedSchema)
    })
  })

  describe('createSchema', () => {
    it('creates new storage with new schema when no storage', async () => {
      const schema = await createSchema(sakila)
      expect(schema).toEqual({ ...sakila, id: schema.id })
      expect(localStorage.length).toEqual(1)
    })

    it('increments the schema name when other schema has name', async () => {
      await createSchema(sakila)
      const schema = await createSchema(sakila)
      expect(schema.name).toEqual(`${sakila.name} (1)`)
    })
  })

  describe('updateSchema', () => {
    it('return a rejected promise when there is no storage', async () => {
      updateSchema(sakila).catch((e) => {
        expect(e).toEqual(new Error(SCHEMA_NOT_FOUND_ERROR))
      })
    })

    it('returns an error when there is storage, but schema does not exist', async () => {
      await createSchema(sakila)
      updateSchema(employeeTemporalDataSet).catch((e) => {
        expect(e).toEqual(new Error(SCHEMA_NOT_FOUND_ERROR))
      })
    })

    it('updates the schema when it exists', async () => {
      const existingSchema = await createSchema(sakila)

      const schema = await updateSchema({ ...existingSchema, name: 'foo' })
      expect(schema.name).toBe('foo')

      const persistedSchema = await getSchema(schema.id)
      expect(persistedSchema.name).toBe('foo')
    })

    it('increments the name when other schema has the name', async () => {
      await createSchema(employeeTemporalDataSet)
      const existingSchema = await createSchema(sakila)

      const schema = await updateSchema({ ...existingSchema, name: employeeTemporalDataSet.name })
      expect(schema.name).toBe(`${employeeTemporalDataSet.name} (1)`)
    })
  })

  describe('deleteSchema', () => {
    it('should have no effect when there is no storage', async () => {
      await deleteSchema('foo')
      expect(localStorage.length).toBe(0)
    })

    it('should return a rejected promise when schema does not exist', async () => {
      await createSchema(sakila)
      deleteSchema('foo').catch((e) => {
        expect(e).toEqual(new Error(SCHEMA_NOT_FOUND_ERROR))
      })
    })

    it('should remove a schema from storage', async () => {
      const expectedSchema = await createSchema(sakila)
      await deleteSchema(expectedSchema.id)
      getSchema(expectedSchema.id).catch((e) => {
        expect(e).toEqual(new Error(SCHEMA_NOT_FOUND_ERROR))
      })
    })
  })

  describe('clearSchemas', () => {
    it('should have no effect when there is no storage', async () => {
      await clearSchemas()
      expect(localStorage.length).toBe(0)
    })
  })

  describe('emptyModel', () => {
    it('return an empy model', async () => {
      const model = emptyModel()
      expect(typeof model.id).toBe('string')
      expect(typeof model.name).toBe('string')
      expect(model.fields).toEqual([])
      expect(model.associations).toEqual([])
    })
  })

  describe('emptyField', () => {
    it('return an empy field', async () => {
      const field = emptyField()
      expect(typeof field.id).toBe('string')
      expect(typeof field.name).toBe('string')
    })
  })

  describe('emptyAssociation', () => {
    it('return an empy association', async () => {
      const association = emptyAssociation('foo', 'bar')
      expect(typeof association.id).toBe('string')
    })
  })
})
