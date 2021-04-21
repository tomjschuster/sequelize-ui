import { expect } from 'chai'
import forEach from 'mocha-each'
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

describe('database', () => {
  describe('displaySqlDialect', () => {
    const cases = [
      [SqlDialect.MariaDb, 'MariaDB'],
      [SqlDialect.MsSql, 'SQL Server'],
      [SqlDialect.MySql, 'MySQL'],
      [SqlDialect.Postgres, 'PostgreSQL'],
      [SqlDialect.Sqlite, 'SQLite'],
    ]
    forEach(cases).describe('(%s)', (dialect, expected) => {
      it(`=== ${JSON.stringify(expected)}`, () => {
        expect(displaySqlDialect(dialect)).to.equal(expected)
      })
    })
  })

  describe('sqlDialectEnvVar', () => {
    const cases = [
      [SqlDialect.MariaDb, 'MARIADB'],
      [SqlDialect.MsSql, 'MSSQL'],
      [SqlDialect.MySql, 'MYSQL'],
      [SqlDialect.Postgres, 'POSTGRES'],
      [SqlDialect.Sqlite, 'SQLITE'],
    ]
    forEach(cases).describe('(%s)', (dialect, expected) => {
      it(`=== ${JSON.stringify(expected)}`, () => {
        expect(sqlDialectEnvVar(dialect)).to.equal(expected)
      })
    })
  })

  describe('parseSqlDialect', () => {
    const cases = [
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
    forEach(cases).describe('(%s)', (dialect, expected) => {
      it(`=== ${JSON.stringify(expected)}`, () => {
        expect(parseSqlDialect(dialect)).to.equal(expected)
      })
    })
  })

  describe('defaultSqlDialectPort', () => {
    const cases = [
      [SqlDialect.MariaDb, '3306'],
      [SqlDialect.MsSql, '1433'],
      [SqlDialect.MySql, '3306'],
      [SqlDialect.Postgres, '5432'],
      [SqlDialect.Sqlite, null],
    ]
    forEach(cases).describe('(%s)', (dialect, expected) => {
      it(`=== ${JSON.stringify(expected)}`, () => {
        expect(defaultSqlDialectPort(dialect)).to.equal(expected)
      })
    })
  })

  describe('defaultSqlDialectUsername', () => {
    const cases = [
      [SqlDialect.MariaDb, 'root'],
      [SqlDialect.MsSql, 'sa'],
      [SqlDialect.MySql, 'root'],
      [SqlDialect.Postgres, 'postgres'],
      [SqlDialect.Sqlite, null],
    ]
    forEach(cases).describe('(%s)', (dialect, expected) => {
      it(`=== ${JSON.stringify(expected)}`, () => {
        expect(defaultSqlDialectUsername(dialect)).to.equal(expected)
      })
    })
  })

  describe('defaultSqlDialectPassword', () => {
    const cases = [
      [SqlDialect.MariaDb, 'root'],
      [SqlDialect.MsSql, 'Password1'],
      [SqlDialect.MySql, 'root'],
      [SqlDialect.Postgres, 'postgres'],
      [SqlDialect.Sqlite, null],
    ]
    forEach(cases).describe('(%s)', (dialect, expected) => {
      it(`=== ${JSON.stringify(expected)}`, () => {
        expect(defaultSqlDialectPassword(dialect)).to.equal(expected)
      })
    })
  })

  describe('defaultSqlDialectDatabase', () => {
    const cases = [
      ['foo', SqlDialect.MariaDb, 'foo'],
      ['foo', SqlDialect.MsSql, 'Foo'],
      ['foo', SqlDialect.MySql, 'foo'],
      ['foo', SqlDialect.Postgres, 'foo'],
      ['foo', SqlDialect.Sqlite, null],
    ]
    forEach(cases).describe('(%s)', (name, dialect, expected) => {
      it(`=== ${JSON.stringify(expected)}`, () => {
        expect(defaultSqlDialectDatabase(name, dialect)).to.equal(expected)
      })
    })
  })

  describe('defaultSqlDialectHost', () => {
    const cases = [
      [SqlDialect.MariaDb, 'localhost'],
      [SqlDialect.MsSql, 'localhost'],
      [SqlDialect.MySql, 'localhost'],
      [SqlDialect.Postgres, 'localhost'],
      [SqlDialect.Sqlite, null],
    ]
    forEach(cases).describe('(%s)', (dialect, expected) => {
      it(`=== ${JSON.stringify(expected)}`, () => {
        expect(defaultSqlDialectHost(dialect)).to.equal(expected)
      })
    })
  })

  describe('defaultSqlDialectStorage', () => {
    const cases = [
      [SqlDialect.MariaDb, null],
      [SqlDialect.MsSql, null],
      [SqlDialect.MySql, null],
      [SqlDialect.Postgres, null],
      [SqlDialect.Sqlite, '.tmp/data.db'],
    ]
    forEach(cases).describe('(%s)', (dialect, expected) => {
      it(`=== ${JSON.stringify(expected)}`, () => {
        expect(defaultSqlDialectStorage(dialect)).to.equal(expected)
      })
    })
  })

  describe('displayDatabaseNounForm', () => {
    const cases = [
      [DatabaseNounForm.Singular, 'singular'],
      [DatabaseNounForm.Plural, 'plural'],
    ]
    forEach(cases).describe('(%s)', (nounForm, expected) => {
      it(`=== ${JSON.stringify(expected)}`, () => {
        expect(displayDatabaseNounForm(nounForm)).to.equal(expected)
      })
    })
  })

  describe('displayDatabaseCaseStyle', () => {
    const cases = [
      [DatabaseCaseStyle.Snake, 'snake'],
      [DatabaseCaseStyle.Camel, 'camel'],
    ]
    forEach(cases).describe('(%s)', (caseStyle, expected) => {
      it(`=== ${JSON.stringify(expected)}`, () => {
        expect(displayDatabaseCaseStyle(caseStyle)).to.equal(expected)
      })
    })
  })

  describe('sqlCurrentTimestamp', () => {
    it('should return the proper value', () => {
      expect(sqlCurrentTimestamp()).to.equal('CURRENT_TIMESTAMP')
    })
  })

  describe('sqlCurrentDate', () => {
    it('should return the proper value', () => {
      expect(sqlCurrentDate()).to.equal('CURRENT_DATE')
    })
  })

  describe('sqlCurrentTime', () => {
    it('should return the proper value', () => {
      expect(sqlCurrentTime()).to.equal('CURRENT_TIME')
    })
  })

  describe('MAX_IDENTIFIER_LENGTH', () => {
    it('should be the proper value', () => {
      expect(MAX_IDENTIFIER_LENGTH).to.equal(63)
    })
  })
})
