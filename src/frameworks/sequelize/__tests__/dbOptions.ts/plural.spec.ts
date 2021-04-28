import { DatabaseNounForm, defaultDbOptions } from '@src/core/database'
import schema from '@src/data/schemas/dataTypes'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework', () => {
  describe('plural database options', () => {
    it('generates correct code', () => {
      const code = SequelizeFramework.generate({
        schema,
        dbOptions: {
          ...defaultDbOptions,
          nounForm: DatabaseNounForm.Plural,
        },
      })
      expect(code).toMatchSnapshot()
    })
  })
})
