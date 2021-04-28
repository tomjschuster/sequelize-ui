import { DatabaseCaseStyle, defaultDbOptions } from '@src/core/database'
import schema from '@src/data/schemas/dataTypes'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework', () => {
  describe('snake case database options', () => {
    it('generates correct code', () => {
      const code = SequelizeFramework.generate({
        schema,
        dbOptions: {
          ...defaultDbOptions,
          caseStyle: DatabaseCaseStyle.Snake,
        },
      })
      expect(code).toMatchSnapshot()
    })
  })
})
