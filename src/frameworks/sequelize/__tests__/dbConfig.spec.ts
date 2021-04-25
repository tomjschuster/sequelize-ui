import {
  DatabaseCaseStyle,
  DatabaseNounForm,
  DatabaseOptions,
  defaultDbOptions,
  SqlDialect,
} from '@src/core/database'
import { dataTypesSchema as schema } from '@src/data/schemas/dataTypes'
import { SequelizeFramework } from '..'

describe('Sequelize Framework', () => {
  describe('database options', () => {
    const dialects: SqlDialect[] = Object.values(SqlDialect)

    it.each(dialects)(
      'generates correct code for %s with supported types and the propper config',
      (sqlDialect) => {
        const code = SequelizeFramework.generate({
          schema,
          dbOptions: { ...defaultDbOptions, sqlDialect },
        })
        expect(code).toMatchSnapshot()
      },
    )

    const configs: [key: string, options: Partial<DatabaseOptions>][] = [
      ['snake case columns and tables', { caseStyle: DatabaseCaseStyle.Snake }],
      ['camel case columns and tables', { caseStyle: DatabaseCaseStyle.Camel }],
      [
        'camel case columns and singular tables',
        { caseStyle: DatabaseCaseStyle.Camel, nounForm: DatabaseNounForm.Singular },
      ],
      ['plural tables', { nounForm: DatabaseNounForm.Plural }],
      ['singular tables', { nounForm: DatabaseNounForm.Singular }],
      ['timestamps', { timestamps: true }],
      ['no timestamps', { timestamps: false }],
    ]

    it.each(configs)('generates correct code for %s', (_label, dbOptions) => {
      const code = SequelizeFramework.generate({
        schema,
        dbOptions: { ...defaultDbOptions, ...dbOptions },
      })
      expect(code).toMatchSnapshot()
    })
  })
})
