import { defaultDbOptions } from '@src/core/database'
import { Schema } from '@src/core/schema'
import blogSchema from '@src/data/schemas/blog'
import employeeTemporalDatasetSchema from '@src/data/schemas/employeeTemporalDataset'
import sakilaSchema from '@src/data/schemas/sakila'
import { SequelizeFramework } from '..'

describe('Sequelize Framework', () => {
  describe('schema', () => {
    const cases: [key: string, schema: Schema][] = [
      ['sakila', sakilaSchema],
      ['sakila', employeeTemporalDatasetSchema],
      ['sakila', blogSchema],
    ]

    it.each(cases)('generates correct code for %s', (_label, schema) => {
      const code = SequelizeFramework.generate({
        schema,
        dbOptions: defaultDbOptions,
      })
      expect(code).toMatchSnapshot()
    })
  })
})
