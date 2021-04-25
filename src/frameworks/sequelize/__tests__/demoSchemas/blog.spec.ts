import { defaultDbOptions } from '@src/core/database'
import schema from '@src/data/schemas/blog'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework', () => {
  it('generates correct code for blog', () => {
    const code = SequelizeFramework.generate({
      schema,
      dbOptions: defaultDbOptions,
    })
    expect(code).toMatchSnapshot()
  })
})
