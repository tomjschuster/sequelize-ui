import { emptyAssociation, emptyField, emptyModel } from '../schema'

describe('schema schema', () => {
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
