import schema from '@src/api/examples/employees'
import { defaultDbOptions } from '@src/core/database'
import { SequelizeFramework } from '../..'

describe('Sequelize Framework', () => {
  it('generates correct code for employee', () => {
    const code = SequelizeFramework.generate({
      schema,
      dbOptions: defaultDbOptions,
    })
    expect(code).toMatchSnapshot()
  })
})
