import { blank, lines } from '@src/core/codegen'
import { caseByDbCaseStyle, DbOptions } from '@src/core/database'
import { dbTableName, ModelWithReferences } from '../../utils/migrations'

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
  models: ModelWithReferences[]
  dbOptions: DbOptions
}
export function addForeignKeysMigration({
  dbOptions,
  models,
}: AddForeignKeysMigrationArgs): string {
  const constraints: Constraint[] = models.flatMap((model) =>
    getModelConstraints({ model, dbOptions }),
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
  model: ModelWithReferences
  dbOptions: DbOptions
}
function getModelConstraints({ model, dbOptions }: GetModelConstraintsArgs): Constraint[] {
  const sourceTable = dbTableName({ model, dbOptions })

  return model.fields
    .map<Constraint | null>((field) => {
      if (!field.reference) return null
      const sourceColumn = caseByDbCaseStyle(field.name, dbOptions.caseStyle)
      return {
        sourceTable,
        sourceColumn,
        targetTable: field.reference.table,
        targetColumn: field.reference.column,
        name: `${sourceTable}_${sourceColumn}_fkey`,
      }
    })
    .filter((c): c is Constraint => !!c)
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
