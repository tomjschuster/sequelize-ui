import {
  DbCaseStyle,
  DbNounForm,
  defaultSqlDialectDatabase,
  defaultSqlDialectHost,
  defaultSqlDialectPassword,
  defaultSqlDialectPort,
  defaultSqlDialectStorage,
  defaultSqlDialectUsername,
  displayDatabaseCaseStyle,
  displayDatabaseNounForm,
  displaySqlDialect,
  MAX_IDENTIFIER_LENGTH,
  parseSqlDialect,
  SqlDialect,
  sqlDialectEnvVar,
} from '..'

describe('database', () => {
  describe('displaySqlDialect', () => {
    const cases: [dialect: SqlDialect, expected: string][] = [
      [SqlDialect.MariaDb, 'MariaDB'],
      [SqlDialect.MsSql, 'SQL Server'],
      [SqlDialect.MySql, 'MySQL'],
      [SqlDialect.Postgres, 'PostgreSQL'],
      [SqlDialect.Sqlite, 'SQLite'],
    ]
    describe.each(cases)('', (dialect, expected) => {
      fit(`(${dialect}) === ${JSON.stringify(expected)}`, () => {
        expect(displaySqlDialect(dialect)).toEqual(expected)
      })
    })
  })

  describe('sqlDialectEnvVar', () => {
    const cases: [dialect: SqlDialect, expected: string][] = [
      [SqlDialect.MariaDb, 'MARIADB'],
      [SqlDialect.MsSql, 'MSSQL'],
      [SqlDialect.MySql, 'MYSQL'],
      [SqlDialect.Postgres, 'POSTGRES'],
      [SqlDialect.Sqlite, 'SQLITE'],
    ]
    describe.each(cases)('', (dialect, expected) => {
      fit(`(${dialect}) === ${JSON.stringify(expected)}`, () => {
        expect(sqlDialectEnvVar(dialect)).toEqual(expected)
      })
    })
  })

  describe('parseSqlDialect', () => {
    const cases: [dialect: string, expected: SqlDialect | null][] = [
      ['mariadb', SqlDialect.MariaDb],
      ['mssql', SqlDialect.MsSql],
      ['mysql', SqlDialect.MySql],
      ['postgres', SqlDialect.Postgres],
      ['sqlite', SqlDialect.Sqlite],
      ['foo', null],
      ['MARIADB', null],
      ['maria db', null],
      ['', null],
    ]
    describe.each(cases)('', (dialect, expected) => {
      fit(`(${dialect}) === ${JSON.stringify(expected)}`, () => {
        expect(parseSqlDialect(dialect)).toEqual(expected)
      })
    })
  })

  describe('defaultSqlDialectPort', () => {
    const cases: [dialect: SqlDialect, expected: string | null][] = [
      [SqlDialect.MariaDb, '3306'],
      [SqlDialect.MsSql, '1433'],
      [SqlDialect.MySql, '3306'],
      [SqlDialect.Postgres, '5432'],
      [SqlDialect.Sqlite, null],
    ]
    describe.each(cases)('', (dialect, expected) => {
      fit(`(${dialect}) === ${JSON.stringify(expected)}`, () => {
        expect(defaultSqlDialectPort(dialect)).toEqual(expected)
      })
    })
  })

  describe('defaultSqlDialectUsername', () => {
    const cases: [dialect: SqlDialect, expected: string | null][] = [
      [SqlDialect.MariaDb, 'root'],
      [SqlDialect.MsSql, 'sa'],
      [SqlDialect.MySql, 'root'],
      [SqlDialect.Postgres, 'postgres'],
      [SqlDialect.Sqlite, null],
    ]
    describe.each(cases)('(%s)', (dialect, expected) => {
      fit(` ${JSON.stringify(expected)}`, () => {
        expect(defaultSqlDialectUsername(dialect)).toEqual(expected)
      })
    })
  })

  describe('defaultSqlDialectPassword', () => {
    const cases: [dialect: SqlDialect, expected: string | null][] = [
      [SqlDialect.MariaDb, 'root'],
      [SqlDialect.MsSql, 'Password1'],
      [SqlDialect.MySql, 'root'],
      [SqlDialect.Postgres, 'postgres'],
      [SqlDialect.Sqlite, null],
    ]
    describe.each(cases)('(%s)', (dialect, expected) => {
      fit(` ${JSON.stringify(expected)}`, () => {
        expect(defaultSqlDialectPassword(dialect)).toEqual(expected)
      })
    })
  })

  describe('defaultSqlDialectDatabase', () => {
    const cases: [name: string, dialect: SqlDialect, expected: string | null][] = [
      ['foo', SqlDialect.MariaDb, 'foo'],
      ['foo', SqlDialect.MsSql, 'Foo'],
      ['foo', SqlDialect.MySql, 'foo'],
      ['foo', SqlDialect.Postgres, 'foo'],
      ['foo', SqlDialect.Sqlite, null],
    ]
    describe.each(cases)('(%s)', (name, dialect, expected) => {
      fit(` ${JSON.stringify(expected)}`, () => {
        expect(defaultSqlDialectDatabase(name, dialect)).toEqual(expected)
      })
    })
  })

  describe('defaultSqlDialectHost', () => {
    const cases: [dialect: SqlDialect, expected: string | null][] = [
      [SqlDialect.MariaDb, 'localhost'],
      [SqlDialect.MsSql, 'localhost'],
      [SqlDialect.MySql, 'localhost'],
      [SqlDialect.Postgres, 'localhost'],
      [SqlDialect.Sqlite, null],
    ]
    describe.each(cases)('(%s)', (dialect, expected) => {
      fit(` ${JSON.stringify(expected)}`, () => {
        expect(defaultSqlDialectHost(dialect)).toEqual(expected)
      })
    })
  })

  describe('defaultSqlDialectStorage', () => {
    const cases: [dialect: SqlDialect, expected: string | null][] = [
      [SqlDialect.MariaDb, null],
      [SqlDialect.MsSql, null],
      [SqlDialect.MySql, null],
      [SqlDialect.Postgres, null],
      [SqlDialect.Sqlite, '.tmp/data.db'],
    ]
    describe.each(cases)('(%s)', (dialect, expected) => {
      fit(` ${JSON.stringify(expected)}`, () => {
        expect(defaultSqlDialectStorage(dialect)).toEqual(expected)
      })
    })
  })

  describe('displayDatabaseNounForm', () => {
    const cases: [dialect: DbNounForm, expected: string][] = [
      [DbNounForm.Singular, 'singular'],
      [DbNounForm.Plural, 'plural'],
    ]
    describe.each(cases)('(%s)', (nounForm, expected) => {
      fit(` ${JSON.stringify(expected)}`, () => {
        expect(displayDatabaseNounForm(nounForm)).toEqual(expected)
      })
    })
  })

  describe('displayDatabaseCaseStyle', () => {
    const cases: [dialect: DbCaseStyle, expected: string][] = [
      [DbCaseStyle.Snake, 'snake'],
      [DbCaseStyle.Camel, 'camel'],
    ]
    describe.each(cases)('(%s)', (caseStyle, expected) => {
      fit(` ${JSON.stringify(expected)}`, () => {
        expect(displayDatabaseCaseStyle(caseStyle)).toEqual(expected)
      })
    })
  })

  describe('MAX_IDENTIFIER_LENGTH', () => {
    fit('should be the proper value', () => {
      expect(MAX_IDENTIFIER_LENGTH).toEqual(63)
    })
  })
})
