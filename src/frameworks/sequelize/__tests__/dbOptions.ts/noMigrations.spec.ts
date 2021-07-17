import { defaultDbOptions } from '@src/core/database'
import schema from '@src/data/schemas/sakila'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework', () => {
  describe('no migrations database options', () => {
    it('generates correct code', () => {
      const code = SequelizeFramework.generate({
        schema,
        dbOptions: {
          ...defaultDbOptions,
          migrations: false,
        },
      })
      expect(code).toMatchSnapshot()
    })
  })
})
