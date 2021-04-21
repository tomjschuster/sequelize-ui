import {
  DatabaseCaseStyle,
  DatabaseNounForm,
  DatabaseOptions,
  SqlDialect,
} from '@lib/core/database'
import { directory, isDirectory } from '@lib/core/files'
import { Schema } from '@lib/core/schema'
import { expect } from 'chai'
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

describe('framework', () => {
  it('should display a name', () => {
    expect(typeof MockFramework.displayName()).to.equal('string')
  })
  it('should generate a directory', () => {
    const generateArgs: GenerateArgs = { schema: mockSchema, dbOptions: mockDbOptions }
    expect(isDirectory(MockFramework.generate(generateArgs))).to.be.true
  })
  it('should have a project type', () => {
    expect(MockFramework.projectType()).to.equal(ProjectType.Npm)
  })
})
