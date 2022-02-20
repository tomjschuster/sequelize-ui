import blog from '@src/api/schema/examples/blog'
import employees from '@src/api/schema/examples/employees'
import sakila from '@src/api/schema/examples/sakila'
import {
  DbCaseStyle,
  DbNounForm,
  DbOptions,
  defaultDbOptions,
  SqlDialect,
} from '@src/core/database'
import { FileItem, FileSystemItem, isFile, withPathsBreadthFirst } from '@src/core/files/fileSystem'
import { Schema } from '@src/core/schema'
import { kebabCase } from '@src/utils/string'
import { addSerializer } from 'jest-specific-snapshot'
import { SequelizeFramework } from '..'

addSerializer({
  test() {
    return true
  },
  print(item: FileSystemItem) {
    return printFileSystemItem(item)
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

const allDbOptions: Record<string, DbOptions> = {
  snakePlural,
  snakeSingular,
  camelPlural,
  camelSingular,
  noTimestamps,
  noPrefixPks,
}

describe('Sequelize Framework', () => {
  type Case = [string, Schema, DbOptions]

  const schemaCases = [blog, sakila, employees].map<Case>((schema) => [
    `schema-${kebabCase(schema.name)}`,
    schema,
    defaultDbOptions,
  ])

  const dbOptionsCases = Object.entries(allDbOptions).map<Case>(([key, dbOptions]) => [
    `options-${kebabCase(key)}`,
    sakila,
    dbOptions,
  ])

  const dialectCases = Object.values(SqlDialect).map<Case>((sqlDialect) => [
    `dialect-${kebabCase(sqlDialect)}`,
    sakila,
    { ...defaultDbOptions, sqlDialect },
  ])

  it.each([...schemaCases, ...dbOptionsCases, ...dialectCases])(
    'generates the correct code for %s',
    (key, schema, dbOptions) => {
      const code = SequelizeFramework.generate({ schema, dbOptions })
      expect(code).toMatchSpecificSnapshot(`./__snapshots__/${key}.shot`)
    },
  )
})

function jsDoc(value: string): string {
  const leftPad = Math.max(0, 38 - Math.ceil(value.length / 2))
  const rightPad = Math.max(0, 38 - Math.floor(value.length / 2))
  return [
    `/${'*'.repeat(78)}`,
    ` *${' '.repeat(leftPad)}${value}${' '.repeat(rightPad)}*`,
    ` ${'*'.repeat(78)}/`,
  ].join('\n')
}

function printFileSystemItem(item: FileSystemItem): string {
  return withPathsBreadthFirst(item)
    .filter((value): value is [string, FileItem] => isFile(value[1]))
    .map(([path, file]) => `\n${jsDoc('/' + path)}\n\n${file.content}\n`)
    .join('')
}
