import blog from '@src/api/schema/examples/blog'
import employees from '@src/api/schema/examples/employees'
import sakila from '@src/api/schema/examples/sakila'
import { defaultDbOptions } from '@src/core/database'
import { FileSystemItem } from '@src/core/files/fileSystem'
import { Schema } from '@src/core/schema'
import { printFileSystemItem } from '@src/frameworks/testUtils'
import { kebabCase } from '@src/utils/string'
import { addSerializer } from 'jest-specific-snapshot'
import { SequelizeFramework } from '..'

addSerializer({
  test() {
    return true
  },
  print(item: FileSystemItem) {
    return printFileSystemItem(item)
  },
})

describe('Sequelize Framework', () => {
  const cases: Record<string, Schema> = {
    blog,
    employees,
    sakila,
  }
  it.each(Object.entries(cases))('generates the correct code for %s', (key, schema) => {
    const code = SequelizeFramework.generate({ schema, dbOptions: defaultDbOptions })
    expect(code).toMatchSpecificSnapshot(`./__snapshots__/schema-${kebabCase(key)}.shot`)
  })
})
