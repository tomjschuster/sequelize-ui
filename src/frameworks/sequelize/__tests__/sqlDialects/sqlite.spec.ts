import { defaultDbOptions, SqlDialect } from '@src/core/database'
import schema from '@src/frameworks/__fixtures__/schemas/dataTypes'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework ', () => {
  describe('SQLite', () => {
    it('generates correct code with supported types and the proper config', () => {
      const code = SequelizeFramework.generate({
        schema,
        dbOptions: { ...defaultDbOptions, sqlDialect: SqlDialect.Sqlite },
      })
      expect(code).toMatchSnapshot()
    })
  })
})
