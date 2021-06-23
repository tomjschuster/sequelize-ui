import { defaultDbOptions } from '@src/core/database'
import schema from '@src/data/schemas/associations'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework', () => {
  describe('association migrations database options', () => {
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
