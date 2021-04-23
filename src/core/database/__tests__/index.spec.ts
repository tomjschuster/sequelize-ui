import {
  DatabaseCaseStyle,
  DatabaseNounForm,
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
  sqlCurrentDate,
  sqlCurrentTime,
  sqlCurrentTimestamp,
  SqlDialect,
  sqlDialectEnvVar,
} from '..'

fdescribe('database', () => {
  fdescribe('displaySqlDialect', () => {
    const cases: [dialect: SqlDialect, expected: string][] = [
      [SqlDialect.MariaDb, 'MariaDB'],
      [SqlDialect.MsSql, 'SQL Server'],
      [SqlDialect.MySql, 'MySQL'],
      [SqlDialect.Postgres, 'PostgreSQL'],
      [SqlDialect.Sqlite, 'SQLite'],
    ]
    fdescribe.each(cases)('', (dialect, expected) => {
      fit(`(${dialect}) === ${JSON.stringify(expected)}`, () => {
        expect(displaySqlDialect(dialect)).toEqual(expected)
      })
    })
  })

  fdescribe('sqlDialectEnvVar', () => {
    const cases: [dialect: SqlDialect, expected: string][] = [
      [SqlDialect.MariaDb, 'MARIADB'],
      [SqlDialect.MsSql, 'MSSQL'],
      [SqlDialect.MySql, 'MYSQL'],
      [SqlDialect.Postgres, 'POSTGRES'],
      [SqlDialect.Sqlite, 'SQLITE'],
    ]
    fdescribe.each(cases)('', (dialect, expected) => {
      fit(`(${dialect}) === ${JSON.stringify(expected)}`, () => {
        expect(sqlDialectEnvVar(dialect)).toEqual(expected)
      })
    })
  })

  fdescribe('parseSqlDialect', () => {
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
    fdescribe.each(cases)('', (dialect, expected) => {
      fit(`(${dialect}) === ${JSON.stringify(expected)}`, () => {
        expect(parseSqlDialect(dialect)).toEqual(expected)
      })
    })
  })

  fdescribe('defaultSqlDialectPort', () => {
    const cases: [dialect: SqlDialect, expected: string | null][] = [
      [SqlDialect.MariaDb, '3306'],
      [SqlDialect.MsSql, '1433'],
      [SqlDialect.MySql, '3306'],
      [SqlDialect.Postgres, '5432'],
      [SqlDialect.Sqlite, null],
    ]
    fdescribe.each(cases)('', (dialect, expected) => {
      fit(`(${dialect}) === ${JSON.stringify(expected)}`, () => {
        expect(defaultSqlDialectPort(dialect)).toEqual(expected)
      })
    })
  })

  fdescribe('defaultSqlDialectUsername', () => {
    const cases: [dialect: SqlDialect, expected: string | null][] = [
      [SqlDialect.MariaDb, 'root'],
      [SqlDialect.MsSql, 'sa'],
      [SqlDialect.MySql, 'root'],
      [SqlDialect.Postgres, 'postgres'],
      [SqlDialect.Sqlite, null],
    ]
    fdescribe.each(cases)('(%s)', (dialect, expected) => {
      fit(` ${JSON.stringify(expected)}`, () => {
        expect(defaultSqlDialectUsername(dialect)).toEqual(expected)
      })
    })
  })

  fdescribe('defaultSqlDialectPassword', () => {
    const cases: [dialect: SqlDialect, expected: string | null][] = [
      [SqlDialect.MariaDb, 'root'],
      [SqlDialect.MsSql, 'Password1'],
      [SqlDialect.MySql, 'root'],
      [SqlDialect.Postgres, 'postgres'],
      [SqlDialect.Sqlite, null],
    ]
    fdescribe.each(cases)('(%s)', (dialect, expected) => {
      fit(` ${JSON.stringify(expected)}`, () => {
        expect(defaultSqlDialectPassword(dialect)).toEqual(expected)
      })
    })
  })

  fdescribe('defaultSqlDialectDatabase', () => {
    const cases: [name: string, dialect: SqlDialect, expected: string | null][] = [
      ['foo', SqlDialect.MariaDb, 'foo'],
      ['foo', SqlDialect.MsSql, 'Foo'],
      ['foo', SqlDialect.MySql, 'foo'],
      ['foo', SqlDialect.Postgres, 'foo'],
      ['foo', SqlDialect.Sqlite, null],
    ]
    fdescribe.each(cases)('(%s)', (name, dialect, expected) => {
      fit(` ${JSON.stringify(expected)}`, () => {
        expect(defaultSqlDialectDatabase(name, dialect)).toEqual(expected)
      })
    })
  })

  fdescribe('defaultSqlDialectHost', () => {
    const cases: [dialect: SqlDialect, expected: string | null][] = [
      [SqlDialect.MariaDb, 'localhost'],
      [SqlDialect.MsSql, 'localhost'],
      [SqlDialect.MySql, 'localhost'],
      [SqlDialect.Postgres, 'localhost'],
      [SqlDialect.Sqlite, null],
    ]
    fdescribe.each(cases)('(%s)', (dialect, expected) => {
      fit(` ${JSON.stringify(expected)}`, () => {
        expect(defaultSqlDialectHost(dialect)).toEqual(expected)
      })
    })
  })

  fdescribe('defaultSqlDialectStorage', () => {
    const cases: [dialect: SqlDialect, expected: string | null][] = [
      [SqlDialect.MariaDb, null],
      [SqlDialect.MsSql, null],
      [SqlDialect.MySql, null],
      [SqlDialect.Postgres, null],
      [SqlDialect.Sqlite, '.tmp/data.db'],
    ]
    fdescribe.each(cases)('(%s)', (dialect, expected) => {
      fit(` ${JSON.stringify(expected)}`, () => {
        expect(defaultSqlDialectStorage(dialect)).toEqual(expected)
      })
    })
  })

  fdescribe('displayDatabaseNounForm', () => {
    const cases: [dialect: DatabaseNounForm, expected: string][] = [
      [DatabaseNounForm.Singular, 'singular'],
      [DatabaseNounForm.Plural, 'plural'],
    ]
    fdescribe.each(cases)('(%s)', (nounForm, expected) => {
      fit(` ${JSON.stringify(expected)}`, () => {
        expect(displayDatabaseNounForm(nounForm)).toEqual(expected)
      })
    })
  })

  fdescribe('displayDatabaseCaseStyle', () => {
    const cases: [dialect: DatabaseCaseStyle, expected: string][] = [
      [DatabaseCaseStyle.Snake, 'snake'],
      [DatabaseCaseStyle.Camel, 'camel'],
    ]
    fdescribe.each(cases)('(%s)', (caseStyle, expected) => {
      fit(` ${JSON.stringify(expected)}`, () => {
        expect(displayDatabaseCaseStyle(caseStyle)).toEqual(expected)
      })
    })
  })

  fdescribe('sqlCurrentTimestamp', () => {
    fit('should return the proper value', () => {
      expect(sqlCurrentTimestamp()).toEqual('CURRENT_TIMESTAMP')
    })
  })

  fdescribe('sqlCurrentDate', () => {
    fit('should return the proper value', () => {
      expect(sqlCurrentDate()).toEqual('CURRENT_DATE')
    })
  })

  fdescribe('sqlCurrentTime', () => {
    fit('should return the proper value', () => {
      expect(sqlCurrentTime()).toEqual('CURRENT_TIME')
    })
  })

  fdescribe('MAX_IDENTIFIER_LENGTH', () => {
    fit('should be the proper value', () => {
      expect(MAX_IDENTIFIER_LENGTH).toEqual(63)
    })
  })
})
