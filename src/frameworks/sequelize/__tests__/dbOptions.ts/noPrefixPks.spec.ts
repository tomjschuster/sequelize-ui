import { defaultDbOptions } from '@src/core/database'
import schema from '@src/frameworks/__fixtures__/schemas/pks'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework', () => {
  describe('no prefix pks options', () => {
    it('generates correct code', () => {
      const code = SequelizeFramework.generate({
        schema,
        dbOptions: {
          ...defaultDbOptions,
          prefixPks: false,
        },
      })
      expect(code).toMatchSnapshot()
    })
  })
})
