import { DatabaseCaseStyle, DatabaseNounForm, defaultDbOptions } from '@src/core/database'
import schema from '@src/data/schemas/dataTypes'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework', () => {
  describe('camel case singular database options', () => {
    it('generates correct code', () => {
      const code = SequelizeFramework.generate({
        schema,
        dbOptions: {
          ...defaultDbOptions,
          caseStyle: DatabaseCaseStyle.Camel,
          nounForm: DatabaseNounForm.Singular,
        },
      })
      expect(code).toMatchSnapshot()
    })
  })
})
