import {
  caseByDbCaseStyle,
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
  nounFormByDbNounForm,
  parseSqlDialect,
  SqlDialect,
  sqlDialectEnvVar,
  tableCaseByDbCaseStyle,
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
    it.each(cases)('displaySqlDialect(%s) === %s', (dialect, expected) => {
      expect(displaySqlDialect(dialect)).toEqual(expected)
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
    it.each(cases)('sqlDialectEnvVar(%s) === %s', (dialect, expected) => {
      expect(sqlDialectEnvVar(dialect)).toEqual(expected)
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
    it.each(cases)('parseSqlDialect(%s) === %s', (dialect, expected) => {
      expect(parseSqlDialect(dialect)).toEqual(expected)
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
    it.each(cases)('defaultSqlDialectPort(%s) === %s', (dialect, expected) => {
      expect(defaultSqlDialectPort(dialect)).toEqual(expected)
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
    it.each(cases)('defaultSqlDialectUsername(%s) === %s', (dialect, expected) => {
      expect(defaultSqlDialectUsername(dialect)).toEqual(expected)
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
    it.each(cases)('defaultSqlDialectPassword(%s) === %s', (dialect, expected) => {
      expect(defaultSqlDialectPassword(dialect)).toEqual(expected)
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
    it.each(cases)('defaultSqlDialectDatabase(%s) === %s', (name, dialect, expected) => {
      expect(defaultSqlDialectDatabase(name, dialect)).toEqual(expected)
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
    it.each(cases)('defaultSqlDialectHost(%s) === %s', (dialect, expected) => {
      expect(defaultSqlDialectHost(dialect)).toEqual(expected)
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
    it.each(cases)('defaultSqlDialectStorage(%s) === %s', (dialect, expected) => {
      expect(defaultSqlDialectStorage(dialect)).toEqual(expected)
    })
  })

  describe('displayDatabaseNounForm', () => {
    const cases: [dialect: DbNounForm, expected: string][] = [
      [DbNounForm.Singular, 'singular'],
      [DbNounForm.Plural, 'plural'],
    ]
    it.each(cases)('displayDatabaseNounForm(%s) === %s', (nounForm, expected) => {
      expect(displayDatabaseNounForm(nounForm)).toEqual(expected)
    })
  })

  describe('displayDatabaseCaseStyle', () => {
    const cases: [dialect: DbCaseStyle, expected: string][] = [
      [DbCaseStyle.Snake, 'snake'],
      [DbCaseStyle.Camel, 'camel'],
    ]
    describe.each(cases)('displayDatabaseCaseStyle(%s) === %s', (caseStyle, expected) => {
      expect(displayDatabaseCaseStyle(caseStyle)).toEqual(expected)
    })
  })

  describe('caseByDbCaseStyle', () => {
    const cases: [value: string, dialect: DbCaseStyle, expected: string][] = [
      ['author id', DbCaseStyle.Snake, 'author_id'],
      ['author id', DbCaseStyle.Camel, 'authorId'],
    ]
    it.each(cases)('caseByStyle(%s, %o) === %s', (value, caseStyle, expected) => {
      expect(caseByDbCaseStyle(value, caseStyle)).toEqual(expected)
    })

    describe('tableCaseByDbCaseStyle', () => {
      const cases: [value: string, dialect: DbCaseStyle, expected: string][] = [
        ['blog post', DbCaseStyle.Snake, 'blog_post'],
        ['blog post', DbCaseStyle.Camel, 'BlogPost'],
      ]
      it.each(cases)('caseByStyle(%s, %o) === %s', (value, caseStyle, expected) => {
        expect(tableCaseByDbCaseStyle(value, caseStyle)).toEqual(expected)
      })
    })

    describe('nounFormByDbNounForm', () => {
      const cases: [value: string, dialect: DbNounForm, expected: string][] = [
        ['blog post', DbNounForm.Singular, 'blog post'],
        ['blog post', DbNounForm.Plural, 'blog posts'],
      ]
      it.each(cases)('caseByStyle(%s, %o) === %s', (value, nounForm, expected) => {
        expect(nounFormByDbNounForm(value, nounForm)).toEqual(expected)
      })
    })
  })

  describe('MAX_IDENTIFIER_LENGTH', () => {
    it('should be the proper value', () => {
      expect(MAX_IDENTIFIER_LENGTH).toEqual(63)
    })
  })
})
