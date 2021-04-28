import { defaultDbOptions } from '@src/core/database'
import fieldsSchema from '@src/data/schemas/fields'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework', () => {
  describe('schema - fields', () => {
    it('generates correct code', () => {
      const code = SequelizeFramework.generate({
        schema: fieldsSchema,
        dbOptions: defaultDbOptions,
      })
      expect(code).toMatchSnapshot()
    })
  })
})
