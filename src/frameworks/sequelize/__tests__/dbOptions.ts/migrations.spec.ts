import { defaultDbOptions } from '@src/core/database'
import schema from '@src/data/schemas/sakila'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework', () => {
  describe('camel case singular database options', () => {
    it('generates correct code', () => {
      const code = SequelizeFramework.generate({
        schema,
        dbOptions: {
          ...defaultDbOptions,
          migrations: true,
        },
      })
      expect(code).toMatchSnapshot()
    })
  })
})
