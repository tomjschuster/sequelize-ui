import { defaultDbOptions } from '@src/core/database'
import { directory, isDirectory } from '@src/core/files'
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
}

describe('framework', () => {
  fit('should display a name', () => {
    expect(typeof MockFramework.displayName()).toEqual('string')
  })
  fit('should generate a directory', () => {
    const generateArgs: GenerateArgs = { schema: blogSchema, dbOptions: defaultDbOptions }
    expect(isDirectory(MockFramework.generate(generateArgs))).toBe(true)
  })
  fit('should have a project type', () => {
    expect(MockFramework.projectType()).toEqual(ProjectType.Npm)
  })
})
