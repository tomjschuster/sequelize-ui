import { defaultDbOptions } from '@src/core/database'
import schema from '@src/data/schemas/sakila'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework', () => {
  it('generates correct code for sakila', () => {
    const code = SequelizeFramework.generate({
      schema,
      dbOptions: defaultDbOptions,
    })
    expect(code).toMatchSnapshot()
  })
})
