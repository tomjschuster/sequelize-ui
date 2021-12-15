import { defaultDbOptions } from '@src/core/database'
import { directory, isDirectory } from '@src/core/files/fileSystem'
import blogSchema from '@src/data/schemas/blog'
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
  defaultFile() {
    return undefined
  },
  defaultModelFile() {
    return undefined
  },
  modelFromPath() {
    return undefined
  },
}

describe('framework', () => {
  it('should display a name', () => {
    expect(typeof MockFramework.displayName()).toEqual('string')
  })
  it('should generate a directory', () => {
    const generateArgs: GenerateArgs = { schema: blogSchema, dbOptions: defaultDbOptions }
    expect(isDirectory(MockFramework.generate(generateArgs))).toBe(true)
  })
  it('should have a project type', () => {
    expect(MockFramework.projectType()).toEqual(ProjectType.Npm)
  })
})
