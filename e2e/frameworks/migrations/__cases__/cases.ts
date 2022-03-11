import { DbCaseStyle, DbNounForm, DbOptions, SqlDialect } from '@src/core/database'
import { Schema } from '@src/core/schema'

export type ExpectedSchemaCase = {
  schema: Schema
  tableColumns: ExpectedColumns
}

type DbOptionsCase = keyof typeof dbOptionsCases

type ColumnCase = string | [string, SqlDialect[]]

export function columnCaseToColumn(columnCase: ColumnCase, sqlDialect: SqlDialect): string | null {
  if (typeof columnCase === 'string') return columnCase
  if (columnCase[1].includes(sqlDialect)) return columnCase[0]
  return null
}

export type ExpectedColumns = {
  [Key in DbOptionsCase]: Record<string, ColumnCase[]>
}

const dbOptionsCases = {
  snakePlural: {
    prefixPks: null,
    timestamps: true,
    caseStyle: DbCaseStyle.Snake,
    nounForm: DbNounForm.Plural,
    migrations: true,
  },
  snakeSingular: {
    prefixPks: null,
    timestamps: true,
    caseStyle: DbCaseStyle.Snake,
    nounForm: DbNounForm.Singular,
    migrations: true,
  },
  camelPlural: {
    prefixPks: null,
    timestamps: true,
    caseStyle: DbCaseStyle.Camel,
    nounForm: DbNounForm.Plural,
    migrations: true,
  },
  camelSingular: {
    prefixPks: null,
    timestamps: true,
    caseStyle: DbCaseStyle.Camel,
    nounForm: DbNounForm.Singular,
    migrations: true,
  },
  noTimestamps: {
    prefixPks: null,
    timestamps: false,
    caseStyle: DbCaseStyle.Snake,
    nounForm: DbNounForm.Plural,
    migrations: true,
  },
  prefixPks: {
    prefixPks: true,
    timestamps: true,
    caseStyle: DbCaseStyle.Snake,
    nounForm: DbNounForm.Plural,
    migrations: true,
  },
} as const

export const cases = Object.entries(dbOptionsCases) as [
  DbOptionsCase,
  Omit<DbOptions, 'sqlDialect'>,
][]
