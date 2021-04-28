import { DatabaseCaseStyle, defaultDbOptions } from '@src/core/database'
import associationsSchema from '@src/data/schemas/associations'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework', () => {
  describe('schema - associations snake', () => {
    it('generates correct code', () => {
      const code = SequelizeFramework.generate({
        schema: associationsSchema,
        dbOptions: { ...defaultDbOptions, caseStyle: DatabaseCaseStyle.Snake },
      })
      expect(code).toMatchSnapshot()
    })
  })
})
