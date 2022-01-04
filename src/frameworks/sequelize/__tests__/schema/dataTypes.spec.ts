import { defaultDbOptions } from '@src/core/database'
import dataTypesSchema from '@src/frameworks/__fixtures__/schemas/dataTypes'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework', () => {
  describe('schema - data types', () => {
    it('generates correct code', () => {
      const code = SequelizeFramework.generate({
        schema: dataTypesSchema,
        dbOptions: defaultDbOptions,
      })
      expect(code).toMatchSnapshot()
    })
  })
})
