import { defaultDbOptions, SqlDialect } from '@src/core/database'
import schema from '@src/frameworks/__fixtures__/schemas/dataTypes'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework ', () => {
  describe('SQL Server', () => {
    it('generates correct code with supported types and the proper config', () => {
      const code = SequelizeFramework.generate({
        schema,
        dbOptions: { ...defaultDbOptions, sqlDialect: SqlDialect.MsSql },
      })
      expect(code).toMatchSnapshot()
    })
  })
})
