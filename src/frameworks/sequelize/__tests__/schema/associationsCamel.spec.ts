import { DbCaseStyle, defaultDbOptions } from '@src/core/database'
import associationsSchema from '@src/frameworks/__fixtures__/schemas/associations'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework', () => {
  describe('schema - associations camel', () => {
    it('generates correct code', () => {
      const code = SequelizeFramework.generate({
        schema: associationsSchema,
        dbOptions: { ...defaultDbOptions, caseStyle: DbCaseStyle.Camel },
      })
      expect(code).toMatchSnapshot()
    })
  })
})
