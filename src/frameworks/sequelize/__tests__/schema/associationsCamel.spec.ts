import { DatabaseCaseStyle, defaultDbOptions } from '@src/core/database'
import associationsSchema from '@src/data/schemas/associations'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework', () => {
  describe('schema - associations camel', () => {
    it('generates correct code', () => {
      const code = SequelizeFramework.generate({
        schema: associationsSchema,
        dbOptions: { ...defaultDbOptions, caseStyle: DatabaseCaseStyle.Camel },
      })
      expect(code).toMatchSnapshot()
    })
  })
})
