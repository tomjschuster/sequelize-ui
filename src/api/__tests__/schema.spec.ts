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

describe('schema api', () => {
  beforeEach(() => {
    // to fully reset the state between tests, clear the storage
    localStorage.clear()
    // and reset all mocks
    jest.clearAllMocks()
  })

  describe('listSchemas', () => {
    it('should return an empty list when there is no storage', async () => {
      const schemas = await listSchemas()
      expect(schemas).toEqual([])
      expect(localStorage.length).toBe(0)
    })
  })

  describe('getSchema', () => {
    it('return a rejected promise when there is no storage', async () => {
      getSchema('foo').catch((e) => {
        expect(e).toEqual(new Error(SCHEMA_NOT_FOUND_ERROR))
      })
    })
  })

  describe('createSchema', () => {
    it('adds a schema to storage', async () => {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const { id: _sakilaId, ...payload } = sakila
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const { id: _schemaId, ...schema } = await createSchema(payload)
      expect(schema).toEqual(payload)
      expect(localStorage.length).toEqual(1)
    })
  })

  describe('updateSchema', () => {
    it('return a rejected promise when there is no storage', async () => {
      updateSchema(sakila).catch((e) => {
        expect(e).toEqual(new Error(SCHEMA_NOT_FOUND_ERROR))
      })
    })
  })

  describe('deleteSchema', () => {
    it('should have no effect when there is no storage', async () => {
      await deleteSchema('foo')
      expect(localStorage.length).toBe(0)
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
