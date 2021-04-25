import { DatabaseCaseStyle, DatabaseOptions, defaultDbOptions } from '@src/core/database'
import { Schema } from '@src/core/schema'
import { associationsSchema } from '@src/data/schemas/associations'
import { dataTypesSchema } from '@src/data/schemas/dataTypes'
import { fieldsSchema } from '@src/data/schemas/fields'
import { SequelizeFramework } from '..'

describe('Sequelize Framework', () => {
  describe('schema', () => {
    const cases: [key: string, schema: Schema, dbOptions: Partial<DatabaseOptions>][] = [
      ['data types', dataTypesSchema, {}],
      ['fields', fieldsSchema, {}],
      ['associations snake', associationsSchema, { caseStyle: DatabaseCaseStyle.Snake }],
      ['associations camel', associationsSchema, { caseStyle: DatabaseCaseStyle.Camel }],
    ]

    it.each(cases)('generates correct code for %s', (_label, schema, dbOptions) => {
      const code = SequelizeFramework.generate({
        schema,
        dbOptions: { ...defaultDbOptions, ...dbOptions },
      })
      expect(code).toMatchSnapshot()
    })
  })
})
