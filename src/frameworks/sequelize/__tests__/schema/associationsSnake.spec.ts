import { DbCaseStyle, defaultDbOptions } from '@src/core/database'
import associationsSchema from '@src/frameworks/__fixtures__/schemas/associations'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework', () => {
  describe('schema - associations snake', () => {
    it('generates correct code', () => {
      const code = SequelizeFramework.generate({
        schema: associationsSchema,
        dbOptions: { ...defaultDbOptions, caseStyle: DbCaseStyle.Snake },
      })
      expect(code).toMatchSnapshot()
    })
  })
})
