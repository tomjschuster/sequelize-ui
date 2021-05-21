import { blank, lines } from '@src/core/codegen'
import { caseByDbCaseStyle, DbOptions } from '@src/core/database'
import { Field, Schema } from '@src/core/schema'
import { dbTableName, getDbColumnFields, Reference } from '../../helpers'
import { fieldOptions } from '../model/modelClass'

type AddForeignKeysMigrationArgs = {
  schema: Schema
  dbOptions: DbOptions
}

export function addForeignKeysMigration({
  schema,
  dbOptions,
}: AddForeignKeysMigrationArgs): string {
  return lines([
    // TODO refactor type defs to use either Sequelize or DataTypes
    `const DataTypes = require('sequelize').DataTypes`,
    blank(),
    `module.exports = {`,
    up({ schema, dbOptions }),
    down({ schema, dbOptions }),
    `};`,
  ])
}

type TableFieldReference = [tableName: string, field: Field, reference: Reference]

function up({ schema, dbOptions }: AddForeignKeysMigrationArgs): string {
  const tableFieldReferences: TableFieldReference[] = schema.models.flatMap((model) => {
    const tableName = dbTableName({ model, dbOptions })
    return getDbColumnFields({ model, schema, dbOptions })
      .filter((fr): fr is [Field, Reference] => !!fr[1])
      .map<TableFieldReference>(([field, reference]) => [tableName, field, reference])
  })

  return lines(
    [
      `up: async (queryInterface, Sequelize) => {`,
      lines(
        tableFieldReferences.map(([table, field, reference]) => {
          const column = caseByDbCaseStyle(field.name, dbOptions.caseStyle)
          return lines([
            `await queryInterface.changeColumn('${table}', '${column}', {`,
            lines(fieldOptions({ field, dbOptions, defineField: true, reference }), {
              depth: 2,
              separator: ',',
            }),
            `})`,
          ])
        }),
        { depth: 2, separator: '\n' },
      ),
      '},',
    ],
    { depth: 2 },
  )
}

function down({ schema, dbOptions }: AddForeignKeysMigrationArgs): string {
  const tableFieldReferences: TableFieldReference[] = schema.models.flatMap((model) => {
    const tableName = dbTableName({ model, dbOptions })
    return getDbColumnFields({ model, schema, dbOptions })
      .filter((fr): fr is [Field, Reference] => !!fr[1])
      .map<TableFieldReference>(([field, reference]) => [tableName, field, reference])
  })

  return lines(
    [
      `down: async (queryInterface, Sequelize) => {`,
      lines(
        tableFieldReferences.map(([table, field]) => {
          const column = caseByDbCaseStyle(field.name, dbOptions.caseStyle)
          return lines([
            `await queryInterface.changeColumn('${table}', '${column}', {`,
            lines(fieldOptions({ field, dbOptions, defineField: true }), {
              depth: 2,
              separator: ',',
            }),
            `})`,
          ])
        }),
        { depth: 2, separator: '\n' },
      ),
      '}',
    ],
    { depth: 2 },
  )
}
