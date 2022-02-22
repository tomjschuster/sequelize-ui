import sakila from '@src/api/schema/examples/sakila'
import { defaultDbOptions, SqlDialect } from '@src/core/database'
import { FileSystemItem } from '@src/core/files/fileSystem'
import { printFileSystemItem } from '@src/frameworks/testUtils'
import { kebabCase } from '@src/utils/string'
import { addSerializer } from 'jest-specific-snapshot'
import { SequelizeFramework } from '..'

addSerializer({
  test() {
    return true
  },
  print(item: FileSystemItem) {
    return printFileSystemItem(item, [
      'sakila/db.ts',
      'sakila/package.json',
      'sakila/config/config.js',
      'sakila/models/Film.ts',
    ])
  },
})

describe('Sequelize Framework', () => {
  it.each(Object.values(SqlDialect))('generates the correct code for %s', (sqlDialect) => {
    const code = SequelizeFramework.generate({
      schema: sakila,
      dbOptions: { ...defaultDbOptions, sqlDialect },
    })
    expect(code).toMatchSpecificSnapshot(`./__snapshots__/dialect-${kebabCase(sqlDialect)}.shot`)
  })
})
