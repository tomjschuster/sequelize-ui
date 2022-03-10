import { blank, lines } from '@src/core/codegen'
import { DbCaseStyle, DbNounForm, DbOptions } from '@src/core/database'

export type DbTemplateArgs = {
  dbOptions: DbOptions
}

export function dbTemplate({ dbOptions }: DbTemplateArgs): string {
  return lines([
    imports(),
    blank(),
    instanceDeclaration({ dbOptions }),
    blank(),
    exportInstance(),
    blank(),
  ])
}

const imports = (): string =>
  lines([
    `import { Sequelize, Options } from 'sequelize'`,
    `import configs from './config/config.js'`,
    blank(),
    `const env = process.env.NODE_ENV || 'development'`,
    `const config = (configs as {[key: string]: Options})[env]`,
  ])

const instanceDeclaration = ({ dbOptions }: DbTemplateArgs) =>
  lines([
    `const db: Sequelize = new Sequelize({`,
    lines(['...config', defineField(dbOptions)], { separator: ',', depth: 2 }),
    '})',
  ])

const exportInstance = (): string => 'export default db'

const hasOptions = (dbOptions: DbOptions): boolean =>
  !dbOptions.timestamps ||
  dbOptions.caseStyle === DbCaseStyle.Snake ||
  dbOptions.nounForm === DbNounForm.Singular

const defineField = (dbOptions: DbOptions): string | null =>
  !hasOptions(dbOptions)
    ? null
    : lines([
        `define: {`,
        lines(
          [
            freezeTableNameField(dbOptions),
            underscoredField(dbOptions.caseStyle === DbCaseStyle.Snake),
            timestampsField(dbOptions.timestamps),
          ],
          { separator: ',', depth: 2 },
        ),
        '}',
      ])

const underscoredField = (underscored: boolean): string | null =>
  underscored ? 'underscored: true' : null

const timestampsField = (timestamps: boolean): string | null =>
  timestamps ? null : 'timestamps: false'

const freezeTableNameField = ({ caseStyle, nounForm }: DbOptions): string | null =>
  caseStyle === DbCaseStyle.Camel && nounForm === DbNounForm.Singular
    ? `freezeTableName: true`
    : null
