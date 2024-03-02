import sakila from '@src/api/schema/examples/sakila'
import { DbCaseStyle, DbNounForm, DbOptions, defaultDbOptions } from '@src/core/database'
import { FileSystemItem } from '@src/core/files/fileSystem'
import { printFileSystemItem } from '@src/frameworks/testUtils'
import { kebabCase } from '@src/utils/string'
import { addSerializer } from 'jest-specific-snapshot'
import { SequelizeFramework } from '..'

addSerializer({
  test() {
    return true
  },
  print(item: FileSystemItem) {
    return printFileSystemItem(item, ['sakila/db.ts', 'sakila/models/Film.ts'])
  },
})

const snakePlural: DbOptions = {
  ...defaultDbOptions,
  caseStyle: DbCaseStyle.Snake,
  nounForm: DbNounForm.Plural,
}

const snakeSingular: DbOptions = {
  ...defaultDbOptions,
  caseStyle: DbCaseStyle.Snake,
  nounForm: DbNounForm.Singular,
}

const camelPlural: DbOptions = {
  ...defaultDbOptions,
  caseStyle: DbCaseStyle.Camel,
  nounForm: DbNounForm.Plural,
}

const camelSingular: DbOptions = {
  ...defaultDbOptions,
  caseStyle: DbCaseStyle.Camel,
  nounForm: DbNounForm.Singular,
}

const noTimestamps: DbOptions = {
  ...defaultDbOptions,
  timestamps: false,
}

const noPrefixPks: DbOptions = {
  ...defaultDbOptions,
  prefixPks: false,
}

describe('Sequelize Framework', () => {
  const cases: Record<string, DbOptions> = {
    snakePlural,
    snakeSingular,
    camelPlural,
    camelSingular,
    noTimestamps,
    noPrefixPks,
  }

  it.each(Object.entries(cases))('generates the correct code for %s', (key, dbOptions) => {
    const code = SequelizeFramework.generate({ schema: sakila, dbOptions })
    expect(code).toMatchSpecificSnapshot(`./__snapshots__/config-${kebabCase(key)}.shot`)
  })

  const paranoidCases: Record<string, DbOptions> = {
    snakePlural,
    noTimestamps,
  }

  const paranoidSchema = {
    ...sakila,
    models: sakila.models.map((model) => ({ ...model, softDelete: true })),
  }

  it.each(Object.entries(paranoidCases))(
    'generates the correct code for paranoid models with %s',
    (key, dbOptions) => {
      const code = SequelizeFramework.generate({ schema: paranoidSchema, dbOptions })
      expect(code).toMatchSpecificSnapshot(`./__snapshots__/config-paranoid-${kebabCase(key)}.shot`)
    },
  )
})
