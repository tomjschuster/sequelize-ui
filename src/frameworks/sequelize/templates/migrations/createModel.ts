import { blank, indent, lines } from '@src/core/codegen'
import { DbOptions } from '@src/core/database'
import { Model, Schema } from '@src/core/schema'
import { dbTableName, fieldTemplate, getDbColumnFields } from '../../utils/helpers'

type CreateModelMigrationArgs = {
  model: Model
  schema: Schema
  dbOptions: DbOptions
}

export function createModelMigration({
  model,
  schema,
  dbOptions,
}: CreateModelMigrationArgs): string {
  return lines([
    // TODO refactor type defs to use either Sequelize or DataTypes
    `const DataTypes = require('sequelize').DataTypes`,
    blank(),
    `module.exports = {`,
    up({ model, schema, dbOptions }),
    down({ model, schema, dbOptions }),
    `};`,
  ])
}

function up({ model, schema, dbOptions }: CreateModelMigrationArgs): string {
  const tableName = dbTableName({ model, dbOptions })
  return lines(
    [
      `up: async (queryInterface, Sequelize) => {`,
      lines(
        [
          `await queryInterface.createTable('${tableName}', {`,
          lines(
            getDbColumnFields({ model, schema, dbOptions }).map(([field]) =>
              fieldTemplate({ field, dbOptions, define: true }),
            ),
            { depth: 2, separator: ',' },
          ),
          `})`,
        ],
        { depth: 2 },
      ),
      `},`,
    ],
    { depth: 2 },
  )
}

function down({ model, dbOptions }: CreateModelMigrationArgs): string {
  const tableName = dbTableName({ model, dbOptions })
  return lines(
    [
      `down: async (queryInterface, Sequelize) => {`,
      indent(2, `await queryInterface.dropTable('${tableName}');`),
      `},`,
    ],
    { depth: 2 },
  )
}
