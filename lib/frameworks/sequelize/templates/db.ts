import {
  blank,
  DatabaseOptions,
  defaultSqlDialectDatabase,
  defaultSqlDialectHost,
  defaultSqlDialectPassword,
  defaultSqlDialectPort,
  defaultSqlDialectStorage,
  defaultSqlDialectUsername,
  displaySqlDialect,
  lines,
  Schema,
  SqlDialect,
  varSqlDialect,
} from "@lib/core";

export type DbTemplateArgs = {
  schema: Schema;
  dbOptions: DatabaseOptions;
};

export const dbTemplate = ({ schema, dbOptions }: DbTemplateArgs): string =>
  lines([
    imports(),
    blank(),
    instanceDeclaration({ schema, dbOptions }),
    blank(),
    exportInstance(),
    blank(),
  ]);

const imports = (): string => `import { Sequelize } from 'sequelize'`;

const instanceDeclaration = ({ schema, dbOptions }: DbTemplateArgs) =>
  lines([
    `const db: Sequelize = new Sequelize({`,
    lines(
      [
        dialectField(dbOptions.sqlDialect),
        storageField(dbOptions.sqlDialect),
        databaseField(schema.name, dbOptions.sqlDialect),
        usernameField(dbOptions.sqlDialect),
        passwordField(dbOptions.sqlDialect),
        hostField(dbOptions.sqlDialect),
        portField(dbOptions.sqlDialect),
        defineField(dbOptions),
      ],
      { separator: ",", depth: 2 }
    ),
    "})",
  ]);

const exportInstance = (): string => "export default db";

const dialectField = (dialect: SqlDialect): string =>
  `dialect: '${displaySqlDialect(dialect)}'`;

const storageField = (dialect: SqlDialect): string | null => {
  const defaultStorage = defaultSqlDialectStorage(dialect);
  return defaultStorage
    ? `storage: process.env.${varSqlDialect(dialect)} || '${defaultStorage}'`
    : null;
};

const databaseField = (
  schemaName: string,
  dialect: SqlDialect
): string | null => {
  const defaultDatabase = defaultSqlDialectDatabase(schemaName, dialect);
  return defaultDatabase
    ? `database: process.env.${varSqlDialect(
        dialect
      )}_DB_NAME || '${defaultDatabase}'`
    : null;
};

const usernameField = (dialect: SqlDialect): string | null => {
  const defaultUsername = defaultSqlDialectUsername(dialect);
  return defaultUsername
    ? `username: process.env.${varSqlDialect(
        dialect
      )}_DB_USERNAME || '${defaultUsername}'`
    : null;
};

const passwordField = (dialect: SqlDialect): string | null => {
  const defaultPassword = defaultSqlDialectPassword(dialect);
  return defaultPassword
    ? `password: process.env.${varSqlDialect(
        dialect
      )}_DB_PASSWORD || '${defaultPassword}'`
    : null;
};

const hostField = (dialect: SqlDialect): string | null => {
  const defaultHost = defaultSqlDialectHost(dialect);
  return defaultHost
    ? `host: process.env.${varSqlDialect(dialect)}_DB_HOST || '${defaultHost}'`
    : null;
};

const portField = (dialect: SqlDialect): string | null => {
  const defaultPort = defaultSqlDialectPort(dialect);
  return defaultPort
    ? `port: parseInt(process.env.${varSqlDialect(
        dialect
      )}_DB_PORT || '${defaultPort}')`
    : null;
};

const hasOptions = (dbOptions: DatabaseOptions): boolean =>
  !dbOptions.timestamps ||
  dbOptions.caseStyle === "snake" ||
  dbOptions.nounForm === "singular";

const defineField = (dbOptions: DatabaseOptions): string | null =>
  !hasOptions(dbOptions)
    ? null
    : lines([
        `define: {`,
        lines(
          [
            freezeTableNameField(dbOptions),
            underscoredField(dbOptions.caseStyle === "snake"),
            timestampsField(dbOptions.timestamps),
            createdAtField(dbOptions),
            updatedAtField(dbOptions),
          ],
          { separator: ",", depth: 2 }
        ),
        "}",
      ]);

const underscoredField = (underscored: boolean): string | null =>
  underscored ? "underscored: true" : null;

const timestampsField = (timestamps: boolean): string | null =>
  timestamps ? null : "timestamps: false";

const createdAtField = ({
  caseStyle,
  timestamps,
}: DatabaseOptions): string | null =>
  caseStyle === "snake" && timestamps ? `createdAt: 'created_at'` : null;

const updatedAtField = ({
  caseStyle,
  timestamps,
}: DatabaseOptions): string | null =>
  caseStyle === "snake" && timestamps ? `updatedAt: 'updated_at'` : null;

const freezeTableNameField = ({
  caseStyle,
  nounForm,
}: DatabaseOptions): string | null =>
  caseStyle === "camel" && nounForm === "singular"
    ? `freezeTableName: true`
    : null;
