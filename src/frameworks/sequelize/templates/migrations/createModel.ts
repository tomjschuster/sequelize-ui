import { blank, indent, lines } from '@src/core/codegen'
import { DbOptions } from '@src/core/database'
import { Model } from '@src/core/schema'
import { fieldTemplate } from '../../utils/field'
import { dbTableName } from '../../utils/migrations'

type MigrationCreateFileNameArgs = {
  model: Model
  dbOptions: DbOptions
  timestamp: number
}

export function migrationCreateFilename({
  model,
  dbOptions,
  timestamp,
}: MigrationCreateFileNameArgs): string {
  return `${timestamp}-create-${dbTableName({ model, dbOptions })}.js`
}

type CreateModelMigrationArgs = {
  model: Model
  dbOptions: DbOptions
}

export function createModelMigration({ model, dbOptions }: CreateModelMigrationArgs): string {
  return lines([
    // TODO refactor type defs to use either Sequelize or DataTypes
    `const DataTypes = require('sequelize').DataTypes`,
    blank(),
    `module.exports = {`,
    up({ model, dbOptions }),
    down({ model, dbOptions }),
    `};`,
  ])
}

function up({ model, dbOptions }: CreateModelMigrationArgs): string {
  const tableName = dbTableName({ model, dbOptions })
  return lines(
    [
      `up: async (queryInterface, Sequelize) => {`,
      lines(
        [
          `await queryInterface.createTable('${tableName}', {`,
          lines(
            model.fields.map((field) =>
              fieldTemplate({ field, dbOptions, define: true, migration: true }),
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
