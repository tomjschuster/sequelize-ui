import { defaultDbOptions, SqlDialect } from '@src/core/database'
import schema from '@src/data/schemas/dataTypes'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework ', () => {
  describe('MariaDB', () => {
    it('generates correct code with supported types and the proper config', () => {
      const code = SequelizeFramework.generate({
        schema,
        dbOptions: { ...defaultDbOptions, sqlDialect: SqlDialect.MariaDb },
      })
      expect(code).toMatchSnapshot()
    })
  })
})
