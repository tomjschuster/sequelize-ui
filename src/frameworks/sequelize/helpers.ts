import { SqlDialect } from '@src/core/database'
import { DataTypeType, Field, Model } from '@src/core/schema'
import { pascalCase, singular } from '@src/core/utils/string'
import shortid from 'shortid'

export const modelName = ({ name }: Model): string => singular(pascalCase(name))

export const addIdField = (fields: Field[]): Field[] =>
  fields.some((f) => f.primaryKey) ? fields : [idField(), ...fields]

const idField = (): Field => ({
  id: shortid(),
  name: 'id',
  type: { type: DataTypeType.Integer },
  primaryKey: true,
})

export const hasJsonType = (model: Model): boolean =>
  model.fields.some((f) => f.type.type === DataTypeType.Json)

export const literalFunction = (fn: string): string => `Sequelize.literal('${fn}')`

export const sqlDialiectConfigValue = (dialect: SqlDialect): string => {
  switch (dialect) {
    case SqlDialect.MariaDb:
      return 'mariadb'
    case SqlDialect.MsSql:
      return 'mssql'
    case SqlDialect.MySql:
      return 'mysql'
    case SqlDialect.Postgres:
      return 'postgres'
    case SqlDialect.Sqlite:
      return 'sqlite'
  }
}
