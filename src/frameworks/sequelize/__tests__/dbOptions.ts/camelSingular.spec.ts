import { DbCaseStyle, DbNounForm, defaultDbOptions } from '@src/core/database'
import schema from '@src/frameworks/__fixtures__/schemas/dataTypes'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework', () => {
  describe('migrations database options', () => {
    it('generates correct code', () => {
      const code = SequelizeFramework.generate({
        schema,
        dbOptions: {
          ...defaultDbOptions,
          caseStyle: DbCaseStyle.Camel,
          nounForm: DbNounForm.Singular,
        },
      })
      expect(code).toMatchSnapshot()
    })
  })
})
