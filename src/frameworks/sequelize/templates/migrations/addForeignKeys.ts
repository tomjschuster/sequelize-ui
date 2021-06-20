import { blank, lines } from '@src/core/codegen'
import { caseByDbCaseStyle, DbOptions } from '@src/core/database'
import { Field, Model, Schema } from '@src/core/schema'
import { dbTableName, getDbColumnFields, Reference } from '../../utils/migrations'

export function migrationForeignKeysFilename(timestamp: number): string {
  return `${timestamp}-add-foreign-keys.js`
}

type Constraint = {
  sourceTable: string
  sourceColumn: string
  targetTable: string
  targetColumn: string
  name: string
}

type AddForeignKeysMigrationArgs = {
  schema: Schema
  dbOptions: DbOptions
}
export function addForeignKeysMigration({
  schema,
  dbOptions,
}: AddForeignKeysMigrationArgs): string {
  const constraints: Constraint[] = schema.models.flatMap((model) =>
    getModelConstraints({ model, schema, dbOptions }),
  )

  return lines([
    // TODO refactor type defs to use either Sequelize or DataTypes
    `const DataTypes = require('sequelize').DataTypes`,
    blank(),
    `module.exports = {`,
    up({ constraints }),
    down({ constraints }),
    `};`,
  ])
}

type UpArgs = {
  constraints: Constraint[]
}
function up({ constraints }: UpArgs): string {
  return lines(
    [
      `up: async (queryInterface, Sequelize) => {`,
      lines(
        constraints.map((constraint) => {
          return lines([
            `await queryInterface.addConstraint('${constraint.sourceTable}', {`,
            lines(constraintFields(constraint), {
              depth: 2,
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

type DownArgs = {
  constraints: Constraint[]
}
function down({ constraints }: DownArgs): string {
  return lines(
    [
      `down: async (queryInterface, Sequelize) => {`,
      lines(
        constraints.map(({ sourceTable, name }) => {
          return lines([`await queryInterface.removeConstraint('${sourceTable}', '${name}')`], {
            depth: 2,
            separator: '\n',
          })
        }),
      ),
      '}',
    ],
    { depth: 2 },
  )
}

type GetModelConstraintsArgs = {
  model: Model
  schema: Schema
  dbOptions: DbOptions
}
function getModelConstraints({ model, schema, dbOptions }: GetModelConstraintsArgs): Constraint[] {
  const sourceTable = dbTableName({ model, dbOptions })

  return getDbColumnFields({ model, schema, dbOptions })
    .filter((fr): fr is [Field, Reference] => !!fr[1])
    .map<Constraint>(([field, reference]) => {
      const sourceColumn = caseByDbCaseStyle(field.name, dbOptions.caseStyle)
      return {
        sourceTable,
        sourceColumn,
        targetTable: reference.table,
        targetColumn: reference.column,
        name: `${sourceTable}_${sourceColumn}_fkey`,
      }
    })
}

function constraintFields({
  sourceColumn,
  targetTable,
  targetColumn,
  name,
}: Constraint): (string | null)[] {
  return [
    `fields: ['${sourceColumn}'],`,
    `type: 'foreign key',`,
    // TODO: name by sql dialect conventions
    `name: '${name}',`,
    'references: {',
    lines([`table: '${targetTable}'`, `field: '${targetColumn}'`], {
      depth: 2,
      separator: ',',
    }),
    '}',
  ]
}
