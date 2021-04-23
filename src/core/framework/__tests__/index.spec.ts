import {
  DatabaseCaseStyle,
  DatabaseNounForm,
  DatabaseOptions,
  SqlDialect,
} from '@src/core/database'
import { directory, isDirectory } from '@src/core/files'
import { Schema } from '@src/core/schema'
import shortid from 'shortid'
import { Framework, GenerateArgs, ProjectType } from '..'

const MockFramework: Framework = {
  displayName() {
    return 'Mock Framework'
  },
  generate() {
    return directory('mock', [])
  },
  projectType() {
    return ProjectType.Npm
  },
}

const mockSchema: Schema = {
  id: shortid(),
  name: 'Mock Schema',
  models: [],
}

const mockDbOptions: DatabaseOptions = {
  sqlDialect: SqlDialect.MariaDb,
  nounForm: DatabaseNounForm.Singular,
  caseStyle: DatabaseCaseStyle.Snake,
  timestamps: true,
}

fdescribe('framework', () => {
  fit('should display a name', () => {
    expect(typeof MockFramework.displayName()).toEqual('string')
  })
  fit('should generate a directory', () => {
    const generateArgs: GenerateArgs = { schema: mockSchema, dbOptions: mockDbOptions }
    expect(isDirectory(MockFramework.generate(generateArgs))).toBe(true)
  })
  fit('should have a project type', () => {
    expect(MockFramework.projectType()).toEqual(ProjectType.Npm)
  })
})
