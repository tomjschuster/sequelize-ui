import { defaultDbOptions } from '@src/core/database'
import schema from '@src/frameworks/__fixtures__/schemas/dataTypes'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework', () => {
  describe('no timestamp database options', () => {
    it('generates correct code', () => {
      const code = SequelizeFramework.generate({
        schema,
        dbOptions: {
          ...defaultDbOptions,
          timestamps: false,
        },
      })
      expect(code).toMatchSnapshot()
    })
  })
})
