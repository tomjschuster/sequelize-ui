import { DbNounForm, defaultDbOptions } from '@src/core/database'
import schema from '@src/frameworks/__fixtures__/schemas/dataTypes'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework', () => {
  describe('plural database options', () => {
    it('generates correct code', () => {
      const code = SequelizeFramework.generate({
        schema,
        dbOptions: {
          ...defaultDbOptions,
          nounForm: DbNounForm.Plural,
        },
      })
      expect(code).toMatchSnapshot()
    })
  })
})
